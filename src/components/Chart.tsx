import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

export type ChartData = {
  name: string;
  [key: string]: string | number;
};

type ChartType = "line" | "bar" | "area";

interface ChartProps {
  data: ChartData[];
  type?: ChartType;
  dataKeys: string[];
  colors?: string[];
  height?: number;
  width?: string;
  title?: string;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  className?: string;
}

export const Chart: React.FC<ChartProps> = ({
  data,
  type = "line",
  dataKeys,
  colors = ["#1E3A8A", "#9333EA", "#F59E0B", "#10B981", "#EF4444"],
  height = 300,
  width = "100%",
  title,
  showGrid = true,
  showTooltip = true,
  showLegend = true,
  className = "",
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const renderChart = () => {
    const commonProps = {
      width: 500,
      height,
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    };

    switch (type) {
      case "bar":
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey="name" />
            <YAxis />
            {showTooltip && <Tooltip />}
            {showLegend && <Legend />}
            {dataKeys.map((key, index) => (
              <Bar
                key={`bar-${key}`}
                type="monotone"
                dataKey={key}
                fill={colors[index % colors.length]}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                animationDuration={1000}
              />
            ))}
          </BarChart>
        );
      case "area":
        return (
          <AreaChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey="name" />
            <YAxis />
            {showTooltip && <Tooltip />}
            {showLegend && <Legend />}
            {dataKeys.map((key, index) => (
              <Area
                key={`area-${key}`}
                type="monotone"
                dataKey={key}
                fill={colors[index % colors.length]}
                stroke={colors[index % colors.length]}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                animationDuration={1000}
              />
            ))}
          </AreaChart>
        );
      default:
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey="name" />
            <YAxis />
            {showTooltip && <Tooltip />}
            {showLegend && <Legend />}
            {dataKeys.map((key, index) => (
              <Line
                key={`line-${key}`}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                activeDot={{ r: 8 }}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                strokeWidth={activeIndex === index ? 3 : 2}
                animationDuration={1000}
              />
            ))}
          </LineChart>
        );
    }
  };

  return (
    <div className={`chart-container ${className}`}>
      {title && (
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
          {title}
        </h3>
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <ResponsiveContainer width={width} height={height}>
          {renderChart()}
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default Chart;
