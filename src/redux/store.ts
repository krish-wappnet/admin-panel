import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './slices/usersSlice';
import auditLogReducer from './slices/auditLogSlice';
import formReducer from './slices/formSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    auditLog: auditLogReducer,
    form: formReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;