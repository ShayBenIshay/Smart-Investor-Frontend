import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";

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
      <p>{isAdmin && `${status}`}</p>
      <h1>{`Welcome ${username}!`}</h1>
      <h3>How can Smart Investor help you today?</h3>

      <p>
        <Link to="/dash/portfolio">My Portfolio</Link>
      </p>
      <p>
        <Link to="/dash/transactions">My Transactions</Link>
      </p>

      {isAdmin && (
        <p>
          <Link to="/dash/transactions/all">All Transactions</Link>
        </p>
      )}

      <p>
        <Link to="/dash/transactions/new">Add Transaction</Link>
      </p>

      {isAdmin && (
        <p>
          <Link to="/dash/users">Users List</Link>
        </p>
      )}

      {isAdmin && (
        <p>
          <Link to="/dash/users/new">Add User</Link>
        </p>
      )}

      <p>
        <Link to="/dash/previousCloses">My Previous Closes</Link>
      </p>

      {isAdmin && (
        <p>
          <Link to="/dash/previousCloses/All">All Previous Closes</Link>
        </p>
      )}
    </section>
  );

  return content;
};
export default Welcome;
