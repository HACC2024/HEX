/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useCallback, useMemo } from "react";
import { ChartOptions, CHART_TYPES, CsvRow } from "./types";

interface ChartOptionsPanelProps {
  onOptionsChange: (options: ChartOptions) => void;
  availableFields: string[];
  data: CsvRow[];
  currentOptions: ChartOptions;
}

export const ChartOptionsPanel = React.memo(
  ({
    onOptionsChange,
    availableFields,
    data,
    currentOptions,
  }: ChartOptionsPanelProps) => {
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

ChartOptionsPanel.displayName = 'ChartOptionsPanel';
