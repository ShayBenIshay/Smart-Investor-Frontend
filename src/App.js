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
import { ROLES } from "./config/roles";
import RequireAuth from "./features/auth/RequireAuth";
import useTitle from "./hooks/useTitle";
import Register from "./features/auth/Register";
import PreviousClosesList from "./features/polygon/PreviousClosesList";
import AllTransactionsList from "./features/transactions/AllTransactionsList";
import AllPreviousClosesList from "./features/polygon/AllPreviousClosesList";
import Portfolio from "./features/portfolio/Portfolio";

const mockData = [
  {
    ticker: "AAPL",
    papers: 10,
    avgBuyPrice: 150,
    currentPrice: 160,
    profitPercentage: 6.67,
    totalAssetProfit: 100,
  },
  {
    ticker: "GOOGL",
    papers: 5,
    avgBuyPrice: 1200,
    currentPrice: 1100,
    profitPercentage: -10,
    totalAssetProfit: 500,
  },
  // Add more mock data as needed
];

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
                {/* <Route path="portfolio" element={<Port data={mockData} />} /> */}
                <Route
                  path="portfolio"
                  element={<Portfolio data={mockData} />}
                />

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
                  <Route path="all" element={<AllPreviousClosesList />} />
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
