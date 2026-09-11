# svgen Skill

## Purpose

Turn a natural-language visual request into a deterministic `svgen` CLI command and GitHub Pages URL.

`svgen` is responsible for generation. The skill is responsible for interpreting intent and selecting parameters. AW remains responsible for repo-level workflow, commit and push.

## Input

A user can describe the design naturally in Japanese or English.

Examples:

- 「64pxの卵、青系、seed 42」
- 「黒背景でfavicon向けの小さなランダム模様」
- 「赤黄緑青紫の虹を128pxで」
- "make a cool 32px square pattern"

## Parameter mapping

| Natural language | Parameter |
|---|---|
| 卵 / egg | `type=egg` |
| 四角 / square / grid | `type=square` |
| 虹 / rainbow | `type=rainbow` |
| 模様 / pattern / dots | `type=pattern` |
| ランダム / random | `type=random` |
| px / ピクセル | `size` |
| seed / シード | `seed` |
| 青系 / cool | `palette=cool` |
| ネオン | `palette=neon` |
| 虹色 | `palette=rainbow` |
| 赤,青,緑など明示色 | `palette=#...,#...,#...` |
| 白背景 | `background=white` |
| 黒背景 | `background=black` |
| 透明背景 | `background=transparent` |
| 薄い背景 | `background=light` |
| 濃さ / opacity | `opacity` |
| 回転 / rotate | `rotate` |
| 個数 / count | `count` |
| グリッド / grid | `grid` |
| 横幅 / rx | `rx` |
| 縦幅 / ry | `ry` |
| 線幅 / stroke | `stroke` |

If a value is not specified, use the documented default. Do not invent unnecessary parameters.

## Output 1: CLI

Use:

```bash
node src/cli.js --type <type> --seed <seed> --size <size> ...
```

For example:

```bash
node src/cli.js --type egg --seed 42 --size 64 --palette cool --background black --rotate -8
```

To write a file:

```bash
node src/cli.js --type egg --seed 42 --size 64 --output egg.svg
```

## Output 2: Pages URL

Base:

```text
https://bonsai.github.io/svgen/
```

Construct a query string with the selected parameters:

```text
?type=<type>&seed=<seed>&size=<size>&palette=<palette>&background=<background>&opacity=<opacity>&rotate=<rotate>&count=<count>&grid=<grid>&rx=<rx>&ry=<ry>&stroke=<stroke>
```

Example:

```text
https://bonsai.github.io/svgen/?type=egg&seed=42&size=64&palette=cool&background=black&rotate=-8
```

URL-encode custom colors and other values when required.

## Output 3: Explanation

When responding to a user, briefly explain the interpreted design and expose the exact parameters. Prefer this compact format:

```text
type=egg
size=64
seed=42
palette=cool
background=black
rotate=-8

CLI: node src/cli.js ...
URL: https://bonsai.github.io/svgen/?...
```

## Determinism

Always preserve an explicitly supplied `seed`. If the user asks for reproducibility but gives no seed, choose a stable seed and state it.

## AW integration

The skill should not commit or push generated assets by itself unless the surrounding AW workflow explicitly requests it. The normal flow is:

```text
natural language
  ↓
skill
  ↓
parameters
  ↓
CLI / Pages URL
  ↓
svgen
  ↓
SVG
  ↓
AW commit / push
```
