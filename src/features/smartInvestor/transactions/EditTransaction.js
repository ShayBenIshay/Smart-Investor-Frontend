import { useParams } from "react-router-dom";
import EditTransactionForm from "./EditTransactionForm";
import { useGetTransactionsQuery } from "./transactionsApiSlice";
import { useGetUsersQuery } from "../users/usersApiSlice";
import useAuth from "../../../hooks/useAuth";
import PulseLoader from "react-spinners/PulseLoader";
import useTitle from "../../../hooks/useTitle";

const EditTransaction = () => {
  useTitle("SmartInvestor: Edit Transaction");

  const { id } = useParams();

  const { username, isAdmin } = useAuth();

  const { transaction } = useGetTransactionsQuery("transactionsList", {
    selectFromResult: ({ data }) => ({
      transaction: data?.entities[id],
    }),
  });

  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  if (!transaction || !users?.length) return <PulseLoader color={"#FFF"} />;

  if (!isAdmin) {
    if (transaction.username !== username) {
      return <p className="errmsg">No access</p>;
    }
  }

  const content = <EditTransactionForm transaction={transaction} />;

  return content;
};
export default EditTransaction;
