import { store } from "../../app/store";
import { usersApiSlice } from "../users/usersApiSlice";
import { transactionsApiSlice } from "../transactions/transactionsApiSlice";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const Prefetch = () => {
  useEffect(() => {
    console.log("subscribing");
    const transactions = store.dispatch(
      transactionsApiSlice.endpoints.getTransactions.initiate()
    );
    const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate());

    return () => {
      console.log("unsubscribing");
      transactions.unsubscribe();
      users.unsubscribe();
    };
  }, []);

  return <Outlet />;
};
export default Prefetch;
