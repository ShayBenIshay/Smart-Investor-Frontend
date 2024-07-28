import React from "react";
import { useGetDailyCloseQuery } from "../../app/api/polygonApiSlice";

const DailyClose = ({ ticker, date }) => {
  const { data, error, isLoading } = useGetDailyCloseQuery({ ticker, date });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h3>
        Daily Close Data for {ticker} on {date}
      </h3>
      {data ? (
        <article>
          <h2>{ticker}</h2>
          <p>date: {date}</p>
          <p>Open: {data.open}</p>
          <p>Close: {data.close}</p>
          <p>High: {data.high}</p>
          <p>Low: {data.low}</p>
          <p>Volume: {data.volume}</p>
        </article>
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
};

export default DailyClose;
