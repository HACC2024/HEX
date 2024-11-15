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
            // Function to parse MM/DD/YYYY date strings
            const isValidDateFormat = (str: string): boolean => {
                // Check if the string contains a valid date in MM/DD/YYYY format
                return /\d{2}\/\d{2}\/\d{4}/.test(str);
            };

            const parseDate = (str: string): Date => {
                // Extract the date portion (MM/DD/YYYY) from the string
                const dateMatch = str.match(/\d{2}\/\d{2}\/\d{4}/);
                if (dateMatch) {
                    const [month, day, year] = dateMatch[0].split('/').map(Number);
                    return new Date(year, month - 1, day); // month is 0-based in JS Date
                }
                return new Date(); // fallback to current date if no match
            };

            // Compare function for sorting dates or strings
            const compareValues = (a: string, b: string): number => {
                // For date strings, compare the full dates
                if (isValidDateFormat(a) && isValidDateFormat(b)) {
                    const dateA = parseDate(a);
                    const dateB = parseDate(b);
                    return dateA.getTime() - dateB.getTime();
                }
                // Fall back to string comparison if not dates
                return a.localeCompare(b);
            };

            // Maintain original data order based on X-axis values, with proper date handling
            const orderedData = React.useMemo(() => {
                return [...data].map((item, index) => ({
                    ...item,
                    originalIndex: index,
                    sortKey: item.name,
                    dateValue: isValidDateFormat(item.name) ? parseDate(item.name) : null
                }));
            }, [data]);

            const commonProps = {
                width: "100%",
                height: 400,
            };

            const getTickInterval = (dataLength: number) => {
                if (dataLength <= 5) return 0;
                if (dataLength <= 10) return 1;
                if (dataLength <= 20) return 2;
                return Math.floor(dataLength / 10);
            };

            const formatXAxisTick = (value: string) => {
                if (!value) return "";
                if (value.length <= 20) return value;
                return `${value.substring(0, 17)}...`;
            };

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

            const transformScatterData = (data: ChartData[]): ScatterData[] => {
                return data.map(item => ({
                    x: parseFloat(item.name) || 0, // Convert name to number for x-axis
                    y: item.value, // Use value for y-axis
                    originalX: item.name, // Keep original value for tooltip
                    originalY: item.value,
                    name: item.name
                }));
            };

            const renderChart = () => {
                switch (options.type) {
                    case "Pie":
                        // Sort data chronologically
                        const pieData = [...orderedData].sort((a, b) =>
                            compareValues(a.sortKey, b.sortKey)
                        );
                        return (
                            <ResponsiveContainer {...commonProps}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        label={false}
                                    >
                                        {pieData.map((entry) => (
                                            <Cell
                                                key={`cell-${entry.originalIndex}`}
                                                fill={
                                                    options.colors[entry.name] ||
                                                    `hsl(${(entry.originalIndex * 360) / data.length}, 70%, 50%)`
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
                                                payload={pieData.map((entry) => ({
                                                    value: entry.name,
                                                    dataValue: entry.value,
                                                    color:
                                                        options.colors[entry.name] ||
                                                        `hsl(${(entry.originalIndex * 360) / data.length}, 70%, 50%)`,
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
                        // Sort data chronologically
                        const barData = [...orderedData].sort((a, b) =>
                            compareValues(a.sortKey, b.sortKey)
                        );
                        return (
                            <ResponsiveContainer {...commonProps}>
                                <BarChart
                                    data={barData}
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
                                        verticalAlign="bottom"
                                        height={36}
                                        wrapperStyle={{
                                            paddingTop: "40px",
                                        }}
                                    />
                                    <Bar dataKey="value" maxBarSize={60}>
                                        {barData.map((entry) => (
                                            <Cell
                                                key={`cell-${entry.originalIndex}`}
                                                fill={
                                                    options.colors[entry.name] ||
                                                    `hsl(${(entry.originalIndex * 360) / data.length}, 70%, 50%)`
                                                }
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        );

                    case "Line":
                        // Sort data chronologically
                        const lineData = [...orderedData].sort((a, b) =>
                            compareValues(a.sortKey, b.sortKey)
                        );
                        return (
                            <ResponsiveContainer {...commonProps}>
                                <LineChart
                                    data={lineData}
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
                                        verticalAlign="bottom"
                                        height={36}
                                        wrapperStyle={{
                                            paddingTop: "40px",
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
                        const scatterData = transformScatterData(data);
                        return (
                            <ResponsiveContainer width="100%" height={400}>
                                <ScatterChart margin={{ top: 20, right: 20, bottom: 90, left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis
                                        type="number"
                                        dataKey="x"
                                        name={options.xAxisField}
                                        tick={{ fontSize: 10, fill: "#666" }}
                                        label={{
                                            value: options.xAxisField,
                                            position: "insideBottom",
                                            offset: -10,
                                            style: { textAnchor: "middle" },
                                        }}
                                    />
                                    <YAxis
                                        type="number"
                                        dataKey="y"
                                        name={options.yAxisField}
                                        tick={{ fontSize: 10, fill: "#666" }}
                                        label={{
                                            value: options.yAxisField,
                                            angle: -90,
                                            position: "insideLeft",
                                            offset: -10,
                                            style: { textAnchor: "middle" },
                                        }}
                                    />
                                    <Tooltip
                                        cursor={{ strokeDasharray: "3 3" }}
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const point = payload[0].payload as ScatterData;
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
                                        verticalAlign="bottom"
                                        height={36}
                                        wrapperStyle={{ paddingTop: "40px" }}
                                    />
                                    <Scatter name="Data Points" data={scatterData} fill="#8884d8">
                                        {scatterData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    options.colors[entry.name] ||
                                                    `hsl(${(index * 360) / data.length}, 70%, 50%)`
                                                }
                                            />
                                        ))}
                                    </Scatter>
                                </ScatterChart>
                            </ResponsiveContainer>
                        );

                    default:
                        return (
                            <div className="text-center p-4">
                                <p className="text-muted">Please select a chart type to begin</p>
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