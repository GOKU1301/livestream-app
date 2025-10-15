#!/bin/bash

echo "🎥 Livestream App Setup Script"
echo "=============================="

# Check if MongoDB is running
echo "📊 Checking MongoDB..."
if pgrep -x "mongod" > /dev/null; then
    echo "✅ MongoDB is running"
else
    echo "❌ MongoDB is not running. Please start MongoDB first:"
    echo "   brew services start mongodb/brew/mongodb-community"
    echo "   or"
    echo "   sudo systemctl start mongod"
    exit 1
fi

# Setup Backend
echo ""
echo "🐍 Setting up Backend (Flask)..."
cd backend

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "✅ Backend setup complete!"

# Setup Frontend
echo ""
echo "⚛️ Setting up Frontend (React)..."
cd ../frontend

if command -v npm &> /dev/null; then
    echo "Installing Node.js dependencies..."
    npm install
    echo "✅ Frontend setup complete!"
else
    echo "❌ npm not found. Please install Node.js first:"
    echo "   https://nodejs.org/"
    exit 1
fi

cd ..

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "To start the application:"
echo "1. Start Backend:  cd backend && python app.py"
echo "2. Start Frontend: cd frontend && npm start"
echo "3. Open browser:   http://localhost:3000"
echo ""
echo "📖 Documentation:"
echo "   - User Guide: docs/User_Guide.md"
echo "   - API Docs:   docs/API_Documentation.md"

# FFmpeg Setup Guide

## Overview
FFmpeg is required for converting RTSP streams to HLS format for browser playback.

## Installation

### Windows
1. Download FFmpeg from https://www.gyan.dev/ffmpeg/builds/
2. Extract the archive
3. Add FFmpeg to system PATH:
   - Right-click Computer > Properties > Advanced System Settings
   - Environment Variables > System Variables
   - Edit Path > Add path to ffmpeg/bin folder

### macOS
```bash
# Using Homebrew
brew install ffmpeg
