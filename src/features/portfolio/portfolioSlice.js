import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { selectAllTransactions } from "../transactions/transactionsApiSlice";
import useAuth from "../../hooks/useAuth";

// Create an entity adapter for the portfolio
const portfolioAdapter = createEntityAdapter({
  selectId: (portfolioItem) => portfolioItem.ticker,
});

// Initial state for the portfolio
const initialState = portfolioAdapter.getInitialState();

// Create an async thunk to calculate the portfolio
export const calculatePortfolio = createAsyncThunk(
  "portfolio/calculatePortfolio",
  async (_, { getState }) => {
    const state = getState();
    console.log(state);
    const transactions = selectAllTransactions(state);
    const { username } = useAuth();
    const filteredTransaction = transactions.filter(
      (transaction) => transaction.username === username
    );
    console.log(filteredTransaction);
    const portfolio = filteredTransaction.reduce((acc, transaction) => {
      const { stock, papers } = transaction;
      const { ticker, price } = stock;
      if (!acc[ticker]) {
        acc[ticker] = {
          ticker,
          papers: 0,
          totalSpent: 0,
          avgBuyPrice: 0,
        };
      }
      acc[ticker].papers += papers;
      acc[ticker].totalSpent += papers * price;
      acc[ticker].avgBuyPrice = acc[ticker].totalSpent / acc[ticker].papers;
      return acc;
    }, {});
    console.log("Calculated portfolio in thunk:", Object.values(portfolio));
    return Object.values(portfolio);
  }
);

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(calculatePortfolio.pending, (state) => {
      console.log("pendinggg");
    });
    builder.addCase(calculatePortfolio.rejected, (state, action) => {
      // Handle the rejected state
      console.log("rejectedd");
      console.error("Failed to calculate portfolio:", action.error);
    });
    builder.addCase(calculatePortfolio.fulfilled, (state, action) => {
      console.log("Action payload:", action.payload);
      portfolioAdapter.setAll(state, action.payload);
    });
  },
});

export default portfolioSlice.reducer;

// Selectors to get the normalized portfolio data
export const {
  selectAll: selectAllPortfolioItems,
  selectById: selectPortfolioById,
  selectIds: selectPortfolioIds,
} = portfolioAdapter.getSelectors((state) => state.portfolio);

export const selectPortfolio = (state) => state.portfolio;
