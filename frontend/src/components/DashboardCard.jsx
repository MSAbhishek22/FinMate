import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

const DashboardCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = 'teal', 
  trend, 
  trendValue,
  onClick,
  className = ''
}) => {
  const colorClasses = {
    teal: 'from-teal-500 to-teal-600',
    gold: 'from-accent-500 to-accent-600',
    primary: 'from-primary-500 to-primary-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600'
  };

  const iconColors = {
    teal: 'text-teal-600 dark:text-teal-400',
    gold: 'text-accent-600 dark:text-accent-400',
    primary: 'text-primary-600 dark:text-primary-400',
    purple: 'text-purple-600 dark:text-purple-400',
    green: 'text-green-600 dark:text-green-400',
    red: 'text-red-600 dark:text-red-400'
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-white/80 dark:bg-secondary-800/80 backdrop-blur-md rounded-2xl shadow-premium border border-white/20 p-6 cursor-pointer transition-all duration-300 hover:shadow-premium-lg ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[color]} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${iconColors[color]}`} />
        </div>
        {trend && (
          <div className={`flex items-center text-sm font-medium ${
            trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {trend === 'up' ? '↗' : '↘'} {trendValue}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          {title}
        </h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {value}
        </p>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default DashboardCard;
