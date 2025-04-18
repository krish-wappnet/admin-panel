import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  darkMode: boolean;
  snackbar: { message: string; undo?: () => void } | null;
  isAddUserModalOpen: boolean; // Add the modal state here
}

const initialState: UIState = {
  darkMode: false,
  snackbar: null,
  isAddUserModalOpen: false, // Set initial state of the modal to closed
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    showSnackbar: (state, action: PayloadAction<{ message: string; undo?: () => void }>) => {
      state.snackbar = action.payload;
    },
    hideSnackbar: (state) => {
      state.snackbar = null;
    },
    setAddUserModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAddUserModalOpen = action.payload; // Toggle modal open state
    },
  },
});

export const { toggleDarkMode, showSnackbar, hideSnackbar, setAddUserModalOpen } = uiSlice.actions;
export default uiSlice.reducer;
