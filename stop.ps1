<#
.SYNOPSIS
    Stops the API and Vite dev server launched by start.ps1.

.DESCRIPTION
    Reads PIDs from .run/api.pid and .run/web.pid and terminates those
    processes (and the dotnet/node child processes they spawned).
#>

[CmdletBinding()]
param()

$ErrorActionPreference = 'Continue'
$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$runDir   = Join-Path $repoRoot '.run'

function Stop-PidFile($file, $label) {
    $path = Join-Path $runDir $file
    if (-not (Test-Path $path)) {
        Write-Host "    $label : no pid file found (skipping)"
        return
    }
    $processId = (Get-Content $path | Select-Object -First 1).Trim()
    if ([string]::IsNullOrWhiteSpace($processId)) {
        Write-Host "    $label : empty pid file (skipping)"
        Remove-Item $path -Force
        return
    }
    try {
        $proc = Get-Process -Id $processId -ErrorAction Stop
        # Kill the launcher window AND any child dotnet/node processes it spawned.
        $children = Get-CimInstance Win32_Process -Filter "ParentProcessId=$processId" -ErrorAction SilentlyContinue
        foreach ($child in $children) {
            try {
                Stop-Process -Id $child.ProcessId -Force -ErrorAction Stop
                Write-Host "    $label : stopped child PID $($child.ProcessId) ($($child.Name))"
            } catch { }
        }
        Stop-Process -Id $proc.Id -Force -ErrorAction Stop
        Write-Host "    $label : stopped window PID $($proc.Id)"
    } catch {
        Write-Host "    $label : process PID $processId not running"
    } finally {
        Remove-Item $path -Force -ErrorAction SilentlyContinue
    }
}

Write-Host ""
Write-Host "==> Stopping demo services" -ForegroundColor Cyan
Stop-PidFile 'api.pid' 'API'
Stop-PidFile 'web.pid' 'Web'
Write-Host ""
Write-Host "Done."
