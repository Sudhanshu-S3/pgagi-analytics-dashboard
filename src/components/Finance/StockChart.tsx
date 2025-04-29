import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface StockChartProps {
  data: any;
}

const StockChart: React.FC<StockChartProps> = ({ data }) => {
  // Early return if no data
  if (!data || !data.chartData) {
    return (
      <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        No chart data available
      </div>
    );
  }

  // Prepare chart data
  const chartData = {
    labels: data.chartData.labels || [],
    datasets: [
      {
        label: `Market Trend`,
        data: data.chartData.values || [],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="h-64 relative">
      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              ticks: {
                color: document.documentElement.classList.contains("dark")
                  ? "rgba(255, 255, 255, 0.7)"
                  : undefined,
              },
              grid: {
                color: document.documentElement.classList.contains("dark")
                  ? "rgba(255, 255, 255, 0.1)"
                  : undefined,
              },
            },
            x: {
              ticks: {
                color: document.documentElement.classList.contains("dark")
                  ? "rgba(255, 255, 255, 0.7)"
                  : undefined,
                maxRotation: 0,
                maxTicksLimit: 8,
              },
              grid: {
                color: document.documentElement.classList.contains("dark")
                  ? "rgba(255, 255, 255, 0.1)"
                  : undefined,
              },
            },
          },
          plugins: {
            legend: {
              labels: {
                color: document.documentElement.classList.contains("dark")
                  ? "rgba(255, 255, 255, 0.7)"
                  : undefined,
              },
            },
            tooltip: {
              backgroundColor: document.documentElement.classList.contains(
                "dark"
              )
                ? "rgba(0, 0, 0, 0.8)"
                : undefined,
              titleColor: document.documentElement.classList.contains("dark")
                ? "rgba(255, 255, 255, 0.9)"
                : undefined,
              bodyColor: document.documentElement.classList.contains("dark")
                ? "rgba(255, 255, 255, 0.9)"
                : undefined,
            },
          },
        }}
      />
    </div>
  );
};

export default StockChart;
