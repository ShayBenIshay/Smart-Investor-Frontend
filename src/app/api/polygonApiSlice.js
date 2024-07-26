import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://api.polygon.io/",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithRetry = async (args, api, extraOptions) => {
  // console.log(args); // request url, method, body
  // console.log(api.getState()); // signal, dispatch, getState()
  // console.log(extraOptions); //custom like {shout: true}

  let result = await baseQuery(args, api, extraOptions);

  //if no response due to out of calls - wait a minue and try again.
  //403? what error polygon returns?
  //try 5 times?
  // if (result?.error?.status === 403) {
  //   //wait a minute

  //   //try again
  //   result = await baseQuery(args, api, extraOptions);
  // }

  return result;
};

export const polygonApiSlice = createApi({
  reducerPath: "polygon",
  baseQuery: baseQueryWithRetry,
  tagTypes: ["PreviousClose"],
  endpoints: (builder) => ({}),
});
