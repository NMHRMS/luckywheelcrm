import React, { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";

export default function DuplicatesLeads() {
  const [file, setFile] = useState(null);
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [duplicates, setDuplicates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const topScrollRef = useRef(null);
  const bottomScrollRef = useRef(null);
  const tableScrollRef = useRef(null);

  // Sync top and bottom scrollbars
  useEffect(() => {
    const syncScroll = (source, target) => {
      if (target.current) {
        target.current.scrollLeft = source.current.scrollLeft;
      }
    };

    const handleTopScroll = () => syncScroll(topScrollRef, tableScrollRef);
    const handleBottomScroll = () =>
      syncScroll(bottomScrollRef, tableScrollRef);
    const handleTableScroll = () => {
      syncScroll(tableScrollRef, topScrollRef);
      syncScroll(tableScrollRef, bottomScrollRef);
    };

    if (
      topScrollRef.current &&
      bottomScrollRef.current &&
      tableScrollRef.current
    ) {
      topScrollRef.current.addEventListener("scroll", handleTopScroll);
      bottomScrollRef.current.addEventListener("scroll", handleBottomScroll);
      tableScrollRef.current.addEventListener("scroll", handleTableScroll);
    }

    return () => {
      if (
        topScrollRef.current &&
        bottomScrollRef.current &&
        tableScrollRef.current
      ) {
        topScrollRef.current.removeEventListener("scroll", handleTopScroll);
        bottomScrollRef.current.removeEventListener(
          "scroll",
          handleBottomScroll
        );
        tableScrollRef.current.removeEventListener("scroll", handleTableScroll);
      }
    };
  }, []);

  // Handle file upload
  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      readExcel(selectedFile);
    }
  };

  const readExcel = (file) => {
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setOriginalData(jsonData);
      findDuplicates(jsonData);
    };
  };

  // Identify duplicates
  const findDuplicates = (data) => {
    let leadMap = new Map();
    let duplicateEntries = [];

    data.forEach((entry) => {
      const key = `${entry["Owner Name"]}-${entry["MobileNo"]}`;
      if (leadMap.has(key)) {
        duplicateEntries.push(entry);
      } else {
        leadMap.set(key, entry);
      }
    });

    setDuplicates(duplicateEntries);
    setFilteredData(data);
    setIsModalOpen(duplicateEntries.length > 0);
    setIsConfirmed(false);
  };

  // Remove duplicate
  const handleRemoveLead = (index) => {
    const leadToRemove = duplicates[index];

    // Remove only one occurrence of the duplicate from the duplicates array
    const updatedDuplicates = [...duplicates];
    updatedDuplicates.splice(index, 1);
    setDuplicates(updatedDuplicates);

    // Ensure that at least one instance of the duplicate remains in filteredData
    const existingCount = filteredData.filter(
      (entry) =>
        entry["Owner Name"] === leadToRemove["Owner Name"] &&
        entry["MobileNo"] === leadToRemove["MobileNo"]
    ).length;

    if (existingCount > 1) {
      setFilteredData(
        filteredData.filter(
          (entry, i) => i !== filteredData.indexOf(leadToRemove)
        )
      );
    }
  };

  // Confirm leads
  const handleConfirmLeads = () => {
    // Ensure that all remaining duplicates (including ones that were not removed) are displayed
    const finalData = [...filteredData];

    // Add back one instance of each duplicate that was removed from the modal
    duplicates.forEach((dup) => {
      if (
        !finalData.some(
          (lead) =>
            lead["Owner Name"] === dup["Owner Name"] &&
            lead["MobileNo"] === dup["MobileNo"]
        )
      ) {
        finalData.push(dup);
      }
    });

    setFilteredData(finalData);
    setIsConfirmed(true);
    setIsModalOpen(false);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Upload Excel to Check Duplicate Leads</h2>
      <input
        type="file"
        accept=".xlsx, .xls"
        className="form-control mb-3"
        style={{ width: "250px" }} // Adjust width as needed
        onChange={handleFileUpload}
      />

      {isConfirmed && (
        <div>
          <h4>Final Imported Leads</h4>
          {/* Top Scrollbar */}
          <div
            ref={topScrollRef}
            style={{
              overflowX: "auto",
              height: "20px",
              width: "100%",
              background: "#f8f9fa", // Light background to indicate scrollbar
            }}
          >
            <div
              style={{
                width: tableScrollRef.current
                  ? `${tableScrollRef.current.scrollWidth}px`
                  : "100%",
                height: "1px", // Ensures scrollbar visibility
              }}
            ></div>
          </div>

          {/* Table Container */}
          <div
            ref={tableScrollRef}
            style={{ overflowX: "auto", whiteSpace: "nowrap" }}
          >
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Sr.No</th>
                  {Object.keys(filteredData[0])
                    .filter((key) => key.toLowerCase() !== "sr.no") // Exclude "Sr.No" from Excel
                    .map((key, index) => (
                      <th key={index}>{key}</th>
                    ))}
                </tr>
              </thead>

              <tbody>
                {filteredData.map((lead, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>{" "}
                    {/* Sequential Sr.No without duplication */}
                    {Object.entries(lead)
                      .filter(([key]) => key.toLowerCase() !== "sr.no") // Exclude "Sr.No" column from the Excel file
                      .map(([key, value], idx) => (
                        <td key={idx}>{value}</td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Duplicate Leads Modal */}
      {isModalOpen && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Duplicate Leads Found</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <table className="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th>Owner Name</th>
                      <th>Mobile No</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {duplicates.map((lead, index) => (
                      <tr key={index}>
                        <td>{lead["Owner Name"]}</td>
                        <td>{lead["MobileNo"]}</td>
                        <td>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleRemoveLead(index)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleConfirmLeads}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div
          className="modal-backdrop show"
          onClick={() => setIsModalOpen(false)}
        ></div>
      )}
    </div>
  );
}
