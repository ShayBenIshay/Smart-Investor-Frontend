import { store } from "../../app/store";
import { usersApiSlice } from "../users/usersApiSlice";
import { transactionsApiSlice } from "../transactions/transactionsApiSlice";
import { previousClosesApiSlice } from "../polygon/previousClosesApiSlice";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const Prefetch = () => {
  useEffect(() => {
    store.dispatch(
      transactionsApiSlice.util.prefetch(
        "getTransactions",
        "transactionsList",
        {
          force: true,
        }
      )
    );
    store.dispatch(
      usersApiSlice.util.prefetch("getUsers", "usersList", { force: true })
    );
    store.dispatch(
      previousClosesApiSlice.util.prefetch(
        "getPreviousCloses",
        "previousClosesList",
        { force: true }
      )
    );
  }, []);

  return <Outlet />;
};
export default Prefetch;
