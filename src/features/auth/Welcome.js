import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";

const Welcome = () => {
  const date = new Date();
  const today = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);

  const { username, status, isAdmin, lastLogin } = useAuth();

  useTitle(`SmartInvestor: ${username}`);

  const loginTimeFormat = !lastLogin
    ? "Congrats! This is you'r first login"
    : new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(new Date(lastLogin));
  const content = (
    <section className="welcome">
      <p>{today}</p>
      <p>{isAdmin && `${status}`}</p>
      <h1>{`Welcome ${username}!`}</h1>
      {lastLogin && <p>Last Login: {loginTimeFormat}</p>}
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
