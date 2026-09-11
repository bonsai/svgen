# svgen

Tiny deterministic SVG design generator for favicon, icon, thumbnail, pattern and other small visual assets.

**Node.js + JavaScript only. No Bun.**

## 1. CLI

```bash
npm install
node src/cli.js --type egg --seed 42 --size 128 --palette rainbow
node src/cli.js --type square --seed 42 --size 64 --grid 4 > square.svg
node src/cli.js --type pattern --seed 42 --size 64 --count 8 --palette cool > pattern.svg
node src/cli.js --type egg --seed 42 --size 128 --rx 0.35 --ry 0.43 --rotate -8 --output egg.svg
```

### All CLI parameters

| Parameter | Values / example | Meaning |
|---|---|---|
| `--type` | `square`, `egg`, `rainbow`, `pattern`, `random` | generator |
| `--seed` | `42` | deterministic seed |
| `--size` | `64` | canvas size, minimum 8 |
| `--palette` | `neon`, `cool`, `rainbow`, `#f00,#0f0,#00f` | colors |
| `--background` | `white`, `black`, `light`, `transparent`, CSS color | background |
| `--opacity` | `0.9` | shape opacity, 0–1 |
| `--rotate` | `-8` | egg rotation in degrees |
| `--count` | `8` | pattern element count |
| `--grid` | `4` | square grid, 2–8 |
| `--rx` | `0.35` | egg horizontal radius ratio |
| `--ry` | `0.43` | egg vertical radius ratio |
| `--stroke` | `5` | rainbow stroke width |
| `--output` | `egg.svg` | write SVG to file |
| `--url` | flag | print the equivalent Pages API URL |
| `--base-url` | URL | override Pages base URL |

Generate a URL directly from the CLI:

```bash
node src/cli.js --url --type egg --seed 42 --size 128 --palette rainbow --background white --opacity 0.9 --rotate -8 --rx 0.35 --ry 0.43
```

## 2. GitHub Pages URL API

The public API is static and GET-based. Every design parameter can be expressed in the URL.

Base URL:

```text
https://bonsai.github.io/svgen/
```

Schema:

```text
https://bonsai.github.io/svgen/?type=<type>&seed=<seed>&size=<size>&palette=<palette>&background=<background>&opacity=<opacity>&rotate=<rotate>&count=<count>&grid=<grid>&rx=<rx>&ry=<ry>&stroke=<stroke>
```

Example:

```text
https://bonsai.github.io/svgen/?type=egg&seed=42&size=128&palette=rainbow&background=white&opacity=0.9&rotate=-8&rx=0.35&ry=0.43
```

The URL is deterministic when `seed` and all other parameters are fixed. This makes it suitable for AW, repo configuration, favicon generation, design experiments and small-image design meetings.

### Parameter schema

```yaml
type: [square, egg, rainbow, pattern, random]
seed: integer
size: integer >= 8
palette: neon | cool | rainbow | comma-separated CSS colors
background: white | black | light | transparent | CSS color
opacity: number 0..1
rotate: number
count: integer >= 1
grid: integer 2..8
rx: number >= 0
ry: number >= 0
stroke: number >= 0.5
```

OpenAPI: [`openapi.yaml`](./openapi.yaml)

## 3. Natural-language skill

The repository includes a reusable skill at [`skills/svgen/SKILL.md`](./skills/svgen/SKILL.md).

The skill converts natural-language design requests into:

```text
自然言語
   ↓
svgen parameters
   ↓
CLI command / Pages URL
   ↓
SVG
```

Examples:

```text
「青系で、64px、卵形、seed 42」
→ type=egg&size=64&seed=42&palette=cool

「赤黄緑青紫の虹を128pxで」
→ type=rainbow&size=128&palette=rainbow

「favicon用に黒背景で小さなランダム模様」
→ type=pattern&size=64&background=black
```

## 4. Design principle

`svgen` is the design generator. AW owns repo-level decisions, orchestration, commit and push.

```text
natural language
      ↓
    AW / skill
      ↓
 parameters
      ↓
    svgen
      ↓
 GitHub Pages URL
      ↓
 tiny SVG
```

16 / 32 / 48 / 64 px are first-class targets. The important abstraction is **shape × palette × layout × seed**.
