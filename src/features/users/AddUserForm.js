import { useState, useEffect } from "react";
import { useAddUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../config/roles";
import useTitle from "../../hooks/useTitle";

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const AddUserForm = () => {
  useTitle("SmartInvestor: Add User");

  const [addUser, { isLoading, isSuccess, isError, error }] =
    useAddUserMutation();

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [roles, setRoles] = useState(["Customer"]);
  const [wallet, setWallet] = useState(10000);

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  useEffect(() => {
    if (isSuccess) {
      setUsername("");
      setPassword("");
      setRoles([]);
      setWallet(10000);
      navigate("/dash/users");
    }
  }, [isSuccess, navigate]);

  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);
  const onWalletChanged = (e) => setWallet(e.target.value);

  const onRolesChanged = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setRoles(values);
  };

  const canSave =
    [roles.length, validUsername, validPassword, wallet >= 0].every(Boolean) &&
    !isLoading;

  const onSaveUserClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addUser({ username, password, roles, wallet });
    }
  };

  const options = Object.values(ROLES).map((role) => {
    return (
      <option key={role} value={role}>
        {" "}
        {role}
      </option>
    );
  });

  const errClass = isError ? "errmsg" : "offscreen";
  const validUserClass = !validUsername ? "form__input--incomplete" : "";
  const validPwdClass = !validPassword ? "form__input--incomplete" : "";
  const validRolesClass = !Boolean(roles.length);
  const validWalletClass = !Boolean(roles.length)
    ? "form__input--incomplete"
    : "";

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className="form" onSubmit={onSaveUserClicked}>
        <div className="form__ticker-row">
          <h2>New User</h2>
        </div>
        <label className="form__label" htmlFor="username">
          Username: <span className="nowrap">[3-20 letters]</span>
        </label>
        <input
          className={`form__input ${validUserClass}`}
          id="username"
          name="username"
          type="text"
          autoComplete="off"
          value={username}
          onChange={onUsernameChanged}
        />

        <label className="form__label" htmlFor="password">
          Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span>
        </label>
        <input
          className={`form__input ${validPwdClass}`}
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={onPasswordChanged}
        />

        <label className="form__label" htmlFor="roles">
          Assigned Roles:
        </label>
        <select
          id="roles"
          name="roles"
          className={`form__select ${validRolesClass}`}
          multiple={true}
          size="3"
          value={roles}
          onChange={onRolesChanged}
        >
          {options}
        </select>
        <label className="form__label" htmlFor="wallet">
          Wallet:
        </label>
        <input
          className={`form__input ${validWalletClass}`}
          type="number"
          id="userWallet"
          name="userWallet"
          value={wallet}
          onChange={onWalletChanged}
        />
        <div className="form__action-buttons">
          <button className="icon-button" title="Save" disabled={!canSave}>
            <FontAwesomeIcon icon={faSave} />
          </button>
        </div>
      </form>
    </>
  );

  return content;
};
export default AddUserForm;
