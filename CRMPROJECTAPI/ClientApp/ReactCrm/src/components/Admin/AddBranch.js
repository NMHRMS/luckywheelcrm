import React, { useState, useEffect } from "react";
import axios from "axios";
import { getRequest, postRequest, putRequest, deleteRequest } from "../utils/Api";
import { getAuthData, fetchStoredData } from "../utils/AuthUtils";
const Branch = () => {
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState({
    name: "",
    contact: "",
    address: "",
  });
  const [newData, setNewData] = useState([]);
  const [id, setId] = useState(undefined);
  const userData = JSON.parse(localStorage.getItem("user"));
  const companyId = userData?.companyId;

  // Handles input changes in form
  function handleChange(e) {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  // Handles submit for both create and update
  function handleSubmit(e) {
    e.preventDefault();
  
    if (!companyId) {
      console.error("Company ID is missing");
      return;
    }
  
    const branchData = {
      branchId: id, // Ensure branchId is included for updates
      name: data.name,
      contact: data.contact,
      address: data.address,
      companyId: companyId, 
    };
  
    if (id === undefined) {
      // Create a new branch
      
        postRequest("/api/Branch", branchData)
        .then(() => {
          loadData();
          setShowModal(false);
        })
        .catch((error) => console.error("Add Error:", error.response?.data));
    } else {
      // Update the branch
      putRequest(`/api/Branch/${id}`, branchData) // Include branchId in the request
        .then(() => {
          loadData();
          setId(undefined);
          setShowModal(false);
        })
        .catch((error) => console.error("Update Error:", error.response?.data));
    }
  
    setData({ name: "", contact: "", address: "" });
  }
  

  // Loads data from the server
  function loadData() {
    getRequest("/api/Branch")
      .then((res) => setNewData(res.data))
      .catch((error) => console.error("Load Error:", error.response?.data));
  }

  // Handles deletion of a branch
  function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this branch?")) {
      deleteRequest(`/api/Branch/${id}`)
        .then(() => loadData())
        .catch((error) => console.error("Delete Error:", error.response?.data));
    }
  }

  // Fetches branch details for updating
  function handleUpdate(id) {
    setId(id);
    getRequest(`/api/Branch/${id}`)
      .then((res) => {
        setData({
          name: res.data.name,
          contact: res.data.contact,
          address: res.data.address,
        });
        setShowModal(true); // Open the modal for update
      })
      .catch((error) => console.error("Fetch Error:", error.response?.data));
  }

  // Initialize data when component mounts
  useEffect(() => {
    loadData();
  }, []);

  // Close the modal and reset the data
  const closeModal = () => {
    setShowModal(false);
    setData({ name: "", contact: "", address: "" }); // Reset form data on close
  };

  return (
    <div className="container mt-1">
      <h3>Add Branch</h3>
      <div className="d-flex justify-content-end">
        <button
          className="btn btn-primary mb-3"
          onClick={() => setShowModal(true)}
        >
          Add Branch
        </button>
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Sr.no</th>
            <th>Branch Name</th>
            <th>Contact</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {newData.map((branch, index) => (
            <tr key={branch.branchId}>
              <td>{index + 1}</td>
              <td>{branch.name}</td>
              <td>{branch.contact}</td>
              <td>{branch.address}</td>
              <td>
                <button
                  className="btn text-primary btn-sm me-2"
                  onClick={() => handleUpdate(branch.branchId)}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
                <button
                  className="btn text-danger btn-sm"
                  onClick={() => handleDelete(branch.branchId)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for adding/updating branch */}
      {showModal && (
        <>
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1040 }}
          ></div>
          <div
            className="modal fade show"
            style={{ display: "block", zIndex: 1050 }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {id ? "Edit Branch" : "Add Branch"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label>Branch Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={data.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Contact</label>
                      <input
                        type="text"
                        className="form-control"
                        name="contact"
                        value={data.contact}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Address</label>
                      <input
                        type="text"
                        className="form-control"
                        name="address"
                        value={data.address}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary me-2 mt-2">
                      {id ? "Update" : "Submit"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary mt-2"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Branch;
