import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useAddNewTransactionMutation } from "./transactionsApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

const AddTransactionForm = () => {
  const [addNewTransaction, { isLoading, isSuccess, isError, error }] =
    useAddNewTransactionMutation();

  const navigate = useNavigate();

  const [ticker, setTicker] = useState("");
  const [price, setPrice] = useState(0);
  const [date, setDate] = useState(format(new Date(), "dd/MM/yyyy"));
  const [papers, setPapers] = useState(0);
  const [operation, setOperation] = useState("");

  useEffect(() => {
    if (isSuccess) {
      setTicker("");
      setPrice(0);
      setDate(format(new Date(), "dd/MM/yyyy"));
      setPapers(0);
      setOperation("");
      navigate("/dash/transactions");
    }
  }, [isSuccess, navigate]);

  const onTickerChanged = (e) => setTicker(e.target.value);
  const onPriceChanged = (e) => setPrice(e.target.value);
  const onDateChanged = (e) => setDate(e.target.value);
  const onPapersChanged = (e) => setPapers(e.target.value);
  const onOperationChanged = (e) => setOperation(e.target.value);

  const canSave =
    [ticker, price, date, papers, operation].every(Boolean) && !isLoading;

  const onSaveTransactionClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewTransaction({
        stock: {
          ticker,
          price,
          date,
        },
        papers,
        operation,
      });
    }
  };

  const errClass = isError ? "errmsg" : "offscreen";
  const validTickerClass = !ticker ? "form__input--incomplete" : "";
  const validPriceClass = !price ? "form__input--incomplete" : "";
  const validDateClass = !date ? "form__input--incomplete" : "";
  const validPapersClass = !papers ? "form__input--incomplete" : "";
  const validOperationClass = !operation ? "form__input--incomplete" : "";

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className="form" onSubmit={onSaveTransactionClicked}>
        <div className="form__title-row">
          <h2>Add a New Transaction</h2>
          <div className="form__action-buttons">
            <button
              type="button"
              onClick={onSaveTransactionClicked}
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>
        <label className="form__label" htmlFor="transactionTicker">
          Transaction Ticker:
        </label>
        <input
          className={`form__input ${validTickerClass}`}
          type="text"
          id="transactionTicker"
          name="transactionTicker"
          value={ticker}
          onChange={onTickerChanged}
        />
        <label className="form__label" htmlFor="transactionPrice">
          Transaction Price:
        </label>
        <input
          className={`form__input ${validPriceClass}`}
          type="number"
          id="transactionPrice"
          name="transactionPrice"
          value={price}
          onChange={onPriceChanged}
        />
        <label className="form__label" htmlFor="transactionDate">
          Transaction Date:
        </label>
        <input
          className={`form__input ${validDateClass}`}
          type="text"
          id="transactionDate"
          name="transactionDate"
          value={date}
          placeholder="dd/mm/yyyy"
          onChange={onDateChanged}
        />
        <label className="form__label" htmlFor="transactionPapers">
          Transaction Papers:
        </label>
        <input
          className={`form__input ${validPapersClass}`}
          type="number"
          id="transactionPapers"
          name="transactionPapers"
          value={papers}
          onChange={onPapersChanged}
        />
        <label className="form__label" htmlFor="transactionOperation">
          Operation(Buy/Sell):
        </label>
        <select
          className={`form__select ${validOperationClass}`}
          // className="form__select"
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
      </form>
    </>
  );

  return content;
};
export default AddTransactionForm;
