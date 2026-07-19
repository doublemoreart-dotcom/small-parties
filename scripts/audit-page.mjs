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
requireFile('fav.ico');
requireFile('favicon.ico');
requireFile('favicon.svg');
requireFile('assets/hero-social-discourse.png');
requireFile('assets/social-thumbnail.png');
requireFile('assets/social-thumbnail.svg');

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
  ['shortcut favicon.ico', /<link[^>]+rel=["']shortcut icon["'][^>]+favicon\.ico/],
  ['Open Graph thumbnail', /<meta[^>]+property=["']og:image["'][^>]+social-thumbnail\.png/],
  ['Open Graph dimensions', /<meta[^>]+property=["']og:image:width["'][^>]+1200[\s\S]*<meta[^>]+property=["']og:image:height["'][^>]+630/],
  ['Twitter large image card', /<meta[^>]+name=["']twitter:card["'][^>]+summary_large_image/],
  ['Google Analytics tag', /googletagmanager\.com\/gtag\/js\?id=G-T2WMCYX21T[\s\S]*gtag\('config', 'G-T2WMCYX21T'\)/],
  ['page preloader', /class=["']page-preloader["']/],
  ['Heroicons sprite', /<svg[^>]+aria-hidden=["']true["'][^>]*>[\s\S]*<symbol id=["']icon-/],
  ['sticky navigation', /class=["']site-nav["']/],
  ['algorithm duel cards', /class=["']algorithm-duel["']/],
  ['benefit map', /class=["']benefit-map["']/],
  ['cost collapsible panels', /class=["']collapsible-panel["']/],
  ['calculator steppers', /class=["']stepper["']/],
  ['calculator display', /class=["']calculator-display["']/],
  ['mobile flow fallback', /class=["']mobile-flow-list["']/],
  ['mobile overflow guard', /overflow-x:hidden/],
  ['scroll-contained quote table', /class=["']quote-table-wrap["'][\s\S]*class=["']cost-quote["']/],
  ['reveal animation hook', /IntersectionObserver/],
];

for (const [label, pattern] of requiredUi) {
  requireText(label, pattern);
}

const mobileFlowCount = (html.match(/class=["']mobile-flow-list["']/g) || []).length;
if (mobileFlowCount < 2) {
  failures.push(`expected at least 2 mobile flow fallbacks, found ${mobileFlowCount}`);
}

if (!/@media \(max-width:800px\)[\s\S]*\.process-line-graphic\{[\s\S]*display:none/.test(html)) {
  failures.push('mobile CSS must hide the wide process SVG');
}

if (!/@media \(max-width:800px\)[\s\S]*\.tpp-line-graphic\{[\s\S]*display:none/.test(html)) {
  failures.push('mobile CSS must hide the wide TPP SVG');
}

if (failures.length) {
  console.error('Page audit failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('OK: page audit passed.');
