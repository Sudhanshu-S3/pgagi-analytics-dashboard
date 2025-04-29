import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WeatherData } from "@/services/api";

interface WeatherState {
  selectedLocation: string;
  favorites: string[];
  isLoading: boolean;
  error: string | null;
  unit: "celsius" | "fahrenheit";
}

const initialState: WeatherState = {
  selectedLocation: "New York",
  favorites: [],
  isLoading: false,
  error: null,
  unit: "celsius",
};

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    setLocation(state, action: PayloadAction<string>) {
      state.selectedLocation = action.payload;
    },
    addToFavorites(state, action: PayloadAction<string>) {
      if (!state.favorites.includes(action.payload)) {
        state.favorites.push(action.payload);
      }
    },
    removeFromFavorites(state, action: PayloadAction<string>) {
      state.favorites = state.favorites.filter((loc) => loc !== action.payload);
    },
    toggleUnit(state) {
      state.unit = state.unit === "celsius" ? "fahrenheit" : "celsius";
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
  setLocation,
  addToFavorites,
  removeFromFavorites,
  toggleUnit,
  setLoading,
  setError,
} = weatherSlice.actions;

export default weatherSlice.reducer;
