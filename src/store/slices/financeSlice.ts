import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FinanceState {
  watchlist: string[];
  timeRange: "1d" | "1w" | "1m" | "1y";
  isLoading: boolean;
  error: string | null;
}

const initialState: FinanceState = {
  watchlist: ["AAPL", "MSFT", "GOOGL", "AMZN"],
  timeRange: "1d",
  isLoading: false,
  error: null,
};

const financeSlice = createSlice({
  name: "finance",
  initialState,
  reducers: {
    addToWatchlist(state, action: PayloadAction<string>) {
      if (!state.watchlist.includes(action.payload)) {
        state.watchlist.push(action.payload);
      }
    },
    removeFromWatchlist(state, action: PayloadAction<string>) {
      state.watchlist = state.watchlist.filter(
        (symbol) => symbol !== action.payload
      );
    },
    setTimeRange(state, action: PayloadAction<"1d" | "1w" | "1m" | "1y">) {
      state.timeRange = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  addToWatchlist,
  removeFromWatchlist,
  setTimeRange,
  setLoading,
  setError,
} = financeSlice.actions;

export default financeSlice.reducer;
