import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { smartInvestorApiSlice } from "./api/smartInvestorApiSlice";
import authReducer from "../features/smartInvestor/auth/authSlice";

let devTools;
if (process.env.NODE_ENV === "development") {
  devTools = false;
} else {
  devTools = true;
}

export const store = configureStore({
  reducer: {
    [smartInvestorApiSlice.reducerPath]: smartInvestorApiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(smartInvestorApiSlice.middleware),
  devTools,
});

setupListeners(store.dispatch);
