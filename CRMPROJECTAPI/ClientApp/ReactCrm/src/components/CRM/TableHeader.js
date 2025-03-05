import React, { useState, useEffect } from "react";
import axios from "axios";

const TableHeader = ({ column, applyFilter }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [filterValue, setFilterValue] = useState("");

  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
    applyFilter(column, e.target.value);
  };

  return (
    <th>
      {column}
      <button onClick={() => setShowFilter(!showFilter)}>🔍</button>
      {showFilter && (
        <div className="filter-modal">
          <input
            type="text"
            value={filterValue}
            onChange={handleFilterChange}
            placeholder="Filter..."
          />
        </div>
      )}
    </th>
  );
};

const TableRow = ({ index, lead }) => {
  return (
    <tr>
      <td>{index}</td>
      <td>{lead.ownerName}</td>
      <td>{lead.fatherName}</td>
      <td>{lead.mobileNo}</td>
      <td>{lead.officeName}</td>
      <td>{lead.districtName}</td>
      <td>{lead.currentAddress}</td>
    </tr>
  );
};

const LeadTable = () => {
  const [leads, setLeads] = useState([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get("/api/leads");
      setLeads(response.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const applyFilter = (column, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [column]: value }));
  };

  const filteredLeads = leads.filter((lead) => {
    return Object.keys(filters).every((key) =>
      lead[key]?.toLowerCase().includes(filters[key]?.toLowerCase())
    );
  });

  return (
    <div className="lead-table">
      <h2>Excel Table</h2>
      <table>
        <thead>
          <tr>
            <th>SR. No.</th>
            <TableHeader column="ownerName" applyFilter={applyFilter} />
            <TableHeader column="fatherName" applyFilter={applyFilter} />
            <TableHeader column="mobileNo" applyFilter={applyFilter} />
            <TableHeader column="officeName" applyFilter={applyFilter} />
            <TableHeader column="districtName" applyFilter={applyFilter} />
            <TableHeader column="currentAddress" applyFilter={applyFilter} />
          </tr>
        </thead>
        <tbody>
          {filteredLeads.map((lead, index) => (
            <TableRow key={index} index={index + 1} lead={lead} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;
