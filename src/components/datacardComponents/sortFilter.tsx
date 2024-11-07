"use client";

import React from "react";
import '../../styles/DataCard.css'; 

interface SortOptionsProps {
  sortOption: string;
  onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SortOptions: React.FC<SortOptionsProps> = ({
  sortOption,
  onSortChange,
}) => {
  return (
    <select className="categorySortButton" onChange={onSortChange} value={sortOption}>
      <option value="nameAsc">Name Ascending</option>
      <option value="nameDesc">Name Descending</option>
      <option value="mostPopular">Most Popular</option>
      <option value="mostRecent">Recently Updated</option>
    </select>
  );
};

export default SortOptions;
