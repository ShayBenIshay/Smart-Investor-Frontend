import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { transactionsApiSlice } from "../transactions/transactionsApiSlice";

const portfolioAdapter = createEntityAdapter({
  selectId: (portfolioItem) => portfolioItem.ticker,
});

const initialState = portfolioAdapter.getInitialState();

export const calculatePortfolio = createAsyncThunk(
  "portfolio/calculatePortfolio",
  async (_, { dispatch }) => {
    try {
      const baseQuery =
        transactionsApiSlice.endpoints.getTransactions.initiate();
      const { ids, entities } = await dispatch(baseQuery).unwrap();
      const transactions = ids.map((transactionId) => entities[transactionId]);
      const portfolio = transactions.reduce((acc, transaction) => {
        const { stock, papers, username } = transaction;
        const { ticker, price } = stock;
        const id = username + "-" + ticker;
        if (!acc[id]) {
          acc[id] = {
            username,
            ticker,
            papers: 0,
            totalSpent: 0,
            avgBuyPrice: 0,
          };
        }
        acc[id].papers += papers;
        acc[id].totalSpent += papers * price;
        acc[id].avgBuyPrice = acc[id].totalSpent / acc[id].papers;
        return acc;
      }, {});
      return Object.values(portfolio);
    } catch (error) {
      console.log(error);
    }
  }
);

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(calculatePortfolio.rejected, (state, action) => {
      console.error("Failed to calculate portfolio:", action.error);
    });
    builder.addCase(calculatePortfolio.fulfilled, (state, action) => {
      portfolioAdapter.setAll(state, action.payload);
    });
  },
});

export default portfolioSlice.reducer;

export const {
  selectAll: selectAllPortfolioItems,
  selectById: selectPortfolioById,
  selectIds: selectPortfolioIds,
} = portfolioAdapter.getSelectors((state) => state.portfolio);

export const selectPortfolio = (state) => state.portfolio;
