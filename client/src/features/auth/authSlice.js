import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  authChecked: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setAuthChecked: (state) => {
      state.authChecked = true;
    },
  },
});

export const {
  setCredentials,
  clearCredentials,
  setAuthChecked,
} = authSlice.actions;

export default authSlice.reducer;