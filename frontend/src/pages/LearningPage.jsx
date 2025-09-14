import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  BookOpen, 
  Target, 
  Award, 
  TrendingUp, 
  DollarSign, 
  PiggyBank,
  Calculator,
  Lightbulb,
  CheckCircle,
  Lock,
  ArrowLeft
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import GenZMoneyTips from '../components/GenZMoneyTips'

const LearningPage = () => {
  const { user } = useAuth()
  const [learningPath, setLearningPath] = useState(null)
  const [loading, setLoading] = useState(true)
  const [completedModules, setCompletedModules] = useState([])

  useEffect(() => {
    fetchLearningPath()
  }, [])

  const fetchLearningPath = async () => {
    try {
      const token = await user?.getIdToken()
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/learning/path`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setLearningPath(data)
      } else {
        // Fallback data when API is not available
        setLearningPath({
          level: 'beginner',
          total_spent: 250,
          expense_count: 15,
          modules: [
            {
              title: "Budgeting Basics",
              description: "Learn the fundamentals of creating and sticking to a budget",
              duration: "15 min",
              difficulty: "Easy",
              type: "budgeting"
            },
            {
              title: "Smart Saving Strategies",
              description: "Discover effective ways to save money without sacrificing your lifestyle",
              duration: "20 min",
              difficulty: "Easy",
              type: "saving"
            },
            {
              title: "Understanding Credit",
              description: "Master credit cards, credit scores, and building good credit",
              duration: "25 min",
              difficulty: "Medium",
              type: "credit"
            },
            {
              title: "Investment Basics",
              description: "Start your investment journey with simple, low-risk options",
              duration: "30 min",
              difficulty: "Medium",
              type: "investing"
            },
            {
              title: "Emergency Fund Planning",
              description: "Build a safety net for unexpected expenses",
              duration: "18 min",
              difficulty: "Easy",
              type: "planning"
            },
            {
              title: "Side Hustle Success",
              description: "Turn your skills into extra income streams",
              duration: "22 min",
              difficulty: "Medium",
              type: "income"
            }
          ]
        })
      }
    } catch (error) {
      console.error('Error fetching learning path:', error)
      // Fallback data when API fails
      setLearningPath({
        level: 'beginner',
        total_spent: 250,
        expense_count: 15,
        modules: [
          {
            title: "Budgeting Basics",
            description: "Learn the fundamentals of creating and sticking to a budget",
            duration: "15 min",
            difficulty: "Easy",
            type: "budgeting"
          },
          {
            title: "Smart Saving Strategies",
            description: "Discover effective ways to save money without sacrificing your lifestyle",
            duration: "20 min",
            difficulty: "Easy",
            type: "saving"
          },
          {
            title: "Understanding Credit",
            description: "Master credit cards, credit scores, and building good credit",
            duration: "25 min",
            difficulty: "Medium",
            type: "credit"
          },
          {
            title: "Investment Basics",
            description: "Start your investment journey with simple, low-risk options",
            duration: "30 min",
            difficulty: "Medium",
            type: "investing"
          },
          {
            title: "Emergency Fund Planning",
            description: "Build a safety net for unexpected expenses",
            duration: "18 min",
            difficulty: "Easy",
            type: "planning"
          },
          {
            title: "Side Hustle Success",
            description: "Turn your skills into extra income streams",
            duration: "22 min",
            difficulty: "Medium",
            type: "income"
          }
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  const completeModule = (moduleId) => {
    setCompletedModules(prev => [...prev, moduleId])
  }

  const getModuleIcon = (type) => {
    const icons = {
      'budgeting': Calculator,
      'saving': PiggyBank,
      'investing': TrendingUp,
      'credit': DollarSign,
      'planning': Target,
      'advanced': Award
    }
    return icons[type] || BookOpen
  }

  const getLevelColor = (level) => {
    const colors = {
      'beginner': 'from-green-500 to-emerald-600',
      'intermediate': 'from-blue-500 to-indigo-600',
      'advanced': 'from-purple-500 to-violet-600'
    }
    return colors[level] || 'from-gray-500 to-gray-600'
  }

  const getLevelEmoji = (level) => {
    const emojis = {
      'beginner': '🌱',
      'intermediate': '🚀',
      'advanced': '💎'
    }
    return emojis[level] || '📚'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header with Back Button */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link 
              to="/dashboard" 
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mr-4"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </Link>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              Financial Learning Hub
            </h1>
          </div>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Main Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gradient mb-4">
            📚 Learn & Grow
          </h2>
          <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Master money management with personalized lessons designed for Gen-Z
          </p>
        </motion.div>

        {learningPath && (
          <>
            {/* Level Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="flex flex-col sm:flex-row items-center sm:justify-between mb-6 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${getLevelColor(learningPath.level)} flex items-center justify-center`}>
                    <span className="text-2xl">{getLevelEmoji(learningPath.level)}</span>
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white capitalize">
                      {learningPath.level} Level
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                      Total Spent: ${learningPath.total_spent} • {learningPath.expense_count} expenses
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Progress Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12"
            >
              <div className="card text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Completed</h3>
                <p className="text-2xl font-bold text-green-600">{completedModules.length}</p>
              </div>
              
              <div className="card text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Total Modules</h3>
                <p className="text-2xl font-bold text-blue-600">{learningPath.modules?.length || 0}</p>
              </div>
              
              <div className="card text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Progress</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round((completedModules.length / (learningPath.modules?.length || 1)) * 100)}%
                </p>
              </div>
            </motion.div>

            {/* Learning Modules */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {learningPath.modules?.map((module, index) => {
                const IconComponent = getModuleIcon(module.type)
                const isCompleted = completedModules.includes(index)
                const isLocked = index > 0 && !completedModules.includes(index - 1)

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`card group cursor-pointer transition-all duration-300 ${
                      isCompleted ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20' :
                      isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'
                    }`}
                    onClick={() => !isLocked && !isCompleted && completeModule(index)}
                  >
                    <div className="flex items-center space-x-2 sm:space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isCompleted ? 'bg-green-500' :
                        isLocked ? 'bg-gray-400' : 'bg-gradient-to-r from-primary-500 to-secondary-500'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : isLocked ? (
                          <Lock className="w-6 h-6 text-white" />
                        ) : (
                          <IconComponent className="w-6 h-6 text-white" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                            {module.title}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {module.duration}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed">
                          {module.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${
                            module.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                            module.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          }`}>
                            {module.difficulty}
                          </span>
                          
                          {!isLocked && !isCompleted && (
                            <button className="text-primary-600 hover:text-primary-700 text-xs sm:text-sm font-medium">
                              Start Learning →
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Gen-Z Money Tips Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12"
            >
              <GenZMoneyTips />
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}

export default LearningPage
