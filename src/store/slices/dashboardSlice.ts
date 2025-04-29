import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DashboardState {
  selectedTimeRange: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  selectedTimeRange: "7d",
  isLoading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setTimeRange(state, action: PayloadAction<string>) {
      state.selectedTimeRange = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setTimeRange, setLoading, setError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
