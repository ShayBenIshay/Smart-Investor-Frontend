import PreviousClose from "./PreviousClose";
import { useGetPreviousClosesQuery } from "./previousClosesApiSlice";
import useAuth from "../../hooks/useAuth";
import PulseLoader from "react-spinners/PulseLoader";
import useTitle from "../../hooks/useTitle";
import { Link } from "react-router-dom";
import { useGetTransactionsQuery } from "../transactions/transactionsApiSlice";

const PreviousClosesList = () => {
  useTitle("SmartInvestor: PreviousCloses List");

  const { username, isAdmin } = useAuth();

  const {
    data: previousCloses,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPreviousClosesQuery("previousClosesList", {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  const {
    data: transactions,
    isLoading: isTransactionsLoading,
    isSuccess: isTransactionsSuccess,
    isError: isTransactionsError,
    error: transactionsError,
  } = useGetTransactionsQuery("transactionsList", {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;
  if (isLoading || isTransactionsLoading) {
    content = <PulseLoader color={"#000"} />;
  }
  if (isError || isTransactionsError) {
    content = (
      <>
        {isError && <p className="errmsg">{error?.data?.message}</p>}
        {isTransactionsError && (
          <p className="errmsg">{transactionsError?.data?.message}</p>
        )}
      </>
    );
  }

  if (isSuccess && isTransactionsSuccess) {
    const { ids, entities } = previousCloses;
    const { ids: transactionsIds, entities: transactionsEntities } =
      transactions;

    let filteredIds;
    if (isAdmin) {
      filteredIds = [...transactionsIds];
    } else {
      filteredIds = transactionsIds.filter(
        (transactionId) =>
          transactionsEntities[transactionId].username === username
      );
    }
    const tickersArr = filteredIds.map(
      (transactionId) => transactionsEntities[transactionId]
    );

    let filteredPreviousClosesIds;
    if (isAdmin) {
      filteredPreviousClosesIds = [...ids];
    } else {
      filteredPreviousClosesIds = ids.filter((previousCloseId) =>
        tickersArr.includes(entities[previousCloseId].ticker)
      );
    }
    const noTransactions = (
      <>
        <p>No Transactions have been made yet.</p>
        <Link to="/dash/transactions/new">Add Transaction</Link>
      </>
    );

    const tableContent = filteredPreviousClosesIds?.length
      ? filteredPreviousClosesIds.map((previousCloseId) => (
          <PreviousClose
            key={previousCloseId}
            previousCloseId={previousCloseId}
          />
        ))
      : noTransactions;

    content = <section>{tableContent}</section>;
  }

  return content;
};
export default PreviousClosesList;
