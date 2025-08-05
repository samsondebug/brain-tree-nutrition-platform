@echo off
echo 🚀 Brain Tree Nutrition - Business Platform
echo ===========================================
echo.

echo 📦 Installing dependencies...
npm install

echo.
echo 🔧 Setting up environment...
if not exist .env (
    copy env.example .env
    echo ✅ Environment file created! Edit .env with your real credentials
) else (
    echo ✅ Environment file already exists
)

echo.
echo 🗄️  Database Setup Required:
echo   1. Install MongoDB locally OR
echo   2. Create MongoDB Atlas account (recommended)
echo   3. Update MONGODB_URI in .env file
echo.

echo 🔑 API Keys Required:
echo   - Shopify API credentials
echo   - Stripe API credentials  
echo   - Email SMTP settings
echo   - Update .env file with your real credentials
echo.

echo 🚀 Starting server...
echo   Server will run at: http://localhost:5000
echo   Press Ctrl+C to stop
echo.

npm start

pause 