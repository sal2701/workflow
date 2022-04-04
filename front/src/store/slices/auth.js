import { createSlice } from "@reduxjs/toolkit";

const initialState = { token: null, refreshToken: null, account: null };

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setAuthTokens: (state, action) => {
      state.refreshToken = action.payload.refreshToken;
      state.token = action.payload.token;
    },
    setAccount: (state, action) => {
      state.account = action.payload;
    },
    logout: (state) => {
      state.account = null;
      state.refreshToken = null;
      state.token = null;
    },
  },
})

// // Action creators are generated for each case reducer function
// export const { increment, decrement, incrementByAmount } = authSlice.actions

export default authSlice