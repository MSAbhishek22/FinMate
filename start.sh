#!/bin/bash
# Start script for Render deployment

echo "Starting FinMate backend server..."
cd backend

# Set default port if not provided
export PORT=${PORT:-10000}

# Initialize database tables
echo "Initializing database..."
python -c "
from app import app, db
with app.app_context():
    db.create_all()
    print('Database tables created successfully!')
"

# Start the Flask application with gunicorn
echo "Starting gunicorn server..."
exec gunicorn --bind 0.0.0.0:$PORT --workers 1 --timeout 120 --preload app:app
