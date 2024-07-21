import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectTransactionById } from "./transactionsApiSlice";

const Transaction = ({ transactionId }) => {
  const transaction = useSelector((state) =>
    selectTransactionById(state, transactionId)
  );

  const navigate = useNavigate();

  if (transaction) {
    const handleEdit = () => navigate(`/dash/transactions/${transactionId}`);

    return (
      <article>
        <h2>{transaction.stock.ticker}</h2>
        <p>Price: {transaction.stock.price}</p>
        <p>Date: {transaction.stock.date}</p>
        <p>Number of papers:{transaction.papers}</p>
        <p>{transaction.operation}</p>
        <button className="icon-button" onClick={handleEdit}>
          <FontAwesomeIcon icon={faPenToSquare} />
        </button>
      </article>
    );
  } else return null;
};

export default Transaction;
