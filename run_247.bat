@echo off
chcp 65001 >nul
title Technocore 7/24 Swarm Engine

echo ============================================================
echo   TECHNOCORE 7/24 SWARM ENGINE - AUTO-RESTART
echo   Durdurma: Bu pencereyi kapatin veya Ctrl+C
echo ============================================================
echo.

:check_ollama
echo [1/2] Ollama kontrol ediliyor...
tasklist /FI "IMAGENAME eq ollama.exe" 2>NUL | find /I "ollama.exe" >NUL
if %errorlevel% neq 0 (
    echo [!] Ollama calismíyor, baslatiliyor...
    start /B "" "%LOCALAPPDATA%\Programs\Ollama\ollama.exe" serve
    timeout /t 5 /nobreak >nul
    echo [OK] Ollama baslatildi.
) else (
    echo [OK] Ollama zaten calisiyor.
)

:loop
echo.
echo [2/2] Swarm Engine baslatiliyor... [%date% %time%]
echo --------------------------------------------------------

cd /d "%~dp0"
python -u swarm_engine.py

echo.
echo [!] Motor durdu. 15 saniye sonra yeniden baslatilacak...
echo     Iptal icin Ctrl+C basin.
timeout /t 15 /nobreak
goto check_ollama
