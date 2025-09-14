from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from models import Base, User, Expense, UserStats
import google.generativeai as genai
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, func
from sqlalchemy.orm import sessionmaker
import jwt
import firebase_admin
from firebase_admin import credentials, auth
import uuid

# Load environment variables
load_dotenv()

# Configure Flask to serve static files from frontend build
static_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'frontend', 'dist')
app = Flask(__name__, static_folder=static_folder, static_url_path='')

# Initialize rate limiter
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

# Configure CORS for flexible deployment
allowed_origins = os.getenv('ALLOWED_ORIGINS', 
    'http://localhost:3000,http://localhost:5173,https://finmate.vercel.app'
).split(',')

CORS(app, 
     origins=allowed_origins,
     supports_credentials=True,
     allow_headers=['Content-Type', 'Authorization'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
)

# Database configuration
DATABASE_URL = os.getenv('DATABASE_URL')

# Validate and fix DATABASE_URL
if not DATABASE_URL or DATABASE_URL == 'postgresql://username:password@hostname:port/database_name':
    # Use SQLite for development/testing
    DATABASE_URL = 'sqlite:///finmate.db'
    print("Warning: Using SQLite database. Set DATABASE_URL environment variable for production.")
else:
    # Handle PostgreSQL URL format for Render
    if DATABASE_URL.startswith('postgres://'):
        DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)
    
    # Validate URL format
    try:
        from urllib.parse import urlparse
        parsed = urlparse(DATABASE_URL)
        if not all([parsed.scheme, parsed.netloc]):
            raise ValueError("Invalid DATABASE_URL format")
    except Exception as e:
        print(f"Invalid DATABASE_URL: {e}. Falling back to SQLite.")
        DATABASE_URL = 'sqlite:///finmate.db'

try:
    engine = create_engine(DATABASE_URL)
    print(f"Database connection successful: {DATABASE_URL.split('@')[0] if '@' in DATABASE_URL else 'sqlite'}@***")
except Exception as e:
    print(f"Database connection failed: {e}")
    print("Falling back to SQLite database")
    DATABASE_URL = 'sqlite:///finmate.db'
    engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create db object for compatibility
from sqlalchemy.ext.declarative import declarative_base
db_base = declarative_base()

class DatabaseManager:
    def __init__(self, engine):
        self.engine = engine
    
    def create_all(self):
        Base.metadata.create_all(bind=self.engine)

db = DatabaseManager(engine)

# Create tables
try:
    db.create_all()
    print("Database tables created successfully")
except Exception as e:
    print(f"Warning: Could not create database tables: {e}")

# Configure Gemini AI
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    print("Warning: GEMINI_API_KEY not found in environment variables")
    genai.configure(api_key="dummy-key-for-development")
else:
    genai.configure(api_key=GEMINI_API_KEY)

# Initialize Gemini model
try:
    model = genai.GenerativeModel('gemini-pro')
except Exception as e:
    print(f"Warning: Could not initialize Gemini model: {e}")
    model = None

# Firebase Admin SDK (optional - for enhanced security)
FIREBASE_CREDENTIALS = os.getenv('FIREBASE_CREDENTIALS')
if FIREBASE_CREDENTIALS:
    try:
        cred = credentials.Certificate(FIREBASE_CREDENTIALS)
        firebase_admin.initialize_app(cred)
    except Exception as e:
        print(f"Warning: Could not initialize Firebase Admin: {e}")

# JWT Secret - Generate secure random key if not provided
JWT_SECRET = os.getenv('JWT_SECRET')
if not JWT_SECRET:
    import secrets
    JWT_SECRET = secrets.token_urlsafe(32)
    print("Warning: Using generated JWT secret. Set JWT_SECRET environment variable for production.")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def verify_token(token):
    """Verify Firebase token and return user info"""
    try:
        if FIREBASE_CREDENTIALS:
            decoded_token = auth.verify_id_token(token)
            return decoded_token
        else:
            # Fallback for development
            return {'uid': 'dev-user', 'email': 'dev@example.com'}
    except Exception as e:
        print(f"Token verification error: {e}")
        return None

def get_or_create_user(db, firebase_uid, email, display_name=None):
    """Get existing user or create new one"""
    user = db.query(User).filter(User.firebase_uid == firebase_uid).first()
    if not user:
        user = User(
            firebase_uid=firebase_uid,
            email=email,
            display_name=display_name
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

@app.after_request
def after_request(response):
    """Add security headers to all responses"""
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    return response

@app.route('/')
def serve_frontend():
    """Serve the React frontend"""
    try:
        return send_file(os.path.join(app.static_folder, 'index.html'))
    except Exception as e:
        # Fallback to API response if frontend files not found
        return jsonify({
            "message": "FinMate Premium API is running!",
            "version": "2.0.0",
            "status": "healthy",
            "features": ["authentication", "ai_tips", "user_stats", "premium_ui"],
            "note": "Frontend files not found. This is the API endpoint."
        })

# Serve static files (CSS, JS, images)
@app.route('/<path:path>')
def serve_static(path):
    """Serve static files from React build"""
    try:
        return send_from_directory(app.static_folder, path)
    except Exception:
        # For client-side routing, serve index.html for unknown routes
        return send_file(os.path.join(app.static_folder, 'index.html'))

# API health check endpoint
@app.route('/api/status')
def api_status():
    return jsonify({
        "message": "FinMate Premium API is running!",
        "version": "2.0.0",
        "status": "healthy",
        "features": ["authentication", "ai_tips", "user_stats", "premium_ui"]
    })

@app.route('/api/health')
def health_check():
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "database": "connected",
        "ai_model": "available" if model else "unavailable"
    })

@app.route('/api/auth/verify', methods=['POST'])
@limiter.limit("10 per minute")
def verify_auth():
    """Verify Firebase token and return user info"""
    db = SessionLocal()
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON data"}), 400
            
        token = data.get('token')
        if not token:
            return jsonify({"error": "Token required"}), 400
        
        user_info = verify_token(token)
        if not user_info:
            return jsonify({"error": "Invalid token"}), 401
        
        user = get_or_create_user(
            db, 
            user_info['uid'], 
            user_info['email'],
            user_info.get('name')
        )
        
        return jsonify({
            "user": user.to_dict(),
            "message": "Authentication successful"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

@app.route('/api/expenses', methods=['GET'])
def get_expenses():
    """Get expenses for authenticated user"""
    db = SessionLocal()
    try:
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({"error": "Authorization header required"}), 401
            
        user_info = verify_token(token)
        if not user_info:
            return jsonify({"error": "Authentication required"}), 401
        
        user = get_or_create_user(db, user_info['uid'], user_info['email'])
        
        expenses = db.query(Expense).filter(Expense.user_id == user.id).order_by(Expense.date.desc()).all()
        return jsonify([expense.to_dict() for expense in expenses])
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

@app.route('/api/expenses', methods=['POST'])
@limiter.limit("30 per minute")
def add_expense():
    """Add expense for authenticated user"""
    db = SessionLocal()
    try:
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({"error": "Authorization header required"}), 401
            
        user_info = verify_token(token)
        if not user_info:
            return jsonify({"error": "Authentication required"}), 401
        
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON data"}), 400
        
        # Validate required fields
        amount = data.get('amount')
        category = data.get('category')
        
        if not amount or not category:
            return jsonify({"error": "Amount and category are required"}), 400
            
        # Validate amount is a positive number
        try:
            amount_float = float(amount)
            if amount_float <= 0:
                return jsonify({"error": "Amount must be a positive number"}), 400
        except (ValueError, TypeError):
            return jsonify({"error": "Amount must be a valid number"}), 400
        
        # Validate category length
        if len(str(category).strip()) == 0 or len(str(category)) > 100:
            return jsonify({"error": "Category must be between 1 and 100 characters"}), 400
        
        user = get_or_create_user(db, user_info['uid'], user_info['email'])
        
        # Create new expense
        expense = Expense.from_dict(data, user.id)
        db.add(expense)
        db.commit()
        db.refresh(expense)
        
        # Update user stats
        update_user_stats(db, user.id)
        
        return jsonify(expense.to_dict()), 201
        
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

@app.route('/api/expenses/<int:expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    """Delete expense for authenticated user"""
    db = SessionLocal()
    try:
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({"error": "Authorization header required"}), 401
            
        user_info = verify_token(token)
        if not user_info:
            return jsonify({"error": "Authentication required"}), 401
        
        user = get_or_create_user(db, user_info['uid'], user_info['email'])
        
        expense = db.query(Expense).filter(
            Expense.id == expense_id,
            Expense.user_id == user.id
        ).first()
        
        if not expense:
            return jsonify({"error": "Expense not found"}), 404
        
        db.delete(expense)
        db.commit()
        
        # Update user stats
        update_user_stats(db, user.id)
        
        return jsonify({"message": "Expense deleted successfully"})
        
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

def update_user_stats(db, user_id):
    """Update user statistics"""
    try:
        # Calculate stats
        total_expenses = db.query(func.count(Expense.id)).filter(Expense.user_id == user_id).scalar()
        total_amount = db.query(func.sum(Expense.amount)).filter(Expense.user_id == user_id).scalar() or 0.0
        
        # Get or create stats
        stats = db.query(UserStats).filter(UserStats.user_id == user_id).first()
        if not stats:
            stats = UserStats(user_id=user_id)
            db.add(stats)
        
        stats.total_expenses = total_expenses
        stats.total_amount = total_amount
        stats.last_activity = datetime.utcnow()
        
        db.commit()
        
    except Exception as e:
        print(f"Error updating user stats: {e}")

@app.route('/api/stats', methods=['GET'])
def get_user_stats():
    """Get user statistics"""
    db = SessionLocal()
    try:
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({"error": "Authorization header required"}), 401
            
        user_info = verify_token(token)
        if not user_info:
            return jsonify({"error": "Authentication required"}), 401
        
        user = get_or_create_user(db, user_info['uid'], user_info['email'])
        
        # Get expenses
        expenses = db.query(Expense).filter(Expense.user_id == user.id).all()
        
        if not expenses:
            return jsonify({
                "total_expenses": 0,
                "total_amount": 0,
                "categories": {},
                "recent_expenses": [],
                "streak_days": 0,
                "daily_average": 0
            })
        
        # Calculate statistics
        total_amount = sum(exp.amount for exp in expenses)
        categories = {}
        
        for exp in expenses:
            cat = exp.category
            categories[cat] = categories.get(cat, 0) + exp.amount
        
        recent_expenses = [exp.to_dict() for exp in expenses[:10]]
        
        # Calculate daily average (last 30 days)
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        recent_expenses_30 = [exp for exp in expenses if exp.date >= thirty_days_ago]
        daily_average = sum(exp.amount for exp in recent_expenses_30) / 30 if recent_expenses_30 else 0
        
        # Get user stats
        stats = db.query(UserStats).filter(UserStats.user_id == user.id).first()
        streak_days = stats.streak_days if stats else 0
        
        return jsonify({
            "total_expenses": len(expenses),
            "total_amount": total_amount,
            "categories": categories,
            "recent_expenses": recent_expenses,
            "streak_days": streak_days,
            "daily_average": daily_average
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

@app.route('/api/tips', methods=['POST'])
@limiter.limit("5 per minute")
def get_ai_tips():
    """Get AI-powered financial tips for authenticated user"""
    try:
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({"error": "Authorization header required"}), 401
            
        user_info = verify_token(token)
        if not user_info:
            return jsonify({"error": "Authentication required"}), 401
        
        data = request.get_json()
        expenses = data.get('expenses', [])
        
        if not expenses:
            return jsonify({
                "tip": "Start tracking your expenses to get personalized financial advice! 💰",
                "category": "general"
            })
        
        # Check if Gemini AI is available
        if not model or not GEMINI_API_KEY:
            # Return fallback tips when AI is not available
            fallback_tips = [
                "Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings! 💰",
                "Set up automatic transfers to your savings account on payday! 🎯",
                "Track every coffee and snack - small expenses add up quickly! ☕",
                "Use cash for discretionary spending to feel the money leaving your hand! 💳",
                "Review your subscriptions monthly - cancel what you don't use! 📱"
            ]
            
            import random
            return jsonify({
                "tip": random.choice(fallback_tips),
                "category": "general"
            })
        
        # Calculate spending statistics
        total_spent = sum(exp['amount'] for exp in expenses)
        categories = {}
        for exp in expenses:
            cat = exp['category']
            categories[cat] = categories.get(cat, 0) + exp['amount']
        
        # Find top spending category
        top_category = max(categories.items(), key=lambda x: x[1]) if categories else None
        
        # Create enhanced prompt for Gemini
        prompt = f"""
        You are a premium financial advisor for Gen-Z students and early earners. 
        Based on the following spending data, provide ONE specific, actionable tip that's:
        - Practical and easy to implement immediately
        - Relevant to their specific spending patterns
        - Encouraging and positive in tone
        - Include an emoji for Gen-Z appeal
        - Focus on building wealth and financial independence
        
        User Profile:
        - Email: {user_info.get('email', 'User')}
        - Spending Data: ${total_spent:.2f} total
        - Top Category: {top_category[0] if top_category else 'N/A'} (${top_category[1]:.2f} if top_category else 0)
        - Transaction Count: {len(expenses)}
        
        Recent expenses: {expenses[:5]}
        
        Provide your response in this exact format:
        Tip: [Your specific, actionable tip here] 💡
        Category: [spending/saving/investing/general]
        """
        
        # Generate AI response
        response = model.generate_content(prompt)
        ai_response = response.text.strip()
        
        # Parse the response
        if "Tip:" in ai_response and "Category:" in ai_response:
            tip_part = ai_response.split("Category:")[0].replace("Tip:", "").strip()
            category_part = ai_response.split("Category:")[1].strip()
            
            return jsonify({
                "tip": tip_part,
                "category": category_part
            })
        else:
            # Fallback if parsing fails
            return jsonify({
                "tip": ai_response,
                "category": "general"
            })
            
    except Exception as e:
        print(f"AI Tips Error: {str(e)}")
        # Return fallback tips
        fallback_tips = [
            "Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings! 💰",
            "Set up automatic transfers to your savings account on payday! 🎯",
            "Track every coffee and snack - small expenses add up quickly! ☕",
            "Use cash for discretionary spending to feel the money leaving your hand! 💳",
            "Review your subscriptions monthly - cancel what you don't use! 📱"
        ]
        
        import random
        return jsonify({
            "tip": random.choice(fallback_tips),
            "category": "general"
        })

@app.route('/api/learning/path', methods=['GET'])
def get_learning_path():
    """Get personalized learning path based on user's financial profile"""
    db = SessionLocal()
    try:
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({"error": "Authorization header required"}), 401
            
        user_info = verify_token(token)
        if not user_info:
            return jsonify({"error": "Authentication required"}), 401
        
        user = get_or_create_user(db, user_info['uid'], user_info['email'])
        
        # Get user's financial profile
        expenses = db.query(Expense).filter(Expense.user_id == user.id).all()
        total_amount = sum(exp.amount for exp in expenses)
        
        # Determine user level based on spending patterns
        if total_amount < 1000:
            level = "beginner"
        elif total_amount < 5000:
            level = "intermediate"
        else:
            level = "advanced"
        
        # Generate learning path
        learning_paths = {
            "beginner": [
                {
                    "title": "Budgeting Basics",
                    "description": "Learn the fundamentals of creating and sticking to a budget",
                    "duration": "15 min",
                    "icon": "📊"
                },
                {
                    "title": "Emergency Fund",
                    "description": "Why you need an emergency fund and how to build one",
                    "duration": "10 min",
                    "icon": "🛡️"
                },
                {
                    "title": "Smart Spending",
                    "description": "Tips for making better spending decisions",
                    "duration": "12 min",
                    "icon": "💡"
                }
            ],
            "intermediate": [
                {
                    "title": "Investment Fundamentals",
                    "description": "Introduction to investing and compound interest",
                    "duration": "20 min",
                    "icon": "📈"
                },
                {
                    "title": "Debt Management",
                    "description": "Strategies for managing and eliminating debt",
                    "duration": "18 min",
                    "icon": "💳"
                },
                {
                    "title": "Tax Optimization",
                    "description": "Understanding taxes and finding deductions",
                    "duration": "25 min",
                    "icon": "📋"
                }
            ],
            "advanced": [
                {
                    "title": "Portfolio Diversification",
                    "description": "Advanced investment strategies and risk management",
                    "duration": "30 min",
                    "icon": "🎯"
                },
                {
                    "title": "Passive Income",
                    "description": "Building multiple income streams",
                    "duration": "35 min",
                    "icon": "💰"
                },
                {
                    "title": "Estate Planning",
                    "description": "Planning for the future and wealth transfer",
                    "duration": "40 min",
                    "icon": "🏛️"
                }
            ]
        }
        
        return jsonify({
            "level": level,
            "modules": learning_paths[level],
            "total_spent": total_amount,
            "expense_count": len(expenses)
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
