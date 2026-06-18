<#
.SYNOPSIS
    Bootstraps and launches the Azure AI Language PII Redaction Studio demo.

.DESCRIPTION
    Verifies prerequisites (.NET 8+ SDK, Node 20+), installs dependencies
    if missing, then starts the .NET API on :5080 and the Vite dev server
    on :5173 in parallel windows, and opens the browser.

    Run from the repo root:
        ./start.ps1
#>

[CmdletBinding()]
param(
    [switch]$NoBrowser
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$apiPath  = Join-Path $repoRoot 'api'
$webPath  = Join-Path $repoRoot 'web'
$runDir   = Join-Path $repoRoot '.run'

if (-not (Test-Path $runDir)) {
    New-Item -ItemType Directory -Path $runDir | Out-Null
}

function Write-Section($msg) {
    Write-Host ""
    Write-Host "==> $msg" -ForegroundColor Cyan
}

function Test-CommandExists($name) {
    try { Get-Command $name -ErrorAction Stop | Out-Null; return $true }
    catch { return $false }
}

Write-Section 'Verifying prerequisites'

if (-not (Test-CommandExists 'dotnet')) {
    Write-Error "dotnet CLI not found. Install the .NET 8 SDK from https://dotnet.microsoft.com/download/dotnet/8.0"
    exit 1
}
$dotnetVersion = (& dotnet --version).Trim()
$dotnetMajor = [int]($dotnetVersion.Split('.')[0])
if ($dotnetMajor -lt 8) {
    Write-Error ".NET SDK $dotnetVersion detected. This demo requires .NET 8 or newer. Install from https://dotnet.microsoft.com/download/dotnet/8.0"
    exit 1
}
Write-Host "    dotnet $dotnetVersion [OK]"

if (-not (Test-CommandExists 'node')) {
    Write-Error "Node.js not found. Install Node 20+ from https://nodejs.org/"
    exit 1
}
$nodeVersion = (& node -v).TrimStart('v').Trim()
$nodeMajor = [int]($nodeVersion.Split('.')[0])
if ($nodeMajor -lt 20) {
    Write-Error "Node $nodeVersion detected. This demo requires Node 20 or newer."
    exit 1
}
Write-Host "    node v$nodeVersion [OK]"

if (-not (Test-CommandExists 'npm')) {
    Write-Error "npm not found (should ship with Node.js)."
    exit 1
}

Write-Section 'Restoring backend (dotnet)'
Push-Location $apiPath
try {
    & dotnet restore | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "dotnet restore failed" }
    Write-Host '    dotnet restore complete [OK]'
} finally {
    Pop-Location
}

Write-Section 'Installing frontend dependencies (npm)'
Push-Location $webPath
try {
    if (-not (Test-Path (Join-Path $webPath 'node_modules'))) {
        Write-Host '    node_modules missing -- running npm install (this may take a minute)...'
        & npm install --no-audit --no-fund
        if ($LASTEXITCODE -ne 0) { throw "npm install failed" }
    } else {
        Write-Host '    node_modules present -- skipping install'
    }
    Write-Host '    frontend deps ready [OK]'
} finally {
    Pop-Location
}

Write-Section 'Starting services'

$apiCmd = "dotnet run --project `"$apiPath`" --urls http://localhost:5080"
$webCmd = "npm run dev --silent -- --host localhost --port 5173"

$apiProc = Start-Process -FilePath 'powershell.exe' `
    -ArgumentList '-NoExit', '-Command', $apiCmd `
    -WorkingDirectory $apiPath `
    -WindowStyle Normal `
    -PassThru

Start-Sleep -Seconds 2

$webProc = Start-Process -FilePath 'powershell.exe' `
    -ArgumentList '-NoExit', '-Command', $webCmd `
    -WorkingDirectory $webPath `
    -WindowStyle Normal `
    -PassThru

$apiProc.Id | Out-File -FilePath (Join-Path $runDir 'api.pid') -Encoding ascii
$webProc.Id | Out-File -FilePath (Join-Path $runDir 'web.pid') -Encoding ascii

Write-Host ("    API window PID: {0}" -f $apiProc.Id)
Write-Host ("    Web window PID: {0}" -f $webProc.Id)

Write-Section 'Waiting for frontend to come up'
$frontendUrl = 'http://localhost:5173'
$ready = $false
for ($i = 0; $i -lt 30; $i++) {
    Start-Sleep -Seconds 1
    try {
        $resp = Invoke-WebRequest -Uri $frontendUrl -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
        if ($resp.StatusCode -eq 200) { $ready = $true; break }
    } catch { }
}

if ($ready) {
    Write-Host "    Frontend ready at $frontendUrl [OK]"
    if (-not $NoBrowser) {
        Start-Process $frontendUrl | Out-Null
    }
} else {
    Write-Warning "Frontend did not respond within 30s. Open $frontendUrl manually once the Vite window finishes starting."
}

Write-Section 'Demo launched'
Write-Host "    API:      http://localhost:5080  (window PID $($apiProc.Id))"
Write-Host "    Frontend: $frontendUrl  (window PID $($webProc.Id))"
Write-Host ""
Write-Host "    Stop with: ./stop.ps1"
