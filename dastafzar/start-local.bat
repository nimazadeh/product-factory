@echo off
REM ============================================================================
REM  Dastafzar - Local installer / launcher for Windows 11 (NO Docker)
REM  Uses YOUR local PostgreSQL. Just double-click this file.
REM
REM  What it does:
REM    1. Checks Node.js 20+ is installed
REM    2. Creates api\.env from the example (only first run) with your DB password
REM    3. Creates the database + user in PostgreSQL if they do not exist
REM    4. Installs + builds the API (NestJS) and runs database migrations
REM    5. Installs + builds the website (Next.js)
REM    6. Starts API (port 4000) and Website (port 3000) in two windows
REM    7. Waits until both answer, then opens the site + admin panel info
REM
REM  If something fails, read the red [ERROR] line - it tells you the fix.
REM ============================================================================
setlocal EnableDelayedExpansion
cd /d "%~dp0"

REM ------------------------- CONFIG - EDIT IF NEEDED -------------------------
set "PG_HOST=localhost"
set "PG_PORT=5432"
set "PG_SUPERUSER=postgres"
set "PG_PASSWORD=12345678"
set "DB_NAME=dastafzar"
set "DB_USER=dastafzar"
set "DB_PASSWORD=12345678"
set "ADMIN_EMAIL=admin@example.com"
set "ADMIN_PASSWORD=********"
REM ---------------------------------------------------------------------------

echo.
echo ============================================================
echo   Dastafzar local setup (Windows, local PostgreSQL)
echo ============================================================
echo.

REM --- 1. Node.js check -------------------------------------------------------
where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js was not found.
  echo         Install Node.js 20 LTS or newer from https://nodejs.org and run this file again.
  pause
  exit /b 1
)
for /f "tokens=1 delims=v." %%v in ('node --version') do set "NODE_MAJOR=%%v"
if !NODE_MAJOR! LSS 20 (
  echo [ERROR] Node.js 20 or newer is required. Found: 
  node --version
  pause
  exit /b 1
)
echo [OK] Node.js found:
node --version

REM --- 2. Env files (first run only, never overwritten) -----------------------
if not exist "api\.env" (
  echo [..] First run: creating api\.env from api\.env.example ...
  copy /y "api\.env.example" "api\.env" >nul
  powershell -NoProfile -Command "$c = Get-Content 'api\.env'; $c = $c -replace 'CHANGE_ME','%DB_PASSWORD%' -replace '^ADMIN_EMAIL=.*','ADMIN_EMAIL=%ADMIN_EMAIL%' -replace '^ADMIN_PASSWORD=.*','ADMIN_PASSWORD=%ADMIN_PASSWORD%'; Set-Content 'api\.env' $c"
  echo [OK] api\.env created. Database password set to the value in CONFIG above.
) else (
  echo [OK] api\.env already exists - kept as is.
)
if not exist ".env" (
  echo POSTGRES_PASSWORD=%DB_PASSWORD% > ".env"
)

REM --- 3. Database: create user + database if missing (needs psql) ------------
where psql >nul 2>&1
if errorlevel 1 (
  echo [WARN] psql was not found in PATH - skipping automatic database creation.
  echo        Make sure database "%DB_NAME%" and user "%DB_USER%" exist in PostgreSQL,
  echo        or add the PostgreSQL bin folder to PATH and run again.
) else (
  echo [..] Checking database "%DB_NAME%" in PostgreSQL...
  set "PGPASSWORD=%PG_PASSWORD%"
  psql -h %PG_HOST% -p %PG_PORT% -U %PG_SUPERUSER% -d postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname='%DB_USER%'" | findstr /c:"1" >nul
  if errorlevel 1 (
    psql -h %PG_HOST% -p %PG_PORT% -U %PG_SUPERUSER% -d postgres -c "CREATE USER %DB_USER% WITH PASSWORD '%DB_PASSWORD%';"
  )
  psql -h %PG_HOST% -p %PG_PORT% -U %PG_SUPERUSER% -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='%DB_NAME%'" | findstr /c:"1" >nul
  if errorlevel 1 (
    psql -h %PG_HOST% -p %PG_PORT% -U %PG_SUPERUSER% -d postgres -c "CREATE DATABASE %DB_NAME% OWNER %DB_USER%;"
  )
  REM Can the app user actually connect?
  set "PGPASSWORD=%DB_PASSWORD%"
  psql -h %PG_HOST% -p %PG_PORT% -U %DB_USER% -d %DB_NAME% -tAc "SELECT 1" >nul 2>&1
  if errorlevel 1 (
    echo [ERROR] Cannot connect to PostgreSQL as user "%DB_USER%".
    echo         Check that PostgreSQL is running and the password in CONFIG is right.
    echo         Current CONFIG: host=%PG_HOST% port=%PG_PORT% user=%DB_USER% password=%DB_PASSWORD%
    pause
    exit /b 1
  )
  echo [OK] Database is reachable.
)

REM --- 4. API: install, generate, migrate, build ------------------------------
echo [..] Installing API dependencies (first run takes a few minutes)...
pushd api
call npm install --legacy-peer-deps --no-audit --no-fund
if errorlevel 1 ( echo [ERROR] npm install failed in api. & popd & pause & exit /b 1 )
echo [..] Generating Prisma client + applying migrations...
call npx prisma generate
if errorlevel 1 ( echo [ERROR] prisma generate failed. & popd & pause & exit /b 1 )
call npx prisma migrate deploy
if errorlevel 1 ( echo [ERROR] prisma migrate deploy failed - is PostgreSQL running? & popd & pause & exit /b 1 )
echo [..] Building API...
call npm run build
if errorlevel 1 ( echo [ERROR] API build failed. & popd & pause & exit /b 1 )
popd
echo [OK] API built.

REM --- 5. Website: install + build --------------------------------------------
echo [..] Installing website dependencies...
call npm install --legacy-peer-deps --no-audit --no-fund
if errorlevel 1 ( echo [ERROR] npm install failed. & pause & exit /b 1 )
echo [..] Building website...
call npm run build
if errorlevel 1 ( echo [ERROR] Website build failed. & pause & exit /b 1 )
echo [OK] Website built.

REM --- 6. Start both servers in their own windows ------------------------------
echo [..] Starting API on port 4000 (new window, keep it open)...
start "Dastafzar API - port 4000" /D "%~dp0api" cmd /k node dist\main.js

echo [..] Waiting for API to answer...
set "API_UP="
for /L %%i in (1,1,30) do (
  if not defined API_UP (
    powershell -NoProfile -Command "try { (Invoke-WebRequest -UseBasicParsing -TimeoutSec 2 http://localhost:4000/api/health).StatusCode } catch { exit 1 }" >nul 2>&1
    if not errorlevel 1 set "API_UP=1"
    if not defined API_UP timeout /t 1 /nobreak >nul
  )
)
if not defined API_UP (
  echo [ERROR] API did not come up in 30 seconds. Look at the "Dastafzar API" window for the error.
  pause
  exit /b 1
)
echo [OK] API is up: http://localhost:4000/api/health

echo [..] Starting website on port 3000 (new window, keep it open)...
start "Dastafzar Website - port 3000" /D "%~dp0" cmd /k "call npm run start -- -p 3000"

echo [..] Waiting for website to answer...
set "WEB_UP="
for /L %%i in (1,1,30) do (
  if not defined WEB_UP (
    powershell -NoProfile -Command "try { (Invoke-WebRequest -UseBasicParsing -TimeoutSec 2 http://localhost:3000).StatusCode } catch { exit 1 }" >nul 2>&1
    if not errorlevel 1 set "WEB_UP=1"
    if not defined WEB_UP timeout /t 1 /nobreak >nul
  )
)
if not defined WEB_UP (
  echo [ERROR] Website did not come up in 30 seconds. Look at the "Dastafzar Website" window for the error.
  pause
  exit /b 1
)

echo.
echo ============================================================
echo   DONE - Dastafzar is running.
echo.
echo   Website:      http://localhost:3000
echo   Admin panel:  http://localhost:3000/admin
echo   Admin login:  %ADMIN_EMAIL%  /  %ADMIN_PASSWORD%
echo                 (from api\.env - change ADMIN_PASSWORD there + rerun)
echo.
echo   To STOP: close the two server windows (API / Website).
echo   To START again later: just run this file again.
echo ============================================================
echo.
start http://localhost:3000
pause
exit /b 0
