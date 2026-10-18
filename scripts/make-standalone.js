import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const htmlPath = path.join(distDir, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Find CSS files
const cssMatch = html.match(/href="\.\/assets\/(index-[^"]+\.css)"/);
if (cssMatch) {
  const cssFile = path.join(distDir, 'assets', cssMatch[1]);
  if (fs.existsSync(cssFile)) {
    const cssContent = fs.readFileSync(cssFile, 'utf8');
    html = html.replace(/<link rel="stylesheet"[^>]+href="\.\/assets\/[^"]+\.css">/, `<style>\n${cssContent}\n</style>`);
  }
}

// Find JS files
const jsMatch = html.match(/src="\.\/assets\/(index-[^"]+\.js)"/);
if (jsMatch) {
  const jsFile = path.join(distDir, 'assets', jsMatch[1]);
  if (fs.existsSync(jsFile)) {
    const jsContent = fs.readFileSync(jsFile, 'utf8');
    html = html.replace(/<script type="module"[^>]+src="\.\/assets\/[^"]+\.js"><\/script>/, `<script type="module">\n${jsContent}\n</script>`);
  }
}

fs.writeFileSync(path.join(distDir, 'standalone.html'), html, 'utf8');
console.log('Successfully generated dist/standalone.html!');
