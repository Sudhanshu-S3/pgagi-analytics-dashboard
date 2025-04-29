import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "@/services/api";
import weatherReducer from "./slices/weatherSlice";
import newsReducer from "./slices/newsSlice";
import financeReducer from "./slices/financeSlice";
import dashboardReducer from "./slices/dashboardSlice";

export const store = configureStore({
  reducer: {
    // Include existing reducers
    dashboard: dashboardReducer,

    // Add new reducers
    weather: weatherReducer,
    news: newsReducer,
    finance: financeReducer,

    // Add the RTK Query API reducer
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

// Optional, but required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
