@echo off
echo ==========================================
echo      Pushing Project to GitHub
echo ==========================================

REM Check if git is installed
where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Git is not installed or not in your PATH.
    echo Please install Git from https://git-scm.com/downloads
    echo and try again.
    pause
    exit /b
)

echo.
echo 1. Initializing Git repository...
if not exist .git (
    git init
) else (
    echo Git repository already initialized.
)

echo.
echo 2. Adding files...
git add .

echo.
echo 3. Committing changes...
git commit -m "Initial commit - Food Delivery App"

echo.
echo 4. Renaming branch to main...
git branch -M main

echo.
echo 5. Adding remote origin...
git remote remove origin 2>nul
git remote add origin https://github.com/AdityaPrasadSwain/First-AI-PROJECT.git

echo.
echo 6. Pushing to GitHub...
git push -u origin main

echo.
echo ==========================================
if %ERRORLEVEL% equ 0 (
    echo      Successfully pushed to GitHub!
) else (
    echo      Error pushing to GitHub.
    echo      Please check your internet connection
    echo      and ensure you have permissions.
)
echo ==========================================
pause
