import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types';
import { saveToLocalStorage } from '../../utils/localStorage';

const initialState: {
  users: User[];
  selectedUserId: string | null;
} = {
  users: JSON.parse(localStorage.getItem('users') || '[]'),
  selectedUserId: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
      saveToLocalStorage('users', state.users);
    },
    updateUser: (
      state,
      action: PayloadAction<{ id: string; role: 'Admin' | 'Editor' | 'Viewer' | 'Custom'; permissions?: Record<'Dashboard' | 'Reports' | 'Settings', Record<'Read' | 'Write' | 'Delete' | 'Share', boolean>> }>
    ) => {
      const { id, role, permissions } = action.payload;
      const userIndex = state.users.findIndex((u) => u.id === id);
      if (userIndex !== -1) {
        state.users[userIndex] = { ...state.users[userIndex], role, permissions };
        saveToLocalStorage('users', state.users);
      }
    },
    selectUser: (state, action: PayloadAction<string | null>) => {
      state.selectedUserId = action.payload;
    },
  },
});

export const { addUser, updateUser, selectUser } = usersSlice.actions;
export default usersSlice.reducer;