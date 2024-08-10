import React, { useState, useEffect } from "react";
import { useGetUsersQuery } from "../users/usersApiSlice";
import useAuth from "../../hooks/useAuth";
import PulseLoader from "react-spinners/PulseLoader";
import { useUpdateUserMutation } from "../users/usersApiSlice";

const Wallet = () => {
  const { username } = useAuth();

  const [
    updateUser,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateUserMutation();

  const [liquid, setLiquid] = useState(0);

  useEffect(() => {
    if (isUpdateSuccess) {
      setLiquid(0);
    }
  }, [isUpdateSuccess]);

  const onLiquidChanged = (e) => setLiquid(e.target.value);

  const canSave = liquid > 0 && !isUpdateLoading;

  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery("usersList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const handleDeposit = async (user) => {
    if (canSave) {
      await updateUser({
        id: user.id,
        username,
        roles: user.roles,
        wallet: user.wallet + Number(liquid),
      });
    }
  };
  const handleWithdrawal = async (user) => {
    if (canSave) {
      await updateUser({
        id: user.id,
        username,
        roles: user.roles,
        wallet: user.wallet - Number(liquid),
      });
    }
  };

  let content;

  if (isLoading) content = <PulseLoader color={"#000"} />;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { entities } = users;
    for (const key in entities) {
      if (entities[key].username === username) {
        const profitLossClass =
          entities[key].wallet > 0
            ? "profit"
            : entities[key].wallet < 0
            ? "loss"
            : "";
        content = (
          <article className="wallet-container">
            <p>
              Liquidity:{" "}
              <span className={profitLossClass}>
                {entities[key].wallet.toFixed(2)}
              </span>
            </p>
            <div>
              <input
                type="number"
                id="liquid"
                name="liquid"
                value={liquid}
                onChange={onLiquidChanged}
              />
              <div>
                <button
                  className="button deposit-button"
                  onClick={() => handleDeposit(entities[key])}
                >
                  Deposit
                </button>
                <button
                  className="button withdrawal-button"
                  onClick={() => handleWithdrawal(entities[key])}
                >
                  Withdrawal
                </button>
              </div>
            </div>
          </article>
        );
      }
    }
  }

  return content;
};

export default Wallet;
