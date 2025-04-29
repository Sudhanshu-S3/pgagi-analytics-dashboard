import { createSelector } from "reselect";
import { RootState } from "./index";

// Basic selectors
const selectWeatherState = (state: RootState) => state.weather;
const selectNewsState = (state: RootState) => state.news;
const selectFinanceState = (state: RootState) => state.finance;
const selectDashboardState = (state: RootState) => state.dashboard;

// Memoized selectors
export const selectSelectedLocation = createSelector(
  [selectWeatherState],
  (weather) => weather.selectedLocation
);

export const selectWeatherFavorites = createSelector(
  [selectWeatherState],
  (weather) => weather.favorites
);

export const selectWeatherUnit = createSelector(
  [selectWeatherState],
  (weather) => weather.unit
);

export const selectNewsCategory = createSelector(
  [selectNewsState],
  (news) => news.category
);

export const selectNewsSearchTerm = createSelector(
  [selectNewsState],
  (news) => news.searchTerm
);

export const selectFinanceWatchlist = createSelector(
  [selectFinanceState],
  (finance) => finance.watchlist
);

export const selectFinanceTimeRange = createSelector(
  [selectFinanceState],
  (finance) => finance.timeRange
);

export const selectDashboardTimeRange = createSelector(
  [selectDashboardState],
  (dashboard) => dashboard.selectedTimeRange
);

// Complex selectors that combine data
export const selectIsLoading = createSelector(
  [
    selectWeatherState,
    selectNewsState,
    selectFinanceState,
    selectDashboardState,
  ],
  (weather, news, finance, dashboard) =>
    weather.isLoading ||
    news.isLoading ||
    finance.isLoading ||
    dashboard.isLoading
);
