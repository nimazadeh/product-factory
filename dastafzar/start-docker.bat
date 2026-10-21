@echo off
REM ============================================================================
REM  Dastafzar - FULL Docker installer / launcher for Windows 11
REM  Everything (database + API + website) runs inside Docker. Nothing else
REM  needs to be installed except Docker Desktop. Just double-click.
REM
REM  What it does:
REM    1. Checks Docker is installed and the daemon is running
REM       (auto-starts Docker Desktop and waits if needed)
REM    2. Creates .env with the database password (first run only)
REM    3. Builds + starts all containers: db (5432), api (4000), web (3000)
REM    4. The API container applies database migrations automatically
REM    5. Waits until website + API answer, then opens the site
REM ============================================================================
setlocal EnableDelayedExpansion
cd /d "%~dp0"

REM ------------------------- CONFIG - EDIT IF NEEDED -------------------------
set "DB_PASSWORD=12345678"
set "ADMIN_EMAIL=admin@example.com"
set "ADMIN_PASSWORD=********"
REM ---------------------------------------------------------------------------

echo.
echo ============================================================
echo   Dastafzar Docker setup (Windows 11)
echo ============================================================
echo.

REM --- 1. Docker installed? -----------------------------------------------------
where docker >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Docker was not found.
  echo         Install Docker Desktop from https://www.docker.com/products/docker-desktop
  echo         then run this file again.
  pause
  exit /b 1
)
echo [OK] Docker CLI found.

REM --- 2. Docker daemon running? Start Docker Desktop if not -------------------
docker info >nul 2>&1
if errorlevel 1 (
  echo [..] Docker is not running - starting Docker Desktop...
  if exist "C:\Program Files\Docker\Docker\Docker Desktop.exe" (
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
  ) else (
    echo [ERROR] Docker Desktop.exe not found in the default location.
    echo         Start Docker Desktop manually, wait until it is green, run again.
    pause
    exit /b 1
  )
  echo [..] Waiting for Docker engine (up to 3 minutes)...
  set "DOCKER_UP="
  for /L %%i in (1,1,36) do (
    if not defined DOCKER_UP (
      docker info >nul 2>&1
      if not errorlevel 1 set "DOCKER_UP=1"
      if not defined DOCKER_UP timeout /t 5 /nobreak >nul
    )
  )
  if not defined DOCKER_UP (
    echo [ERROR] Docker engine did not start in time. Open Docker Desktop,
    echo         wait until it says "Engine running", then run this file again.
    pause
    exit /b 1
  )
)
echo [OK] Docker engine is running.

REM --- 3. Root .env (database password for compose, first run only) -------------
if not exist ".env" (
  echo POSTGRES_PASSWORD=%DB_PASSWORD% > ".env"
  echo [OK] Created .env with POSTGRES_PASSWORD from CONFIG above.
) else (
  echo [OK] .env already exists - kept as is.
)

REM --- 4. Build + start everything ----------------------------------------------
echo [..] Building and starting containers (first run downloads images - be patient)...
call docker compose up -d --build
if errorlevel 1 (
  echo [ERROR] docker compose failed. Scroll up for the first red error,
  echo         or run:  docker compose logs
  pause
  exit /b 1
)

REM --- 5. Wait for API, then website ----------------------------------------------
echo [..] Waiting for API (migrations run automatically inside the container)...
set "API_UP="
for /L %%i in (1,1,60) do (
  if not defined API_UP (
    powershell -NoProfile -Command "try { (Invoke-WebRequest -UseBasicParsing -TimeoutSec 2 http://localhost:4000/api/health).StatusCode } catch { exit 1 }" >nul 2>&1
    if not errorlevel 1 set "API_UP=1"
    if not defined API_UP timeout /t 2 /nobreak >nul
  )
)
if not defined API_UP (
  echo [ERROR] API did not come up. Check its logs with:
  echo         docker compose logs api
  pause
  exit /b 1
)
echo [OK] API is up: http://localhost:4000/api/health

echo [..] Waiting for website...
set "WEB_UP="
for /L %%i in (1,1,60) do (
  if not defined WEB_UP (
    powershell -NoProfile -Command "try { (Invoke-WebRequest -UseBasicParsing -TimeoutSec 2 http://localhost:3000).StatusCode } catch { exit 1 }" >nul 2>&1
    if not errorlevel 1 set "WEB_UP=1"
    if not defined WEB_UP timeout /t 2 /nobreak >nul
  )
)
if not defined WEB_UP (
  echo [ERROR] Website did not come up. Check its logs with:
  echo         docker compose logs web
  pause
  exit /b 1
)

echo.
echo ============================================================
echo   DONE - Dastafzar is running in Docker.
echo.
echo   Website:      http://localhost:3000
echo   Admin panel:  http://localhost:3000/admin
echo   Admin login:  %ADMIN_EMAIL%  /  %ADMIN_PASSWORD%
echo.
echo   Useful commands (run in this folder):
echo     docker compose logs -f      watch logs
echo     docker compose down         stop everything (data is kept)
echo     docker compose up -d        start again
echo     docker compose down -v      stop + DELETE the database
echo ============================================================
echo.
start http://localhost:3000
pause
exit /b 0
