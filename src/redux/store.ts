import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Use 'localStorage' or 'sessionStorage'
import { combineReducers } from 'redux';
import usersReducer from './slices/usersSlice';
import auditLogReducer from './slices/auditLogSlice';
import formReducer from './slices/formSlice';
import uiReducer from './slices/uiSlice'; // Import uiReducer

// Redux Persist Configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['form', 'users', 'ui'], // Persist 'form', 'users', and 'ui' slices
  blacklist: ['auditLog'], // Optionally, exclude auditLog from persistence
};

// Combine reducers
const rootReducer = combineReducers({
  users: usersReducer,
  auditLog: auditLogReducer,
  form: formReducer,
  ui: uiReducer, // Include the ui reducer for persistence
});

// Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store
export const store = configureStore({
  reducer: persistedReducer,
});

// Persistor
export const persistor = persistStore(store);

// Define RootState type
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
