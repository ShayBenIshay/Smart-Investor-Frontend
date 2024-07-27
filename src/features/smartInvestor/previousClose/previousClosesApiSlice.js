import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { smartInvestorApiSlice } from "../../../app/api/smartInvestorApiSlice";

const previousClosesAdapter = createEntityAdapter({});

const initialState = previousClosesAdapter.getInitialState({});

export const previousClosesApiSlice = smartInvestorApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPreviousCloses: builder.query({
      query: () => ({
        url: "/previousCloses",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedPreviousCloses = responseData.map((previousClose) => {
          previousClose.id = previousClose._id;
          return previousClose;
        });
        return previousClosesAdapter.setAll(initialState, loadedPreviousCloses);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "PreviousClose", id: "LIST" },
            ...result.ids.map((id) => ({ type: "PreviousClose", id })),
          ];
        } else return [{ type: "PreviousClose", id: "LIST" }];
      },
    }),
    addPreviousClose: builder.mutation({
      query: (initialPreviousClose) => ({
        url: "/previousCloses",
        method: "POST",
        body: {
          ...initialPreviousClose,
        },
      }),
      invalidatesTags: [{ type: "PreviousClose", id: "LIST" }],
    }),
    updatePreviousClose: builder.mutation({
      query: (initialPreviousClose) => ({
        url: `/previousCloses/`,
        method: "PUT",
        body: {
          ...initialPreviousClose,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "PreviousClose", id: arg.id },
      ],
    }),
    deletePreviousClose: builder.mutation({
      query: ({ id }) => ({
        url: `/previousCloses/`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "PreviousClose", id: arg.id },
      ],
    }),

    // getPreviousClose: builder.query({
    //   query: (ticker) => ({
    //     url: `/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${process.env.REACT_APP_POLYGON_API_KEY}`,
    //     validateStatus: (response, result) => {
    //       return response.status === 200 && !result.isError;
    //     },
    //   }),
    //   transformResponse: (responseData) => {
    //     console.log(responseData);
    //     responseData.id = responseData.ticker;
    //     return previousClosesAdapter.addOne(responseData);
    //     // return previousClosesAdapter.setAll(initialState, responseData);
    //   },
    //   providesTags: (result, error, arg) => {
    //     return { type: "PreviousClose" };
    //   },
    // }),
  }),
});

export const {
  useGetPreviousClosesQuery,
  useAddPreviousCloseMutation,
  useUpdatePreviousCloseMutation,
  useDeletePreviousCloseMutation,
} = previousClosesApiSlice;

export const selectPreviousClosesResult =
  previousClosesApiSlice.endpoints.getPreviousCloses.select();

const selectPreviousClosesData = createSelector(
  selectPreviousClosesResult,
  (previousClosesResult) => previousClosesResult.data
);

export const {
  selectAll: selectAllPreviousCloses,
  selectById: selectPreviousCloseById,
  selectIds: selectPreviousCloseIds,
} = previousClosesAdapter.getSelectors(
  (state) => selectPreviousClosesData(state) ?? initialState
);
