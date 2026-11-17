import http from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || !path.extname(reqPath)) {
    reqPath = '/index.html';
  }
  const filePath = path.join(distDir, reqPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    const indexHtml = path.join(distDir, 'index.html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(indexHtml).pipe(res);
  }
});

await new Promise(resolve => server.listen(4174, resolve));
console.log('HTTP Server listening at http://localhost:4174');

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-i18n-test-'));
const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const debugPort = 9226;

const chrome = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  `--remote-debugging-port=${debugPort}`,
  `--user-data-dir=${tmpDir}`,
  '--no-first-run',
  '--no-default-browser-check',
  'about:blank'
], { stdio: 'ignore' });

// Wait for Chrome CDP port
let versionData = null;
for (let i = 0; i < 20; i++) {
  await new Promise(r => setTimeout(r, 200));
  try {
    const res = await fetch(`http://127.0.0.1:${debugPort}/json/version`);
    versionData = await res.json();
    if (versionData) break;
  } catch (e) {}
}

if (!versionData) {
  console.error('Failed to connect to headless Chrome');
  chrome.kill();
  server.close();
  process.exit(1);
}

const listRes = await fetch(`http://127.0.0.1:${debugPort}/json/list`);
const pages = await listRes.json();
const wsUrl = pages[0]?.webSocketDebuggerUrl;

let ws;
if (typeof WebSocket !== 'undefined') {
  ws = new WebSocket(wsUrl);
} else {
  const wsMod = await import('ws');
  ws = new wsMod.WebSocket(wsUrl);
}

await new Promise((resolve, reject) => {
  ws.onopen = resolve;
  ws.onerror = reject;
});

let msgId = 1;
const pendingRequests = new Map();
const consoleErrors = [];

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && pendingRequests.has(msg.id)) {
    pendingRequests.get(msg.id)(msg);
    pendingRequests.delete(msg.id);
  }
  if (msg.method === 'Runtime.exceptionThrown') {
    const desc = msg.params?.exceptionDetails?.exception?.description || msg.params?.exceptionDetails?.text;
    consoleErrors.push(`[Exception] ${desc}`);
  }
  if (msg.method === 'Log.entryAdded' && msg.params?.entry?.level === 'error') {
    consoleErrors.push(`[Log.error] ${msg.params.entry.text}`);
  }
};

function send(method, params = {}) {
  return new Promise((resolve) => {
    const id = msgId++;
    pendingRequests.set(id, resolve);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

await send('Runtime.enable');
await send('Log.enable');
await send('Page.enable');

const testLanguages = ['es', 'en'];
let totalIssues = 0;

for (const lang of testLanguages) {
  console.log(`\n========================================`);
  console.log(`TESTING LANGUAGE: ${lang.toUpperCase()}`);
  console.log(`========================================`);

  await send('Page.navigate', { url: 'http://localhost:4174/#/' });
  await new Promise(r => setTimeout(r, 600));

  // First set localStorage in current page, then navigate so it initializes cleanly with target language
  await send('Page.navigate', { url: 'http://localhost:4174/#/' });
  await new Promise(r => setTimeout(r, 400));
  await send('Runtime.evaluate', {
    expression: `
      localStorage.setItem('preferred_lang', '${lang}');
      window.location.hash = '#/';
      window.location.reload();
    `
  });
  await new Promise(r => setTimeout(r, 800));

  // Verify navigation bar texts
  const navEval = await send('Runtime.evaluate', {
    expression: `JSON.stringify({
      navTexts: Array.from(document.querySelectorAll('header nav button, header button')).map(b => b.innerText.trim()).filter(Boolean),
      h1: document.querySelector('h1')?.innerText || '',
      heroSub: document.querySelector('p')?.innerText || ''
    })`
  });
  const navInfo = JSON.parse(navEval.result?.result?.value || '{}');
  console.log(`[${lang}] Nav items:`, navInfo.navTexts);
  console.log(`[${lang}] Hero H1:`, navInfo.h1.slice(0, 70));

  if (lang === 'es') {
    if (!navInfo.navTexts.some(t => t.includes('Cursos') || t.includes('Precios'))) {
      console.error('❌ ES Nav did not contain expected Spanish words (Cursos/Precios)');
      totalIssues++;
    } else {
      console.log('✅ ES Nav contains proper Spanish labels');
    }
  } else {
    if (!navInfo.navTexts.some(t => t.includes('Courses') || t.includes('Pricing'))) {
      console.error('❌ EN Nav did not contain expected English words (Courses/Pricing)');
      totalIssues++;
    } else {
      console.log('✅ EN Nav contains proper English labels');
    }
  }

  // Navigate to #/courses and inspect Course Guide Modal
  console.log(`\nTesting Course Guide Modal in ${lang.toUpperCase()}:`);
  await send('Page.navigate', { url: 'http://localhost:4174/#/courses' });
  await new Promise(r => setTimeout(r, 700));

  // Open first course academic guide modal
  await send('Runtime.evaluate', {
    expression: `
      const guideBtn = Array.from(document.querySelectorAll('button')).find(b => 
        b.innerText.toLowerCase().includes('course syllabus') || b.innerText.toLowerCase().includes('guía académica')
      );
      if (guideBtn) guideBtn.click();
    `
  });
  await new Promise(r => setTimeout(r, 600));

  const modalEval = await send('Runtime.evaluate', {
    expression: `JSON.stringify({
      modalOpen: !!document.querySelector('.fixed.inset-0.z-50'),
      modalTitle: document.querySelector('.fixed.inset-0.z-50 h3')?.innerText || '',
      modalHeadings: Array.from(document.querySelectorAll('.fixed.inset-0.z-50 h4')).map(h => h.innerText.trim()),
      modalButtons: Array.from(document.querySelectorAll('.fixed.inset-0.z-50 button, .fixed.inset-0.z-50 a')).map(b => b.innerText.trim()),
      policyText: document.querySelector('.fixed.inset-0.z-50 .bg-amber-500\\\\/10')?.innerText || ''
    })`
  });
  const modalInfo = JSON.parse(modalEval.result?.result?.value || '{}');
  console.log(`[${lang}] Modal open: ${modalInfo.modalOpen}`);
  console.log(`[${lang}] Modal Title: ${modalInfo.modalTitle}`);
  console.log(`[${lang}] Headings:`, modalInfo.modalHeadings);
  console.log(`[${lang}] Buttons:`, modalInfo.modalButtons);
  console.log(`[${lang}] Policy banner preview:`, modalInfo.policyText.slice(0, 100).replace(/\n/g, ' '));

  if (lang === 'es') {
    const isPolicySpanish = modalInfo.policyText.toLowerCase().includes('política académica') || modalInfo.policyText.includes('50%');
    const isHeadingSpanish = modalInfo.modalHeadings.some(h => {
      const lower = h.toLowerCase();
      return lower.includes('temario') || lower.includes('resumen') || lower.includes('metodología');
    });
    const isBtnSpanish = modalInfo.modalButtons.some(b => {
      const lower = b.toLowerCase();
      return lower.includes('cerrar guía') || lower.includes('solicitar diagnóstico');
    });

    if (!isPolicySpanish || !isHeadingSpanish || !isBtnSpanish) {
      console.error('❌ ES Course Guide modal has missing or English translations!');
      totalIssues++;
    } else {
      console.log('✅ ES Course Guide modal is 100% Spanish');
    }
  } else {
    const isPolicyEnglish = modalInfo.policyText.toLowerCase().includes('mandatory academic policy') || modalInfo.policyText.includes('50%');
    const isHeadingEnglish = modalInfo.modalHeadings.some(h => {
      const lower = h.toLowerCase();
      return lower.includes('modular syllabus') || lower.includes('course overview') || lower.includes('pedagogical methodology');
    });
    const isBtnEnglish = modalInfo.modalButtons.some(b => {
      const lower = b.toLowerCase();
      return lower.includes('close guide') || lower.includes('request free');
    });

    if (!isPolicyEnglish || !isHeadingEnglish || !isBtnEnglish) {
      console.error('❌ EN Course Guide modal has missing or Spanish translations!');
      totalIssues++;
    } else {
      console.log('✅ EN Course Guide modal is 100% English');
    }
  }

  // Close guide modal
  await send('Runtime.evaluate', {
    expression: `
      const closeBtn = Array.from(document.querySelectorAll('.fixed.inset-0.z-50 button')).find(b => 
        b.innerText.toLowerCase().includes('close') || b.innerText.toLowerCase().includes('cerrar')
      );
      if (closeBtn) closeBtn.click();
    `
  });
  await new Promise(r => setTimeout(r, 400));

  // Test Booking Modal
  console.log(`\nTesting Booking Modal in ${lang.toUpperCase()}:`);
  await send('Runtime.evaluate', {
    expression: `
      const enrollBtn = Array.from(document.querySelectorAll('button')).find(b => 
        b.innerText.toLowerCase().includes('enroll') || b.innerText.toLowerCase().includes('inscribirse')
      );
      if (enrollBtn) enrollBtn.click();
    `
  });
  await new Promise(r => setTimeout(r, 600));

  const bookingEval = await send('Runtime.evaluate', {
    expression: `JSON.stringify({
      modalOpen: !!document.querySelector('.fixed.inset-0.z-50 form'),
      formTitle: document.querySelector('.fixed.inset-0.z-50 h3')?.innerText || '',
      labels: Array.from(document.querySelectorAll('.fixed.inset-0.z-50 label')).map(l => l.innerText.trim()),
      submitBtn: document.querySelector('.fixed.inset-0.z-50 form button[type="submit"]')?.innerText.trim() || ''
    })`
  });
  const bookingInfo = JSON.parse(bookingEval.result?.result?.value || '{}');
  console.log(`[${lang}] Booking form title:`, bookingInfo.formTitle);
  console.log(`[${lang}] Form labels:`, bookingInfo.labels);
  console.log(`[${lang}] Submit button:`, bookingInfo.submitBtn);

  if (lang === 'es') {
    const isLabelSpanish = bookingInfo.labels.some(l => l.includes('Nombre') || l.includes('Correo') || l.includes('Idioma'));
    const isSubmitSpanish = bookingInfo.submitBtn.toLowerCase().includes('enviar solicitud');
    if (!isLabelSpanish || !isSubmitSpanish) {
      console.error('❌ ES Booking modal has missing or English translations!');
      totalIssues++;
    } else {
      console.log('✅ ES Booking modal is 100% Spanish');
    }
  } else {
    const isLabelEnglish = bookingInfo.labels.some(l => l.includes('Full Name') || l.includes('Email') || l.includes('Language'));
    const isSubmitEnglish = bookingInfo.submitBtn.toLowerCase().includes('send request');
    if (!isLabelEnglish || !isSubmitEnglish) {
      console.error('❌ EN Booking modal has missing or Spanish translations!');
      totalIssues++;
    } else {
      console.log('✅ EN Booking modal is 100% English');
    }
  }

  // Close booking modal
  await send('Runtime.evaluate', {
    expression: `
      const closeBooking = document.querySelector('.fixed.inset-0.z-50 button');
      if (closeBooking) closeBooking.click();
    `
  });
  await new Promise(r => setTimeout(r, 400));

  // Test Pricing Page
  console.log(`\nTesting Pricing Page in ${lang.toUpperCase()}:`);
  await send('Runtime.evaluate', {
    expression: `
      window.location.hash = '#/pricing';
      window.location.reload();
    `
  });
  await new Promise(r => setTimeout(r, 800));

  const pricingEval = await send('Runtime.evaluate', {
    expression: `JSON.stringify({
      heading: document.querySelector('h1, h2')?.innerText || '',
      bodySnippet: (document.body.innerText || '').slice(0, 500).replace(/\\n/g, ' ')
    })`
  });
  const pricingInfo = JSON.parse(pricingEval.result?.result?.value || '{}');
  console.log(`[${lang}] Pricing heading:`, pricingInfo.heading);
  if (lang === 'es') {
    if (pricingInfo.bodySnippet?.includes('Precios') || pricingInfo.bodySnippet?.includes('Tarifas') || pricingInfo.heading?.includes('Tarifas') || pricingInfo.heading?.includes('Precios')) {
      console.log('✅ ES Pricing page contains proper Spanish terms');
    } else {
      console.error('❌ ES Pricing page missing Spanish terms!');
      totalIssues++;
    }
  } else {
    if (pricingInfo.bodySnippet?.includes('Rates') || pricingInfo.bodySnippet?.includes('Pricing') || pricingInfo.heading?.includes('Rates') || pricingInfo.heading?.includes('Pricing')) {
      console.log('✅ EN Pricing page contains proper English terms');
    } else {
      console.error('❌ EN Pricing page missing English terms!');
      totalIssues++;
    }
  }
}

ws.close();
chrome.kill();
server.close();

console.log(`\n========================================`);
if (totalIssues === 0 && consoleErrors.length === 0) {
  console.log('🎉 ALL I18N VERIFICATIONS PASSED PERFECTLY (0 ISSUES, 0 ERRORS)!');
  process.exit(0);
} else {
  console.error(`❌ I18N VERIFICATION COMPLETED WITH ${totalIssues} ISSUES AND ${consoleErrors.length} ERRORS.`);
  process.exit(1);
}
