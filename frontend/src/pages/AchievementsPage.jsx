import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Trophy, Star, Award, Target, Zap, Crown, TrendingUp, ArrowLeft } from 'lucide-react'
import AchievementBadge from '../components/AchievementBadge'
import { useAuth } from '../contexts/AuthContext'

const AchievementsPage = () => {
  const { user } = useAuth()
  const [achievements, setAchievements] = useState([])
  const [userStats, setUserStats] = useState(null)
  const [loading, setLoading] = useState(true)

  // Mock achievements data (in real app, this would come from backend)
  const mockAchievements = [
    {
      id: 1,
      type: 'first_expense',
      title: 'First Steps',
      description: 'Add your first expense',
      rarity: 'common',
      target: 1,
      current: 1,
      progress: 100,
      unlockedAt: new Date().toISOString()
    },
    {
      id: 2,
      type: 'week_streak',
      title: 'Week Warrior',
      description: 'Track expenses for 7 consecutive days',
      rarity: 'rare',
      target: 7,
      current: 3,
      progress: 43
    },
    {
      id: 3,
      type: 'month_streak',
      title: 'Monthly Master',
      description: 'Track expenses for 30 consecutive days',
      rarity: 'epic',
      target: 30,
      current: 3,
      progress: 10
    },
    {
      id: 4,
      type: 'budget_master',
      title: 'Budget Boss',
      description: 'Stay under budget for 3 months',
      rarity: 'legendary',
      target: 3,
      current: 0,
      progress: 0
    },
    {
      id: 5,
      type: 'savings_goal',
      title: 'Savings Superstar',
      description: 'Save $1000 in total',
      rarity: 'epic',
      target: 1000,
      current: 250,
      progress: 25
    },
    {
      id: 6,
      type: 'financial_guru',
      title: 'Financial Guru',
      description: 'Complete all learning modules',
      rarity: 'legendary',
      target: 12,
      current: 2,
      progress: 17
    }
  ]

  useEffect(() => {
    fetchUserStats()
    // In real app, fetch actual achievements from backend
    setAchievements(mockAchievements)
    setLoading(false)
  }, [])

  const fetchUserStats = async () => {
    try {
      const token = await user?.getIdToken()
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setUserStats(data)
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
    }
  }

  const unlockedAchievements = achievements.filter(a => a.progress >= 100)
  const lockedAchievements = achievements.filter(a => a.progress < 100)

  const getTotalPoints = () => {
    return unlockedAchievements.reduce((total, achievement) => {
      const points = {
        'common': 10,
        'rare': 25,
        'epic': 50,
        'legendary': 100
      }
      return total + (points[achievement.rarity] || 0)
    }, 0)
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
              Achievements
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
            🏆 Your Achievements
          </h2>
          <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            Track your financial journey and unlock rewards as you build better money habits
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-12"
        >
          <div className="card text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Total Points</h3>
            <p className="text-xl sm:text-2xl font-bold text-yellow-600">{getTotalPoints()}</p>
          </div>
          
          <div className="card text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Unlocked</h3>
            <p className="text-xl sm:text-2xl font-bold text-green-600">{unlockedAchievements.length}</p>
          </div>
          
          <div className="card text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">In Progress</h3>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">{lockedAchievements.length}</p>
          </div>
          
          <div className="card text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Completion</h3>
            <p className="text-xl sm:text-2xl font-bold text-purple-600">
              {Math.round((unlockedAchievements.length / achievements.length) * 100)}%
            </p>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="card mb-8 sm:mb-12"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Overall Progress
            </h3>
            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              {unlockedAchievements.length} of {achievements.length} completed
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <div 
              className="h-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${(unlockedAchievements.length / achievements.length) * 100}%` }}
            />
          </div>
        </motion.div>

        {/* Unlocked Achievements */}
        {unlockedAchievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8 sm:mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Star className="w-6 h-6 text-yellow-500 mr-2" />
              Unlocked Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {unlockedAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <AchievementBadge 
                    achievement={achievement} 
                    isUnlocked={true}
                    showConfetti={index === 0} // Show confetti for most recent
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Locked Achievements */}
        {lockedAchievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Target className="w-6 h-6 text-blue-500 mr-2" />
              In Progress
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lockedAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <AchievementBadge 
                    achievement={achievement} 
                    isUnlocked={false}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Motivational Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 sm:mt-12 text-center"
        >
          <div className="card bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
            <Crown className="w-8 h-8 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
              Keep Going! 🚀
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 px-4">
              Every small step counts towards building better financial habits. 
              Complete more challenges to unlock exclusive rewards!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AchievementsPage
