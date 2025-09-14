import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Plus, TrendingUp, TrendingDown, BookOpen, Award } from 'lucide-react'
import ExpenseForm from '../components/ExpenseForm'
import ExpenseList from '../components/ExpenseList'
import ExpenseChart from '../components/ExpenseChart'
import AITipCard from '../components/AITipCard'
import FinancialTipsCard from '../components/FinancialTipsCard'
import { useExpenses } from '../hooks/useExpenses'
import { useAITips } from '../hooks/useAITips'

const Dashboard = () => {
  const [showForm, setShowForm] = useState(false)
  const { expenses, addExpense, loading } = useExpenses()
  const { tip, loading: tipLoading } = useAITips(expenses)

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const thisMonth = expenses.filter(expense => {
    const expenseDate = new Date(expense.date)
    const now = new Date()
    return expenseDate.getMonth() === now.getMonth() && 
           expenseDate.getFullYear() === now.getFullYear()
  })
  const thisMonthTotal = thisMonth.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link 
                to="/" 
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Back to home"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-gradient">FinMate 💰</h1>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Your Finance Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-4">
              <Link
                to="/learning"
                className="btn-secondary flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 text-sm"
                aria-label="Go to learning"
              >
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Learn</span>
              </Link>
              <Link
                to="/achievements"
                className="btn-secondary flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 text-sm"
                aria-label="View achievements"
              >
                <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Achievements</span>
              </Link>
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 text-sm"
                aria-label="Add new expense"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Add</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">${totalSpent.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">${thisMonthTotal.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900">{expenses.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-8">
            {/* Chart Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Spending Overview 📈
                </h2>
                <ExpenseChart expenses={expenses} />
              </div>
            </motion.div>

            {/* Recent Expenses */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Recent Expenses 💸
                </h2>
                <ExpenseList expenses={expenses.slice(0, 5)} />
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Financial Tips Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <FinancialTipsCard />
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions ⚡
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full btn-primary text-left"
                >
                  + Add Expense
                </button>
                <Link
                  to="/learning"
                  className="w-full btn-secondary text-center block"
                >
                  📚 Financial Learning
                </Link>
                <Link
                  to="/achievements"
                  className="w-full bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-medium py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 block text-center"
                >
                  🏆 View Achievements
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Expense Form Modal */}
      {showForm && (
        <ExpenseForm 
          onClose={() => setShowForm(false)}
          onSubmit={addExpense}
          loading={loading}
        />
      )}
    </div>
  )
}

export default Dashboard
