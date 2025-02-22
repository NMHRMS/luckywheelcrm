import React, { useState, useEffect } from "react";

export default function LeadsTable({ leadsData, setFilteredLeads }) {
  const [filters, setFilters] = useState({});
  const [uniqueColumnValues, setUniqueColumnValues] = useState({});
  const [activeFilter, setActiveFilter] = useState(null);
  const [filterSearch, setFilterSearch] = useState("");

  // Extract Unique Values for Filtering
  useEffect(() => {
    const uniqueValues = {};
    leadsData.forEach((lead) => {
      Object.keys(lead).forEach((key) => {
        if (!uniqueValues[key]) uniqueValues[key] = new Set();
        uniqueValues[key].add(lead[key]);
      });
    });

    // Convert Sets to Arrays
    Object.keys(uniqueValues).forEach(
      (key) => (uniqueValues[key] = Array.from(uniqueValues[key]))
    );

    setUniqueColumnValues(uniqueValues);
  }, [leadsData]);

  // Apply Filters
  useEffect(() => {
    let filtered = [...leadsData];
    Object.keys(filters).forEach((column) => {
      if (filters[column].length > 0) {
        filtered = filtered.filter((lead) => filters[column].includes(lead[column]));
      }
    });
    setFilteredLeads(filtered);
  }, [filters, leadsData]);

  // Handle Filter Changes
  const handleFilterChange = (column, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (!updatedFilters[column]) updatedFilters[column] = [];
      if (updatedFilters[column].includes(value)) {
        updatedFilters[column] = updatedFilters[column].filter((item) => item !== value);
      } else {
        updatedFilters[column].push(value);
      }
      return updatedFilters;
    });
  };

  // Toggle Filter Dropdown
  const toggleFilterDropdown = (column) => {
    setActiveFilter(activeFilter === column ? null : column);
    setFilterSearch("");
  };

  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>ID</th>
          <th>
            Name
            <button className="btn btn-sm btn-light ms-2" onClick={() => toggleFilterDropdown("name")}>
              <i className="bi bi-funnel"></i>
            </button>
            {activeFilter === "name" && (
              <div className="filter-dropdown">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Search..."
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                />
                {uniqueColumnValues["name"]
                  ?.filter((val) => val.toLowerCase().includes(filterSearch.toLowerCase()))
                  .map((value) => (
                    <div key={value} className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={filters["name"]?.includes(value) || false}
                        onChange={() => handleFilterChange("name", value)}
                      />
                      <label className="form-check-label">{value}</label>
                    </div>
                  ))}
              </div>
            )}
          </th>
          <th>Email</th>
          <th>Phone</th>
        </tr>
      </thead>
      <tbody>
        {leadsData.map((lead) => (
          <tr key={lead.id}>
            <td>{lead.id}</td>
            <td>{lead.name}</td>
            <td>{lead.email}</td>
            <td>{lead.phone}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
