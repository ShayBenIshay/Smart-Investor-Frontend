import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import useTitle from "../../../hooks/useTitle";

const Welcome = () => {
  const date = new Date();
  const today = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(date);

  const { username, status, isAdmin } = useAuth();

  useTitle(`SmartInvestor: ${username}`);

  const content = (
    <section className="welcome">
      <p>{today}</p>
      <p>{`${status}`}</p>
      <h1>{`Welcome ${username}!`}</h1>
      <h3>How can Smart Investor help you today?</h3>

      <p>
        <Link to="/dash/transactions">View My Transactions</Link>
      </p>

      <p>
        <Link to="/dash/transactions/new">Add Transaction</Link>
      </p>

      {isAdmin && (
        <p>
          <Link to="/dash/users">View User Settings</Link>
        </p>
      )}

      {isAdmin && (
        <p>
          <Link to="/dash/users/new">Add User</Link>
        </p>
      )}

      {isAdmin && (
        <p>
          <Link to="/dash/previousCloses">View Previous Closes List</Link>
        </p>
      )}
    </section>
  );

  return content;
};
export default Welcome;
