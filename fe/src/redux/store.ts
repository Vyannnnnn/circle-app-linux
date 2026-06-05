import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import threadReducer from "./slices/threadSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    thread: threadReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

