import { useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useAddNewTransactionMutation } from "./transactionsSlice";

const AddTransactionForm = () => {
  const [addNewTransaction, { isLoading }] = useAddNewTransactionMutation();

  const navigate = useNavigate();

  const [ticker, setTicker] = useState("");
  const [price, setPrice] = useState(0);
  const [date, setDate] = useState(format(new Date(), "dd/MM/yyyy"));
  const [papers, setPapers] = useState(0);
  const [operation, setOperation] = useState("");

  const onTickerChanged = (e) => setTicker(e.target.value);
  const onPriceChanged = (e) => setPrice(e.target.value);
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
        await addNewTransaction({ stock, papers, operation }).unwrap();

        setTicker("");
        setPrice(0);
        setDate(format(new Date(), "dd/MM/yyyy"));
        setPapers(0);
        setOperation("");
        navigate("/");
      } catch (err) {
        console.error("Failed to save the transaction", err);
      }
    }
  };

  return (
    <section>
      <h2>Add a New Transaction</h2>
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
      </form>
    </section>
  );
};
export default AddTransactionForm;
