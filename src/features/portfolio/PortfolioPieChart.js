import { PieChart } from "react-minimal-pie-chart";
import "./Portfolio.css";
import { useState, useMemo } from "react";

const colors = [
  "#E38627",
  "#C13C37",
  "#6A2135",
  "#8BC34A",
  "#3498DB",
  "#9B59B6",
  "#34495E",
  "#F1C40F",
  "#E74C3C",
  "#1ABC9C",
  "#2ECC71",
  "#D35400",
  "#7F8C8D",
  "#2980B9",
  "#9B59B6",
  "#16A085",
  "#F39C12",
  "#2C3E50",
  "#95A5A6",
  "#27AE60",
];

const PortfolioPieChart = ({ portfolio, totalHoldings }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [clickedIndex, setClickedIndex] = useState(null);

  const chartData = useMemo(() => {
    let colorIndex = 0;
    return Object.entries(portfolio).map(([key, portfolioItem]) => ({
      title: portfolioItem.ticker,
      value: (portfolioItem.totalSpent / totalHoldings) * 100,
      color: colors[colorIndex++ % colors.length],
    }));
  }, [portfolio, totalHoldings]);

  const handleMouseOver = (event, index) => {
    setHoveredIndex(index);
  };

  const handleMouseOut = () => {
    setHoveredIndex(null);
  };

  const handleClick = (event, index) => {
    setClickedIndex(index === clickedIndex ? null : index);
  };

  return (
    <div className="pie-chart-container">
      <PieChart
        data={chartData}
        animate
        animationDuration={500}
        animationEasing="ease-out"
        center={[50, 50]}
        radius={35}
        label={({ dataEntry }) =>
          `${dataEntry.title}: ${dataEntry.value.toFixed(2)}%`
        }
        labelPosition={70}
        labelStyle={{
          fontSize: "5px",
          fill: "#fff",
          textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
        }}
        segmentsShift={(index) => (index === clickedIndex ? 5 : 0)}
        segmentsStyle={(index) => {
          return {
            fill: index === hoveredIndex ? "gray" : chartData[index].color,
            cursor: "pointer",
            transition: "fill 0.3s, transform 0.3s",
          };
        }}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        onClick={handleClick}
      />
    </div>
  );
};

export default PortfolioPieChart;
