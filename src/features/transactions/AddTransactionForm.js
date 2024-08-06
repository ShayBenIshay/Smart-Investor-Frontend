import { useState, useEffect } from "react";
import { format, isToday } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useAddTransactionMutation } from "./transactionsApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import {
  useGetDailyCloseQuery,
  useGetPreviousCloseQuery,
  transformDate,
} from "../../app/api/polygonApiSlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { tickersList } from "../../tickers/tickers";
const AddTransactionForm = () => {
  const [addTransaction, { isLoading, isSuccess, isError, error }] =
    useAddTransactionMutation();

  const navigate = useNavigate();

  const [ticker, setTicker] = useState("");
  const [price, setPrice] = useState(0);
  const [date, setDate] = useState(new Date());
  const [papers, setPapers] = useState(0);
  const [operation, setOperation] = useState("");

  useEffect(() => {
    if (isSuccess) {
      setTicker("");
      setPrice(0);
      setDate(new Date());
      setPapers(0);
      setOperation("");
      navigate("/dash/transactions");
    }
  }, [isSuccess, navigate]);

  const transformedDate = transformDate(format(date, "dd/MM/yyyy"));

  const { data: dailyCloseData, isSuccess: isDailySuccess } =
    useGetDailyCloseQuery(
      { ticker, date: transformedDate },
      { skip: !tickersList.includes(ticker) || isToday(date) }
    );
  const { data: previousCloseData, isSuccess: isPrevSuccess } =
    useGetPreviousCloseQuery(
      { ticker },
      { skip: !tickersList.includes(ticker) || !isToday(date) }
    );

  useEffect(() => {
    if (
      (isPrevSuccess && previousCloseData.resultsCount !== 0) ||
      isDailySuccess
    ) {
      dailyCloseData
        ? setPrice(dailyCloseData.close)
        : setPrice(previousCloseData?.results[0]?.c);
    }
  }, [dailyCloseData, previousCloseData]);

  const onTickerChanged = (e) => {
    setTicker(e.target.value.trim());
  };
  const onPriceChanged = (e) => setPrice(e.target.value);
  const onDateChanged = (date) => setDate(date);
  const onPapersChanged = (e) => setPapers(e.target.value);
  const onOperationChanged = (e) => setOperation(e.target.value);

  const canSave =
    [ticker, price, date, papers, operation].every(Boolean) &&
    !isLoading &&
    price > 0 &&
    papers > 0;

  const onSaveTransactionClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addTransaction({
        stock: {
          ticker,
          price,
          date: format(date, "dd/MM/yyyy"),
        },
        papers,
        operation,
      });
    }
  };

  const errClass = isError ? "errmsg" : "offscreen";
  const validTickerClass = !ticker ? "form__input--incomplete" : "";
  const validPriceClass = !price || price <= 0 ? "form__input--incomplete" : "";
  const validDateClass = !date ? "form__input--incomplete" : "";
  const validPapersClass =
    !papers || papers <= 0 ? "form__input--incomplete" : "";
  const validOperationClass = !operation ? "form__input--incomplete" : "";

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className="form" onSubmit={onSaveTransactionClicked}>
        <div className="form__title-row">
          <h2>Add a New Transaction</h2>
        </div>
        <label className="form__label" htmlFor="transactionTicker">
          Stock Ticker:
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
          Stock Price:
        </label>
        <input
          className={`form__input ${validPriceClass}`}
          type="number"
          id="transactionPrice"
          name="transactionPrice"
          value={price}
          onChange={onPriceChanged}
        />
        <label className="form__label" htmlFor="transactionPapers">
          Papers:
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
        </div>
      </form>
    </>
  );

  return content;
};
export default AddTransactionForm;
