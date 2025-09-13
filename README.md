# FinMate  🚀

**Your AI-Powered Financial Companion for Gen-Z**

A premium Progressive Web App (PWA) that helps students and early earners track expenses, get personalized AI financial advice, and build wealth through smart money management.

![FinMate Premium](https://img.shields.io/badge/FinMate-Premium%20Edition-1A3C40?style=for-the-badge&logo=react&logoColor=FFD700)

## ✨ **Premium Features**(Coming soon)

### 🔐 **Authentication & Personalization**
- **Firebase Authentication** - Secure Google & email/password login
- **Personalized Dashboard** - Custom greetings and user-specific insights
- **Data Sync** - Seamless offline/online data synchronization
- **User Profiles** - Individual expense tracking and statistics

### 🎨 **Premium UI/UX**
- **Dark Mode Toggle** - Beautiful light/dark theme switching
- **Premium Color Palette** - Deep teal (#1A3C40) with gold accents (#FFD700)
- **Micro-interactions** - Smooth animations and hover effects
- **Responsive Design** - Perfect on mobile, tablet, and desktop
- **Glass Morphism** - Modern backdrop blur effects

### 📊 **Enhanced Dashboard**
- **Summary Cards** - Net savings, daily/weekly averages, top categories
- **Premium Charts** - Beautiful visualizations with rounded edges
- **Quick Actions** - Voice input and frequent category buttons
- **Real-time Stats** - Live updates and progress tracking

### 🤖 **AI-Powered Learning**
- **Daily Financial Tips** - Personalized advice from Gemini AI
- **Learning Paths** - Beginner, intermediate, and advanced modules
- **Financial Quizzes** - Gamified learning experience
- **Smart Recommendations** - AI-driven spending insights

### 🏆 **Gamification**
- **Achievement Badges** - Streak tracking and milestone celebrations
- **Progress Tracking** - Visual progress indicators
- **Confetti Animations** - Celebration effects for achievements
- **Goal Setting** - Personalized financial goals

## 🛠 **Tech Stack**

### **Frontend**
- **React 18** - Modern React with hooks
- **Vite** - Lightning-fast build tool
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Firebase** - Authentication and real-time database
- **Chart.js** - Beautiful data visualizations
- **React Hot Toast** - Elegant notifications

### **Backend**
- **Flask** - Python web framework
- **SQLAlchemy** - Database ORM
- **Google Gemini AI** - Advanced AI financial advisor
- **Firebase Admin SDK** - Secure authentication
- **SQLite** - Lightweight database

### **PWA Features**
- **Service Worker** - Offline functionality
- **IndexedDB** - Local data storage
- **Manifest** - App installation
- **Push Notifications** - Daily reminders

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ and npm
- Python 3.8+
- Firebase project
- Google Gemini AI API key

### **1. Clone & Setup**
```bash
git clone https://github.com/MSAbhishek22/FinMate.git
cd FinMate
```

### **2. Frontend Setup**
```bash
cd frontend
npm install
cp env.example .env
# Edit .env with your Firebase and API keys
npm run dev
```

### **3. Backend Setup**
```bash
cd backend
pip install -r requirements.txt
cp env.example .env
# Edit .env with your API keys
python app.py
```

### **4. Environment Variables**

#### **Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

#### **Backend (.env)**
```env
GEMINI_API_KEY=your_gemini_api_key
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///finmate.db
FIREBASE_CREDENTIALS=path/to/firebase-credentials.json
```

## 🎯 **Key Features**

### **📱 Progressive Web App**
- Install on mobile devices
- Works offline
- Fast loading with CDN
- Automatic updates

### **🔐 Secure Authentication**
- Firebase Authentication
- Google OAuth integration
- Email/password login
- Secure token management

### **🤖 AI Financial Advisor**
- Personalized spending insights
- Daily financial tips
- Smart recommendations
- Learning path generation

### **📊 Advanced Analytics**
- Real-time expense tracking
- Category breakdown
- Spending trends
- Goal progress tracking

### **🎨 Premium Design**
- Dark/Light mode
- Smooth animations
- Glass morphism effects
- Responsive layout

## 📁 **Project Structure**

```
FinMate/
├── frontend/                 # React PWA
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Page components
│   │   └── config/         # Configuration files
│   ├── public/             # Static assets
│   └── package.json
├── backend/                 # Flask API
│   ├── models.py           # Database models
│   ├── app.py              # Main Flask app
│   └── requirements.txt
├── README.md
└── VERCEL_DEPLOYMENT.md
```

## 🚀 **Deployment**

### **Vercel Deployment**
1. **Deploy Backend** - Follow `VERCEL_DEPLOYMENT.md`
2. **Deploy Frontend** - Configure environment variables
3. **Set up Firebase** - Configure authentication
4. **Test Features** - Verify all functionality

### **Environment Setup**
- Set Firebase configuration
- Configure Gemini AI API
- Set up CORS origins
- Configure database

## 🎨 **Design System**

### **Color Palette**
- **Primary**: Deep Teal (#1A3C40)
- **Accent**: Gold (#FFD700)
- **Background**: Light Gray (#F1F5F9)
- **Surface**: White/Dark Gray

### **Typography**
- **Primary**: DM Sans
- **Display**: Space Grotesk
- **Mono**: JetBrains Mono

### **Components**
- **Cards**: Glass morphism with backdrop blur
- **Buttons**: Gradient backgrounds with hover effects
- **Inputs**: Rounded corners with focus states
- **Animations**: Smooth transitions and micro-interactions

## 🔧 **Development**

### **Available Scripts**
```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Backend
python app.py        # Start Flask server
```

### **Code Quality**
- ESLint configuration
- Prettier formatting
- TypeScript support (optional)
- Component documentation

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Google Gemini AI** for intelligent financial advice
- **Firebase** for authentication and real-time features
- **Vercel** for seamless deployment
- **TailwindCSS** for beautiful styling
- **Framer Motion** for smooth animations

---

**Built with ❤️ for the next generation of financial leaders**

*FinMate  - Where smart money meets beautiful design*
