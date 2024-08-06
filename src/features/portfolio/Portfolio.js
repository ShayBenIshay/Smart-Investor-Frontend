import React from "react";
import useAuth from "../../hooks/useAuth";
import { useGetPreviousClosesQuery } from "../polygon/previousClosesApiSlice";
import { useGetTransactionsQuery } from "../transactions/transactionsApiSlice";
import "./Portfolio.css";
import { Link } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import useTitle from "../../hooks/useTitle";

const Portfolio = () => {
  useTitle("SmartInvestor: Portfolio");

  const { username } = useAuth();
  const {
    data: transactions,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetTransactionsQuery("transactionsList", {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  const {
    data: prevClose,
    isLoading: isPrevLoading,
    isSuccess: isPrevSuccess,
    isError: isPrevError,
    error: prevError,
  } = useGetPreviousClosesQuery("previousClosesList");

  let content;

  if (isLoading || isPrevLoading) content = <PulseLoader color={"#000"} />;
  if (isError || isPrevError) {
    content = (
      <>
        {isError && <p className="errmsg">{error?.data?.message}</p>}
        {isPrevError && <p className="errmsg">{prevError?.data?.message}</p>}
      </>
    );
  }
  if (isSuccess && isPrevSuccess) {
    const { entities } = transactions;
    const { entities: prevEntities } = prevClose;
    const transactionsArr = Object.values(entities);
    const filteredPortfolio = transactionsArr
      .filter((transaction) => transaction.username === username)
      .reduce((acc, transaction) => {
        const { stock, papers } = transaction;
        const { ticker, price } = stock;
        const id = ticker;
        if (!acc[id]) {
          acc[id] = {
            username,
            ticker,
            papers: 0,
            totalSpent: 0,
            avgBuyPrice: 0,
          };
        }
        acc[id].papers += papers;
        acc[id].totalSpent += papers * price;
        acc[id].avgBuyPrice = acc[id].totalSpent / acc[id].papers;
        return acc;
      }, {});

    const noTransactions = (
      <>
        <p>
          You have no Stocks holdings registered to the system. Add
          Trasnasctions first.
        </p>
        <Link to="/dash/transactions/new">Add Transaction</Link>
      </>
    );

    const portfolioTable = Object.fromEntries(
      Object.entries(filteredPortfolio).map(([key, portfolioRow]) => {
        const tickerData = Object.values(prevEntities).find(
          (data) => data.ticker === portfolioRow.ticker
        );
        const currentPrice = tickerData.previousClose.close;
        const profitPercentage =
          100 * (currentPrice / portfolioRow.avgBuyPrice - 1);
        const totalAssetProfit =
          (currentPrice - portfolioRow.avgBuyPrice) * portfolioRow.papers;

        return [
          key,
          {
            ...portfolioRow,
            currentPrice,
            profitPercentage,
            totalAssetProfit,
          },
        ];
      })
    );

    content = Object.keys(portfolioTable).length ? (
      <div className="portfolio">
        <h3>Your Porfolio</h3>
        <p>in development</p>
        <table>
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Papers</th>
              <th>Avg Buy Price</th>
              <th>Current Price</th>
              <th>Profit Percentage</th>
              <th>Total Asset Profit</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(portfolioTable).map(([key, portfolioItem]) => {
              let profitLossClass =
                portfolioItem.profitPercentage > 0
                  ? "profit"
                  : portfolioItem.profitPercentage < 0
                  ? "loss"
                  : "";

              return (
                <tr key={key}>
                  <td>{portfolioItem.ticker}</td>
                  <td>{portfolioItem.papers}</td>
                  <td>{portfolioItem.avgBuyPrice.toFixed(2)}</td>
                  <td>{portfolioItem.currentPrice?.toFixed(2) || "N/A"}</td>
                  <td className={profitLossClass}>
                    {portfolioItem.profitPercentage?.toFixed(2) || "N/A"}%
                  </td>
                  <td className={profitLossClass}>
                    {portfolioItem.totalAssetProfit?.toFixed(2) || "N/A"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    ) : (
      noTransactions
    );
  }

  return content;
};

export default Portfolio;
