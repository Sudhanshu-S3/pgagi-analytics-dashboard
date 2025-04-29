import { configureStore } from "@reduxjs/toolkit";
import weatherReducer from "./slices/weatherSlice";
import newsReducer from "./slices/newsSlice";

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    news: newsReducer,
    // Add other reducers here as needed
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
