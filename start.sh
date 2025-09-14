#!/bin/bash
# Start script for Render deployment

echo "Starting FinMate backend server..."
cd backend

# Set default port if not provided
export PORT=${PORT:-10000}

# Check if DATABASE_URL is set properly
if [ -z "$DATABASE_URL" ] || [ "$DATABASE_URL" = "postgresql://username:password@hostname:port/database_name" ]; then
    echo "Warning: DATABASE_URL not properly configured. Using SQLite fallback."
    export DATABASE_URL="sqlite:///finmate.db"
fi

# Initialize database tables
echo "Initializing database..."
python -c "
try:
    from app import app, db
    with app.app_context():
        db.create_all()
        print('Database tables created successfully!')
except Exception as e:
    print(f'Database initialization error: {e}')
    print('Continuing with startup...')
"

# Start the Flask application with gunicorn
echo "Starting gunicorn server..."
exec gunicorn --bind 0.0.0.0:$PORT --workers 1 --timeout 120 --log-level info app:app
