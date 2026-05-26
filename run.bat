@echo off
title GCC Bijnor Portal - Local Server Launcher
color 0B

echo =======================================================================
echo          GLOBAL COMPUTER CENTER BIJNOR - LOCAL PORTAL LAUNCH                 
echo =======================================================================
echo.
echo [*] Checking Node.js installation...

node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed on your system!
    echo.
    echo React (Vite) models require Node.js to serve files correctly.
    echo Blank page is displayed because modern browsers block JavaScript modules
    echo when double-clicking direct index.html files (file:// protocol restrictions).
    echo.
    echo Please download and install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b
)

echo [OK] Node.js is installed.
echo.

if not exist node_modules (
    echo [-] node_modules directory is missing. Installing dependencies...
    echo     (This might take 1-2 minutes depending on your internet speed...)
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo [ERROR] Failed to install npm packages. 
        echo Check your internet connectivity or run 'npm install' manually.
        pause
        exit /b
    )
    echo.
    echo [OK] All dependencies successfully installed!
)

echo [*] Starting local secure development server...
echo [*] Opening your web browser at http://localhost:3000...
echo.

:: Open default browser after a short delay
timeout /t 3 /nobreak >nul
start http://localhost:3000

:: Start the application
call npm run dev

pause
