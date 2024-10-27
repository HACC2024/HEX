/* eslint-disable @typescript-eslint/no-explicit-any */
// components/CsvReader.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import Papa from "papaparse";
import { ChartComponent } from "./Chart";
import { FilterPanel } from "./FilterPanel";
import { DataTable } from "./Datatable";
import { ChartOptionsPanel } from "./ChartOptionsPanels";
import InstructionsModal from "./InstructionsModal";
import {
  processChartData,
  applyFilters,
  exportChartAsPNG,
  exportFilteredData,
} from "./chartUtils";
import { CsvRow, ChartOptions, FilterState } from "./types";

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
  const chartRef = useRef<HTMLDivElement>(null);
  const [delimiter, setDelimiter] = useState<string>(",");

  const [chartOptions, setChartOptions] = useState<ChartOptions>({
    title: "Data Visualization",
    colors: {},
    type: "Bar",
    xAxisField: "",
    yAxisField: "",
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setError("Please upload a valid CSV file");
      return;
    }

    setLoading(true);

    // Use the selected delimiter directly instead of trying to detect it
    Papa.parse(file, {
      header: true,
      skipEmptyLines: false,
      delimiter: delimiter, // Use the delimiter from state
      transformHeader: (header: string) => header.trim(),
      transform: (value: string) => {
        if (value === undefined || value === null) {
          return "";
        }
        return value.toString().trim();
      },
      complete: (result) => {
        setLoading(false);

        // Check if we got any data
        if (!result.data || result.data.length === 0) {
          setError("No data found in the CSV file");
          return;
        }

        // Check if we got more than one column
        if (Object.keys(result.data[0] || {}).length <= 1) {
          // If parsing failed with the selected delimiter, try auto-detecting
          const reader = new FileReader();
          reader.onload = (e) => {
            const content = e.target?.result as string;
            const firstLine = content.split("\n")[0];
            const possibleDelimiters = [",", ";", "\t", "|"];
            const detectedDelimiter = possibleDelimiters.find(
              (d) => (firstLine.match(new RegExp(d, "g")) || []).length > 0
            );

            if (detectedDelimiter && detectedDelimiter !== delimiter) {
              setDelimiter(detectedDelimiter);
              // Re-parse with detected delimiter
              Papa.parse(file, {
                header: true,
                skipEmptyLines: false,
                transformHeader: (header: string) => header.trim(),
                transform: (value: string) => {
                  if (value === undefined || value === null) {
                    return "";
                  }
                  return value.toString().trim();
                },
                delimiter: detectedDelimiter,
                complete: (newResult) => {
                  handleParseComplete(newResult);
                },
              });
            } else {
              setError(
                "Unable to parse CSV file correctly. Please check the file format or try a different delimiter."
              );
            }
          };
          reader.readAsText(file);
          return;
        }

        handleParseComplete(result);
      },
      error: (err) => {
        setLoading(false);
        setError(`Error parsing CSV: ${err.message}`);
      },
    });

    setCsvFileName(file.name);
  };

  // Separate function to handle successful parse
  const handleParseComplete = (result: Papa.ParseResult<any>) => {
    // Filter out completely empty rows
    const parsedData = (result.data as CsvRow[]).filter((row) => {
      return Object.values(row).some(
        (value) =>
          value !== undefined &&
          value !== null &&
          value.toString().trim() !== ""
      );
    });

    if (parsedData.length === 0) {
      setError("No valid data found in the CSV file");
      return;
    }

    setData(parsedData);
    setFilteredData(parsedData);
    setActiveFilters([]);
    setError(null);

    if (parsedData.length > 0) {
      const fields = Object.keys(parsedData[0]);
      setChartOptions((prev) => ({
        ...prev,
        xAxisField: fields[0],
        yAxisField:
          fields.find((field) => {
            const value = parsedData[0][field];
            return value !== undefined &&
              value !== null &&
              value.toString().trim() !== ""
              ? !isNaN(Number(value))
              : false;
          }) ||
          fields[1] ||
          "",
      }));
    }
  };

  const availableFields = Object.keys(data[0] || {});

  useEffect(() => {
    setFilteredData(applyFilters(data, activeFilters));
  }, [data, activeFilters]);

  const addFilter = () => {
    if (!currentFilter.field) return;
    setActiveFilters((prev) => [
      ...prev,
      { ...currentFilter, id: Date.now().toString() },
    ]);
    setCurrentFilter({
      field: "",
      operator: "is equal to",
      value: "",
    });
  };

  const removeFilter = (filterId: string) => {
    setActiveFilters((prev) => prev.filter((f) => f.id !== filterId));
  };

  const handleExportChart = () => {
    exportChartAsPNG(chartRef, chartOptions.title);
  };

  const handleExportFilteredData = () => {
    exportFilteredData(filteredData, csvFileName);
  };

  const startOver = () => {
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
      fileInputRef.current.value = "";
    }
  };

  const processedChartData = processChartData(filteredData, chartOptions);

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title mb-0">HEX CSV Data Visualizer and Cleaner</h5>
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
                <div className="mb-3 mt-3">
                  <small className="form-label ms-1" style={{ textAlign: "left", display: "block" }}>CSV Delimiter</small>
                  <div className="alert alert-info py-2">
                    <div className="d-flex align-items-center">
                      <span className="badge bg-primary me-2">Current</span>
                      <span className="font-monospace">
                        {delimiter === ","
                          ? "Comma (,)"
                          : delimiter === ";"
                          ? "Semicolon (;)"
                          : delimiter === "\t"
                          ? "Tab"
                          : delimiter === "|"
                          ? "Pipe (|)"
                          : "Default: Comma (,)"}
                      </span>
                    </div>
                  </div>
                </div>
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
        <div className="row">
          <div className="col-md-4">
            <FilterPanel
              activeFilters={activeFilters}
              availableFields={availableFields}
              currentFilter={currentFilter}
              onFilterChange={setCurrentFilter}
              onAddFilter={addFilter}
              onRemoveFilter={removeFilter}
              onExportFiltered={handleExportFilteredData}
            />

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
              onExport={handleExportChart}
            />

            <DataTable data={filteredData} />

            <InstructionsModal
              show={showInstructions}
              onClose={() => setShowInstructions(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CsvReader;
