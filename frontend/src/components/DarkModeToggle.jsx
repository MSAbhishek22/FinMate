import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const DarkModeToggle = ({ className = '' }) => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <motion.button
      onClick={toggleDarkMode}
      className={`relative p-2 rounded-full bg-white/10 dark:bg-gray-800/50 backdrop-blur-md border border-white/20 dark:border-gray-700/50 hover:bg-white/20 dark:hover:bg-gray-700/50 transition-all duration-300 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={false}
      animate={{
        rotate: darkMode ? 180 : 0,
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={false}
        animate={{
          opacity: darkMode ? 0 : 1,
          scale: darkMode ? 0 : 1,
        }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Sun className="w-5 h-5 text-gold-accent" />
      </motion.div>
      
      <motion.div
        initial={false}
        animate={{
          opacity: darkMode ? 1 : 0,
          scale: darkMode ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Moon className="w-5 h-5 text-teal-400" />
      </motion.div>
    </motion.button>
  );
};

export default DarkModeToggle;
