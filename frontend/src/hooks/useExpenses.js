import { useState, useEffect } from 'react'
import { openDB } from 'idb'
import { useAuth } from '../contexts/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Initialize IndexedDB
const initDB = async () => {
  return openDB('finmate', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('expenses')) {
        db.createObjectStore('expenses', { keyPath: 'id' })
      }
    },
  })
}

export const useExpenses = () => {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(false)
  const [db, setDB] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    initDB().then(setDB)
  }, [])

  useEffect(() => {
    if (db) {
      loadExpenses()
    }
  }, [db])

  const loadExpenses = async () => {
    if (!db) return

    try {
      const tx = db.transaction('expenses', 'readonly')
      const store = tx.objectStore('expenses')
      const storedExpenses = await store.getAll()
      
      // Sort by date (newest first)
      const sortedExpenses = storedExpenses.sort((a, b) => new Date(b.date) - new Date(a.date))
      setExpenses(sortedExpenses)
    } catch (error) {
      console.error('Error loading expenses from IndexedDB:', error)
    }
  }

  const addExpense = async (expense) => {
    if (!db) return

    setLoading(true)
    try {
      // Add to IndexedDB first (for offline support)
      const tx = db.transaction('expenses', 'readwrite')
      const store = tx.objectStore('expenses')
      await store.add(expense)

      // Update local state
      setExpenses(prev => [expense, ...prev])

      // Try to sync with backend if online
      if (navigator.onLine && user) {
        try {
          const token = await user.getIdToken()
          const response = await fetch(`${API_URL}/api/expenses`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(expense),
          })

          if (!response.ok) {
            throw new Error('Failed to sync with server')
          }
        } catch (error) {
          console.warn('Failed to sync expense with server:', error)
          // Expense is still saved locally, will sync when online
        }
      }
    } catch (error) {
      console.error('Error adding expense:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteExpense = async (expenseId) => {
    if (!db) return

    try {
      // Remove from IndexedDB
      const tx = db.transaction('expenses', 'readwrite')
      const store = tx.objectStore('expenses')
      await store.delete(expenseId)

      // Update local state
      setExpenses(prev => prev.filter(expense => expense.id !== expenseId))

      // Try to sync with backend if online
      if (navigator.onLine && user) {
        try {
          const token = await user.getIdToken()
          await fetch(`${API_URL}/api/expenses/${expenseId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          })
        } catch (error) {
          console.warn('Failed to sync deletion with server:', error)
        }
      }
    } catch (error) {
      console.error('Error deleting expense:', error)
    }
  }

  const syncWithServer = async () => {
    if (!navigator.onLine || !db || !user) return

    try {
      // Get all local expenses
      const tx = db.transaction('expenses', 'readonly')
      const store = tx.objectStore('expenses')
      const localExpenses = await store.getAll()

      // Get server expenses instead of sync endpoint
      const token = await user.getIdToken()
      const response = await fetch(`${API_URL}/api/expenses`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const serverExpenses = await response.json()
        
        // Update local database with server data
        const tx2 = db.transaction('expenses', 'readwrite')
        const store2 = tx2.objectStore('expenses')
        await store2.clear()
        
        for (const expense of serverExpenses) {
          await store2.add(expense)
        }

        setExpenses(serverExpenses.sort((a, b) => new Date(b.date) - new Date(a.date)))
      }
    } catch (error) {
      console.error('Error syncing with server:', error)
    }
  }

  // Auto-sync when coming back online
  useEffect(() => {
    const handleOnline = () => {
      syncWithServer()
    }

    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [db])

  return {
    expenses,
    addExpense,
    deleteExpense,
    loading,
    syncWithServer,
  }
}
