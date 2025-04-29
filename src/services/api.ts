import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Enhanced Weather interfaces
export interface WeatherData {
  current: {
    temp: number;
    humidity: number;
    wind_speed: number;
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
  };
  daily: Array<{
    dt: number;
    temp: {
      day: number;
      min: number;
      max: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
  }>;
  timezone: string;
  timezone_offset: number;
}

// Enhanced News interface
export interface NewsItem {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

// Keep existing interfaces
export interface FinancialData {
  symbol: string;
  metrics: {
    marketCap: number;
    peRatio: number;
    eps: number;
    revenue: number;
    revenueGrowth: number;
    dividendYield: number;
    profitMargin: number;
  };
  forecast: {
    targetPrice: number;
    recommendation: string;
    analystCount: number;
  };
}

// City search interface
export interface CitySearchResult {
  id: number;
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface StockQuote {
  symbol: string;
  open: number;
  high: number;
  low: number;
  price: number;
  volume: number;
  previousClose: number;
  change: number;
  changePercent: number;
}

export interface StockTimeSeriesData {
  meta: {
    symbol: string;
    interval: string;
  };
  values: Array<{
    datetime: string;
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
  }>;
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }), // We'll use relative URLs and handle the full URL in endpoints
  tagTypes: ["Weather", "News", "Finance"],
  endpoints: (builder) => ({
    // Updated Weather endpoints
    getWeather: builder.query<WeatherData, { lat: number; lon: number }>({
      query: ({ lat, lon }) => ({
        url: `https://api.openweathermap.org/data/2.5/onecall`,
        params: {
          lat,
          lon,
          units: "metric", // or "imperial" for Fahrenheit
          exclude: "minutely,hourly,alerts",
          appid: process.env.NEXT_PUBLIC_OPENWEATHERMAP_KEY,
        },
      }),
      providesTags: ["Weather"],
    }),

    // City search endpoint
    searchCities: builder.query<CitySearchResult[], string>({
      query: (query) => ({
        url: `https://wft-geo-db.p.rapidapi.com/v1/geo/cities`,
        params: { namePrefix: query, limit: 5 },
        headers: {
          "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
          "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
        },
      }),
      transformResponse: (response: any) => response.data,
    }),

    // News endpoint with infinite scrolling
    getNews: builder.query<
      { articles: NewsItem[] },
      { category: string; page: number }
    >({
      query: ({ category, page }) => ({
        url: `https://newsapi.org/v2/top-headlines`,
        params: {
          country: "us",
          category,
          page,
          pageSize: 10,
          apiKey: process.env.NEXT_PUBLIC_NEWSAPI_KEY,
        },
      }),
      // Merge with existing data for infinite scrolling
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return endpointName + queryArgs.category;
      },
      merge: (currentCache, newItems, { arg: { page } }) => {
        if (page === 1) {
          return newItems;
        }
        return {
          ...newItems,
          articles: [...currentCache.articles, ...newItems.articles],
        };
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      providesTags: ["News"],
    }),

    getStockQuote: builder.query<StockQuote, string>({
      query: (symbol) => ({
        url: `https://www.alphavantage.co/query`,
        params: {
          function: "GLOBAL_QUOTE",
          symbol,
          apikey: process.env.NEXT_PUBLIC_ALPHA_VANTAGE_KEY,
        },
      }),
      transformResponse: (response: any) => {
        const quote = response["Global Quote"];
        return {
          symbol: quote["01. symbol"],
          open: parseFloat(quote["02. open"]),
          high: parseFloat(quote["03. high"]),
          low: parseFloat(quote["04. low"]),
          price: parseFloat(quote["05. price"]),
          volume: parseInt(quote["06. volume"]),
          previousClose: parseFloat(quote["08. previous close"]),
          change: parseFloat(quote["09. change"]),
          changePercent: parseFloat(
            quote["10. change percent"].replace("%", "")
          ),
        };
      },
      providesTags: (result, error, symbol) => [
        { type: "Finance", id: symbol },
      ],
    }),

    getStockTimeSeries: builder.query<
      StockTimeSeriesData,
      { symbol: string; interval: string }
    >({
      query: ({ symbol, interval }) => ({
        url: `https://www.alphavantage.co/query`,
        params: {
          function:
            interval === "1d" ? "TIME_SERIES_INTRADAY" : "TIME_SERIES_DAILY",
          symbol,
          interval: interval === "1d" ? "15min" : undefined,
          outputsize: "compact",
          apikey: process.env.NEXT_PUBLIC_ALPHA_VANTAGE_KEY,
        },
      }),
      transformResponse: (response: any, meta, arg) => {
        const timeSeries =
          response[
            arg.interval === "1d"
              ? "Time Series (15min)"
              : "Time Series (Daily)"
          ];
        const values = Object.entries(timeSeries)
          .map(([datetime, data]: [string, any]) => ({
            datetime,
            open: data["1. open"],
            high: data["2. high"],
            low: data["3. low"],
            close: data["4. close"],
            volume: data["5. volume"],
          }))
          .reverse();

        return {
          meta: {
            symbol: arg.symbol,
            interval: arg.interval,
          },
          values,
        };
      },
      providesTags: (result, error, arg) => [
        { type: "Finance", id: `${arg.symbol}-${arg.interval}` },
      ],
    }),

    searchStockSymbols: builder.query<
      Array<{ symbol: string; name: string }>,
      string
    >({
      query: (keywords) => ({
        url: `https://www.alphavantage.co/query`,
        params: {
          function: "SYMBOL_SEARCH",
          keywords,
          apikey: process.env.NEXT_PUBLIC_ALPHA_VANTAGE_KEY,
        },
      }),
      transformResponse: (response: any) => {
        return (
          response.bestMatches?.map((match: any) => ({
            symbol: match["1. symbol"],
            name: match["2. name"],
          })) || []
        );
      },
    }),

    // Add the missing financial data endpoint
    getFinancialData: builder.query<FinancialData, string>({
      query: (symbol) => ({
        url: `https://financial-api.example.com/fundamentals`,
        params: {
          symbol,
          apikey: process.env.NEXT_PUBLIC_FINANCIAL_API_KEY,
        },
      }),
      transformResponse: (response: any) => {
        return {
          symbol: response.symbol,
          metrics: {
            marketCap: response.marketCap || 0,
            peRatio: response.peRatio || 0,
            eps: response.eps || 0,
            revenue: response.revenue || 0,
            revenueGrowth: response.revenueGrowth || 0,
            dividendYield: response.dividendYield || 0,
            profitMargin: response.profitMargin || 0,
          },
          forecast: {
            targetPrice: response.targetPrice || 0,
            recommendation: response.recommendation || "N/A",
            analystCount: response.analystCount || 0,
          },
        };
      },
      providesTags: (result, error, symbol) => [
        { type: "Finance", id: `fundamentals-${symbol}` },
      ],
    }),
  }),
});

// Export the hooks
export const {
  useGetWeatherQuery,
  useSearchCitiesQuery,
  useGetNewsQuery,
  useGetFinancialDataQuery, // Now correctly defined
  useGetStockQuoteQuery,
  useGetStockTimeSeriesQuery,
  useSearchStockSymbolsQuery,
} = apiSlice;
