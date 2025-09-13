import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, DollarSign, Calendar, Tag, FileText } from 'lucide-react'

const ExpenseForm = ({ onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: 'food',
    note: '',
    date: new Date().toISOString().split('T')[0]
  })

  const categories = [
    { value: 'food', label: '🍕 Food & Dining', color: 'bg-red-100 text-red-800' },
    { value: 'transport', label: '🚗 Transport', color: 'bg-blue-100 text-blue-800' },
    { value: 'shopping', label: '🛍️ Shopping', color: 'bg-purple-100 text-purple-800' },
    { value: 'entertainment', label: '🎬 Entertainment', color: 'bg-pink-100 text-pink-800' },
    { value: 'health', label: '🏥 Health', color: 'bg-green-100 text-green-800' },
    { value: 'education', label: '📚 Education', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'bills', label: '💳 Bills', color: 'bg-orange-100 text-orange-800' },
    { value: 'other', label: '📦 Other', color: 'bg-gray-100 text-gray-800' }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.amount || parseFloat(formData.amount) <= 0) return
    
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
      id: Date.now().toString()
    })
    
    setFormData({
      amount: '',
      category: 'food',
      note: '',
      date: new Date().toISOString().split('T')[0]
    })
    onClose()
  }

  const selectedCategory = categories.find(cat => cat.value === formData.category)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Add Expense 💸</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close form"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              {selectedCategory && (
                <div className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${selectedCategory.color}`}>
                  {selectedCategory.label}
                </div>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note (Optional)
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  rows="3"
                  placeholder="What was this expense for?"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !formData.amount || parseFloat(formData.amount) <= 0}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Expense'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ExpenseForm
