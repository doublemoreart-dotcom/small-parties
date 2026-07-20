import { existsSync, readFileSync, statSync } from 'node:fs';

const failures = [];

function requireFile(path) {
  if (!existsSync(path)) {
    failures.push(`missing file: ${path}`);
    return false;
  }
  return true;
}

function pngSize(path) {
  const buffer = readFileSync(path);
  const isPng = buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (!isPng) failures.push(`${path} is not a PNG file`);
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function requirePngSize(path, width, height) {
  if (!requireFile(path)) return;
  const size = pngSize(path);
  if (size.width !== width || size.height !== height) {
    failures.push(`${path} must be ${width}x${height}; found ${size.width}x${size.height}`);
  }
}

function requireBelow(path, maxBytes) {
  if (!requireFile(path)) return;
  const size = statSync(path).size;
  if (size > maxBytes) {
    failures.push(`${path} should be <= ${maxBytes} bytes; found ${size} bytes`);
  }
}

function requireIco(path) {
  if (!requireFile(path)) return;
  const buffer = readFileSync(path);
  if (buffer.readUInt16LE(0) !== 0 || buffer.readUInt16LE(2) !== 1) {
    failures.push(`${path} is not a valid ICO file`);
  }
}

requireIco('fav.ico');
requireIco('favicon.ico');
requireFile('favicon.svg');
requirePngSize('assets/hero-social-discourse.png', 1600, 900);
requirePngSize('assets/social-thumbnail.png', 1200, 630);
requirePngSize('assets/menu-icon.png', 256, 256);
requirePngSize('assets/tpp-logo.png', 1182, 1182);
requireFile('assets/social-thumbnail.svg');
requireBelow('assets/social-thumbnail.png', 1_000_000);
requireBelow('assets/menu-icon.png', 200_000);
requireBelow('assets/tpp-logo.png', 100_000);

const generatedJunk = [
  'assets/social-thumbnail.svg.png',
  'assets/social-thumbnail.svg.qlpreview',
];

for (const path of generatedJunk) {
  if (existsSync(path)) failures.push(`remove generated intermediate asset: ${path}`);
}

if (failures.length) {
  console.error('Asset audit failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('OK: asset audit passed.');
