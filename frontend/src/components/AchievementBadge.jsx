import { motion } from 'framer-motion'
import { Award, Star, Trophy, Target, Zap, Crown } from 'lucide-react'

const AchievementBadge = ({ achievement, isUnlocked = false, showConfetti = false }) => {
  const getAchievementIcon = (type) => {
    const icons = {
      'first_expense': Target,
      'week_streak': Zap,
      'month_streak': Star,
      'budget_master': Trophy,
      'savings_goal': Award,
      'financial_guru': Crown
    }
    return icons[type] || Award
  }

  const getAchievementColor = (rarity) => {
    const colors = {
      'common': 'from-gray-400 to-gray-500',
      'rare': 'from-blue-400 to-blue-600',
      'epic': 'from-purple-400 to-purple-600',
      'legendary': 'from-yellow-400 to-orange-500'
    }
    return colors[rarity] || 'from-gray-400 to-gray-500'
  }

  const IconComponent = getAchievementIcon(achievement.type)

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
        isUnlocked 
          ? 'bg-white dark:bg-gray-800 border-transparent shadow-lg' 
          : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 opacity-60'
      }`}
    >
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              initial={{ 
                x: '50%', 
                y: '50%',
                scale: 0 
              }}
              animate={{
                x: `${50 + (Math.random() - 0.5) * 200}%`,
                y: `${50 + (Math.random() - 0.5) * 200}%`,
                scale: [0, 1, 0],
                rotate: 360
              }}
              transition={{
                duration: 1,
                delay: i * 0.1,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}

      {/* Badge Icon */}
      <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${getAchievementColor(achievement.rarity)} flex items-center justify-center mx-auto mb-3`}>
        <IconComponent className="w-8 h-8 text-white" />
      </div>

      {/* Badge Info */}
      <div className="text-center">
        <h3 className={`font-semibold mb-1 ${isUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
          {achievement.title}
        </h3>
        <p className={`text-sm ${isUnlocked ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400'}`}>
          {achievement.description}
        </p>
        
        {achievement.progress !== undefined && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r ${getAchievementColor(achievement.rarity)} transition-all duration-300`}
                style={{ width: `${Math.min(achievement.progress, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {achievement.current}/{achievement.target}
            </p>
          </div>
        )}

        {isUnlocked && achievement.unlockedAt && (
          <p className="text-xs text-green-600 dark:text-green-400 mt-2">
            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Rarity Indicator */}
      <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium capitalize ${
        achievement.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
        achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
        achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
      }`}>
        {achievement.rarity}
      </div>
    </motion.div>
  )
}

export default AchievementBadge
