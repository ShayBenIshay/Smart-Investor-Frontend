import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { smartInvestorApiSlice } from "./api/smartInvestorApiSlice";
import authReducer from "../features/auth/authSlice";
import { polygonApiSlice } from "./api/polygonApiSlice";

export const store = configureStore({
  reducer: {
    [smartInvestorApiSlice.reducerPath]: smartInvestorApiSlice.reducer,
    auth: authReducer,
    [polygonApiSlice.reducerPath]: polygonApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(smartInvestorApiSlice.middleware),
  devTools: process.env.NODE_ENV !== "development",
});

setupListeners(store.dispatch);
