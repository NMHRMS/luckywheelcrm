import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Leads() {
  const navigate = useNavigate();
  const [fileData, setFileData] = useState([{}]);
  const [isScrollable, setIsScrollable] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 30; // Number of records per page
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = fileData.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Fetch data from API
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split("T")[0]; // e.g., "2025-01-16"

        console.log("Formatted Date:", formattedDate);

        const response = await axios.get(
          `http://localhost:5286/api/enquiries/list/${formattedDate}`
        );

        if (response.status === 200) {
          console.log("Response Data:", response.data);
        } else {
          console.error("Error: Unexpected response status", response.status);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };
    fetchdata();
  }, []);

  const convertExcelDate = (serial) => {
    const utc_days = Math.floor(serial - 25569); // Days since 1970-01-01
    const date = new Date(utc_days * 86400 * 1000); // Convert to milliseconds
    return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  // Handle Excel file upload
  const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (file && (file.name.endsWith(".xls") || file.name.endsWith(".xlsx"))) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      // Transform Excel data
      const formattedData = data.map((row) => ({
        "State Name": row["State Name"] || "",
        "Office Name": row["Office Name"] || "",
        "District Name": row["District Name"] || "",
        "Registration No.": row["Registration No."] || "",
        "Registration Date": typeof row["Registration Date"] === "number"
          ? convertExcelDate(row["Registration Date"]) // Convert if numeric
          : row["Registration Date"], 
        "Owner Name": row["Owner Name"] || "",
        "Father Name": row["Father Name"] || "",
        "Current Address": row["Current Address"] || "",
        "Vehicle Class": row["Vehicle Class"] || "",
        "Laden Weight": row["Laden Weight"] || "",
        "Maker Name": row["Maker Name"] || "",
        "Model Name": row["Model Name"] || "",
        "Mobile No.": row["Mobile No."] || "",
        "Dealer Name": row["Dealer Name"] || "",
      }));

      setFileData(formattedData);

      // Save the data to localStorage
      localStorage.setItem("fileData", JSON.stringify(formattedData));

      // Check if the table needs scrolling
      const columnCount = Object.keys(data[0] || {}).length;
      setIsScrollable(columnCount > 5);
      alert("File uploaded successfully!");
    };
    reader.readAsBinaryString(file);
  } else {
    alert("Please upload a valid Excel file.");
  }
};
  // Pagination logic: slice the fileData for the current page
  const paginatedData = fileData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(fileData.length / pageSize);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Save data to the server
  const saveDataToServer = async () => {
    if (fileData.length === 0) {
      alert("No data to save. Please upload an Excel file.");
      return;
    }
    try {
      const currentDate = new Date();
      const edate = currentDate.toISOString().split("T")[0]; // e.g., "2025-01-16"

      for (const row of fileData) {
        const enquiryData = {
          id: 0,
          createdate: edate,
          createby: "admin",
          state: row["State Name"],
          office: row["Office Name"],
          district: row["District Name"],
          regNo: row["Registration No."],
          regDate: row["Registration Date"],
          owner: row["Owner Name"],
          fatherName: row["Father Name"],
          address: row["Current Address"],
          vehicleClass: row["Vehicle Class"],
          ladenWeight: row["Laden Weight"],
          makerName: row["Maker Name"],
          modelName: row["Model Name"],
          mobileNo: row["Mobile No."],
          dealerName: row["Dealer Name"],
        };

        console.log("enquiryData", enquiryData);

        // Save each enquiry individually
        const saveResponse = await axios.post(
          "http://localhost:8081/excelenquiry",
          enquiryData
        );
        if (saveResponse.status !== 201) {
          console.error("Failed to save enquiry:", enquiryData);
        }
      }

      alert("Data saved successfully!");
    } catch (error) {
      console.error("Error saving data to server:", error);
      alert("An error occurred while saving data.");
    }
  };

  // File download
  const handleFileDownload = () => {
    const ws = XLSX.utils.json_to_sheet(fileData.length > 0 ? fileData : [{}]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "enquiry_data.xlsx");
  };

  // Download template
  const handleTemplateDownload = () => {
    const templateData = [
      {
        "State Name": "",
        "Office Name": "",
        "District Name": "",
        "Registration No.": "",
        "Registration Date": "",
        "Owner Name": "",
        "Father Name": "",
        "Current Address": "",
        "Vehicle Class": "",
        "Laden Weight": "",
        "Maker Name": "",
        "Model Name": "",
        "Mobile No.": "",
        "Dealer Name": "",
      },
    ];
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "enquiry_template.xlsx");
  };

  // Navigation to list page
  const navigatelist = () => {
    navigate("/admin/listenquires");
  };

  const handleCheckboxChange = (index) => {
    setSelectedRows((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleAssign = (userid) => {
    const updatedFileData = [...fileData];
    selectedRows.forEach((index) => {
      updatedFileData[index] = { ...updatedFileData[index], userid, assigned: true };
    });
    setFileData(updatedFileData);
    setSelectedRows([]);
    setShowModal(false);
  };

  return (
    <div className="container-fluid">
      <div className="card shadow">
        <div className="card-body">
          <h2 className="card-title mb-4">Excel Data Management</h2>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <input
              type="text"
              className="form-control w-25"
              placeholder="Search records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div>
              <button
                className="btn btn-primary me-2"
                onClick={() => document.getElementById("fileUploadInput").click()}
              >
                <i className="bi bi-file-earmark-arrow-up me-2"></i>Upload Excel
              </button>
              <input
                id="fileUploadInput"
                type="file"
                accept=".xls,.xlsx"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
              <button
                className="btn btn-success me-2"
                onClick={handleFileDownload}
              >
                <i className="bi bi-file-earmark-arrow-down me-2"></i>Download
                Data
              </button>
            </div>
            <div>
              <button
                className="btn btn-outline-primary me-2"
                onClick={handleTemplateDownload}
              >
                Download Template
              </button>
              <button
                className="btn btn-outline-success me-2"
                onClick={() => setShowModal(true)}
                disabled={selectedRows.length === 0}
              >
                Assign to
              </button>
              <button
                className="btn btn-outline-info me-2"
                onClick={saveDataToServer}
              >
                Save to Server
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={navigatelist}
              >
                List
              </button>
            </div>
          </div>
          {filteredData.length > 0 ? (
  <div>
    <div className="table-responsive">
      <table className="table table-bordered table-hover" style={{ width: "100%" }}>
        <thead className="table">
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={(e) => {
                  const newSelectedRows = e.target.checked
                    ? filteredData.map((_, index) => index)
                    : [];
                  setSelectedRows(newSelectedRows);
                }}
                checked={selectedRows.length === filteredData.length}
              />
            </th>
            <th>#</th>
            {Object.keys(filteredData[0]).map((header, index) => (
              <th key={index} style={{ whiteSpace: "nowrap", maxWidth: "200px", textOverflow: "ellipsis", overflow: "hidden" }}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, index) => (
            <tr key={index}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(index)}
                  onChange={() => handleCheckboxChange(index)}
                />
              </td>
              <td>{(currentPage - 1) * pageSize + index + 1}</td>
              {Object.values(row).map((value, idx) => (
                <td
                  key={idx}
                  style={{
                    whiteSpace: "nowrap", // Prevent text wrapping
                    maxWidth: "200px", // Ensure enough space for each cell
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Pagination Controls */}
    {totalPages > 1 && (
      <nav>
        <ul className="pagination">
          <li
            className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
            onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
          >
            <span className="page-link">Previous</span>
          </li>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <li
              key={page}
              className={`page-item ${page === currentPage ? "active" : ""}`}
              onClick={() => goToPage(page)}
            >
              <span className="page-link">{page}</span>
            </li>
          ))}
          <li
            className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
            onClick={() => currentPage < totalPages && goToPage(currentPage + 1)}
          >
            <span className="page-link">Next</span>
          </li>
        </ul>
      </nav>
    )}
  </div>
) : (
  <div>No data available</div>
)}

        </div>
      </div>
    </div>
  );
}
