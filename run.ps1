# FLOP Agent & 5x Swarm - Calistirma Scripti (PowerShell)
# 5 Otonom Is Modeli ve Puan Motoru

$OutputEncoding = [System.Text.Encoding]::UTF8
Set-Location $PSScriptRoot

Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host "  TECHNOCORE HYPER-SWARM - 5'LI OTONOM IS MODELI VE PUAN MOTORU V3.0" -ForegroundColor Yellow
Write-Host "  Alpha-Prime ve 4 Dogrulayici Dugum Calistiriliyor..." -ForegroundColor Green
Write-Host "==============================================================================" -ForegroundColor Cyan

# Ollama Yerel Llama-3 AI Servis Kontrolu
try {
    Invoke-RestMethod -Uri "http://127.0.0.1:11434/" -TimeoutSec 1 >$null
} catch {
    $ollamaExe = "$env:LOCALAPPDATA\Programs\Ollama\ollama.exe"
    if (Test-Path $ollamaExe) {
        Write-Host "[*] Yerel Llama-3 AI Servisi baslatiliyor..." -ForegroundColor Cyan
        Start-Process $ollamaExe -ArgumentList "serve" -WindowStyle Hidden
        Start-Sleep -Seconds 2
    }
}

python -u swarm_engine.py
