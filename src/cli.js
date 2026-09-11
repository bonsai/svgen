#!/usr/bin/env node

import { writeFile } from 'node:fs/promises';

const args = new Map();
const positional = [];
const argv = process.argv.slice(2);

for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a.startsWith('--')) {
    const [k, v] = a.slice(2).split('=', 2);
    args.set(k, v ?? argv[++i]);
  } else {
    positional.push(a);
  }
}

const type = args.get('type') ?? positional[0] ?? 'random';
const size = Math.max(8, Number(args.get('size') ?? 64));
const seed = Number(args.get('seed') ?? Date.now());

function rng(seed) {
  let x = seed >>> 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 4294967296;
  };
}

const random = rng(seed);
const palettes = [
  ['#111827', '#22d3ee', '#f472b6', '#facc15'],
  ['#0f172a', '#38bdf8', '#a78bfa', '#fb7185'],
  ['#ffffff', '#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6'],
];
const palette = palettes[Math.floor(random() * palettes.length)];
const pick = (items) => items[Math.floor(random() * items.length)];

function square() {
  const n = 2 + Math.floor(random() * 4);
  const cell = size / n;
  let body = '';
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (random() > 0.25) {
        body += `<rect x="${x * cell}" y="${y * cell}" width="${cell + 0.2}" height="${cell + 0.2}" fill="${pick(palette)}"/>`;
      }
    }
  }
  return body;
}

function egg() {
  const c = pick(palette);
  const rx = size * (0.31 + random() * 0.08);
  const ry = size * (0.40 + random() * 0.06);
  return `<ellipse cx="${size / 2}" cy="${size / 2}" rx="${rx}" ry="${ry}" fill="${c}" transform="rotate(${Math.floor(random() * 30 - 15)} ${size / 2} ${size / 2})"/>`;
}

function rainbow() {
  const cx = size / 2;
  const cy = size * 0.62;
  const step = size * 0.075;
  let body = '';
  [...palette, ...palette].slice(0, 5).forEach((c, i) => {
    const r = size * 0.46 - i * step;
    body += `<path d="M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}" fill="none" stroke="${c}" stroke-width="${step}"/>`;
  });
  return body;
}

function pattern() {
  const count = 4 + Math.floor(random() * 5);
  let body = '';
  for (let i = 0; i < count; i++) {
    const r = size * (0.04 + random() * 0.14);
    body += `<circle cx="${random() * size}" cy="${random() * size}" r="${r}" fill="${pick(palette)}"/>`;
  }
  return body;
}

function generate(kind) {
  switch (kind) {
    case 'square': return square();
    case 'egg': return egg();
    case 'rainbow': return rainbow();
    case 'pattern': return pattern();
    default: return generate(pick(['square', 'egg', 'rainbow', 'pattern']));
  }
}

const body = generate(type);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="100%" height="100%" fill="${pick(['#fff', '#0b1020', '#f8fafc'])}"/>${body}</svg>`;

const output = args.get('output');
if (output) {
  await writeFile(output, `${svg}\n`, 'utf8');
} else {
  process.stdout.write(`${svg}\n`);
}
