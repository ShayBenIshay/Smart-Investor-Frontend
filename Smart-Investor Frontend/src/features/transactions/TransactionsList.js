import Transaction from "./Transaction";
import { useGetTransactionsQuery } from "./transactionsApiSlice";
import useAuth from "../../hooks/useAuth";
import PulseLoader from "react-spinners/PulseLoader";
import useTitle from "../../hooks/useTitle";

const TransactionsList = () => {
  useTitle("SmartInvestor: Transactions List");

  const { username, isAdmin } = useAuth();

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

  if (isLoading) content = <PulseLoader color={"#FFF"} />;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids, entities } = transactions;

    let filteredIds;
    if (isAdmin) {
      filteredIds = [...ids];
    } else {
      filteredIds = ids.filter(
        (transactionId) => entities[transactionId].username === username
      );
    }

    const tableContent =
      ids?.length &&
      filteredIds.map((transactionId) => (
        <Transaction key={transactionId} transactionId={transactionId} />
      ));

    content = <section>{tableContent}</section>;
  }

  return content;
};
export default TransactionsList;
