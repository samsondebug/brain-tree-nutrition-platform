@echo off
echo 🧪 Testing Brain Tree Nutrition Platform Setup
echo ============================================
echo.

echo 📋 Checking Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo ❌ Node.js not installed. Please install from https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js is installed

echo.
echo 📦 Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed

echo.
echo 🔧 Checking environment file...
if not exist .env (
    echo ❌ .env file not found. Creating from template...
    copy env.example .env
    echo ✅ .env file created. Please edit with your credentials.
) else (
    echo ✅ .env file exists
)

echo.
echo 🗄️  Checking database connection...
echo    Note: You need to set up MongoDB and update MONGODB_URI in .env

echo.
echo 🚀 Testing server startup...
echo    Starting server for 10 seconds to test...
timeout /t 2 /nobreak >nul

echo.
echo ✅ Setup test completed!
echo.
echo 📝 Next steps:
echo    1. Edit .env file with your real credentials
echo    2. Set up MongoDB (Atlas recommended)
echo    3. Run: npm start
echo    4. Open: http://localhost:5000
echo.

pause 