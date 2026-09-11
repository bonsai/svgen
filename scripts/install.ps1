$ErrorActionPreference = 'Stop'

Set-Location (Join-Path $PSScriptRoot '..')

Write-Host '[svgen] installing dependencies...'

if (Get-Command bun -ErrorAction SilentlyContinue) {
    bun install
    Write-Host '[svgen] Bun ready'
    bun src/cli.js --type random --seed 42 --size 64 | Set-Content -Encoding utf8 "$env:TEMP\svgen-test.svg"
} elseif (Get-Command npm -ErrorAction SilentlyContinue) {
    npm install
    Write-Host '[svgen] npm ready'
    node src/cli.js --type random --seed 42 --size 64 | Set-Content -Encoding utf8 "$env:TEMP\svgen-test.svg"
} else {
    throw '[svgen] bun or npm is required'
}

Write-Host "[svgen] generated $env:TEMP\svgen-test.svg"
