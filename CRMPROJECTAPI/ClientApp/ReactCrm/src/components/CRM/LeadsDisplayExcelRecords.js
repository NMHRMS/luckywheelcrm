import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRequest } from "../utils/Api";

const LeadsDisplayExcelRecords = () => {
  const { excelName } = useParams(); // Get file name from URL
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [leadsPerPage] = useState(50); // You can adjust this to control how many leads per page

  useEffect(() => {
    getRequest(`/api/Leads/get_leads_by_excelname?excelName=${excelName}`)
      .then((response) => {
        setLeads(response.data.leads || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching leads:", error);
        setError("Failed to load leads.");
        setLoading(false);
      });
  }, [excelName]);

  // Pagination Logic
  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = leads.slice(indexOfFirstLead, indexOfLastLead);

  // Total number of pages
  const totalPages = Math.ceil(leads.length / leadsPerPage);

  // Change page handler
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3 text-left">Leads from: {excelName}</h2>
      {loading ? (
        <p className="text-left">Loading leads...</p>
      ) : error ? (
        <p className="text-danger text-left">{error}</p>
      ) : leads.length === 0 ? (
        <p className="text-center">No leads found.</p>
      ) : (
        <>
          {/* Pagination Controls - Placed above the table */}
          <div className="d-flex justify-content-left my-1">
  <ul className="pagination">
    <li className="page-item">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="page-link"
      >
        Previous
      </button>
    </li>

    {Array.from({ length: totalPages }, (_, index) => (
      <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
        <button
          onClick={() => handlePageChange(index + 1)}
          className="page-link"
        >
          {index + 1}
        </button>
      </li>
    ))}

    <li className="page-item">
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="page-link"
      >
        Next
      </button>
    </li>
  </ul>
</div>

          {/* Table with optimized spacing */}
          <div className="table-responsive">
            <table className="table table-bordered text-left" style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
              <thead className="thead-dark">
                <tr>
                  <th>Owner Name</th>
                  <th>Mobile No</th>
                  <th>Office Name</th>
                  <th>District</th>
                  <th>State</th>
                  <th>Registration No</th>
                  <th>Vehicle Class</th>
                  <th>Model Name</th>
                  <th>Dealer Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentLeads.map((lead, index) => (
                  <tr key={index}>
                    <td>{lead.ownerName || "N/A"}</td>
                    <td>{lead.mobileNo || "N/A"}</td>
                    <td>{lead.officeName || "N/A"}</td>
                    <td>{lead.districtName || "N/A"}</td>
                    <td>{lead.stateName || "N/A"}</td>
                    <td>{lead.registrationNo || "N/A"}</td>
                    <td>{lead.vehicleClass || "N/A"}</td>
                    <td>{lead.modelName || "N/A"}</td>
                    <td>{lead.dealerName || "N/A"}</td>
                    <td>{lead.status || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls - Placed below the table */}
          <div className="d-flex justify-content-center my-3">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn btn-sm btn-secondary mx-1"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`btn btn-sm btn-secondary mx-1 ${
                  currentPage === index + 1 ? "active" : ""
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="btn btn-sm btn-secondary mx-1"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default LeadsDisplayExcelRecords;
