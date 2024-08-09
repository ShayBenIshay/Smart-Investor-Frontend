import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";

export default function PortfolioBarChart({ portfolio }) {
  console.log(Object.entries(portfolio));
  const tickers = Object.entries(portfolio).map(([ticker, portfolioItem]) => {
    return ticker;
  });
  console.log(tickers);
  const percentages = Object.entries(portfolio).map(([_, portfolioItem]) => {
    return portfolioItem.profitPercentage.toFixed(2);
  });
  const series = [{ data: percentages }];

  return (
    <div className="bar-chart-container">
      <BarChart
        height={300}
        width={300}
        grid={{ horizontal: true }}
        series={series}
        margin={{
          top: 10,
          bottom: 20,
        }}
        yAxis={[
          {
            colorMap: {
              type: "piecewise",
              thresholds: [0],
              colors: ["red", "green"],
            },
          },
        ]}
        xAxis={[
          {
            scaleType: "band",
            data: tickers,
            colorMap: {
              type: "piecewise",
              thresholds: [new Date(2021, 1, 1), new Date(2023, 1, 1)],
              colors: ["blue", "red", "blue"],
            },
          },
        ]}
      />
    </div>
  );
}
