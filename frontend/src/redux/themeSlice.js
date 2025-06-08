// src/store/slices/themeSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Helper to get the user's saved preference from localStorage (if any)
const getStoredThemePreference = () => {
  if (typeof localStorage !== 'undefined') { // In some environments, where Server-Side Rendering localStorage may not be available, if we  try to access localStorage when it doesn’t exist, it will cause a runtime error

    const storedPreference = localStorage.getItem('theme');
    if (storedPreference === 'dark') return 'dark';
  }
  return 'light'; // Default: light mode
};

const initialState = {
  themeMode: getStoredThemePreference(), 
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleThemeMode: (state) => {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.themeMode);
    },
    
  },
});

export const { toggleThemeMode } = themeSlice.actions;
export default themeSlice.reducer;
