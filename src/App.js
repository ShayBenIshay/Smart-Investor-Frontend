import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import DashLayout from "./components/DashLayout";
import Public from "./components/Public";
import TransactionsList from "./features/smartInvestor/transactions/TransactionsList";
import EditTransaction from "./features/smartInvestor/transactions/EditTransaction";
import AddTransaction from "./features/smartInvestor/transactions/AddTransaction";
import Login from "./features/smartInvestor/auth/Login";
import Prefetch from "./features/smartInvestor/auth/Prefetch";
import Welcome from "./features/smartInvestor/auth/Welcome";
import UsersList from "./features/smartInvestor/users/UsersList";
import EditUser from "./features/smartInvestor/users/EditUser";
import AddUserForm from "./features/smartInvestor/users/AddUserForm";
import PersistLogin from "./features/smartInvestor/auth/PersistLogin";
import { ROLES } from "./config/roles";
import RequireAuth from "./features/smartInvestor/auth/RequireAuth";
import useTitle from "./hooks/useTitle";
import Register from "./features/smartInvestor/auth/Register";
import PreviousClose from "./features/smartInvestor/previousClose/PreviousClose";
import PreviousClosesList from "./features/smartInvestor/previousClose/PreviousClosesList";
import AllTransactionsList from "./features/smartInvestor/transactions/AllTransactionsList";

function App() {
  useTitle("Smart Investor");
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        {/* Protected Routes */}
        <Route element={<PersistLogin />}>
          <Route
            element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
          >
            <Route element={<Prefetch />}>
              <Route path="dash" element={<DashLayout />}>
                <Route index element={<Welcome />} />

                <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                  <Route path="users">
                    <Route index element={<UsersList />} />
                    <Route path=":id" element={<EditUser />} />
                    <Route path="new" element={<AddUserForm />} />
                  </Route>
                </Route>

                <Route path="transactions">
                  <Route index element={<TransactionsList />} />
                  <Route path="all" element={<AllTransactionsList />} />
                  <Route path="new" index element={<AddTransaction />} />
                  <Route path=":id" element={<EditTransaction />} />
                </Route>

                <Route path="previousCloses">
                  <Route index element={<PreviousClosesList />} />
                  {/* <Route index element={<PreviousClose />} /> */}
                  {/* <Route path=":ticker" element={<PreviousClose />} /> */}
                </Route>

                {/* Catch all - replace with 404 component if you want */}
                {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
              </Route>
            </Route>
          </Route>
        </Route>
        {/* End Protected Routes */}
      </Route>
    </Routes>
  );
}

export default App;
