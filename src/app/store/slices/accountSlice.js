import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  walletAddress: null,
  balance: "0",
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccount: (state, action) => {
      state.walletAddress = action.payload.walletAddress;
      state.balance = action.payload.balance;
    },
    disconnectAccount: (state) => {
      state.walletAddress = null;
      state.balance = "0";
    },
  },
});

export const { setAccount, disconnectAccount } = accountSlice.actions;
export default accountSlice.reducer;
