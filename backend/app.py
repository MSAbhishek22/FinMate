from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Expense
import google.generativeai as genai
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure CORS for Vercel deployment
CORS(app, origins=[
    "http://localhost:3000",
    "http://localhost:5173", 
    "https://finmate.vercel.app",
    "https://finmate-git-main.vercel.app",
    "https://finmate-*.vercel.app"
])

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///finmate.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')

# Initialize database
db.init_app(app)

# Configure Gemini AI
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'AIzaSyAGO7dkP7A3fTJDFq7fobXvXQJBnnKouIQ')
genai.configure(api_key=GEMINI_API_KEY)

# Initialize Gemini model
model = genai.GenerativeModel('gemini-pro')

def create_tables():
    with app.app_context():
        db.create_all()

# Create tables on startup
create_tables()

@app.route('/')
def home():
    return jsonify({
        "message": "FinMate API is running!",
        "version": "1.0.0",
        "status": "healthy"
    })

@app.route('/api/health')
def health_check():
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "database": "connected"
    })

@app.route('/api/expenses', methods=['GET'])
def get_expenses():
    try:
        expenses = Expense.query.order_by(Expense.date.desc()).all()
        return jsonify([expense.to_dict() for expense in expenses])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/expenses', methods=['POST'])
def add_expense():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('amount') or not data.get('category'):
            return jsonify({"error": "Amount and category are required"}), 400
        
        # Create new expense
        expense = Expense(
            amount=float(data['amount']),
            category=data['category'],
            note=data.get('note', ''),
            date=datetime.fromisoformat(data.get('date', datetime.now().isoformat()))
        )
        
        db.session.add(expense)
        db.session.commit()
        
        return jsonify(expense.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/api/expenses/<int:expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    try:
        expense = Expense.query.get_or_404(expense_id)
        db.session.delete(expense)
        db.session.commit()
        return jsonify({"message": "Expense deleted successfully"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/api/expenses/sync', methods=['POST'])
def sync_expenses():
    try:
        data = request.get_json()
        expenses_data = data.get('expenses', [])
        
        # Clear existing expenses (optional - you might want to merge instead)
        Expense.query.delete()
        
        # Add new expenses
        for exp_data in expenses_data:
            expense = Expense(
                amount=float(exp_data['amount']),
                category=exp_data['category'],
                note=exp_data.get('note', ''),
                date=datetime.fromisoformat(exp_data.get('date', datetime.now().isoformat()))
            )
            db.session.add(expense)
        
        db.session.commit()
        return jsonify({"message": f"Synced {len(expenses_data)} expenses"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/api/tips', methods=['POST'])
def get_ai_tips():
    try:
        data = request.get_json()
        expenses = data.get('expenses', [])
        
        if not expenses:
            return jsonify({
                "tip": "Start tracking your expenses to get personalized financial advice! 💰",
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
        
        # Create prompt for Gemini
        prompt = f"""
        You are a friendly financial advisor for Gen-Z students and early earners. 
        Based on the following spending data, provide ONE specific, actionable tip that's:
        - Practical and easy to implement
        - Relevant to their spending patterns
        - Encouraging and positive in tone
        - Include an emoji for Gen-Z appeal
        
        Spending Data:
        - Total spent: ${total_spent:.2f}
        - Top spending category: {top_category[0] if top_category else 'N/A'} (${top_category[1]:.2f} if top_category else 0)
        - Number of transactions: {len(expenses)}
        
        Recent expenses: {expenses[:5]}
        
        Provide your response in this exact format:
        Tip: [Your specific tip here] 💡
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

@app.route('/api/stats', methods=['GET'])
def get_stats():
    try:
        expenses = Expense.query.all()
        
        if not expenses:
            return jsonify({
                "total_expenses": 0,
                "total_amount": 0,
                "categories": {},
                "recent_expenses": []
            })
        
        total_amount = sum(exp.amount for exp in expenses)
        categories = {}
        
        for exp in expenses:
            cat = exp.category
            categories[cat] = categories.get(cat, 0) + exp.amount
        
        recent_expenses = [exp.to_dict() for exp in expenses[:10]]
        
        return jsonify({
            "total_expenses": len(expenses),
            "total_amount": total_amount,
            "categories": categories,
            "recent_expenses": recent_expenses
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
