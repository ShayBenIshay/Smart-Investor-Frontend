import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({ baseUrl: "https://api.polygon.io/" });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const baseQueryWithRetry = async (args, api, extraOptions, retries = 5) => {
  let result = await baseQuery(args, api, extraOptions);

  for (let i = 0; i < retries; i++) {
    //change to the status of too many request and then move the sleep and recall inside
    if (result?.error?.status !== 403) {
      break;
    }
    await sleep(60000); // Wait 60 seconds
    result = await baseQuery(args, api, extraOptions);
  }

  return result;
};

export const polygonApiSlice = createApi({
  reducerPath: "polygon",
  baseQuery: baseQueryWithRetry,
  endpoints: (builder) => ({
    getDailyClose: builder.query({
      query: (ticker, date) => ({
        url: `/v1/open-close/${ticker}/${date}?adjusted=true&apiKey=${process.env.REACT_APP_POLYGON_API_KEY}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
    }),
  }),
});

export const { useGetDailyCloseQuery } = polygonApiSlice;
