// Content sanity checks run in CI: bilingual key pairs (xxxEn / xxxEs) and KaTeX-compilable LaTeX.
// Usage: node scripts/check-content.mjs   (exit code 1 on failure)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import katex from 'katex';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const walk = (d) =>
  fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(d, e.name)) : /\.(jsx?|mjs)$/.test(e.name) ? [path.join(d, e.name)] : []
  );
const files = walk(path.join(root, 'src'));
// Keys where Es legitimately falls back to En (e.g. proper names that are identical in both languages)
const OPTIONAL_ES = new Set(['mentor']);
const errors = [];
const lineOf = (src, i) => src.slice(0, i).split('\n').length;
const rel = (f) => path.relative(root, f);

// Matches a quoted JS string literal (single or double quotes, with escapes)
const LIT = `'(?:[^'\\\\\\n]|\\\\.)*'|"(?:[^"\\\\\\n]|\\\\.)*"`;

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');

  // 1. Every Xxx(En|Es) key must have its counterpart in the same file
  const counts = {};
  for (const m of src.matchAll(/^\s*([a-zA-Z0-9]+)(En|Es)\s*:/gm)) {
    (counts[m[1]] ??= { En: 0, Es: 0 })[m[2]]++;
  }
  for (const [key, c] of Object.entries(counts)) {
    if (!OPTIONAL_ES.has(key) && c.En !== c.Es) errors.push(`${rel(file)}: key "${key}" has ${c.En} En vs ${c.Es} Es entries`);
  }

  // 2. Every latex / latexEn / latexEs string literal must compile with KaTeX
  const re = new RegExp(`^\\s*latex(?:En|Es)?\\s*:\\s*(${LIT})`, 'gm');
  for (const m of src.matchAll(re)) {
    let value;
    try {
      value = new Function(`return ${m[1]}`)();
    } catch {
      continue;
    }
    try {
      katex.renderToString(value, { throwOnError: true, strict: 'ignore' });
    } catch (e) {
      errors.push(`${rel(file)}:${lineOf(src, m.index)}: KaTeX error: ${e.message.split('\n')[0]}`);
    }
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  console.error(`\n${errors.length} content check failure(s).`);
  process.exit(1);
}
console.log(`Content checks passed (${files.length} files scanned).`);
