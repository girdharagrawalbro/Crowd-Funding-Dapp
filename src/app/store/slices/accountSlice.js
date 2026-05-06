import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  name: null,
  balance: "0",
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccount: (state, action) => {
      state.userId = action.payload.userId;
      state.name = action.payload.name;
      state.balance = action.payload.balance || "0";
    },
    disconnectAccount: (state) => {
      state.userId = null;
      state.name = null;
      state.balance = "0";
    },
  },
});

export const { setAccount, disconnectAccount } = accountSlice.actions;
export default accountSlice.reducer;
