@echo off
set "Path=C:\Users\Tz Grup\.local\bin;%Path%"
cd /d "C:\Users\Tz Grup\technocore-agent"
uv run --python 3.12 flop_agent.py %*
pause