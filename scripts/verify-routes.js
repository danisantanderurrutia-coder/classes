import http from 'http';
import fs from 'fs';
import path from 'path';
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
    // SPA fallback
    const indexHtml = path.join(distDir, 'index.html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(indexHtml).pipe(res);
  }
});

await new Promise(resolve => server.listen(4173, resolve));
console.log('HTTP Server listening at http://localhost:4173');

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const debugPort = 9222;

const chrome = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  `--remote-debugging-port=${debugPort}`,
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

// Simple WebSocket client using global WebSocket (available in Node 21+) or dynamic import
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

const routes = [
  '#/',
  '#/pricing',
  '#/courses',
  '#/lab',
  '#/piad',
  '#/library',
  '#/contact'
];

let allPassed = true;

for (const route of routes) {
  consoleErrors.length = 0;
  const targetUrl = `http://localhost:4173/${route}`;
  console.log(`\nTesting route: ${route}`);
  
  await send('Page.navigate', { url: targetUrl });
  // Wait for rendering
  await new Promise(r => setTimeout(r, 800));

  // Evaluate page title and check if body contains content
  const evalRes = await send('Runtime.evaluate', {
    expression: `JSON.stringify({
      title: document.title,
      bodyLength: document.body.innerText.length,
      heading: document.querySelector('h1, h2')?.innerText || '',
      hasErrorBoundary: document.body.innerText.includes('Algo no cargó correctamente')
    })`
  });

  const pageInfo = JSON.parse(evalRes.result?.result?.value || '{}');
  console.log(`  Heading: "${pageInfo.heading?.slice(0, 50)}..."`);
  console.log(`  Text length: ${pageInfo.bodyLength}`);
  console.log(`  Hit Error Boundary: ${pageInfo.hasErrorBoundary}`);

  if (consoleErrors.length > 0) {
    console.error(`  ❌ Console errors on ${route}:`, consoleErrors);
    allPassed = false;
  } else if (pageInfo.hasErrorBoundary) {
    console.error(`  ❌ Triggered Error Boundary on ${route}`);
    allPassed = false;
  } else if (pageInfo.bodyLength < 50) {
    console.error(`  ❌ Page seems blank on ${route}`);
    allPassed = false;
  } else {
    console.log(`  ✅ ${route} rendered cleanly with 0 errors!`);
  }
}

ws.close();
chrome.kill();
server.close();

if (allPassed) {
  console.log('\n🎉 ALL ROUTES PASSED VERIFICATION WITH ZERO RUNTIME ERRORS!');
  process.exit(0);
} else {
  console.error('\n❌ SOME ROUTES FAILED VERIFICATION.');
  process.exit(1);
}
