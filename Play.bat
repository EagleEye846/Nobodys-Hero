@echo off
rem Double-click this to play Nobody's Hero. It starts the game's little
rem server and opens the game in your web browser. Keep this window open
rem while you play; close it when you're done.
cd /d "%~dp0"
title Nobody's Hero

rem Prefer the "py" launcher that python.org's installer adds: a plain
rem "python" can be a stand-in that only opens the Microsoft Store.
set PYTHON=
where py >nul 2>nul && set PYTHON=py
if not defined PYTHON where python >nul 2>nul && set PYTHON=python
if not defined PYTHON (
  echo.
  echo  Python isn't installed, and the game needs it to run.
  echo  Get it from https://www.python.org/downloads/ and, while installing,
  echo  tick the box that says "Add python.exe to PATH". Then try again.
  echo.
  pause
  exit /b 1
)

echo.
echo  Starting Nobody's Hero...
echo  Your browser will open the game. If it doesn't, go to http://localhost:8000
echo  Keep this window open while you play. Close it to stop.
echo.
start "" http://localhost:8000
rem With the Studio here (the tools folder), start its server, so saving
rem from the Studio works; otherwise the plain game server.
if exist tools\serve.py (%PYTHON% tools\serve.py) else (%PYTHON% play.py)
pause
