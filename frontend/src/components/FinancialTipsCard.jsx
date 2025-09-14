import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Lightbulb, RefreshCw, Sparkles, TrendingUp, PiggyBank, Calculator } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const FinancialTipsCard = () => {
  const { user } = useAuth()
  const [tips, setTips] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentTipIndex, setCurrentTipIndex] = useState(0)

  useEffect(() => {
    fetchTips()
  }, [])

  const fetchTips = async () => {
    setLoading(true)
    try {
      const token = await user?.getIdToken()
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tips`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          context: "daily_tips",
          user_level: "beginner"
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setTips(data.tips || [data])
      } else {
        // Fallback tips for Gen-Z
        setTips([
          {
            tip: "Start with the 50/30/20 rule: 50% needs, 30% wants, 20% savings. It's like budgeting but make it simple! 💡",
            category: "budgeting",
            priority: "high"
          },
          {
            tip: "Use apps to automate your savings - even $5/week adds up to $260/year. That's like 52 bubble teas! 🧋",
            category: "saving",
            priority: "medium"
          },
          {
            tip: "Before buying anything over $50, wait 24 hours. If you still want it, go for it. This stops impulse purchases! ⏰",
            category: "spending",
            priority: "high"
          }
        ])
      }
    } catch (error) {
      console.error('Error fetching tips:', error)
      // Fallback tips
      setTips([
        {
          tip: "Track your daily coffee spending - it might surprise you! Small expenses add up quickly. ☕",
          category: "awareness",
          priority: "medium"
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const nextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % tips.length)
  }

  const getCategoryIcon = (category) => {
    const icons = {
      'budgeting': Calculator,
      'saving': PiggyBank,
      'investing': TrendingUp,
      'spending': Lightbulb,
      'general': Sparkles
    }
    return icons[category] || Lightbulb
  }

  const getCategoryColor = (category) => {
    const colors = {
      'budgeting': 'from-blue-500 to-indigo-600',
      'saving': 'from-green-500 to-emerald-600',
      'investing': 'from-purple-500 to-violet-600',
      'spending': 'from-orange-500 to-red-600',
      'general': 'from-pink-500 to-rose-600'
    }
    return colors[category] || 'from-primary-500 to-secondary-600'
  }

  if (tips.length === 0 && !loading) {
    return null
  }

  const currentTip = tips[currentTipIndex] || tips[0]
  const IconComponent = getCategoryIcon(currentTip?.category)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-2 border-primary-200 dark:border-primary-700"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${getCategoryColor(currentTip?.category)} flex items-center justify-center`}>
            <IconComponent className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              💡 Daily Financial Tip
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 capitalize">
              {currentTip?.category || 'General'} • Gen-Z Friendly
            </p>
          </div>
        </div>
        
        <button
          onClick={tips.length > 1 ? nextTip : fetchTips}
          disabled={loading}
          className="p-2 rounded-lg bg-white dark:bg-gray-700 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 text-gray-600 dark:text-gray-300 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <motion.div
          key={currentTipIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-gray-700 dark:text-gray-200 leading-relaxed mb-4">
            {currentTip?.tip}
          </p>
          
          {currentTip?.priority && (
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                currentTip.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                currentTip.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              }`}>
                {currentTip.priority} priority
              </span>
              
              {tips.length > 1 && (
                <div className="flex space-x-1">
                  {tips.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentTipIndex 
                          ? 'bg-primary-600' 
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}

export default FinancialTipsCard
