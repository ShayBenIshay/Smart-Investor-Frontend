import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectTransactionById } from "./transactionsApiSlice";
import EditTransactionForm from "./EditTransactionForm";

const EditTransaction = () => {
  const { id } = useParams();

  const transaction = useSelector((state) => selectTransactionById(state, id));

  const content = transaction ? (
    <EditTransactionForm transaction={transaction} />
  ) : (
    <p>Loading...</p>
  );

  return content;
};
export default EditTransaction;
