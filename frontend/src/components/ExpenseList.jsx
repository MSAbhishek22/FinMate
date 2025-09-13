import { format } from 'date-fns'
import { motion } from 'framer-motion'

const ExpenseList = ({ expenses }) => {
  const categoryIcons = {
    food: '🍕',
    transport: '🚗',
    shopping: '🛍️',
    entertainment: '🎬',
    health: '🏥',
    education: '📚',
    bills: '💳',
    other: '📦'
  }

  const categoryColors = {
    food: 'bg-red-100 text-red-800',
    transport: 'bg-blue-100 text-blue-800',
    shopping: 'bg-purple-100 text-purple-800',
    entertainment: 'bg-pink-100 text-pink-800',
    health: 'bg-green-100 text-green-800',
    education: 'bg-indigo-100 text-indigo-800',
    bills: 'bg-orange-100 text-orange-800',
    other: 'bg-gray-100 text-gray-800'
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">💸</div>
        <p className="text-gray-500 dark:text-gray-400">No expenses yet. Add your first expense to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense, index) => (
        <motion.div
          key={expense.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-secondary-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-secondary-700/50 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white dark:bg-secondary-700 rounded-full flex items-center justify-center text-2xl shadow-sm">
              {categoryIcons[expense.category] || '📦'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900 dark:text-white">
                  ${expense.amount.toFixed(2)}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[expense.category]}`}>
                  {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
                </span>
              </div>
              {expense.note && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{expense.note}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {format(new Date(expense.date), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default ExpenseList
