$ErrorActionPreference = 'Stop'

Set-Location (Join-Path $PSScriptRoot '..')

Write-Host '[svgen] installing dependencies...'

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    throw '[svgen] npm is required'
}

npm install
npm run start -- --type random --seed 42 --size 64 | Set-Content -Encoding utf8 "$env:TEMP\svgen-test.svg"

Write-Host '[svgen] ready'
Write-Host "[svgen] generated $env:TEMP\svgen-test.svg"
