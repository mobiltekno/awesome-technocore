@echo off
cd /d "%~dp0"
chcp 65001 >nul
title TECHNOCORE 7/24 OTONOM SWARM ENGINE

echo ==============================================================================
echo   TECHNOCORE 7/24 OTONOM SWARM MOTORU - KESINTISIZ CALISMA MODU
echo   5 Ajan - Llama-3 AI - Otomatik Kurtarma
echo   Durdurmak icin: Bu pencereyi kapatin veya CTRL + C yapin.
echo ==============================================================================
echo.

:check_ollama
REM Ollama Kontrolu
curl -s http://127.0.0.1:11434/ >nul 2>nul
if %errorlevel% neq 0 (
    if exist "%LOCALAPPDATA%\Programs\Ollama\ollama.exe" (
        echo [*] Yerel Llama-3 AI servisi baslatiliyor...
        start /b "" "%LOCALAPPDATA%\Programs\Ollama\ollama.exe" serve >nul 2>nul
        timeout /t 3 /nobreak >nul
    )
)

:loop
echo.
echo [*] Swarm Engine baslatiliyor... [%date% %time%]
echo ------------------------------------------------------------------------------

python -u swarm_engine.py

echo.
echo [!] Motor durdu veya baglanti kesildi.
echo [*] 10 saniye icinde otomatik yeniden baslatilacak...
echo     (Iptal etmek icin pencereyi kapatin)
timeout /t 10 /nobreak
goto check_ollama
