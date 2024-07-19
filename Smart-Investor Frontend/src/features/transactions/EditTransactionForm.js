import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  selectTransactionById,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} from "./transactionsSlice";

const EditTransactionForm = () => {
  const { transactionId } = useParams();
  const navigate = useNavigate();

  const [updateTransaction, { isLoading }] = useUpdateTransactionMutation();
  const [deleteTransaction] = useDeleteTransactionMutation();

  const transaction = useSelector((state) =>
    selectTransactionById(state, transactionId)
  );

  const [ticker, setTicker] = useState(transaction?.stock?.ticker);
  const [price, setPrice] = useState(transaction?.stock?.price);
  const [date, setDate] = useState(transaction?.stock?.date);
  const [papers, setPapers] = useState(transaction?.papers);
  const [operation, setOperation] = useState(transaction?.operation);

  if (!transaction) {
    return (
      <section>
        <h2>Transaction not found!</h2>
      </section>
    );
  }

  const onTickerChanged = (e) => setTicker(e.target.value);
  const onPriceChanged = (e) => setPrice(Number(e.target.value));
  const onDateChanged = (e) => setDate(e.target.value);
  const onPapersChanged = (e) => setPapers(e.target.value);
  const onOperationChanged = (e) => setOperation(e.target.value);

  const canSave =
    [ticker, price, date, papers, operation].every(Boolean) && !isLoading;

  const onSaveTransactionClicked = async () => {
    if (canSave) {
      const stock = {
        ticker,
        price,
        date,
      };
      try {
        await updateTransaction({
          stock,
          id: transactionId,
          papers,
          operation,
        }).unwrap();

        setTicker("");
        setPrice(0);
        setDate(format(new Date(), "dd/MM/yyyy"));
        setPapers(0);
        setOperation("");
        navigate(`/transaction/${transactionId}`);
      } catch (err) {
        console.error("Failed to save the transaction", err);
      }
    }
  };

  const onDeleteTransactionClicked = async () => {
    try {
      await deleteTransaction({ id: transaction._id }).unwrap();

      setTicker("");
      setPrice(0);
      setDate(format(new Date(), "dd/MM/yyyy"));
      setPapers(0);
      setOperation("");
      navigate("/");
    } catch (err) {
      console.error("Failed to delete the transaction", err);
    }
  };

  return (
    <section>
      <h2>Edit Transaction</h2>
      <form>
        <label htmlFor="transactionTicker">Transaction Ticker:</label>
        <input
          type="text"
          id="transactionTicker"
          name="transactionTicker"
          value={ticker}
          onChange={onTickerChanged}
        />
        <label htmlFor="transactionPrice">Transaction Price:</label>
        <input
          type="number"
          id="transactionPrice"
          name="transactionPrice"
          value={price}
          onChange={onPriceChanged}
        />
        <label htmlFor="transactionDate">Transaction Date:</label>
        <input
          type="text"
          id="transactionDate"
          name="transactionDate"
          value={date}
          placeholder="dd/mm/yyyy"
          onChange={onDateChanged}
        />
        <label htmlFor="transactionPapers">Transaction Papers:</label>
        <input
          type="number"
          id="transactionPapers"
          name="transactionPapers"
          value={papers}
          onChange={onPapersChanged}
        />
        <label htmlFor="transactionOperation">Operation(Buy/Sell):</label>
        <select
          id="transactionOperation"
          value={operation}
          onChange={onOperationChanged}
        >
          <option value=""></option>
          <option key="buy" value="Buy">
            Buy
          </option>
          <option key="sell" value="Sell">
            Sell
          </option>
        </select>
        <button
          type="button"
          onClick={onSaveTransactionClicked}
          disabled={!canSave}
        >
          Save Transaction
        </button>
        <button
          className="deleteButton"
          type="button"
          onClick={onDeleteTransactionClicked}
        >
          Delete Transaction
        </button>
      </form>
    </section>
  );
};

export default EditTransactionForm;
