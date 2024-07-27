import Transaction from "./Transaction";
import { useGetTransactionsQuery } from "./transactionsApiSlice";
import useAuth from "../../../hooks/useAuth";
import PulseLoader from "react-spinners/PulseLoader";
import useTitle from "../../../hooks/useTitle";
import { Link } from "react-router-dom";

const TransactionsList = () => {
  useTitle("SmartInvestor: Transactions List");

  const { username } = useAuth();

  const {
    data: transactions,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetTransactionsQuery("transactionsList", {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;

  if (isLoading) content = <PulseLoader color={"#000"} />;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids, entities } = transactions;

    const filteredIds = ids.filter(
      (transactionId) => entities[transactionId].username === username
    );
    const noTransactions = (
      <>
        <p>No Transactions have been made yet.</p>
        <Link to="/dash/transactions/new">Add Transaction</Link>
      </>
    );
    const tableContent = filteredIds?.length
      ? filteredIds.map((transactionId) => (
          <Transaction key={transactionId} transactionId={transactionId} />
        ))
      : noTransactions;

    content = <section>{tableContent}</section>;
  }

  return content;
};
export default TransactionsList;
