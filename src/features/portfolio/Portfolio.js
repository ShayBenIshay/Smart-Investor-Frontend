import React from "react";
import { useSelector } from "react-redux";
import useAuth from "../../hooks/useAuth";
import { useGetPreviousClosesQuery } from "../polygon/previousClosesApiSlice";
import { selectAllPortfolioItems } from "./portfolioSlice";
import "./Portfolio.css";

const Portfolio = () => {
  const allPortfolioItems = useSelector(selectAllPortfolioItems);
  const { username } = useAuth();
  const filteredPortfolio = allPortfolioItems.filter(
    (portfolioItem) => portfolioItem.username === username
  );

  const {
    data: { entities },
  } = useGetPreviousClosesQuery("previousClosesList");
  const portfolio = filteredPortfolio.map((item) => {
    const tickerData = Object.values(entities).find(
      (data) => data.ticker === item.ticker
    );
    const currentPrice = tickerData.previousClose.close;
    const profitPercentage = 100 * (currentPrice / item.avgBuyPrice - 1);
    const totalAssetProfit = (currentPrice - item.avgBuyPrice) * item.papers;
    return {
      ...item,
      currentPrice,
      profitPercentage,
      totalAssetProfit,
    };
  });

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
          {portfolio.map((portfolioItem) => {
            let profitLossClass =
              portfolioItem.profitPercentage > 0
                ? "profit"
                : portfolioItem.profitPercentage < 0
                ? "loss"
                : "";

            return (
              <tr key={portfolioItem.ticker}>
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
  );
};

export default Portfolio;
