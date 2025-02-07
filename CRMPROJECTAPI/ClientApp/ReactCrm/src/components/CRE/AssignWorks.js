import { useEffect, useState } from "react";
import { getRequest, postRequest } from "../utils/Api";

const AssignWorks = () => {
  const [assignedLeads, setAssignedLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeads, setSelectedLeads] = useState(new Set());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");

  const userId = "0a227b73-3cec-4b68-ac32-f9af9f34586e";

  useEffect(() => {
    if (userId) {
      fetchUsers();
      fetchAssignedLeads();
    }
  }, [userId]);
  

  const fetchUsers = async () => {
    try {
      const response = await getRequest("/api/Users");
      const filteredUsers = response.data.filter(
        (user) =>
          user.roleId === "341fe51d-b3bb-4ce0-901f-06443bb61830" ||
          user.roleId === "5c13fc2f-6c3a-412d-86cf-e83ba26bdb42"
      );
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchAssignedLeads = async () => {
    try {
      const response = await getRequest(`/api/Leads/assigned/${userId}`);
      console.log("Fetched Assigned Leads:", response.data); // Debugging
      setAssignedLeads(response.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectLead = (leadId) => {
    const updatedSelectedLeads = new Set(selectedLeads);
    updatedSelectedLeads.has(leadId)
      ? updatedSelectedLeads.delete(leadId)
      : updatedSelectedLeads.add(leadId);
    setSelectedLeads(updatedSelectedLeads);
  };

  const toggleSelectAll = () => {
    setSelectedLeads(
      selectedLeads.size === assignedLeads.length
        ? new Set()
        : new Set(assignedLeads.map((lead) => lead.leadId))
    );
  };

  const openAssignModal = () => {
    if (selectedLeads.size === 0) {
      alert("Please select at least one lead to assign.");
      return;
    }
    setModalVisible(true);
  };

  const assignLeads = async () => {
    if (!selectedUser) {
      alert("Please select a user to assign the leads.");
      return;
    }
  
    const selectedLeadIds = Array.from(selectedLeads);
  
    if (selectedLeadIds.length === 0) {
      alert("No leads selected for assignment.");
      return;
    }
  
    try {
      for (const leadId of selectedLeadIds) {
        const requestBody = {
          leadID: leadId,
          assignedTo: selectedUser,
          assignedBy: userId,
          assignedDate: new Date().toISOString(),
        };
  
        console.log("Request Payload:", JSON.stringify(requestBody, null, 2));
  
        const response = await postRequest("/api/LeadAssign/assign", requestBody);
  
        if (!response || response.status !== 200) {
          throw new Error(response.data?.message || "Failed to assign lead");
        }
  
        console.log("Lead assigned successfully:", response.data);
      }
  
      // Instead of refetching, manually update assignedLeads state
      setAssignedLeads((prevLeads) =>
        prevLeads.map((lead) =>
          selectedLeadIds.includes(lead.leadId)
            ? { ...lead, assignedTo: selectedUser }
            : lead
        )
      );
  
      alert("Leads assigned successfully!");
      setSelectedLeads(new Set());
      setModalVisible(false);
    } catch (error) {
      console.error("Error assigning leads:", error);
      alert(`Error: ${error.message}`);
    }
  };
  
  

  return (
    <div className="container mt-4">
      <h2>Assigned Leads</h2>
      <button onClick={openAssignModal} className="btn btn-primary mb-3">
        Assign To
      </button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div
          style={{ overflowX: "auto", whiteSpace: "nowrap", maxWidth: "100%" }}
        >
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedLeads.size === assignedLeads.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>Sr. No.</th>
                <th>Owner Name</th>
                <th>Mobile No</th>
                <th>District</th>
                <th>Current Address</th>
                <th>Lead Source</th>
                <th>Assigned To</th>
                <th>Assigned By</th>
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
                      checked={selectedLeads.has(lead.leadId)}
                      onChange={() => toggleSelectLead(lead.leadId)}
                    />
                  </td>
                  <td>{index + 1}</td>
                  <td>{lead.ownerName}</td>
                  <td>{lead.mobileNo}</td>
                  <td>{lead.districtName}</td>
                  <td>{lead.currentAddress}</td>
                  <td>{lead.leadSource}</td>
                  <td>{lead.assignedBy}</td>

                  <td>
                    {users.find((user) => user.userId === lead.assignedTo)
                      ? `${
                          users.find((user) => user.userId === lead.assignedTo)
                            .firstName
                        } 
                       ${
                         users.find((user) => user.userId === lead.assignedTo)
                           .lastName || ""
                       }`.trim()
                      : "N/A"}
                  </td>
                  <td>{new Date(lead.assignedDate).toLocaleString()}</td>
                  <td>{lead.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalVisible && (
        <div
          className="modal show"
          style={{
            display: "block",
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1050,
          }}
          onClick={() => setModalVisible(false)}
        >
          <div
            className="modal-dialog"
            style={{
              position: "absolute",
              top: "30%",
              left: "60%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              maxWidth: "600px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Assign to CRE</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalVisible(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="creSelect" className="form-label">
                    Select User:
                  </label>
                  <select
                    className="form-select"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                  >
                    <option value="">Select User</option>
                    {users.map((user) => (
                      <option key={user.userId} value={user.userId}>
                        {user.firstName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalVisible(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={assignLeads}
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignWorks;
