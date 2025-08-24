import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const useAITips = (expenses) => {
  const [tip, setTip] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTip = async () => {
      if (!expenses || expenses.length === 0) {
        setTip({
          tip: "Start tracking your expenses to get personalized financial advice! 💰",
          category: "general"
        })
        return
      }

      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`${API_URL}/api/tips`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ expenses })
        })

        if (!response.ok) {
          throw new Error('Failed to fetch AI tip')
        }

        const data = await response.json()
        setTip(data)
      } catch (err) {
        console.error('Error fetching AI tip:', err)
        setError(err.message)
        // Set fallback tip
        setTip({
          tip: "Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings! 💰",
          category: "general"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTip()
  }, [expenses])

  return { tip, loading, error }
}
