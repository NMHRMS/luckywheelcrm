import axios from "axios";
import React, { useState, useEffect } from "react";
import { deleteRequest, getRequest, postRequest } from "../utils/Api";

export default function CRM() {
  const [modalVisible, setModalVisible] = useState(false);
  const [newLead, setNewLead] = useState({
    OwnerName: "",
    MobileNo: "",
    DistrictName: "",
    CurrentAddress: "",
    StateName: "",
    Product: "",
    LeadType: "",
    Status: "Not Called", // Default status
    Company: "",
    LeadSource: "",
    leadId: "", // For edit purposes
  });

  const [filteredLeads, setFilteredLeads] = useState([]);
  const [products, setProducts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [creUsers, setCreUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedLeads, setSelectedLeads] = useState([]);

  useEffect(() => {
    fetchData();
    fetchCreUsers();
  }, []);

  const fetchData = async () => {
    try {
      const productsResponse = await getRequest("/api/Products");
      setProducts(productsResponse.data);

      const companiesResponse = await getRequest("/api/Companies");
      setCompanies(companiesResponse.data);

      const leadsResponse = await getRequest("/api/Leads");
      console.log("Leads:", leadsResponse.data);
      setFilteredLeads(leadsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchCreUsers = async () => {
    try {
      const usersResponse = await getRequest("/api/Users");
      const creUsersList = usersResponse.data.filter(
        (user) => user.roleId === "ad851efd-cd73-43ff-aca5-9f3bc12127b2"
      );
      setCreUsers(creUsersList);
    } catch (error) {
      console.error("Error fetching CRE users:", error);
    }
  };

  const handleSelectLead = (leadId) => {
    setSelectedLeads(
      (prevSelected) =>
        prevSelected.includes(leadId)
          ? prevSelected.filter((id) => id !== leadId) // Remove if already selected
          : [...prevSelected, leadId] // Add if not selected
    );
  };

  const handleUserSelection = (e) => {
    setSelectedUser(e.target.value);
  };

  const handleAssignLeads = async () => {
    if (selectedLeads.length === 0) {
      alert("No leads selected!");
      console.error("No leads selected!");
      return;
    }

    const currentUserId = "141d915d-617b-437a-9ef7-9511fd3646fe"; // Logged-in user ID
    const leadId = selectedLeads[0]; // Assigning only the first selected lead

    if (!selectedUser) {
      alert("Please select a user to assign the lead.");
      return;
    }

    // Check if the selected user exists in creUsers
    const userExists = creUsers.some((user) => user.userId === selectedUser);

    if (!userExists) {
      alert("The selected user does not exist. Please select a valid user.");
      return;
    }

    const payload = {
      leadID: leadId,
      assignedTo: selectedUser,
      assignedBy: currentUserId,
      assignedDate: new Date().toISOString(),
    };

    console.log("Sending Payload:", JSON.stringify(payload, null, 2));

    try {
      const response = await postRequest(
        "/api/LeadAssign/assign",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Response:", response.data);

      // Find assigned user's name
      const assignedUser = creUsers.find(
        (user) => user.userId === selectedUser
      );
      const assignedUsername = assignedUser
        ? `${assignedUser.firstName} ${assignedUser.lastName}`.trim()
        : "Unknown";

      console.log("Assigned Username:", assignedUsername);

      alert("Lead assigned successfully!");

      // Update state to reflect assigned lead
      setFilteredLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead.leadId === leadId
            ? {
                ...lead,
                assignedTo: assignedUsername,
                assignedDate: new Date().toISOString(),
              }
            : lead
        )
      );
    } catch (error) {
      const errorMessage = error.response
        ? JSON.stringify(error.response.data, null, 2)
        : error.request
        ? "No response from the server. Check your connection."
        : error.message;

      console.error("Error assigning lead:", errorMessage);
      alert("Failed to assign lead. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    setNewLead({ ...newLead, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const leadData = {
      CompanyId: selectedCompany,
      OwnerName: newLead.OwnerName,
      MobileNo: newLead.MobileNo,
      DistrictName: newLead.DistrictName,
      CurrentAddress: newLead.CurrentAddress,
      StateName: newLead.StateName,
      ProductId: selectedProduct, // Assuming this is a product code like 'Truck'
      LeadType: newLead.LeadType,
      Status: newLead.Status,
    };

    try {
      const res = await postRequest(
        "/api/Leads",
        leadData
      );
      setFilteredLeads([...filteredLeads, res.data]);

      setModalVisible(false);
      resetLeadForm();
    } catch (error) {
      console.error("Error saving lead:", error.message);
      alert("Error occurred: " + error.message);
    }
  };

  const resetLeadForm = () => {
    setNewLead({
      OwnerName: "",
      MobileNo: "",
      DistrictName: "",
      CurrentAddress: "",
      StateName: "",
      LeadSource: "",
      LeadType: "",
      Product: "",
      Company: "",
      Status: "Not Called",
    });
    setSelectedProduct("");
    setSelectedCompany("");
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleEditLead = (index) => {
    const lead = filteredLeads[index];
    console.log("Selected Lead: ", lead);

    setNewLead({
      leadId: lead.leadId,
      OwnerName: lead.ownerName,
      MobileNo: lead.mobileNo,
      DistrictName: lead.districtName,
      CurrentAddress: lead.currentAddress,
      StateName: lead.stateName,
      Product: lead.productId,
      LeadType: lead.leadType,
      Status: lead.status,
      Company: lead.companyId,
      LeadSource: lead.leadSource,
    });
    setSelectedProduct(lead.productId);
    setSelectedCompany(lead.companyId);
    setModalVisible(true);
  };

  const handleDeleteLead = async (index) => {
    const leadToDelete = filteredLeads[index];
    try {
      await deleteRequest(
        `/api/leads/${leadToDelete.leadId}`
      );
      setFilteredLeads(filteredLeads.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedLeads(filteredLeads.map((lead) => lead.leadId));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleRowDoubleClick = (index) => {
    const lead = filteredLeads[index];
    setNewLead({
      leadId: lead.leadId,
      OwnerName: lead.OwnerName,
      MobileNo: lead.MobileNo,
      DistrictName: lead.DistrictName,
      CurrentAddress: lead.CurrentAddress,
      StateName: lead.StateName,
      Product: lead.Product,
      LeadType: lead.LeadType,
      Status: lead.Status,
      Company: lead.Company,
      LeadSource: lead.LeadSource,
    });
    setSelectedProduct(lead.Product);
    setSelectedCompany(lead.Company);
    setModalVisible(true);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "10px",
        }}
      >
        <button
          onClick={() => setModalVisible(true)}
          className="btn btn-primary"
        >
          Add New Lead
        </button>
        <button
          onClick={() => setAssignModalVisible(true)}
          className="btn btn-success ms-2"
        >
          Assign
        </button>
      </div>

      <div
        className="table-responsive table-container"
        style={{ overflowX: "auto", whiteSpace: "nowrap" }}
      >
        <table className="table table-bordered text-center">
          <thead className="table-light">
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    selectedLeads.length === filteredLeads.length &&
                    filteredLeads.length > 0
                  }
                />
              </th>
              <th>Sr. No.</th>
              <th>Owner Name</th>
              <th>Mobile No</th>
              <th>District Name</th>
              <th>Current Address</th>
              <th>Registration No</th>
              <th>Registration Date</th>
              <th>Vehicle Class</th>
              <th>State Name</th>
              <th>Laden Weight</th>
              <th>Model Name</th>
              <th>Dealer Name</th>
              <th>Product ID</th>
              <th>Lead Type</th>
              <th>Assigned To</th>
              <th>Assigned Date</th>
              <th>Follow Up Date</th>
              <th>Remark</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead, index) => (
                <tr
                  key={lead.leadId}
                  onDoubleClick={() => handleRowDoubleClick(index)}
                >
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
                  <td>{lead.currentAddress}</td>
                  <td>{lead.registrationNo}</td>
                  <td>{lead.registrationDate}</td>
                  <td>{lead.vehicleClass}</td>
                  <td>{lead.stateName}</td>
                  <td>{lead.ladenWeight}</td>
                  <td>{lead.modelName}</td>
                  <td>{lead.dealerName}</td>
                  <td>{lead.productId}</td>
                  <td>{lead.leadType}</td>
                  <td>
                    {creUsers.find((user) => user.userId === lead.assignedTo)
                      ?.firstName || "Unassigned"}
                  </td>
                  <td>{lead.assignedDate}</td>
                  <td>{lead.followUpDate}</td>
                  <td>{lead.remark}</td>
                  <td>{lead.status}</td>
                  <td>
                    <button
                      className="btn text-success"
                      onClick={() => handleEditLead(index)}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button
                      className="btn text-danger"
                      onClick={() => handleDeleteLead(index)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="21">No leads found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
            overflowY: "auto",
          }}
          onClick={handleModalClose}
        >
          <div
            className="modal-dialog"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              maxWidth: "600px",
            }}
            onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
          >
            <div
              className="modal-content"
              style={{ maxHeight: "80vh", overflowY: "auto" }}
            >
              <div className="modal-header">
                <h5 className="modal-title">
                  {newLead.leadId ? "Edit Lead" : "Add New Lead"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleModalClose}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  {/* Add all the fields */}

                  <div className="mb-3">
                    <label htmlFor="CompanyId" className="form-label">
                      Company ID
                    </label>
                    <select
                      id="Company"
                      className="form-select"
                      value={selectedCompany}
                      onChange={(e) => setSelectedCompany(e.target.value)}
                    >
                      <option value="">Select Company</option>
                      {companies.map((company) => (
                        <option
                          key={company.companyId}
                          value={company.companyId}
                        >
                          {company.name}{" "}
                          {/* Use company.name instead of company.companyName */}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="OwnerName" className="form-label">
                      Owner Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="OwnerName"
                      name="OwnerName"
                      value={newLead.OwnerName}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="MobileNo" className="form-label">
                      Mobile No
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="MobileNo"
                      name="MobileNo"
                      value={newLead.MobileNo}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="DistrictName" className="form-label">
                      District Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="DistrictName"
                      name="DistrictName"
                      value={newLead.DistrictName}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="CurrentAddress" className="form-label">
                      Current Address
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="CurrentAddress"
                      name="CurrentAddress"
                      value={newLead.CurrentAddress}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="StateName" className="form-label">
                      State Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="StateName"
                      name="StateName"
                      value={newLead.StateName}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="ProductId" className="form-label">
                      Product
                    </label>
                    <select
                      id="Product"
                      className="form-select"
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                    >
                      <option value="">Select Product</option>
                      {products.map((product) => (
                        <option
                          key={product.productId}
                          value={product.productId}
                        >
                          {product.productName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="LeadType" className="form-label">
                      Lead Type
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="LeadType"
                      name="LeadType"
                      value={newLead.LeadType}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="Status" className="form-label">
                      Status
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="Status"
                      name="Status"
                      value={newLead.Status}
                      onChange={handleInputChange}
                    />
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSave}
                  >
                    {newLead.leadId ? "Update Lead" : "Add Lead"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {assignModalVisible && (
        <div>
          {/* Background Overlay */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black
              zIndex: 1040, // Ensure it stays behind the modal
            }}
            onClick={() => setAssignModalVisible(false)} // Click outside to close
          ></div>

          {/* Modal */}
          <div
            className="modal show d-block"
            tabIndex="-1"
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1050, // Higher than the overlay
            }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Assign Leads</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setAssignModalVisible(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <label className="form-label">Select User (CRE):</label>
                  <select
                    className="form-control"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                  >
                    <option value="">Select User</option>
                    {creUsers.map((user) => (
                      <option key={user.userId} value={user.userId}>
                        {user.firstName} {user.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setAssignModalVisible(false)}
                  >
                    Close
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={handleAssignLeads}
                  >
                    Assign
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
