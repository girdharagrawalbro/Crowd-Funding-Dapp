import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./slices/accountSlice";
import userReducer from './slices/userSlice';
import eventsReducer from './slices/eventSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    account: accountReducer,
    events: eventsReducer,
  },
});