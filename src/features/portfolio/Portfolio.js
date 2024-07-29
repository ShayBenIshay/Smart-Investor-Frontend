import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectAllPortfolioItems } from "./portfolioSlice";
import { useGetTransactionsQuery } from "../transactions/transactionsApiSlice";
import "./Portfolio.css";

const Portfolio = () => {
  const dispatch = useDispatch();
  const portfolio = useSelector(selectAllPortfolioItems);

  // Trigger the portfolio calculation when transactions data changes
  const { data: transactions, isFetching, isError } = useGetTransactionsQuery();

  useEffect(() => {
    if (transactions) {
      console.log("Transactions fetched:", transactions);
    }
  }, [transactions, dispatch]);

  useEffect(() => {
    console.log("Calculated portfolio:", portfolio);
  }, [portfolio]);

  if (isFetching) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching transactions.</div>;
  }

  return (
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
          {portfolio.map((item) => (
            <tr key={item.ticker}>
              <td>{item.ticker}</td>
              <td>{item.papers}</td>
              <td>{item.avgBuyPrice.toFixed(2)}</td>
              <td>{item.currentPrice?.toFixed(2) || "N/A"}</td>
              <td>{item.profitPercentage?.toFixed(2) || "N/A"}%</td>
              <td>{item.totalAssetProfit?.toFixed(2) || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Portfolio;
