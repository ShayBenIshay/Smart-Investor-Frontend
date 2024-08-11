import { useState, useEffect } from "react";
import { format, isToday, parse } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} from "./transactionsApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import {
  useGetDailyCloseQuery,
  useGetPreviousCloseQuery,
  transformDate,
} from "../../app/api/polygonApiSlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditTransactionForm = ({ transaction }) => {
  const [updateTransaction, { isLoading, isSuccess, isError, error }] =
    useUpdateTransactionMutation();

  const [
    deleteTransaction,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteTransactionMutation();

  const navigate = useNavigate();

  const [ticker, setTicker] = useState(transaction?.stock?.ticker);
  const [price, setPrice] = useState(transaction?.stock?.price);
  const [date, setDate] = useState(
    parse(transaction?.stock?.date, "dd/MM/yyyy", new Date())
  );
  const [papers, setPapers] = useState(transaction?.papers);
  const [operation, setOperation] = useState(transaction?.operation);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setTicker("");
      setPrice(0);
      setDate(new Date());
      setPapers(0);
      setOperation("");
      navigate(`/dash/transactions`);
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const transformedDate = transformDate(format(date, "dd/MM/yyyy"));

  const { data: dailyCloseData, error: dailyCloseError } =
    useGetDailyCloseQuery(
      { ticker, date: transformedDate },
      { skip: ticker.length < 4 || isToday(date) }
    );
  const { data: previousCloseData, error: previousCloseError } =
    useGetPreviousCloseQuery(
      { ticker },
      { skip: ticker.length < 4 || !isToday(date) }
    );

  useEffect(() => {
    if (transaction.stock.price !== price) {
      if (dailyCloseData) {
        setPrice(dailyCloseData.close);
      } else if (previousCloseData) {
        setPrice(previousCloseData.results[0].c);
      }
    }
  }, [dailyCloseData, previousCloseData]);

  const onTickerChanged = (e) => setTicker(e.target.value);
  const onPriceChanged = (e) => setPrice(Number(e.target.value));
  const onDateChanged = (date) => setDate(date);
  const onPapersChanged = (e) => setPapers(e.target.value);
  const onOperationChanged = (e) => setOperation(e.target.value);

  const canSave =
    [ticker, price, date, papers, operation].every(Boolean) &&
    !isLoading &&
    price > 0 &&
    papers > 0;

  const onSaveTransactionClicked = async () => {
    if (canSave) {
      await updateTransaction({
        stock: {
          ticker,
          price,
          date: format(date, "dd/MM/yyyy"),
        },
        id: transaction.id,
        papers,
        operation,
      });
    }
  };

  const onDeleteTransactionClicked = async () => {
    await deleteTransaction({ id: transaction.id });
  };

  const errClass = isError ? "errmsg" : "offscreen";
  const validTickerClass = !ticker ? "form__input--incomplete" : "";
  const validPriceClass = !price || price <= 0 ? "form__input--incomplete" : "";
  const validDateClass = !date ? "form__input--incomplete" : "";
  const validPapersClass =
    !papers || papers <= 0 ? "form__input--incomplete" : "";
  const validOperationClass = !operation ? "form__input--incomplete" : "";

  const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Edit Transaction</h2>
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
        <label className="form__label" htmlFor="transactionDate">
          Transaction Date:
        </label>
        <DatePicker
          selected={date}
          onChange={onDateChanged}
          dateFormat="dd/MM/yyyy"
          className={`form__input ${validDateClass}`}
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
        <label htmlFor="transactionPapers">Transaction Papers:</label>
        <input
          className={`form__input ${validPapersClass}`}
          type="number"
          id="transactionPapers"
          name="transactionPapers"
          value={papers}
          onChange={onPapersChanged}
        />
        <label htmlFor="transactionOperation">Operation(Buy/Sell):</label>
        <select
          className={`form__select ${validOperationClass}`}
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
        <div className="form__action-buttons">
          <button
            type="button"
            onClick={onSaveTransactionClicked}
            disabled={!canSave}
          >
            <FontAwesomeIcon icon={faSave} />
          </button>
          <button
            className="deleteButton"
            type="button"
            onClick={onDeleteTransactionClicked}
          >
            <FontAwesomeIcon icon={faTrashCan} />
          </button>
        </div>
      </form>
    </>
  );

  return content;
};

export default EditTransactionForm;
