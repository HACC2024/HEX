"use client";

import React from "react";

interface SortOptionsProps {
  sortOption: string;
  onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SortOptions: React.FC<SortOptionsProps> = ({
  sortOption,
  onSortChange,
}) => {
  return (
    <select 
      onChange={onSortChange} 
      value={sortOption}
      style={{
        padding: '8px 8px',
        borderRadius: '6px',
        border: '1px solid #ddd',
        backgroundColor: '#fff',
        fontSize: '14px',
        cursor: 'pointer',
        outline: 'none',
        minWidth: '140px',
        appearance: 'auto',
        color: '#333'
      }}
    >
      <option value="nameAsc">Name Ascending</option>
      <option value="nameDesc">Name Descending</option>
      <option value="mostPopular">Most Popular</option>
      <option value="mostRecent">Recently Updated</option>
    </select>
  );
};

export default SortOptions;