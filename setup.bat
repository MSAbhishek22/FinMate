@echo off
echo 🚀 Setting up FinMate - Your Gen-Z Finance Buddy
echo ================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js (v16+) first.
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8+ first.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed!

REM Setup Frontend
echo.
echo 📱 Setting up Frontend...
cd frontend

REM Install dependencies
echo Installing frontend dependencies...
call npm install

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating frontend .env file...
    copy env.example .env
)

cd ..

REM Setup Backend
echo.
echo 🔧 Setting up Backend...
cd backend

REM Create virtual environment
echo Creating Python virtual environment...
python -m venv venv

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing backend dependencies...
pip install -r requirements.txt

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating backend .env file...
    copy env.example .env
    echo ⚠️  Please update backend\.env with your OpenAI API key
)

cd ..

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Update backend\.env with your OpenAI API key
echo 2. Start the backend: cd backend ^&^& venv\Scripts\activate.bat ^&^& python app.py
echo 3. Start the frontend: cd frontend ^&^& npm run dev
echo.
echo 🌐 Frontend will be available at: http://localhost:3000
echo 🔗 Backend API will be available at: http://localhost:5000
echo.
echo Happy coding! 💰
pause
