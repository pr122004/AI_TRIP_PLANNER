import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice.js';
import tripReducer from './tripSlice.js';
import themeReducer  from './themeSlice.js';

// Configure persist for auth only
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['token', 'user', 'isAuthenticated']
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  trips: tripReducer,
  theme: themeReducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Needed for redux-persist
    }),
});

export const persistor = persistStore(store);