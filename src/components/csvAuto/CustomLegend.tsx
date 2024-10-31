// components/CustomLegend.tsx
"use client";

import React, { useState } from 'react';
import { ITEMS_PER_PAGE } from './types';

interface CustomLegendProps {
  payload: Array<{
    value: string;
    dataValue: number;
    color: string;
  }>;
  xAxisField: string;
  yAxisField: string;
}

const CustomLegendComponent = ({ payload, yAxisField }: CustomLegendProps) => {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil((payload?.length || 0) / ITEMS_PER_PAGE);
  const visibleItems = payload?.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE) || [];

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
                <div key={`legend-${index}`} className="col-6 d-flex align-items-center">
                  <div
                    className="rounded-circle me-2"
                    style={{
                      backgroundColor: entry.color,
                      width: "12px",
                      height: "12px",
                    }}
                  />
                  <span className="text-truncate small">
                    {`${entry.value} (${formatValue(entry.dataValue || 0)} ${yAxisField})`}
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
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
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
};

CustomLegendComponent.displayName = "CustomLegend";

export const CustomLegend = React.memo(CustomLegendComponent);