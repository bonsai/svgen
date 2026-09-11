# svgen

Tiny SVG design generator. **Node.js + JavaScript only.**

`svgen` generates small, deterministic SVG designs for favicon, icon, thumbnail, pattern and other tiny visual assets.

## CLI

```bash
npm install
node src/cli.js --type random --seed 42 --size 64
node src/cli.js --type square --seed 42 --size 64 > square.svg
node src/cli.js --type egg --seed 42 --size 128 --output egg.svg
node src/cli.js --type rainbow --seed 42 --size 64 > rainbow.svg
node src/cli.js --type pattern --seed 42 --size 64 > pattern.svg
```

### Install scripts

WSL / Linux:

```bash
./scripts/install.sh
```

PowerShell:

```powershell
./scripts/install.ps1
```

The scripts install with npm and run a small generation test. No Bun is required.

### Direct execution

From the repository root:

```bash
node src/cli.js --type square --seed 42 --size 64 > square.svg
```

From `src`:

```bash
node ./cli.js --type square --seed 42 --size 64 > square.svg
```

On WSL, do not use Windows path syntax such as `node .\cli.js`. The correct relative path is `node ./cli.js`.

## Generators

- `square` — square / grid compositions
- `egg` — organic egg form
- `rainbow` — arc / band composition
- `pattern` — small random pattern
- `random` — selects a generator deterministically from the seed

## Design principle

The output is deliberately tiny. 16 / 32 / 48 / 64 px are first-class targets.

The generator separates **shape × palette × layout × seed** so that AW can later choose a repo's visual identity without embedding design logic in the workflow.

```text
AW / repo config
      ↓
     svgen
      ↓
 tiny SVG
      ↓
 favicon / icon / logo / pattern
```

`svgen` only generates. Git commit/push and repo-level decisions belong to AW.
