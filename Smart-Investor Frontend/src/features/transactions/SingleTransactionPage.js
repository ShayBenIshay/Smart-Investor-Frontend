import { useSelector } from "react-redux";
import { selectTransactionById } from "./transactionsSlice";

import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const SingleTransactionPage = () => {
  const { transactionId } = useParams();

  const transaction = useSelector((state) =>
    selectTransactionById(state, transactionId)
  );

  if (!transaction) {
    return (
      <section>
        <h2>Transaction not found!</h2>
      </section>
    );
  }

  return (
    <article>
      <h2>{transaction.stock.ticker}</h2>
      <p>Price: {transaction.stock.price}</p>
      <p>Date: {transaction.stock.date}</p>
      <p>Number of papers:{transaction.papers}</p>
      <p>{transaction.operation}</p>
      <Link to={`/transaction/edit/${transaction._id}`}>Edit Transaction</Link>
    </article>
  );
};

export default SingleTransactionPage;
