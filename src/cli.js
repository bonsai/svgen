#!/usr/bin/env node

import { writeFile } from 'node:fs/promises';

const argv = process.argv.slice(2);
const args = new Map();
const positional = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a.startsWith('--')) {
    const [k, v] = a.slice(2).split('=', 2);
    args.set(k, v ?? argv[++i]);
  } else positional.push(a);
}

const get = (key, fallback) => args.get(key) ?? fallback;
const number = (key, fallback, min = -Infinity, max = Infinity) => {
  const n = Number(get(key, fallback));
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
};
const type = get('type', positional[0] ?? 'random');
const size = number('size', 64, 8);
const seed = number('seed', Date.now());
const opacity = number('opacity', 1, 0, 1);
const rotate = number('rotate', 0);
const count = number('count', 6, 1);
const grid = number('grid', 4, 2, 8);
const rx = number('rx', 0.35, 0);
const ry = number('ry', 0.43, 0);
const stroke = number('stroke', size * 0.075, 0.5);

const palettes = {
  neon: ['#111827', '#22d3ee', '#f472b6', '#facc15'],
  cool: ['#0f172a', '#38bdf8', '#a78bfa', '#fb7185'],
  rainbow: ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6'],
};
const paletteArg = get('palette', 'neon');
const palette = palettes[paletteArg] ?? paletteArg.split(',').map((x) => x.trim()).filter(Boolean);
const backgrounds = { white: '#fff', black: '#0b1020', light: '#f8fafc', transparent: 'none' };
const backgroundArg = get('background', 'white');
const background = backgrounds[backgroundArg] ?? backgroundArg;

function rng(value) {
  let x = value >>> 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 4294967296;
  };
}

const random = rng(seed);
const pick = (items) => items[Math.floor(random() * items.length)];

function square() {
  const n = Math.round(grid);
  const cell = size / n;
  let body = '';
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    if (random() > 0.25) body += `<rect x="${x * cell}" y="${y * cell}" width="${cell + 0.2}" height="${cell + 0.2}" fill="${pick(palette)}"/>`;
  }
  return body;
}

function egg() {
  return `<ellipse cx="${size / 2}" cy="${size / 2}" rx="${size * rx}" ry="${size * ry}" fill="${pick(palette)}" transform="rotate(${rotate} ${size / 2} ${size / 2})"/>`;
}

function rainbow() {
  const cx = size / 2;
  const cy = size * 0.62;
  let body = '';
  [...palette, ...palette].slice(0, 5).forEach((color, i) => {
    const r = size * 0.46 - i * stroke;
    body += `<path d="M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}" fill="none" stroke="${color}" stroke-width="${stroke}"/>`;
  });
  return body;
}

function pattern() {
  let body = '';
  for (let i = 0; i < Math.round(count); i++) {
    const r = size * (0.04 + random() * 0.14);
    body += `<circle cx="${random() * size}" cy="${random() * size}" r="${r}" fill="${pick(palette)}"/>`;
  }
  return body;
}

function generate(kind) {
  if (kind === 'random') kind = pick(['square', 'egg', 'rainbow', 'pattern']);
  return ({ square, egg, rainbow, pattern }[kind] ?? pattern)();
}

const body = generate(type);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="100%" height="100%" fill="${background}"/><g opacity="${opacity}">${body}</g></svg>`;

if (args.has('url')) {
  const base = get('base-url', 'https://bonsai.github.io/svgen/');
  const params = new URLSearchParams();
  for (const key of ['type', 'seed', 'size', 'palette', 'background', 'opacity', 'rotate', 'count', 'grid', 'rx', 'ry', 'stroke']) {
    if (args.has(key)) params.set(key, get(key));
  }
  process.stdout.write(`${base}?${params}\n`);
} else if (args.has('output')) {
  await writeFile(get('output'), `${svg}\n`, 'utf8');
} else {
  process.stdout.write(`${svg}\n`);
}
