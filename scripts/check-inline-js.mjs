import { readFileSync } from 'node:fs';
import { Script } from 'node:vm';

const html = readFileSync('index.html', 'utf8');
const failures = [];
const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];

function attrValue(attrs, name) {
  const match = attrs.match(new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`, 'i'));
  return match?.[1] ?? '';
}

function isJavaScript(attrs) {
  if (/\ssrc\s*=/i.test(attrs)) return false;
  const type = attrValue(attrs, 'type').trim().toLowerCase();
  return !type || ['text/javascript', 'application/javascript', 'module'].includes(type);
}

let checked = 0;
for (const [match, attrs, code] of scripts) {
  if (!isJavaScript(attrs)) continue;
  checked += 1;
  try {
    new Script(code, { filename: `index.html inline script ${checked}` });
  } catch (error) {
    failures.push(`inline script ${checked}: ${error.message}`);
  }
}

if (checked === 0) {
  failures.push('no inline JavaScript blocks checked');
}

if (failures.length) {
  console.error('Inline JavaScript check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`OK: inline JavaScript syntax passed (${checked} blocks).`);
