import Transaction from "./Transaction";
import { useGetTransactionsQuery } from "./transactionsApiSlice";
import PulseLoader from "react-spinners/PulseLoader";
import useTitle from "../../../hooks/useTitle";
import { Link } from "react-router-dom";

const AllTransactionsList = () => {
  useTitle("SmartInvestor: All Transactions List");

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

    const noTransactions = (
      <>
        <p>No Transactions have been made yet.</p>
        <Link to="/dash/transactions/new">Add Transaction</Link>
      </>
    );
    const tableContent = ids?.length
      ? ids.map((transactionId) => (
          <>
            <p>{entities[transactionId].username}</p>
            <Transaction key={transactionId} transactionId={transactionId} />
          </>
        ))
      : noTransactions;

    content = <section>{tableContent}</section>;
  }

  return content;
};
export default AllTransactionsList;
