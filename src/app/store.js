import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "./api/apiSlice";
import authReducer from "../features/auth/authSlice";

let devTools;
if (process.env.NODE_ENV === "development") {
  devTools = false;
} else {
  devTools = true;
}

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools,
});

setupListeners(store.dispatch);
