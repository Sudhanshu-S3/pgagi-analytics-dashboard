import React from "react";
import styles from "./DashboardChart.module.scss";

interface DashboardChartProps {
  title: string;
  data: number[];
}

const DashboardChart: React.FC<DashboardChartProps> = ({ title, data }) => {
  // This is a placeholder for a real chart component
  const maxValue = Math.max(...data);

  return (
    <div className={styles.chart}>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="flex h-40 items-end">
        {data.map((value, index) => (
          <div
            key={index}
            className="bg-primary mx-1 rounded-t-md"
            style={{
              height: `${(value / maxValue) * 100}%`,
              width: "20px",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardChart;
