import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { apiSlice } from "@/services/api";
import weatherReducer from "./slices/weatherSlice";
import newsReducer from "./slices/newsSlice";
import financeReducer from "./slices/financeSlice";

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  weather: weatherReducer,
  news: newsReducer,
  finance: financeReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["weather", "news", "finance"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      apiSlice.middleware
    ),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
