import React from 'react';
import { useTheme } from '../context/ThemeContext';
/*import styles from './ThemeToggle.module.css';*/

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      /* className={styles.themeToggle} */
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      {isDarkMode ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggle;