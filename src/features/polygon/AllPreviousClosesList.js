import PreviousClose from "./PreviousClose";
import { useGetPreviousClosesQuery } from "./previousClosesApiSlice";
import PulseLoader from "react-spinners/PulseLoader";
import useTitle from "../../hooks/useTitle";
import { Link } from "react-router-dom";

const AllPreviousClosesList = () => {
  useTitle("SmartInvestor: PreviousCloses List");

  const {
    data: { ids },
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPreviousClosesQuery("previousClosesList", {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;
  if (isLoading) {
    content = <PulseLoader color={"#000"} />;
  }
  if (isError) {
    content = (
      <>{isError && <p className="errmsg">{error?.data?.message}</p>}</>
    );
  }

  if (isSuccess) {
    const noTransactions = (
      <>
        <p>No Transactions have been made yet.</p>
        <Link to="/dash/transactions/new">Add Transaction</Link>
      </>
    );

    const tableContent = ids?.length
      ? ids.map((previousCloseId) => (
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
export default AllPreviousClosesList;
