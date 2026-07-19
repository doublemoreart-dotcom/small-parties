import { readFileSync } from 'node:fs';

const html = readFileSync('index.html', 'utf8');
const failures = [];

function requireText(label, pattern) {
  if (!pattern.test(html)) failures.push(`missing ${label}`);
}

const mobileBlockMatch = html.match(/@media \(max-width:800px\)\{([\s\S]*?)\n    \}/);
const mobileCss = mobileBlockMatch?.[1] ?? '';

if (!mobileCss) {
  failures.push('mobile media query: @media (max-width:800px)');
}

function requireMobile(label, pattern) {
  if (!pattern.test(mobileCss)) failures.push(`mobile CSS missing ${label}`);
}

requireText(
  'cost breakdown table wrapped for horizontal scroll',
  /class=["']quote-table-wrap["'][\s\S]*class=["']cost-breakdown-table["']/,
);
requireText(
  'price quote table wrapped for horizontal scroll',
  /class=["']quote-table-wrap["'][\s\S]*class=["']cost-quote["']/,
);
requireText(
  'no TPP card inner decorative rule',
  /^(?![\s\S]*\.tpp-section \.flow \.step::before)/,
);

requireMobile('process wide graphic hidden', /\.process-line-graphic\{[\s\S]*display:none/);
requireMobile('TPP wide graphic hidden', /\.tpp-line-graphic\{[\s\S]*display:none/);
requireMobile('mobile flow fallback visible', /\.mobile-flow-list\{[\s\S]*display:grid/);
requireText(
  'narrow mobile quote table right gradient hint',
  /@media \(max-width:700px\)\{[\s\S]*\.quote-table-wrap::after\{[\s\S]*linear-gradient/,
);
requireMobile('cost quote horizontal width', /\.cost-quote\{[\s\S]*min-width:640px/);
requireMobile('cost breakdown horizontal width', /\.cost-breakdown-table\{[\s\S]*min-width:640px/);
requireMobile('general card title size', /\.card h3,[\s\S]*\.flow \.step h3,[\s\S]*\.stat strong\{font-size:20px\}/);
requireMobile('four benefit card title size', /\.benefit-card h3\{[\s\S]*font-size:18px/);
requireMobile('general body size', /\.card p,[\s\S]*\.flow \.step p\{font-size:16px\}/);
requireMobile('auxiliary text size', /\.stat span\{font-size:14px\}/);
requireMobile('calculator result number size', /\.result strong\{font-size:30px\}/);
requireMobile('duel upward arrow', /\.duel-node::before\{[\s\S]*display:block/);
requireMobile('duel downward arrow', /\.duel-node::after\{[\s\S]*display:block/);

if (failures.length) {
  console.error('Mobile audit failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('OK: mobile audit passed.');
