import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";
import { jwtDecode } from "jwt-decode";

const Welcome = () => {
  const date = new Date();
  const today = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(date);

  const token = useSelector(selectCurrentToken);
  const decoded = jwtDecode(token);
  const { username } = decoded.UserInfo;

  const content = (
    <section className="welcome">
      <p>{today}</p>

      <h1>{`Welcome ${username}!`}</h1>
      <h3>How can Smart Investor help you today?</h3>

      <p>
        <Link to="/dash/transactions">View My Transactions</Link>
      </p>

      <p>
        <Link to="/dash/transactions/new">Add Transaction</Link>
      </p>

      <p>
        <Link to="/dash/users">View User Settings</Link>
      </p>

      <p>
        <Link to="/dash/users/new">Add User</Link>
      </p>
    </section>
  );

  return content;
};
export default Welcome;
