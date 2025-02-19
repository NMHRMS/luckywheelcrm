import React from "react";

export default function Pagination({ currentPage, setCurrentPage, totalRecords, recordsPerPage, setRecordsPerPage }) {
  return (
    <div>
      <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>Prev</button>
      <span> Page {currentPage} </span>
      <button onClick={() => setCurrentPage((prev) => prev + 1)}>Next</button>
      <select onChange={(e) => setRecordsPerPage(Number(e.target.value))}>
        <option value="50">50</option>
        <option value="100">100</option>
        <option value="all">All</option>
      </select>
    </div>
  );
}