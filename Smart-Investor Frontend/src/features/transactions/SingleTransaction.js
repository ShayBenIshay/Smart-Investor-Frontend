import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectTransactionById } from "./transactionsSlice";

const SingleTransaction = ({ transactionId }) => {
  const transaction = useSelector((state) =>
    selectTransactionById(state, transactionId)
  );

  return (
    <article>
      <h2>{transaction.stock.ticker}</h2>
      <p>Price: {transaction.stock.price}</p>
      <p>Date: {transaction.stock.date}</p>
      <p>Number of papers:{transaction.papers}</p>
      <p>{transaction.operation}</p>
      <Link to={`transaction/${transaction._id}`}>View Transaction</Link>
    </article>
  );
};

export default SingleTransaction;
