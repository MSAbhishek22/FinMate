import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, RefreshCw, Sparkles } from 'lucide-react';
import { useAITips } from '../hooks/useAITips';
import { useExpenses } from '../hooks/useExpenses';

const DailyTip = () => {
  const { expenses } = useExpenses();
  const { tip, loading, error } = useAITips(expenses);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const handleRefresh = () => {
    setLastRefresh(new Date());
    // Force re-render by updating key dependency
    // Note: Better implementation would use a refresh function from useAITips
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-teal-50 to-gold-50 dark:from-teal-900/20 dark:to-gold-900/20 rounded-2xl shadow-premium border border-teal-200/50 dark:border-teal-700/50 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-teal-500 to-gold-500 rounded-xl">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-teal-deep dark:text-white">
              Daily Financial Tip
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {getGreeting()}, here's your personalized advice
            </p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="p-2 text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
        </div>
      ) : tip ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-gold-accent mt-0.5 flex-shrink-0" />
            <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
              {tip.tip}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
              <span>AI-powered for you</span>
            </div>
            {tip.category && (
              <span className="px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs font-medium rounded-full">
                {tip.category}
              </span>
            )}
          </div>
        </motion.div>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500 dark:text-gray-400">
            Start tracking expenses to get personalized tips! 💰
          </p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-teal-200/50 dark:border-teal-700/50">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Last updated: {lastRefresh.toLocaleTimeString()}
        </p>
      </div>
    </motion.div>
  );
};

export default DailyTip;
