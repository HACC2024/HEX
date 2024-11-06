"use client";

import React from "react";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ChartData, ChartOptions, ScatterData } from "./types";
import { CustomLegend } from "./CustomLegend";

interface ChartComponentProps {
  data: ChartData[];
  options: ChartOptions;
  onExport: () => void;
}

export const ChartComponent = React.memo(
  React.forwardRef<HTMLDivElement, ChartComponentProps>(
    ({ data, options, onExport }, ref) => {
      const commonProps = {
        width: "100%",
        height: 400,
      };

      // Calculate dynamic width based on number of data points
      const getTickInterval = (dataLength: number) => {
        if (dataLength <= 5) return 0; // Show all ticks for 5 or fewer items
        if (dataLength <= 10) return 1; // Show every other tick for 6-10 items
        if (dataLength <= 20) return 2; // Show every third tick for 11-20 items
        return Math.floor(dataLength / 10); // Show ~10 ticks for larger datasets
      };

      // Format long x-axis labels
      const formatXAxisTick = (value: string) => {
        if (!value) return "";
        if (value.length <= 20) return value;
        return `${value.substring(0, 17)}...`;
      };

      // Calculate dynamic text rotation based on label length
      const calculateXAxisAngle = (data: ChartData[]) => {
        const maxLength = Math.max(...data.map((item) => item.name.length));
        if (maxLength <= 10) return 0;
        if (maxLength <= 15) return 30;
        return -20;
      };

      const xAxisConfig = {
        dataKey: "name",
        angle: calculateXAxisAngle(data),
        textAnchor: "end",
        tickFormatter: formatXAxisTick,
        interval: getTickInterval(data.length),
        height: 70,
        tick: {
          fontSize: 10,
          fill: "#666",
        },
        padding: { left: 20, right: 20 },
        label: {
          value: options.xAxisField,
          position: "insideBottom",
          offset: -10,
          style: { textAnchor: "middle" },
        },
      };

      const yAxisConfig = {
        tickFormatter: (value: number) => {
          if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
          if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
          if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
          return value.toFixed(1);
        },
        tick: {
          fontSize: 10,
          fill: "#666",
        },
        width: 80,
        label: {
          value: options.yAxisField,
          angle: -90,
          position: "insideLeft",
          offset: -10,
          style: { textAnchor: "middle" },
        },
      };

      const renderChart = () => {
        switch (options.type) {
          case "Pie":
            return (
              <ResponsiveContainer {...commonProps}>
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    label={false}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          options.colors[entry.name] ||
                          `hsl(${(index * 360) / data.length}, 70%, 50%)`
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [
                      `${value.toFixed(2)}`,
                      options.yAxisField,
                    ]}
                  />
                  <Legend
                    content={
                      <CustomLegend
                        payload={data.map((entry, index) => ({
                          value: entry.name,
                          dataValue: entry.value,
                          color:
                            options.colors[entry.name] ||
                            `hsl(${(index * 360) / data.length}, 70%, 50%)`,
                        }))}
                        xAxisField={options.xAxisField}
                        yAxisField={options.yAxisField}
                      />
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            );

          case "Bar":
            return (
              <ResponsiveContainer {...commonProps}>
                <BarChart
                  data={data}
                  margin={{ top: 20, right: 20, bottom: 90, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis {...xAxisConfig} />
                  <YAxis {...yAxisConfig} />
                  <Tooltip
                    formatter={(value: number) => [
                      `${value.toFixed(2)}`,
                      options.yAxisField,
                    ]}
                    labelStyle={{ color: "#666" }}
                  />
                  <Legend
                    content={
                      <CustomLegend
                        payload={[
                          {
                            value: `${options.xAxisField} vs ${options.yAxisField}`,
                            dataValue: data.length,
                            color: "#8884d8",
                          },
                        ]}
                        xAxisField={options.xAxisField}
                        yAxisField={options.yAxisField}
                      />
                    }
                    verticalAlign="bottom" // Position legend at bottom
                    height={36} // Fixed height for legend
                    wrapperStyle={{
                      paddingTop: "40px", // Add padding above legend
                    }}
                  />
                  <Bar dataKey="value" maxBarSize={60}>
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          options.colors[entry.name] ||
                          `hsl(${(index * 360) / data.length}, 70%, 50%)`
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            );

          case "Line":
            return (
              <ResponsiveContainer {...commonProps}>
                <LineChart
                  data={data}
                  margin={{ top: 20, right: 20, bottom: 90, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis {...xAxisConfig} />
                  <YAxis {...yAxisConfig} />
                  <Tooltip
                    formatter={(value: number) => [
                      `${value.toFixed(2)}`,
                      options.yAxisField,
                    ]}
                    labelStyle={{ color: "#666" }}
                  />
                  <Legend
                    content={
                      <CustomLegend
                        payload={[
                          {
                            value: `${options.xAxisField} vs ${options.yAxisField}`,
                            dataValue: data.length,
                            color: "#8884d8",
                          },
                        ]}
                        xAxisField={options.xAxisField}
                        yAxisField={options.yAxisField}
                      />
                    }
                    verticalAlign="bottom" // Position legend at bottom
                    height={36} // Fixed height for legend
                    wrapperStyle={{
                      paddingTop: "40px", // Add padding above legend
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            );

          case "Scatter":
            return (
              <ResponsiveContainer {...commonProps}>
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 90, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name={options.xAxisField}
                    tick={{
                      fontSize: 8,
                      fill: "#666",
                    }}
                    label={{
                      value: options.xAxisField,
                      position: "insideBottom",
                      offset: -20,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name={options.yAxisField}
                    tick={{
                      fontSize: 8,
                      fill: "#666",
                    }}
                    label={{
                      value: options.yAxisField,
                      angle: -90,
                      position: "insideLeft",
                      offset: -10,
                    }}
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const point = payload[0].payload as ChartData &
                          ScatterData;
                        return (
                          <div
                            className="custom-tooltip"
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.95)",
                              padding: "8px 12px",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            }}
                          >
                            <p
                              style={{
                                margin: "0 0 4px 0",
                                fontWeight: "bold",
                              }}
                            >
                              {`${options.xAxisField}: ${point.originalX}`}
                            </p>
                            <p style={{ margin: 0, fontWeight: "bold" }}>
                              {`${options.yAxisField}: ${point.originalY}`}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    content={
                      <CustomLegend
                        payload={[
                          {
                            value: `${options.xAxisField} vs ${options.yAxisField}`,
                            dataValue: data.length,
                            color: "#8884d8",
                          },
                        ]}
                        xAxisField={options.xAxisField}
                        yAxisField={options.yAxisField}
                      />
                    }
                    verticalAlign="bottom" // Position legend at bottom
                    height={36} // Fixed height for legend
                    wrapperStyle={{
                      paddingTop: "40px", // Add padding above legend
                    }}
                  />
                  <Scatter name="Data Points" data={data} fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            );

          default:
            return (
              <div className="text-center p-4">
                <p className="text-muted">
                  Please select a chart type to begin
                </p>
              </div>
            );
        }
      };

      return (
        <div className="card mb-4" ref={ref}>
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">{options.title}</h5>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={onExport}
            >
              Export Chart
            </button>
          </div>
          <div className="card-body">{renderChart()}</div>
        </div>
      );
    }
  )
);
