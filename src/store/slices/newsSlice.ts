import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NewsState {
  category: string;
  searchTerm: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: NewsState = {
  category: "technology",
  searchTerm: "",
  isLoading: false,
  error: null,
};

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    setCategory(state, action: PayloadAction<string>) {
      state.category = action.payload;
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setCategory, setSearchTerm, setLoading, setError } =
  newsSlice.actions;

export default newsSlice.reducer;
