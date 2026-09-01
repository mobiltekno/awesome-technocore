@echo off
chcp 65001 >nul
title TECHNOCORE HYPER-SWARM V3.0 (5'li Otonom Avci Bot)
cd /d "%~dp0"

echo ==============================================================================
echo   TECHNOCORE HYPER-SWARM - 5'LI OTONOM IS MODELI VE PUAN MOTORU V3.0
echo   Alpha-Prime ve 4 Dogrulayici Dugum Baslatiliyor...
echo ==============================================================================
echo.

REM 1. Python kontrolu
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [HATA] Python bulunamadi! Lutfen Python'un kurulu ve PATH'e ekli oldugundan emin olun.
    pause
    exit /b 1
)

REM 2. Gerekli kutuphanelerin kontrolu
python -c "import cryptography" >nul 2>nul
if %errorlevel% neq 0 (
    echo [*] Gerekli 'cryptography' kutuphanesi kuruluyor...
    pip install cryptography
)

REM 3. Ollama Yerel AI Servis Kontrolu
curl -s http://127.0.0.1:11434/ >nul 2>nul
if %errorlevel% neq 0 (
    if exist "%LOCALAPPDATA%\Programs\Ollama\ollama.exe" (
        echo [*] Yerel Llama-3 AI Motoru baslatiliyor...
        start /b "" "%LOCALAPPDATA%\Programs\Ollama\ollama.exe" serve >nul 2>nul
        timeout /t 2 /nobreak >nul
    )
)

echo [*] Swarm Engine (Llama-3 Destekli 5 Otonom Is Modeli) Calistiriliyor...
echo [*] Durdurmak icin istediginiz zaman CTRL + C basabilirsiniz.
echo.

python -u swarm_engine.py

if %errorlevel% neq 0 (
    echo.
    echo [!] Program sonlandi veya hata aldi.
)

pause
