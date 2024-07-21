import Transaction from "./Transaction";
import { useGetTransactionsQuery } from "./transactionsApiSlice";

const TransactionsList = () => {
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

  if (isLoading) content = <p>Loading...</p>;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids } = transactions;

    const tableContent = ids?.length
      ? ids.map((transactionId) => (
          <Transaction key={transactionId} transactionId={transactionId} />
        ))
      : null;

    content = <section>{tableContent}</section>;
  }

  return content;
};
export default TransactionsList;
