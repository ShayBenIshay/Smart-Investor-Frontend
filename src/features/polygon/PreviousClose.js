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
        <p>date: {previousClose.date}</p>
        <p>Closing Price: {previousClose.previousClose.close}</p>
        <p>Highest Price: {previousClose.previousClose.high}</p>
        <p>Lowest Price: {previousClose.previousClose.low}</p>
        <p>Open Price: {previousClose.previousClose.open}</p>
        <p>Trading Volume: {previousClose.previousClose.volume}</p>
      </article>
    );
  } else return null;
};

const memoizedPreviousClose = memo(PreviousClose);

export default memoizedPreviousClose;
