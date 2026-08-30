# FLOP Agent & 5x Swarm - Calistirma Scripti (PowerShell)
# 5 Otonom Is Modeli ve Puan Motoru

$OutputEncoding = [System.Text.Encoding]::UTF8
Set-Location $PSScriptRoot

Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host "  TECHNOCORE HYPER-SWARM - 5'LI OTONOM IS MODELI VE PUAN MOTORU V3.0" -ForegroundColor Yellow
Write-Host "  Alpha-Prime ve 4 Dogrulayici Dugum Calistiriliyor..." -ForegroundColor Green
Write-Host "==============================================================================" -ForegroundColor Cyan

python -u swarm_engine.py
