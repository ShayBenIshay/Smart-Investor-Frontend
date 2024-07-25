import AddTransactionForm from "./AddTransactionForm";
import useTitle from "../../../hooks/useTitle";

const AddTransaction = () => {
  useTitle("SmartInvestor: Add Transaction");

  const content = <AddTransactionForm />;

  return content;
};
export default AddTransaction;
