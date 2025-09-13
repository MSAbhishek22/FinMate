import { useEffect, useRef } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const ExpenseChart = ({ expenses }) => {
  const chartRef = useRef(null)

  // Group expenses by category
  const categoryData = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {})

  const categories = {
    food: '🍕 Food',
    transport: '🚗 Transport',
    shopping: '🛍️ Shopping',
    entertainment: '🎬 Entertainment',
    health: '🏥 Health',
    education: '📚 Education',
    bills: '💳 Bills',
    other: '📦 Other'
  }

  const colors = [
    '#ef4444', // red
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#10b981', // green
    '#6366f1', // indigo
    '#f97316', // orange
    '#6b7280'  // gray
  ]

  const chartData = {
    labels: Object.keys(categoryData).map(cat => categories[cat] || cat),
    datasets: [
      {
        label: 'Amount ($)',
        data: Object.values(categoryData),
        backgroundColor: Object.keys(categoryData).map((_, index) => colors[index % colors.length]),
        borderColor: Object.keys(categoryData).map((_, index) => colors[index % colors.length]),
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  }

  const doughnutData = {
    labels: Object.keys(categoryData).map(cat => categories[cat] || cat),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: Object.keys(categoryData).map((_, index) => colors[index % colors.length]),
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = ((context.parsed.y / total) * 100).toFixed(1)
            return `${context.label}: $${context.parsed.y.toFixed(2)} (${percentage}%)`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toFixed(0)
          }
        }
      }
    }
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = ((context.parsed / total) * 100).toFixed(1)
            return `${context.label}: $${context.parsed.toFixed(2)} (${percentage}%)`
          }
        }
      }
    }
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <p className="text-gray-500">Add some expenses to see your spending patterns!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Bar Chart */}
      <div className="h-80">
        <Bar data={chartData} options={options} />
      </div>
      
      {/* Doughnut Chart */}
      <div className="h-80">
        <Doughnut data={doughnutData} options={doughnutOptions} />
      </div>
    </div>
  )
}

export default ExpenseChart
