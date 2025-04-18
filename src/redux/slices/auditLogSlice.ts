import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuditLogEntry } from '../../types';
import { saveToLocalStorage } from '../../utils/localStorage';

const initialState: AuditLogEntry[] = JSON.parse(localStorage.getItem('auditLogs') || '[]');

const auditLogSlice = createSlice({
  name: 'auditLog',
  initialState,
  reducers: {
    addLog: (state, action: PayloadAction<AuditLogEntry>) => {
      state.unshift(action.payload);
      state.splice(10); 
      saveToLocalStorage('auditLogs', state);
    },
  },
});

export const { addLog } = auditLogSlice.actions;
export default auditLogSlice.reducer;