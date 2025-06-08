import React, { useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleThemeMode } from '../../redux/themeSlice.js';

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.theme.themeMode);

  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  return (
    <button
      onClick={() => dispatch(toggleThemeMode())}
      aria-label="Toggle theme"
      className="p-2 rounded-full transition-colors duration-200 hover:bg-gray-200 dark:bg-gray-700"
    >

      {(themeMode == 'dark') ? (
        <Sun size={20} className="text-yellow-400" />
      ) : (
        <Moon size={20} className="text-gray-800 dark:text-gray-200" />
      )}
    </button>
  );
};

export default ThemeToggle;
