import { readFileSync, existsSync } from 'node:fs';

const html = readFileSync('index.html', 'utf8');
const failures = [];

function requireFile(path) {
  if (!existsSync(path)) failures.push(`missing file: ${path}`);
}

function requireText(label, pattern) {
  if (!pattern.test(html)) failures.push(`missing ${label}`);
}

requireFile('index.html');
requireFile('favicon.ico');
requireFile('favicon.svg');
requireFile('assets/hero-social-discourse.png');

const requiredSections = ['overview', 'process', 'algorithm', 'game', 'cost', 'tpp', 'check'];
for (const id of requiredSections) {
  requireText(`section #${id}`, new RegExp(`<section[^>]+id=["']${id}["']`));
}

const anchors = [...html.matchAll(/href=["']#([^"']+)["']/g)].map(match => match[1]);
const missingTargets = anchors.filter(id => !new RegExp(`id=["']${id}["']`).test(html));
if (missingTargets.length) {
  failures.push(`nav anchors without targets: ${[...new Set(missingTargets)].join(', ')}`);
}

const requiredUi = [
  ['preload hero image', /<link[^>]+rel=["']preload["'][^>]+hero-social-discourse\.png/],
  ['page preloader', /class=["']page-preloader["']/],
  ['Heroicons sprite', /<svg[^>]+aria-hidden=["']true["'][^>]*>[\s\S]*<symbol id=["']icon-/],
  ['sticky navigation', /class=["']site-nav["']/],
  ['algorithm duel cards', /class=["']algorithm-duel["']/],
  ['benefit map', /class=["']benefit-map["']/],
  ['cost collapsible panels', /class=["']collapsible-panel["']/],
  ['calculator steppers', /class=["']stepper["']/],
  ['calculator display', /class=["']calculator-display["']/],
  ['reveal animation hook', /IntersectionObserver/],
];

for (const [label, pattern] of requiredUi) {
  requireText(label, pattern);
}

if (failures.length) {
  console.error('Page audit failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('OK: page audit passed.');
