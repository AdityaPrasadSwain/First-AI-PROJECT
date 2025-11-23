# GitHub Upload Guide

## Prerequisites
1. Install Git from: https://git-scm.com/download/win
2. Create a GitHub account if you don't have one
3. Make sure you have access to: https://github.com/AdityaPrasadSwain/First-AI-PROJECT.git

## Steps to Upload

### 1. Install Git (if not already installed)
- Download Git for Windows from https://git-scm.com/download/win
- Run the installer with default settings
- Restart your terminal/command prompt

### 2. Configure Git (First time only)
Open Command Prompt or PowerShell and run:
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 3. Initialize Git Repository
Navigate to your project folder and run:
```bash
cd C:\Users\swain\OneDrive\Desktop\Test
git init
```

### 4. Create .gitignore File
A .gitignore file has been created for you in the project root.

### 5. Add All Files
```bash
git add .
```

### 6. Commit Changes
```bash
git commit -m "Initial commit: Food delivery app with cart, orders, and delivery tracking"
```

### 7. Add Remote Repository
```bash
git remote add origin https://github.com/AdityaPrasadSwain/First-AI-PROJECT.git
```

### 8. Push to GitHub
```bash
git branch -M main
git push -u origin main
```

If the repository already has content, you might need to force push:
```bash
git push -u origin main --force
```

## Alternative: Using GitHub Desktop
1. Download GitHub Desktop: https://desktop.github.com/
2. Install and sign in with your GitHub account
3. Click "Add" → "Add Existing Repository"
4. Select your project folder: C:\Users\swain\OneDrive\Desktop\Test
5. Click "Publish repository"
6. Enter repository name: First-AI-PROJECT
7. Click "Publish Repository"

## Project Structure
Your project includes:
- ✅ Backend (Spring Boot + PostgreSQL)
- ✅ Frontend (React + TypeScript + Vite)
- ✅ Cart functionality with quantity management
- ✅ Order tracking with delivery status
- ✅ Restaurant owner dashboard
- ✅ Delivery partner dashboard
- ✅ Customer order history
- ✅ Real-time status updates

## Important Notes
- Make sure to update database credentials in `backend/src/main/resources/application.properties`
- Don't commit sensitive information (passwords, API keys)
- The .gitignore file excludes node_modules, target, and other build artifacts

## Troubleshooting

### If you get "repository already exists" error:
```bash
git remote remove origin
git remote add origin https://github.com/AdityaPrasadSwain/First-AI-PROJECT.git
git push -u origin main --force
```

### If you get authentication error:
- Use GitHub Personal Access Token instead of password
- Generate token at: https://github.com/settings/tokens
- Use token as password when prompted

### If you want to update existing repository:
```bash
git add .
git commit -m "Update: Added delivery partner panel and fixed cart issues"
git push origin main
```
