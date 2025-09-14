#!/bin/bash
# Start script for Render deployment

echo "Starting FinMate backend server..."
cd backend

# Set default port if not provided
export PORT=${PORT:-5000}

# Start the Flask application with gunicorn
exec gunicorn --bind 0.0.0.0:$PORT --workers 1 --timeout 120 app:app
