import React, { useEffect, useState } from "react";
import { getRequest } from "../utils/Api"; // Assuming getRequest is your utility for making API calls

export default function DseLeads() {
  const [assignedLeads, setAssignedLeads] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const dsmUserId = "41c1fed3-d5d2-4ea8-b5b7-3bcb45493431"; // DSE's user ID

  useEffect(() => {
    const fetchAssignedLeads = async () => {
      try {
        const response = await getRequest(`/api/Leads/assigned/${dsmUserId}`);
        setAssignedLeads(response.data);
      } catch (error) {
        console.error("Error fetching assigned leads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedLeads();
  }, [dsmUserId]);

  // Toggle all checkboxes
  const handleSelectAll = () => {
    if (selectedLeads.length === assignedLeads.length) {
      setSelectedLeads([]); // Unselect all
    } else {
      setSelectedLeads(assignedLeads.map((lead) => lead.leadId)); // Select all
    }
  };

  // Toggle individual checkbox
  const handleSelectLead = (leadId) => {
    setSelectedLeads((prevSelected) =>
      prevSelected.includes(leadId)
        ? prevSelected.filter((id) => id !== leadId) // Unselect
        : [...prevSelected, leadId] // Select
    );
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Assigned Leads</h2>
      {assignedLeads.length > 0 ? (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedLeads.length === assignedLeads.length && assignedLeads.length > 0}
                />
              </th>
              <th>Sr. No.</th>
              <th>Owner Name</th>
              <th>Mobile No</th>
              <th>District</th>
              {/* <th>Lead Source</th> */}
              {/* <th>Assigned To</th> */}
              <th>Assigned Date</th>
              <th>Status</th>

            </tr>
          </thead>
          <tbody>
            {assignedLeads.map((lead, index) => (
              <tr key={lead.leadId}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedLeads.includes(lead.leadId)}
                    onChange={() => handleSelectLead(lead.leadId)}
                  />
                </td>
                <td>{index + 1}</td>
                <td>{lead.ownerName}</td>
                <td>{lead.mobileNo}</td>
                <td>{lead.districtName}</td>
                {/* <td>{lead.leadSource}</td> */}
                {/* <td>{lead.assignedTo ? lead.assignedTo : "N/A"}</td> */}
                <td>{new Date(lead.assignedDate).toLocaleString()}</td>
                <td>{lead.status}</td>

              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No leads assigned.</p>
      )}
    </div>
  );
}
