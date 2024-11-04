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
    <select onChange={onSortChange} value={sortOption}>
      <option value="nameAsc">Name Ascending</option>
      <option value="nameDesc">Name Descending</option>
      <option value="mostPopular">Most Popular</option>
      <option value="mostRecent">Recently Updated</option>
    </select>
  );
};

export default SortOptions;
