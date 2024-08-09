import React from "react";

const PortfolioTable = ({ portfolio }) => {
  return (
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
        {Object.entries(portfolio).map(([ticker, portfolioItem]) => {
          let profitLossClass =
            portfolioItem.profitPercentage > 0
              ? "profit"
              : portfolioItem.profitPercentage < 0
              ? "loss"
              : "";

          return (
            <tr key={ticker}>
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
  );
};

export default PortfolioTable;
