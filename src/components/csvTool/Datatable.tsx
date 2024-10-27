// components/DataTable.tsx
"use client";

import React, { useState, useMemo } from 'react';
import { CsvRow } from './types';

interface DataTableProps {
  data: CsvRow[];
}

export const DataTable = React.memo(({ data }: DataTableProps) => {
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

DataTable.displayName = 'DataTable';