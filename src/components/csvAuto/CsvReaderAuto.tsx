/* eslint-disable @typescript-eslint/no-explicit-any */
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
import "./graph.css";

interface CsvAutoProps {
  file: { [key: string]: string[] } | null;
}

const CsvAuto: React.FC<CsvAutoProps> = ({ file }) => {
  const [selectedCsvUrl, setSelectedCsvUrl] = useState<string>("");
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
  const chartRef = useRef<HTMLDivElement>(null);

  const [chartOptions, setChartOptions] = useState<ChartOptions>({
    title: "Data Visualization",
    colors: {},
    type: "Bar",
    xAxisField: "",
    yAxisField: "",
  });

  const extractFileName = (url: string): string => {
    const decodedUrl = decodeURIComponent(url);
    const parts = decodedUrl.split("/");
    const fileNameWithParams = parts.pop();
    const fileName = fileNameWithParams?.split("?")[0];
    return fileName || "";
  };

  useEffect(() => {
    if (file) {
      const firstCsvUrl = Object.keys(file)
        .filter((key) => key.toLowerCase().endsWith("csv"))
        .map((key) => file[key][0])
        .find((url) => !!url);

      if (firstCsvUrl) {
        setSelectedCsvUrl(firstCsvUrl);
        setCsvFileName(extractFileName(firstCsvUrl));
        fetchCsvData(firstCsvUrl);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const fetchCsvData = async (csvUrl: string) => {
    setLoading(true);
    try {
      const response = await fetch(csvUrl);
      const text = await response.text();
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          handleParseComplete(result);
          setLoading(false);
        },
        error: (err: Error) => {
          console.error("Error parsing CSV:", err);
          setLoading(false);
        },
      });
    } catch (error) {
      console.error("Error fetching CSV:", error);
      setLoading(false);
    }
  };

  const handleCsvSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFile = event.target.value;
    setSelectedCsvUrl(selectedFile);
    setCsvFileName(event.target.selectedOptions[0].text);

    if (selectedFile) {
      fetchCsvData(selectedFile);
    }
  };

  const handleParseComplete = (result: Papa.ParseResult<any>) => {
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

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title mb-0">
                  HEX CSV Data Visualizer and Cleaner
                </h5>
                <button
                  className="btn btn-outline-info btn-sm"
                  onClick={() => {
                    if (csvFileName) {
                      setShowInstructions(true);
                    } else {
                      alert("Select a CSV File First");
                    }
                  }}
                >
                  {csvFileName ? "How to Use This Tool" : "Get Started!"}
                </button>
              </div>

              <div className="mb-3">
                <select
                  className="form-control custom-dropdown"
                  value={selectedCsvUrl}
                  onChange={handleCsvSelect}
                >
                  <option value="">Select a CSV file</option>
                  {file &&
                    Object.keys(file)
                      .filter((key) => key.toLowerCase().endsWith("csv"))
                      .map((key) =>
                        file[key].map((url, index) => (
                          <option key={index} value={url}>
                            {`${key} - ${extractFileName(url)}`}
                          </option>
                        ))
                      )}
                </select>
                {csvFileName && (
                  <div className="d-flex justify-content-between align-items-center mt-2 ms-1">
                    <small className="text-muted">
                      Current file: {csvFileName}
                    </small>
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
              onAddFilter={() => {
                setActiveFilters((prev) => [
                  ...prev,
                  { ...currentFilter, id: Date.now().toString() },
                ]);
                setCurrentFilter({
                  field: "",
                  operator: "is equal to",
                  value: "",
                });
              }}
              onRemoveFilter={(id) => {
                setActiveFilters((prev) => prev.filter((f) => f.id !== id));
              }}
              onExportFiltered={() =>
                exportFilteredData(filteredData, csvFileName)
              }
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
              data={processChartData(filteredData, chartOptions)}
              options={chartOptions}
              onExport={() => exportChartAsPNG(chartRef, chartOptions.title)}
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

export default CsvAuto;
