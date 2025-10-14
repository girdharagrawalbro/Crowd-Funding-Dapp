import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./slices/accountSlice";
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    account: accountReducer,
  },
});