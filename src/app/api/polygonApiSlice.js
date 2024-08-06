import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({ baseUrl: "https://api.polygon.io/" });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const baseQueryWithRetry = async (args, api, extraOptions, retries = 5) => {
  let result = await baseQuery(args, api, extraOptions);
  console.log(result);

  for (let i = 0; i < retries; i++) {
    if (result?.error?.status !== 403) {
      break;
    }
    await sleep(60000); // Wait 60 seconds
    result = await baseQuery(args, api, extraOptions);
  }
  console.log(result);

  return result;
};

export const polygonApiSlice = createApi({
  reducerPath: "polygon",
  baseQuery: baseQueryWithRetry,
  endpoints: (builder) => ({
    getDailyClose: builder.query({
      query: ({ ticker, date }) => ({
        url: `/v1/open-close/${ticker}/${date}?adjusted=true&apiKey=${process.env.REACT_APP_POLYGON_API_KEY}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
    }),
    getPreviousClose: builder.query({
      query: ({ ticker }) => ({
        url: `/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${process.env.REACT_APP_POLYGON_API_KEY}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
    }),
  }),
});

export const { useGetDailyCloseQuery, useGetPreviousCloseQuery } =
  polygonApiSlice;

export function transformDate(dateString) {
  const parts = dateString.split("/");
  const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
  return formattedDate;
}
