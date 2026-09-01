@echo off
cd /d "%~dp0"
chcp 65001 >nul
title TECHNOCORE 7/24 OTONOM SWARM ENGINE v2.0
color 0A

:menu
cls
echo.
echo  ======================================================================
echo  =                                                                    =
echo  =     TECHNOCORE HYPER-SWARM ENGINE v2.0 - KONTROL MERKEZI          =
echo  =                                                                    =
echo  ======================================================================
echo.
echo   [SISTEM OZELLIKLERI]
echo   ---------------------------------------------------------------------------
echo    AI Motoru       : Llama-3.2:3B (Birincil) + Llama-3.2:1B (Yedek)
echo    Ajan Sayisi     : 5 Otonom Ajan (Alpha-Prime + 4 Node)
echo    Ollama Sunucu   : 127.0.0.1:11434 (Yerel GPU/CPU)
echo   ---------------------------------------------------------------------------
echo    Kibble Motoru   : Harici is cozme (CLAIM - DELIVER) + Hakemlik (ATTEST)
echo    Organik Gorevler: 5 Dakikada 1 Arastirma Gorevi (+2 Puan)
echo    Quorum Sistemi  : 3 Validator / 2-3 Cogunluk Oylama
echo    Spam Avcisi     : Stub/Duplicate/Template/Hash-Collision Tespit
echo    Asalak Avci     : Bilinen bot DID'lerine NOT (-3 Puan) Cezasi
echo   ---------------------------------------------------------------------------
echo    Credence Odasi  : /r/credence Ampirik Arastirma (ACCEPT-SUBMIT-VOUCH)
echo    Anti-Sybil      : Pair Cap (max=2) + Reciprocal (max=1)
echo    Oran Dengesi    : %%80 Dis Ag / %%20 Ic Benchmark
echo    Bellek Koruma   : 500 kayit siniri (7/24 guvenli)
echo    Otomatik Restart: Cokme/Baglanti kopma durumunda 10s yeniden baslatma
echo   ---------------------------------------------------------------------------
echo.
echo   [KOMUTLAR]
echo   ---------------------------------------------------------------------------
echo    1. BASLAT       - Swarm Engine'i baslat (7/24 otonom mod)
echo    2. TEKRAR BASLAT- Motoru durdur ve sifirdan tekrar baslat
echo    3. DURUM        - Ollama AI ve sistem durumunu kontrol et
echo    4. TEST         - Llama-3 AI test calistir
echo    5. SKOR         - Canli liderlik tablosunu kontrol et
echo    6. CIKIS        - Programi kapat
echo   ---------------------------------------------------------------------------
echo.

set /p choice="  Seciminiz [1-6]: "

if "%choice%"=="1" goto start_engine
if "%choice%"=="2" goto restart_engine
if "%choice%"=="3" goto check_status
if "%choice%"=="4" goto test_llm
if "%choice%"=="5" goto check_score
if "%choice%"=="6" goto quit
goto menu

:start_engine
cls
echo.
echo  ======================================================================
echo   TECHNOCORE 7/24 OTONOM SWARM MOTORU BASLATILIYOR
echo  ======================================================================
echo.
curl -s http://127.0.0.1:11434/ >nul 2>nul
if %errorlevel% neq 0 (
    if exist "%LOCALAPPDATA%\Programs\Ollama\ollama.exe" (
        echo   [*] Ollama AI servisi baslatiliyor...
        start /b "" "%LOCALAPPDATA%\Programs\Ollama\ollama.exe" serve >nul 2>nul
        timeout /t 4 /nobreak >nul
        echo   [OK] Ollama baslatildi.
    ) else (
        echo   [!] Ollama bulunamadi! (Fallback calisacak)
    )
) else (
    echo   [OK] Ollama AI servisi aktif.
)
echo.

:run_loop
echo.
echo  [*] Swarm Engine baslatiliyor... [%date% %time%]
echo  ----------------------------------------------------------------------
echo.

python -u swarm_engine.py

echo.
echo  [!] Motor durdu veya baglanti kesildi.
echo  [*] 10 saniye icinde otomatik yeniden baslatilacak...
echo      (Ana menuye donmek icin CTRL+C yapin)
echo.
timeout /t 10 /nobreak

curl -s http://127.0.0.1:11434/ >nul 2>nul
if %errorlevel% neq 0 (
    if exist "%LOCALAPPDATA%\Programs\Ollama\ollama.exe" (
        start /b "" "%LOCALAPPDATA%\Programs\Ollama\ollama.exe" serve >nul 2>nul
        timeout /t 3 /nobreak >nul
    )
)
goto run_loop

:restart_engine
cls
echo.
echo  ======================================================================
echo   MOTOR YENIDEN BASLATILIYOR
echo  ======================================================================
echo.
echo  [1/3] Mevcut Python islemleri durduruluyor...
taskkill /f /im python.exe >nul 2>nul
timeout /t 2 /nobreak >nul
echo  [2/3] Ollama AI kontrol ediliyor...
curl -s http://127.0.0.1:11434/ >nul 2>nul
if %errorlevel% neq 0 (
    if exist "%LOCALAPPDATA%\Programs\Ollama\ollama.exe" (
        start /b "" "%LOCALAPPDATA%\Programs\Ollama\ollama.exe" serve >nul 2>nul
        timeout /t 3 /nobreak >nul
    )
)
echo  [3/3] Swarm Engine temiz baslatma...
echo.
goto run_loop

:check_status
cls
echo.
echo  ======================================================================
echo   SISTEM DURUM KONTROLU
echo  ======================================================================
echo.

echo  [1] OLLAMA AI DURUMU:
curl -s http://127.0.0.1:11434/ >nul 2>nul
if %errorlevel% equ 0 (
    echo      [OK] Ollama servisi AKTIF (port 11434)
) else (
    echo      [X] Ollama servisi KAPALI
)
echo.

echo  [2] YUKLU AI MODELLERI:
curl -s http://127.0.0.1:11434/api/tags 2>nul | python -c "import sys,json; d=json.load(sys.stdin); [print(f'      - {m[\"name\"]} ({m.get(\"size\",0)//1048576}MB)') for m in d.get('models',[])]" 2>nul
if %errorlevel% neq 0 echo      [!] Model listesi alinamadi.
echo.

echo  [3] PYTHON DURUMU:
python --version 2>nul
if %errorlevel% neq 0 echo      [X] Python bulunamadi!
echo.

echo  [4] DOSYA KONTROLU:
if exist swarm_engine.py (echo      [OK] swarm_engine.py) else (echo      [X] swarm_engine.py EKSIK!)
if exist llm_client.py (echo      [OK] llm_client.py) else (echo      [X] llm_client.py EKSIK!)
if exist consensus_guard.py (echo      [OK] consensus_guard.py) else (echo      [X] consensus_guard.py EKSIK!)
if exist flop_agent.py (echo      [OK] flop_agent.py) else (echo      [X] flop_agent.py EKSIK!)
if exist alpha_protocol.py (echo      [OK] alpha_protocol.py) else (echo      [X] alpha_protocol.py EKSIK!)
if exist swarm_seeds.json (echo      [OK] swarm_seeds.json) else (echo      [X] swarm_seeds.json EKSIK!)
if exist .env (echo      [OK] .env) else (echo      [X] .env EKSIK!)
echo.

echo  [5] SON GIT COMMIT:
git log -1 --oneline 2>nul
echo.
echo  ======================================================================
echo.
pause
goto menu

:test_llm
cls
echo.
echo  ======================================================================
echo   LLAMA-3 AI TEST MODULU
echo  ======================================================================
echo.
echo  [*] Llama-3.2:3B modeline test sorusu gonderiliyor...
echo.
python -u test_llm.py 2>nul
if %errorlevel% neq 0 (
    echo  [!] test_llm.py calistirilamadi. Dosya eksik olabilir.
)
echo.
echo  ======================================================================
echo.
pause
goto menu

:check_score
cls
echo.
echo  ======================================================================
echo   CANLI LIDERLIK TABLOSU KONTROLU
echo  ======================================================================
echo.
python -c "import urllib.request,json; d=json.loads(urllib.request.urlopen('https://flop-kibble.onrender.com/api/board',timeout=10).read()); ps=d.get('passports',[]); seeds=json.load(open('swarm_seeds.json')); our_dids={s['did'] for s in seeds}; print(f'  Toplam Ajan: {len(ps)}'); print(); [print(f'  #{i+1} | {p[\"did\"][-10:]} | Skor:{p.get(\"score\",0):>6} | Is:{p.get(\"jobs_posted\",0):>4} | Teslim:{p.get(\"results_delivered\",0):>4} | Onay:{p.get(\"attestations_given\",0):>4}' + (' <<< BIZ!' if p.get('did') in our_dids else '')) for i,p in enumerate(ps[:15])]; print(); [print(f'  >>> BIZIM AJAN: ...{p[\"did\"][-10:]} | Sira: #{i+1} | Skor: {p.get(\"score\",0)}') for i,p in enumerate(ps) if p.get('did') in our_dids]" 2>nul
if %errorlevel% neq 0 (
    echo  [!] Liderlik tablosu alinamadi. Internet baglantisi kontrol edin.
)
echo.
echo  ======================================================================
echo.
pause
goto menu

:quit
echo.
echo  [*] Technocore Swarm Engine kapatiliyor...
echo  [*] Iyi geceler!
echo.
exit /b 0
