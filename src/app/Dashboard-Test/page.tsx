/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {
  useEffect,
  useCallback,
  useState,
  useMemo,
  useRef,
} from "react";
import Papa from "papaparse";
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
import "bootstrap/dist/css/bootstrap.min.css";
import { X } from "lucide-react";
import InstructionsModal from "../../components/csvTool/InstructionsModal";

interface ChartData {
  name: string;
  value: number;
}

interface CsvRow {
  [key: string]: string | number;
}

interface ChartOptions {
  title: string;
  colors: { [key: string]: string };
  type: string;
  xAxisField: string;
  yAxisField: string;
}

interface FilterState {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface ScatterData {
  x: number;
  y: number;
  originalX: string | number;
  originalY: string | number;
  name: string;
}

const CHART_TYPES = ["Pie", "Bar", "Line", "Scatter"] as const;
const FILTER_OPERATORS = [
  { value: "is equal to", label: "Is Equal To" },
  { value: "is not equal to", label: "Is Not Equal To" },
  { value: "is greater than", label: "Is Greater Than" },
  { value: "is less than", label: "Is Less Than" },
  { value: "contains", label: "Contains" },
  { value: "starts with", label: "Starts With" },
  { value: "ends with", label: "Ends With" },
] as const;

const ITEMS_PER_PAGE = 10;
const MAX_DISPLAYED_ITEMS = 50;

const ChartOptionsPanel = React.memo(
  ({
    onOptionsChange,
    availableFields,
    data,
    currentOptions,
  }: {
    onOptionsChange: (options: ChartOptions) => void;
    availableFields: string[];
    data: CsvRow[];
    currentOptions: ChartOptions;
  }) => {
    const [localOptions, setLocalOptions] = useState(currentOptions);

    const uniqueCategories = useMemo(() => {
      if (!localOptions.xAxisField || !data.length) return [];
      const categories = new Map<string, number>();

      data.forEach((row) => {
        const category = row[localOptions.xAxisField]?.toString() || "";
        categories.set(category, (categories.get(category) || 0) + 1);
      });

      return Array.from(categories.entries())
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([category]) => category);
    }, [data, localOptions.xAxisField]);

    const handleChange = useCallback(
      (field: keyof ChartOptions, value: any) => {
        setLocalOptions((prev) => ({ ...prev, [field]: value }));
      },
      []
    );

    const applyChanges = useCallback(() => {
      onOptionsChange(localOptions);
    }, [localOptions, onOptionsChange]);

    return (
      <div className="card mb-4">
        <div className="card-body">
          <small className="text-muted ms-1">Chart Title</small>
          <input
            type="text"
            placeholder="Chart Title"
            value={localOptions.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="form-control mb-2"
          />
          <small className="text-muted ms-1">Chart Type</small>
          <select
            value={localOptions.type}
            onChange={(e) => handleChange("type", e.target.value)}
            className="form-select mb-2"
          >
            <option value="">Select Chart Type</option>
            {CHART_TYPES.map((type) => (
              <option key={type} value={type}>
                {type} Chart
              </option>
            ))}
          </select>

          {CHART_TYPES.includes(localOptions.type as any) && (
            <div className="mb-3">
              <small className="text-muted ms-1">X-axis</small>
              <select
                value={localOptions.xAxisField}
                onChange={(e) => handleChange("xAxisField", e.target.value)}
                className="form-select mb-2"
              >
                <option value="">Select X-axis Field</option>
                {availableFields.map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
              <small className="text-muted ms-1">Y-axis</small>
              <select
                value={localOptions.yAxisField}
                onChange={(e) => handleChange("yAxisField", e.target.value)}
                className="form-select"
              >
                <option value="">Select Y-axis Field</option>
                {availableFields.map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="mb-3">
            <div className="d-flex align-items-center mb-3">
              <h5 className="mb-0">Color Settings</h5>
              <span className="text-muted ms-2 fw-light fs-6">
                Determined by X-axis Field
              </span>
            </div>
            <div className="row g-2">
              {uniqueCategories.map((category) => (
                <div key={category} className="col-6 d-flex align-items-center">
                  <span className="text-truncate me-2">{category}</span>
                  <input
                    type="color"
                    value={localOptions.colors[category] || "#FF6384"}
                    onChange={(e) =>
                      handleChange("colors", {
                        ...localOptions.colors,
                        [category]: e.target.value,
                      })
                    }
                    style={{ width: "32px", height: "32px" }}
                  />
                </div>
              ))}
            </div>
          </div>

          <button onClick={applyChanges} className="btn btn-primary w-100">
            Apply Changes
          </button>
        </div>
      </div>
    );
  }
);

const DataTable = React.memo(({ data }: { data: CsvRow[] }) => {
  const [page, setPage] = useState(0);
  const itemsPerPage = 25;

  const paginatedData = useMemo(() => {
    const start = page * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }, [data, page]);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            {Object.keys(data[0] || {}).map((key) => (
              <th key={key} className="text-uppercase">
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, idx) => (
            <tr key={idx}>
              {Object.values(row).map((value, cellIdx) => (
                <td key={cellIdx}>{value?.toString()}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-between align-items-center p-2">
        <span className="text-muted">
          Showing {page * itemsPerPage + 1} to{" "}
          {Math.min((page + 1) * itemsPerPage, data.length)} of {data.length}{" "}
          entries
        </span>
        <div className="btn-group">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="btn btn-outline-secondary"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="btn btn-outline-secondary"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
});

const CustomLegend = React.memo(
  ({
    payload,
    yAxisField,
  }: {
    payload: any[];
    xAxisField: string;
    yAxisField: string;
  }) => {
    const [page, setPage] = useState(0);
    const totalPages = Math.ceil((payload?.length || 0) / ITEMS_PER_PAGE);
    const visibleItems =
      payload?.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE) || [];

    // Format numbers for better readability
    const formatValue = (value: number) => {
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
      return value.toFixed(1);
    };

    return (
      <div className="card">
        <div className="card-header py-2 bg-light">
          <h6 className="mb-0 text-muted">Legend</h6>
        </div>
        <div className="card-body">
          {visibleItems.length > 0 ? (
            <>
              <div className="row g-2">
                {visibleItems.map((entry, index) => (
                  <div
                    key={`legend-${index}`}
                    className="col-6 d-flex align-items-center"
                  >
                    <div
                      className="rounded-circle me-2"
                      style={{
                        backgroundColor: entry.color,
                        width: "12px",
                        height: "12px",
                      }}
                    />
                    <span className="text-truncate small">
                      {`${entry.value} (${formatValue(
                        entry.dataValue || 0
                      )} ${yAxisField})`}
                    </span>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="btn btn-sm btn-outline-secondary"
                  >
                    Previous
                  </button>
                  <span className="small">
                    Page {page + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setPage((p) => Math.min(totalPages - 1, p + 1))
                    }
                    disabled={page === totalPages - 1}
                    className="btn btn-sm btn-outline-secondary"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-muted small">
              No data to display in legend
            </div>
          )}
        </div>
      </div>
    );
  }
);

const ChartComponent = React.memo(
  React.forwardRef(
    (
      {
        data,
        options,
        onExport,
      }: {
        data: ChartData[];
        options: ChartOptions;
        onExport: () => void;
      },
      ref: React.ForwardedRef<HTMLDivElement>
    ) => {
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
        return 45;
      };

      // Common X-Axis configuration
      const xAxisConfig = {
        dataKey: "name",
        angle: calculateXAxisAngle(data),
        textAnchor: "end",
        tickFormatter: formatXAxisTick,
        interval: getTickInterval(data.length),
        height: 60,
        tick: {
          fontSize: 12,
          fill: "#666",
        },
        padding: { left: 20, right: 20 },
      };

      // Common Y-Axis configuration
      const yAxisConfig = {
        tickFormatter: (value: number) => {
          // Format large numbers with K/M/B
          if (value >= 1000000000) {
            return `${(value / 1000000000).toFixed(1)}B`;
          }
          if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M`;
          }
          if (value >= 1000) {
            return `${(value / 1000).toFixed(1)}K`;
          }
          return value.toFixed(1);
        },
        tick: {
          fontSize: 12,
          fill: "#666",
        },
        width: 80,
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
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
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
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
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
                            value: options.xAxisField,
                            dataValue: data[data.length - 1]?.value,
                            color: "#8884d8",
                          },
                        ]}
                        xAxisField={options.xAxisField}
                        yAxisField={options.yAxisField}
                      />
                    }
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
                    paddingTop: '40px' // Add padding above legend
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

const CsvReader = () => {
  const [data, setData] = useState<CsvRow[]>([]);
  const [filteredData, setFilteredData] = useState<CsvRow[]>([]);
  const [activeFilters, setActiveFilters] = useState<FilterState[]>([]);
  const [currentFilter, setCurrentFilter] = useState<Omit<FilterState, "id">>({
    field: "",
    operator: "is equal to",
    value: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [csvFileName, setCsvFileName] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [chartOptions, setChartOptions] = useState<ChartOptions>({
    title: "Data Visualization",
    colors: {},
    type: "Bar",
    xAxisField: "",
    yAxisField: "",
  });

  const chartRef = useRef<any>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv") {
      setError("Please upload a valid CSV file");
      return;
    }

    setLoading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setLoading(false);
        if (result.errors.length > 0) {
          setError(`Error parsing CSV: ${result.errors[0].message}`);
          return;
        }
        setData(result.data as CsvRow[]);
        setFilteredData(result.data as CsvRow[]);
        setActiveFilters([]);
        setError(null);

        if (result.data.length > 0) {
          const fields = Object.keys(result.data[0] as CsvRow);
          setChartOptions((prev) => ({
            ...prev,
            xAxisField: fields[0],
            yAxisField:
              fields.find((field) => {
                const value = (result.data[0] as CsvRow)[field];
                return typeof value === "string" || typeof value === "number"
                  ? !isNaN(Number(value))
                  : false;
              }) ||
              fields[1] ||
              "",
          }));
        }
      },
      error: (err) => {
        setLoading(false);
        setError(`Error parsing CSV: ${err.message}`);
      },
    });
    setCsvFileName(file.name);
  };

  const availableFields = useMemo(() => {
    return data.length > 0 ? Object.keys(data[0]) : [];
  }, [data]);

  const applyFilters = useCallback(() => {
    let filtered = [...data];

    activeFilters.forEach((filter) => {
      filtered = filtered.filter((row) => {
        const value = row[filter.field];
        const filterValue = filter.value;

        switch (filter.operator) {
          case "is equal to":
            return value?.toString() === filterValue;
          case "is not equal to":
            return value?.toString() !== filterValue;
          case "is greater than":
            return Number(value) > Number(filterValue);
          case "is less than":
            return Number(value) < Number(filterValue);
          case "contains":
            return value
              ?.toString()
              .toLowerCase()
              .includes(filterValue.toLowerCase());
          case "starts with":
            return value
              ?.toString()
              .toLowerCase()
              .startsWith(filterValue.toLowerCase());
          case "ends with":
            return value
              ?.toString()
              .toLowerCase()
              .endsWith(filterValue.toLowerCase());
          default:
            return true;
        }
      });
    });

    setFilteredData(filtered);
  }, [data, activeFilters]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const addFilter = () => {
    if (!currentFilter.field) return;

    const newFilter: FilterState = {
      ...currentFilter,
      id: Date.now().toString(),
    };

    setActiveFilters((prev) => [...prev, newFilter]);
    setCurrentFilter({
      field: "",
      operator: "is equal to",
      value: "",
    });
  };

  const removeFilter = (filterId: string) => {
    setActiveFilters((prev) => prev.filter((f) => f.id !== filterId));
  };

  const exportFilteredCsv = () => {
    const csv = Papa.unparse(filteredData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const fileName = csvFileName.replace(".csv", "_filtered.csv");

    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportChart = () => {
    if (!chartRef.current) {
      console.log("chartRef.current is null, export aborted.");
      return;
    }

    // Find the SVG element within the chart container
    const svgElement = chartRef.current.querySelector(".recharts-wrapper svg");
    if (!svgElement) {
      console.log("No SVG element found, export aborted.");
      return;
    }

    // Get the dimensions
    const svgWidth = svgElement.width.baseVal.value;
    const svgHeight = svgElement.height.baseVal.value;

    // Create a copy of the SVG
    const svgClone = svgElement.cloneNode(true) as SVGElement;

    // Set the white background
    const background = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    background.setAttribute("width", String(svgWidth));
    background.setAttribute("height", String(svgHeight));
    background.setAttribute("fill", "white");
    svgClone.insertBefore(background, svgClone.firstChild);

    // Convert SVG to string
    const svgData = new XMLSerializer().serializeToString(svgClone);

    // Create canvas
    const canvas = document.createElement("canvas");
    canvas.width = svgWidth * 2; // Multiply by 2 for better resolution
    canvas.height = svgHeight * 2;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      console.log("Failed to get canvas context, export aborted.");
      return;
    }

    // Set white background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Scale for better resolution
    ctx.scale(2, 2);

    // Create image from SVG
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      // Convert to PNG and download
      const link = document.createElement("a");
      link.download = `${chartOptions.title
        .toLowerCase()
        .replace(/\s+/g, "-")}.png`;
      link.href = canvas.toDataURL("image/png");
        link.click();
        link.click();
        console.log("Export completed, PNG downloaded.");
      link.click();
        console.log("Export completed, PNG downloaded.");
    };

    // Handle any errors
    img.onerror = (error) => {
      console.error("Error loading image:", error);
    };

    // Load the SVG data
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);
    img.src = url;

    // Clean up
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      const link = document.createElement("a");
      link.download = `${chartOptions.title
        .toLowerCase()
        .replace(/\s+/g, "-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      URL.revokeObjectURL(url);
    };
  };

  const processedChartData = useMemo(() => {
    if (
      !chartOptions.xAxisField ||
      !chartOptions.yAxisField ||
      !filteredData.length
    ) {
      return [];
    }

    if (chartOptions.type === "Scatter") {
      // Create separate scatter data array
      const scatterPoints: ScatterData[] = filteredData
        .map((row) => {
          const xValue = row[chartOptions.xAxisField];
          const yValue = row[chartOptions.yAxisField];

          const x = Number(xValue);
          const y = Number(yValue);

          if (!isNaN(x) && !isNaN(y)) {
            return {
              x,
              y,
              originalX: xValue,
              originalY: yValue,
              name: `${xValue}-${yValue}`,
            };
          }
          return null;
        })
        .filter((point): point is ScatterData => point !== null)
        .slice(0, MAX_DISPLAYED_ITEMS);

      // Convert scatter data to ChartData format for consistency
      return scatterPoints.map((point) => ({
        name: point.name,
        value: point.y,
        // Add scatter-specific properties
        x: point.x,
        y: point.y,
        originalX: point.originalX,
        originalY: point.originalY,
      })) as (ChartData & ScatterData)[];
    }

    // Original aggregation logic for other chart types
    const aggregatedData = new Map<string, number>();
    let count = 0;

    filteredData.forEach((row) => {
      const xValue = row[chartOptions.xAxisField]?.toString() || "";
      const yValue = Number(row[chartOptions.yAxisField]);

      if (aggregatedData.has(xValue)) {
        if (!isNaN(yValue)) {
          aggregatedData.set(
            xValue,
            (aggregatedData.get(xValue) || 0) + yValue
          );
        } else {
          aggregatedData.set(xValue, (aggregatedData.get(xValue) || 0) + 1);
        }
      } else if (count < MAX_DISPLAYED_ITEMS) {
        aggregatedData.set(xValue, !isNaN(yValue) ? yValue : 1);
        count++;
      }
    });

    return Array.from(aggregatedData.entries())
      .map(([name, value]) => ({
        name,
        value: Number(value.toFixed(2)),
      }))
      .sort((a, b) => b.value - a.value);
  }, [
    filteredData,
    chartOptions.xAxisField,
    chartOptions.yAxisField,
    chartOptions.type,
  ]);

  function startOver(): void {
    setCsvFileName("");
    setData([]);
    setFilteredData([]);
    setActiveFilters([]);
    setCurrentFilter({
      field: "",
      operator: "is equal to",
      value: "",
    });
    setChartOptions({
      title: "Data Visualization",
      colors: {},
      type: "Bar",
      xAxisField: "",
      yAxisField: "",
    });
    setError(null);
    setLoading(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input value
    }
  }

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title mb-0">HEX CSV Data Visualizer</h5>
                <button
                  className="btn btn-outline-info btn-sm"
                  onClick={() => {
                    if (csvFileName) {
                      setShowInstructions(true);
                    } else {
                      alert("Upload a File First");
                    }
                  }}
                >
                  {csvFileName ? "How to Use This Tool" : "Get Started!"}
                </button>
              </div>
              <div className="mb-3">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="form-control"
                  ref={fileInputRef}
                />
                {csvFileName && (
                  <div className="d-flex justify-content-between align-items-center mt-2 ms-1">
                    <small className="text-muted">
                      Current file: {csvFileName}
                    </small>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={startOver}
                    >
                      Start Over
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {loading && (
                <div className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {data.length > 0 && (
        <>
          <div className="row">
            <div className="col-md-4">
              <div className="card mb-4">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title mb-0 me-3">Filter Data</h5>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={exportFilteredCsv}
                    >
                      Export Filtered Data
                    </button>
                  </div>
                  <div className="mb-3">
                    {activeFilters.map((filter) => (
                      <div
                        key={filter.id}
                        className="badge bg-primary d-inline-flex align-items-center me-2 mb-2 p-2"
                      >
                        <span className="me-2">
                          {filter.field} {filter.operator} {filter.value}
                        </span>
                        <X
                          size={14}
                          className="cursor-pointer"
                          onClick={() => removeFilter(filter.id)}
                        />
                      </div>
                    ))}
                  </div>

                  <small className="text-muted ms-1">Field</small>
                  <select
                    value={currentFilter.field}
                    onChange={(e) =>
                      setCurrentFilter((prev) => ({
                        ...prev,
                        field: e.target.value,
                      }))
                    }
                    className="form-select mb-2"
                  >
                    <option value="">Select Field</option>
                    {availableFields.map((field) => (
                      <option key={field} value={field}>
                        {field}
                      </option>
                    ))}
                  </select>

                  <small className="text-muted ms-1">Operator</small>
                  <select
                    value={currentFilter.operator}
                    onChange={(e) =>
                      setCurrentFilter((prev) => ({
                        ...prev,
                        operator: e.target.value,
                      }))
                    }
                    className="form-select mb-2"
                  >
                    {FILTER_OPERATORS.map((op) => (
                      <option key={op.value} value={op.value}>
                        {op.label}
                      </option>
                    ))}
                  </select>

                  <div>
                    <small className="text-muted ms-1">Value</small>
                      <input
                        type="text"
                        value={currentFilter.value}
                        onChange={(e) =>
                          setCurrentFilter((prev) => ({
                            ...prev,
                            value: e.target.value,
                          }))
                        }
                        placeholder="Filter value"
                        className="form-control mb-3"
                      />
                  </div>

                  <button
                    onClick={addFilter}
                    className="btn btn-primary w-100"
                    disabled={!currentFilter.field}
                  >
                    Add Filter
                  </button>
                </div>
              </div>

              <ChartOptionsPanel
                onOptionsChange={setChartOptions}
                availableFields={availableFields}
                data={filteredData}
                currentOptions={chartOptions}
              />
            </div>

            <div className="col-md-8">
              <ChartComponent
                ref={chartRef}
                data={processedChartData}
                options={chartOptions}
                onExport={exportChart}
              />

              <DataTable data={filteredData} />
              <InstructionsModal
                show={showInstructions}
                onClose={() => setShowInstructions(false)}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CsvReader;
