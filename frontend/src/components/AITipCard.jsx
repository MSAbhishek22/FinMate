import { motion } from 'framer-motion'
import { Lightbulb, Sparkles } from 'lucide-react'

const AITipCard = ({ tip, loading }) => {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-200"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Lightbulb className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">AI Financial Tip</h3>
            <p className="text-sm text-gray-600">Powered by Gemini AI</p>
          </div>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </motion.div>
    )
  }

  if (!tip) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-200"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Lightbulb className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">AI Financial Tip</h3>
            <p className="text-sm text-gray-600">Powered by Gemini AI</p>
          </div>
        </div>
        <p className="text-gray-600">
          Start tracking your expenses to get personalized financial advice! 💰
        </p>
      </motion.div>
    )
  }

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'spending':
        return 'text-orange-600 bg-orange-100'
      case 'saving':
        return 'text-green-600 bg-green-100'
      case 'investing':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-primary-600 bg-primary-100'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-200"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary-100 rounded-lg">
          <Sparkles className="w-5 h-5 text-primary-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">AI Financial Tip</h3>
          <p className="text-sm text-gray-600">Powered by Gemini AI</p>
        </div>
        {tip.category && (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(tip.category)}`}>
            {tip.category}
          </span>
        )}
      </div>
      
      <div className="space-y-3">
        <p className="text-gray-700 leading-relaxed">
          {tip.tip}
        </p>
        
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
          <span>Personalized based on your spending patterns</span>
        </div>
      </div>
    </motion.div>
  )
}

export default AITipCard
