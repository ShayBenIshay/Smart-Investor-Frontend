import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import DashLayout from "./components/DashLayout";
import Public from "./components/Public";
import TransactionsList from "./features/transactions/TransactionsList";
import EditTransaction from "./features/transactions/EditTransaction";
import AddTransaction from "./features/transactions/AddTransaction";
import Login from "./features/auth/Login";
import Prefetch from "./features/auth/Prefetch";
import Welcome from "./features/auth/Welcome";
import UsersList from "./features/users/UsersList";
import EditUser from "./features/users/EditUser";
import AddUserForm from "./features/users/AddUserForm";
import PersistLogin from "./features/auth/PersistLogin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />

        <Route element={<PersistLogin />}>
          <Route element={<Prefetch />}>
            <Route path="dash" element={<DashLayout />}>
              <Route index element={<Welcome />} />

              <Route path="users">
                <Route index element={<UsersList />} />
                <Route path=":id" element={<EditUser />} />
                <Route path="new" element={<AddUserForm />} />
              </Route>

              <Route path="transactions">
                <Route index element={<TransactionsList />} />
                <Route path="new" index element={<AddTransaction />} />
                <Route path=":id" element={<EditTransaction />} />
              </Route>

              {/* Catch all - replace with 404 component if you want */}
              {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
