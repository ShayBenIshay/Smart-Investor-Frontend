import AddTransactionForm from "./features/transactions/AddTransactionForm";
import TransactionsList from "./features/transactions/TransactionsList";
import SingleTransactionPage from "./features/transactions/SingleTransactionPage";
import EditTransactionForm from "./features/transactions/EditTransactionForm";
import Layout from "./components/Layout";
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<TransactionsList />} />

        <Route path="transaction">
          <Route index element={<AddTransactionForm />} />
          <Route path=":transactionId" element={<SingleTransactionPage />} />
          <Route path="edit/:transactionId" element={<EditTransactionForm />} />
        </Route>

        {/* Catch all - replace with 404 component if you want */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
