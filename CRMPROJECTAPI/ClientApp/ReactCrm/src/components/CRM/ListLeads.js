import { useEffect, useState } from "react";
import { getRequest, postRequest } from "../utils/Api";
import LeadsDisplayExcelRecords from "./LeadsDisplayExcelRecords";
import { useNavigate } from "react-router-dom";
const ListLeads = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Navigation hook

  useEffect(() => {
    getRequest("/api/Leads/get_leads_dataList")
      .then((response) => {
        console.log(response.data); // Log the response to see the structure
        setFiles(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching files:", error);
        setError("Failed to load files. Please try again later.");
        setLoading(false);
      });
  }, []);

  const handleFileClick = (fileName) => {
    navigate(`/crm/leadsdisplayexcelrecords/${fileName}`);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Leads by Excel File</h2>
      {loading ? (
        <p>Loading files...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : files.length === 0 ? (
        <p>No files available.</p>
      ) : (
        <table className="table  table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>Excel Name</th>
              <th>Total Leads</th>
              <th>Assigned Leads</th>
              <th>Not Assigned Leads</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, index) => (
              <tr key={index}>
                <td>
                  <button
                    className="btn btn-link"
                    onClick={() => handleFileClick(file.excelName)}
                  >
                    {typeof file.excelName === "string"
                      ? file.excelName
                      : "Invalid name"}
                  </button>
                </td>
                <td>
                  {typeof file.totalCount === "number"
                    ? file.totalCount
                    : "N/A"}
                </td>
                <td>
                  {typeof file.assignedCount === "number"
                    ? file.assignedCount
                    : "N/A"}
                </td>
                <td>
                  {typeof file.notAssignedCount === "number"
                    ? file.notAssignedCount
                    : "N/A"}
                </td>
                <td>
                  {file.createdDate
                    ? new Date(file.createdDate).toLocaleString()
                    : "Invalid date"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListLeads;
