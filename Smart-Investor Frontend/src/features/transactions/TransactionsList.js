import { useSelector } from "react-redux";
import { selectTransactionIds } from "./transactionsSlice";
import SingleTransaction from "./SingleTransaction";
import { useGetTransactionsQuery } from "./transactionsSlice";

const TransactionsList = () => {
  const { isLoading, isSuccess, isError, error } = useGetTransactionsQuery();

  const orderedTransactionIds = useSelector(selectTransactionIds);

  let content;
  if (isLoading) {
    content = <p>"Loading..."</p>;
  } else if (isSuccess) {
    content = orderedTransactionIds.map((transactionId) => (
      <SingleTransaction key={transactionId} transactionId={transactionId} />
    ));
  } else if (isError) {
    content = <p>{error}</p>;
  }

  return <section>{content}</section>;
};
export default TransactionsList;
