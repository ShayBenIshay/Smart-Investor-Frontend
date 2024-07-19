import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const transactionsAdapter = createEntityAdapter({
  sortComparer: function (a, b) {
    var aa = a.stock.date.split("/").reverse().join(),
      bb = b.stock.date.split("/").reverse().join();
    return aa < bb ? 1 : aa > bb ? -1 : 0;
  },
});

const initialState = transactionsAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTransactions: builder.query({
      query: () => "/transactions",
      transformResponse: (responseData) => {
        const loadedTransactions = responseData.map((transaction) => {
          transaction.id = transaction._id;
          return transaction;
        });
        return transactionsAdapter.setAll(initialState, loadedTransactions);
      },
      providesTags: (result, error, arg) => [
        { type: "Transaction", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Transaction", id })),
      ],
    }),
    addNewTransaction: builder.mutation({
      query: (initialTransaction) => ({
        url: "/transactions",
        method: "POST",
        body: {
          ...initialTransaction,
        },
      }),
      invalidatesTags: [{ type: "Transaction", id: "LIST" }],
    }),
    updateTransaction: builder.mutation({
      query: (initialTransaction) => ({
        url: `/transactions/`,
        method: "PUT",
        body: {
          ...initialTransaction,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Transaction", id: arg.id },
      ],
    }),
    deleteTransaction: builder.mutation({
      query: ({ id }) => ({
        url: `/transactions/`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Transaction", id: arg.id },
      ],
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useAddNewTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} = extendedApiSlice;

export const selectTransactionsResult =
  extendedApiSlice.endpoints.getTransactions.select();

const selectTransactionsData = createSelector(
  selectTransactionsResult,
  (transactionsResult) => transactionsResult.data
);

export const {
  selectAll: selectAllTransactions,
  selectById: selectTransactionById,
  selectIds: selectTransactionIds,
} = transactionsAdapter.getSelectors(
  (state) => selectTransactionsData(state) ?? initialState
);
