# FLOP Agent & 5x Swarm - Calistirma Scripti
# Kullanim: .\run.ps1       (interaktif numarali menu)
#           .\run.ps1 15    (15: 5'li Swarm Otonom Puan Fabrikasi)
#           .\run.ps1 12    (12: Tekli 7/24 Otonom Puan Motoru)
#           .\run.ps1 11    (11: Ag onay kanitlari ve linkler)
#           .\run.ps1 13    (13: Manuel Validator Denetleme Konsolu)
#           .\run.ps1 14    (14: Oracle Fiyat Dogrulayicisi)
#           .\run.ps1 3     (3:  Kibble is panosu ve liderlik tablosu)

$env:Path = "C:\Users\Tz Grup\.local\bin;$env:Path"
Set-Location "C:\Users\Tz Grup\technocore-agent"
uv run --python 3.12 flop_agent.py @args
