import React from "react";

export default function Filters({ filters, setFilters, leadsData, setFilteredLeads }) {
  const handleFilterChange = (column, value) => {
    setFilters((prev) => ({
      ...prev,
      [column]: prev[column]?.includes(value)
        ? prev[column].filter((v) => v !== value)
        : [...(prev[column] || []), value],
    }));
  };

  return (
    <div>
      {Object.keys(leadsData[0] || {}).map((key) => (
        <div key={key}>
          <label>{key}</label>
          <select onChange={(e) => handleFilterChange(key, e.target.value)}>
            <option value="">All</option>
            {[...new Set(leadsData.map((lead) => lead[key]))].map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}