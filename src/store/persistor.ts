import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "@/services/api";
import weatherReducer from "./slices/weatherSlice";
import newsReducer from "./slices/newsSlice";
import financeReducer from "./slices/financeSlice";
import dashboardReducer from "./slices/dashboardSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// Define which parts of state to persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["weather", "finance", "dashboard"], // Only persist these reducers
};

const rootReducer = combineReducers({
  dashboard: dashboardReducer,
  weather: weatherReducer,
  news: newsReducer,
  finance: financeReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredActionPaths: ["register", "rehydrate"],
        // You can also ignore paths in your Redux state if needed
        ignoredPaths: ["_persist"],
      },
    }).concat(apiSlice.middleware),
});

export const persistor = persistStore(store);

// Optional, but required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
