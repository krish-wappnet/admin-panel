import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  darkMode: boolean;
  snackbar: { message: string; undo?: () => void } | null;
}

const initialState: UIState = {
  darkMode: false,
  snackbar: null,
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
  },
});

export const { toggleDarkMode, showSnackbar, hideSnackbar } = uiSlice.actions;
export default uiSlice.reducer;