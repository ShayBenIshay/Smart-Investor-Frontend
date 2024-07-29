import { useGetPreviousClosesQuery } from "./previousClosesApiSlice";
import { memo } from "react";

const PreviousClose = ({ previousCloseId }) => {
  const { previousClose } = useGetPreviousClosesQuery("previousClosesList", {
    selectFromResult: ({ data }) => ({
      previousClose: data?.entities[previousCloseId],
    }),
  });

  if (previousClose) {
    return (
      <article>
        <h2>{previousClose.ticker}</h2>
        <p>Date: {previousClose.date}</p>
        <p>Close: {previousClose.previousClose.close}</p>
        <p>High: {previousClose.previousClose.high}</p>
        <p>Low: {previousClose.previousClose.low}</p>
        <p>Open: {previousClose.previousClose.open}</p>
        <p>Volume: {previousClose.previousClose.volume}</p>
      </article>
    );
  } else return null;
};

const memoizedPreviousClose = memo(PreviousClose);

export default memoizedPreviousClose;
