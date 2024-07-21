import { Link } from "react-router-dom";

const Public = () => {
  const content = (
    <section className="public">
      <header>
        <h1>
          Welcome to <span className="nowrap">Smart Investor!</span>
        </h1>
      </header>
      <main className="public__main">
        <p>The app to Smart mangage your Transactions.</p>
        <br />
        <p>Owner: Shay Ben Ishay</p>
        <Link to="/login">Login</Link>
      </main>
    </section>
  );
  return content;
};
export default Public;
