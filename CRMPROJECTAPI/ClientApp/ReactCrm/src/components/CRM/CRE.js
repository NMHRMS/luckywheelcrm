import { useEffect, useState } from "react";
import axios from "axios";

const CREDashboard = () => {
  const [assignedLeads, setAssignedLeads] = useState([]);
  const [users, setUsers] = useState({}); // Store users with userId as key
  const [loading, setLoading] = useState(true);

  // Fetch userId from localStorage
  const userId = JSON.parse(localStorage.getItem("user"))?.userId;

  useEffect(() => {
    if (userId) {
      console.log("User ID from localStorage:", userId); // Log the userId to ensure it's correct
      setLoading(true); // Set loading to true when fetching data
      fetchUsers(); // Fetch all users first
    }
  }, [userId]);

  // Fetch users and store them in a lookup object { userId: "Full Name" }
  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://localhost:7258/api/Users");
      console.log("Users API Response:", response.data); // Log the response to check if data is returned
      const userMap = response.data.reduce((acc, user) => {
        acc[user.userId] = `${user.firstName} ${user.lastName}`.trim();
        return acc;
      }, {});
      setUsers(userMap);

      fetchAssignedLeads(); // Fetch assigned leads after users are fetched
    } catch (error) {
      console.error(
        "Error fetching users:",
        error.response?.data || error.message
      );
      setLoading(false); // Stop loading even if there's an error
    }
  };

  const fetchAssignedLeads = async () => {
    try {
      const response = await axios.get(
        `https://localhost:7258/api/LeadAssign/assigned/${userId}`
      );
      console.log("Assigned Leads API Response:", response.data); // Log the response to check the structure
      setAssignedLeads(response.data);
    } catch (error) {
      console.error(
        "Error fetching assigned leads:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false); // Ensure loading is set to false once the data is fetched
    }
  };

  useEffect(() => {
    console.log("Assigned Leads:", assignedLeads); // Log assigned leads data to check if it's being set correctly
  }, [assignedLeads]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Assigned Leads</h2>

      {loading ? (
        <p>Loading...</p>
      ) : assignedLeads.length > 0 ? (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Lead ID</th>
              <th>Lead Source</th>
              <th>Owner Name</th>
              <th>Assigned To</th>
              <th>Assigned Date</th>
              <th>District</th>
              <th>Current Address</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {assignedLeads.map((lead, index) => (
              <tr key={lead.leadId}>
                <td>{index + 1}</td>
                <td>{lead.leadId}</td>
                <td>{lead.leadSource}</td>
                <td>{lead.ownerName}</td>
                <td>{users[lead.assignedTo] || "N/A"}</td>
                <td>{new Date(lead.assignedDate).toLocaleString()}</td>
                <td>{lead.districtName}</td>
                <td>{lead.currentAddress}</td>
                <td>{lead.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center">No assigned leads found.</p>
      )}
    </div>
  );
};

export default CREDashboard;
