import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { smartInvestorApiSlice } from "./api/smartInvestorApiSlice";
import { polygonSmartInvestorApiSlice } from "./api/polygonSmartInvestorApiSlice";
import authReducer from "../features/smartInvestor/auth/authSlice";
// import { polygonApiSlice } from "./api/polygonApiSlice";

export const store = configureStore({
  reducer: {
    [smartInvestorApiSlice.reducerPath]: smartInvestorApiSlice.reducer,
    [polygonSmartInvestorApiSlice.reducerPath]:
      polygonSmartInvestorApiSlice.reducer,
    auth: authReducer,
    // [polygonApiSlice.reducerPath]: polygonApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(smartInvestorApiSlice.middleware)
      .concat(polygonSmartInvestorApiSlice.middleware),
  devTools: process.env.NODE_ENV !== "development",
});

setupListeners(store.dispatch);
