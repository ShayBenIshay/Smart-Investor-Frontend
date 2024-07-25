import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileCirclePlus,
  faFilePen,
  faUserGear,
  faUserPlus,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link, useLocation } from "react-router-dom";

import { useSendLogoutMutation } from "../features/smartInvestor/auth/authApiSlice";
import useAuth from "../hooks/useAuth";

const DASH_REGEX = /^\/dash(\/)?$/;
const TRANSACTION_REGEX = /^\/dash\/transactions(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;

const DashHeader = () => {
  const { isAdmin } = useAuth();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) navigate("/");
  }, [isSuccess, navigate]);

  const onAddTransactionClicked = () => navigate("/dash/transactions/new");
  const onAddUserClicked = () => navigate("/dash/users/new");
  const onTransactionsClicked = () => navigate("/dash/transactions");
  const onUsersClicked = () => navigate("/dash/users");

  let dashClass = null;
  if (
    !DASH_REGEX.test(pathname) &&
    !TRANSACTION_REGEX.test(pathname) &&
    !USERS_REGEX.test(pathname)
  ) {
    dashClass = "dash-header__container--small";
  }

  let addTransactionButton = null;
  if (TRANSACTION_REGEX.test(pathname)) {
    addTransactionButton = (
      <button
        className="icon-button"
        title="Add Transaction"
        onClick={onAddTransactionClicked}
      >
        <FontAwesomeIcon icon={faFileCirclePlus} />
      </button>
    );
  }

  let addUserButton = null;
  if (USERS_REGEX.test(pathname)) {
    addUserButton = (
      <button
        className="icon-button"
        title="Add User"
        onClick={onAddUserClicked}
      >
        <FontAwesomeIcon icon={faUserPlus} />
      </button>
    );
  }

  let userButton = null;
  if (isAdmin) {
    if (!USERS_REGEX.test(pathname) && pathname.includes("/dash")) {
      userButton = (
        <button className="icon-button" title="Users" onClick={onUsersClicked}>
          <FontAwesomeIcon icon={faUserGear} />
        </button>
      );
    }
  }

  let transactionsButton = null;
  if (!TRANSACTION_REGEX.test(pathname) && pathname.includes("/dash")) {
    transactionsButton = (
      <button
        className="icon-button"
        title="Transactions"
        onClick={onTransactionsClicked}
      >
        <FontAwesomeIcon icon={faFilePen} />
      </button>
    );
  }

  const logoutButton = (
    <button className="icon-button" title="Logout" onClick={sendLogout}>
      <FontAwesomeIcon icon={faRightFromBracket} />
    </button>
  );

  const errClass = isError ? "errmsg" : "offscreen";

  let buttonContent;
  if (isLoading) {
    buttonContent = <p>Logging Out...</p>;
  } else {
    buttonContent = (
      <>
        {addTransactionButton}
        {addUserButton}
        {transactionsButton}
        {userButton}
        {logoutButton}
      </>
    );
  }

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <header className="header">
        <div className={`dash-header__container ${dashClass}`}>
          <Link to="/dash">
            <h1>Smart Investor</h1>
          </Link>
          <nav className="dash-header__nav">
            {/* add more buttons later */}
            {buttonContent}
          </nav>
        </div>
      </header>
    </>
  );

  return content;
};

export default DashHeader;
