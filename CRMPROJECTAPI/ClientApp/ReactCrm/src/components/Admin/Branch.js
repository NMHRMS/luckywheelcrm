import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Branch() {
  const [branches, setBranches] = useState([]); // To store branches from the backend
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [branchName, setBranchName] = useState(""); // Branch name input
  const [location, setLocation] = useState(""); // Location input
  const [address, setAddress] = useState(""); // Address input
  const [companyId, setCompanyId] = useState(""); // Company ID input
  const [currentBranch, setCurrentBranch] = useState(null); // Track current branch for update
  const [systemDate] = useState(new Date().toLocaleDateString()); // System date

  const apiUrl = "http://localhost:3000/branch"; // Replace with your backend URL

  // Fetch branches from the API on initial load
  useEffect(() => {
    axios.get(apiUrl)
      .then((response) => {
        setBranches(response.data); // Set branches from the API
      })
      .catch((error) => {
        console.error("Error fetching branches:", error);
      });
  }, []);

  // Handle Add or Update Branch
  const handleAddBranch = () => {
    if (!branchName.trim() || !location.trim() || !address.trim()) {
      alert("All fields are required");
      return;
    }
  
    const branchData = {
      name: branchName,
      location: location,
      address: address,
      date: systemDate, // Ensure this field matches the backend model
    };
  
    console.log("Sending payload:", branchData); // Debugging log
  
    axios.post("https://localhost:7258/api/Branch", branchData)
      .then((response) => {
        console.log("Response:", response.data);
        setBranches([...branches, response.data]); // Append new branch
        clearForm();
      })
      .catch((error) => {
        console.error("Error adding branch:", error.response?.data || error.message);
      });
  };
  

  // Clear form fields
  const clearForm = () => {
    setBranchName("");
    setLocation("");
    setAddress("");
    setCompanyId("");
    setShowModal(false);
    setCurrentBranch(null);
  };

  // Handle Edit Branch
  const handleEditBranch = (branch) => {
    setBranchName(branch.name);
    setLocation(branch.location);
    setAddress(branch.address);
    setCompanyId(branch.companyId); // Set the company ID when editing
    setCurrentBranch(branch);
    setShowModal(true); // Open modal for editing
  };

  // Handle Delete Branch
  const handleDeleteBranch = (id) => {
    if (window.confirm("Are you sure you want to delete this branch?")) {
      axios.delete(`${apiUrl}/${id}`)
        .then(() => {
          setBranches(branches.filter((branch) => branch.id !== id)); // Remove branch from list
        })
        .catch((error) => {
          console.error("Error deleting branch:", error);
        });
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between mb-4">
        <h3>Branch Management</h3>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-circle me-2"></i>Add Branch
        </button>
      </div>

      {/* Table to display branches */}
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Address</th>
            <th>Date Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {branches.length > 0 ? (
            branches.map((branch) => (
              <tr key={branch.id}>
                <td>{branch.name}</td>
                <td>{branch.location}</td>
                <td>{branch.address}</td>
                <td>{branch.date}</td>
                <td>
                  <button
                    className="btn text-primary btn-sm me-2"
                    onClick={() => handleEditBranch(branch)}
                  >
                    <i className="bi bi-pencil-square"></i> 
                  </button>
                  <button
                    className="btn text-danger btn-sm"
                    onClick={() => handleDeleteBranch(branch.id)}
                  >
                    <i className="bi bi-trash"></i> 
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No branches found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal for Adding/Editing Branch */}
      {showModal && (
        <div className="modal show" style={{ display: "block" }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {currentBranch ? "Edit Branch" : "Add Branch"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="branchName" className="form-label">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="branchName"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="location" className="form-label">
                    Location
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="companyId" className="form-label">
                    Company ID
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="companyId"
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="systemDate" className="form-label">
                    System Date
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="systemDate"
                    value={systemDate}
                    readOnly
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  <i className="bi bi-x-circle me-2 "></i>Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddBranch}
                >
                  <i className="bi bi-check-circle me-2"></i>
                  {currentBranch ? "Update" : "Add"} Branch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
