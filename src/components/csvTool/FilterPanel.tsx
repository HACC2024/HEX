// components/FilterPanel.tsx
"use client";

import React from 'react';
import { X } from 'lucide-react';
import { FilterState, FILTER_OPERATORS } from './types';

interface FilterPanelProps {
  activeFilters: FilterState[];
  availableFields: string[];
  currentFilter: Omit<FilterState, "id">;
  onFilterChange: (filter: Omit<FilterState, "id">) => void;
  onAddFilter: () => void;
  onRemoveFilter: (id: string) => void;
  onExportFiltered: () => void;
}

const FilterPanel = React.memo(({ 
  activeFilters, 
  availableFields, 
  currentFilter, 
  onFilterChange,
  onAddFilter,
  onRemoveFilter,
  onExportFiltered
}: FilterPanelProps) => {
  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title mb-0 me-3">Filter Data</h5>
          <button className="btn btn-outline-primary btn-sm" onClick={onExportFiltered}>
            Export Filtered Data
          </button>
        </div>

        <div className="mb-3">
          {activeFilters.map((filter) => (
            <div key={filter.id} className="badge bg-primary d-inline-flex align-items-center me-2 mb-2 p-2">
              <span className="me-2">
                {filter.field} {filter.operator} {filter.value}
              </span>
              <X
                size={14}
                className="cursor-pointer"
                onClick={() => onRemoveFilter(filter.id)}
              />
            </div>
          ))}
        </div>

        <small className="text-muted ms-1">Field</small>
        <select
          value={currentFilter.field}
          onChange={(e) => onFilterChange({ ...currentFilter, field: e.target.value })}
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
          onChange={(e) => onFilterChange({ ...currentFilter, operator: e.target.value })}
          className="form-select mb-2"
        >
          {FILTER_OPERATORS.map((op: { value: string; label: string }) => (
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
            onChange={(e) => onFilterChange({ ...currentFilter, value: e.target.value })}
            placeholder="Filter value"
            className="form-control mb-3"
          />
        </div>

        <button
          onClick={onAddFilter}
          className="btn btn-primary w-100"
          disabled={!currentFilter.field}
        >
          Add Filter
        </button>
      </div>
    </div>
  );
});

FilterPanel.displayName = "FilterPanel";

export { FilterPanel };