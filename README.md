# 💰 FinMate - Your Gen-Z Finance Buddy

> **Track. Save. Grow. Your money, your way.**

FinMate is a Progressive Web App designed specifically for Gen-Z students and early earners to manage their finances with style. Built with modern web technologies and AI-powered insights.

## ✨ Features

- 📱 **Progressive Web App** - Install on any device
- 💸 **Expense Tracking** - Log expenses with categories and notes
- 📊 **Visual Analytics** - Beautiful charts showing spending patterns
- 🤖 **AI-Powered Tips** - Personalized saving advice
- 📚 **Micro-Lessons** - Learn investing basics
- 🔄 **Offline Support** - Works without internet
- 🎨 **Gen-Z Design** - Modern, playful UI with smooth animations

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- Git

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Environment Variables
Create `.env` files in both frontend and backend directories:

**Frontend (.env)**
```
VITE_API_URL=http://localhost:5000
```

**Backend (.env)**
```
OPENAI_API_KEY=your_openai_api_key_here
FLASK_ENV=development
```

## 🏗️ Project Structure

```
finmate/
├── frontend/                 # React + Vite + TailwindCSS
│   ├── public/
│   │   ├── manifest.json    # PWA manifest
│   │   ├── sw.js           # Service worker
│   │   └── icons/          # PWA icons
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Utility functions
│   │   └── styles/         # Global styles
│   └── package.json
├── backend/                 # Flask API
│   ├── app.py              # Main Flask app
│   ├── models.py           # Database models
│   ├── routes.py           # API routes
│   └── requirements.txt    # Python dependencies
└── README.md
```

## 🎨 Design Philosophy

- **Mobile-First**: Responsive design that works on all devices
- **Gen-Z Aesthetic**: Soft gradients, smooth animations, emojis
- **Accessibility**: ARIA labels, keyboard navigation
- **Performance**: Code splitting, lazy loading, service workers

## 🔧 Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS
- **Chart.js** - Data visualization
- **Framer Motion** - Animations
- **IndexedDB** - Offline storage

### Backend
- **Flask** - Python web framework
- **SQLite** - Database
- **OpenAI API** - AI-powered tips
- **CORS** - Cross-origin support

## 📱 PWA Features

- Installable on mobile and desktop
- Offline functionality with service workers
- Push notifications (future)
- Background sync

## 🚀 Deployment

### Frontend (Netlify/Vercel)
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### Backend (Render/Heroku)
```bash
cd backend
# Deploy with requirements.txt
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project for your own hackathons!

---

**Built with ❤️ for Gen-Z by Gen-Z**
