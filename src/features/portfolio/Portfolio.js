import React from "react";
import useAuth from "../../hooks/useAuth";
import { useGetPreviousClosesQuery } from "../polygon/previousClosesApiSlice";
import { useGetTransactionsQuery } from "../transactions/transactionsApiSlice";
import "./Portfolio.css";
import { Link } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import useTitle from "../../hooks/useTitle";
import PortfolioPieChart from "./PortfolioPieChart";
import PortfolioTable from "./PortfolioTable";
import PortfolioBarChart from "./PortfolioBarChart";
import Wallet from "../wallet/Wallet";
import { useGetUsersQuery } from "../users/usersApiSlice";

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
  const {
    data: users,
    isLoading: isUsersLoading,
    isSuccess: isUsersSuccess,
    isError: isUsersError,
    error: usersError,
  } = useGetUsersQuery("usersList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
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
        const { stock, papers, operation } = transaction;
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
        acc[id].papers += operation === "Buy" ? papers : -papers;
        acc[id].totalSpent +=
          operation === "Buy"
            ? papers * price
            : -acc[id].papers * acc[id].avgBuyPrice;

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

    let liquid = 0;
    if (isUsersSuccess) {
      const { entities } = users;
      for (const key in entities) {
        if (entities[key].username === username) {
          liquid = entities[key].wallet > 0 ? entities[key].wallet : 0;
        }
      }
    }
    let totalHoldings = liquid;
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
        const dailyProfit =
          tickerData.previousClose.close - tickerData.previousClose.open;
        const dailyProfitPercentage =
          (dailyProfit / tickerData.previousClose.open) * 100;
        totalHoldings += portfolioRow.totalSpent;
        return [
          key,
          {
            ...portfolioRow,
            currentPrice,
            profitPercentage,
            totalAssetProfit,
            dailyProfitPercentage,
          },
        ];
      })
    );
    const totals = {
      ticker: "TOTAL",
      papers: 0,
      totalSpent: 0,
      totalSellPrice: 0,
    };
    Object.entries(portfolioTable).map(([key, portfolioItem]) => {
      // totals.papers += portfolioItem.papers;
      totals.totalSpent += portfolioItem.totalSpent;
      totals.totalSellPrice +=
        portfolioItem.currentPrice * portfolioItem.papers;
    });
    // totals.avgBuyPrice = totals.totalSpent / totals.papers;
    // totals.currentPrice = totals.totalSellPrice / totals.papers;
    totals.profitPercentage =
      ((totals.totalSellPrice - totals.totalSpent) / totals.totalSpent) * 100;
    totals.totalAssetProfit = totals.totalSellPrice - totals.totalSpent;
    // const tableWithTotals =
    //   Object.keys(portfolioTable).length > 1
    //     ? {
    //         ...portfolioTable,
    //         Totals: totals,
    //       }
    //     : portfolioTable;

    content = Object.keys(portfolioTable).length ? (
      <div className="portfolio-container">
        <div className="portfolio-header">
          <Wallet />
          <article>
            <h4>Total</h4>
            <p>{`Profit/Loss (%): ${totals.profitPercentage.toFixed(2)}`}</p>
            <p>{`Profit/Loss ($): ${totals.totalAssetProfit.toFixed(2)}`}</p>
          </article>
        </div>
        <div className="portfolio-table">
          <h3>Your Porfolio</h3>
          <PortfolioTable portfolio={portfolioTable} />
        </div>
        <div>
          <h2 className="portfolio-title">Portfolio Charts</h2>
          <div className="portfolio-charts-container">
            <PortfolioBarChart portfolio={portfolioTable} />
            <PortfolioPieChart
              portfolio={portfolioTable}
              totalHoldings={totalHoldings}
              liquid={liquid}
            />
          </div>
        </div>
      </div>
    ) : (
      <>
        <Wallet />
        {noTransactions}
      </>
    );
  }

  return content;
};

export default Portfolio;
