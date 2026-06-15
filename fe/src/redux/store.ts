import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import threadReducer from "./slices/threadSlice";
import notificationReducer from "./slices/notificationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    thread: threadReducer,
    notification: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

