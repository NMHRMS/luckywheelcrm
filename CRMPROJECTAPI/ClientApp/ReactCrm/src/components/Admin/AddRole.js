import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer  } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getRequest, postRequest, putRequest, deleteRequest } from "../utils/Api";
import { getAuthData, fetchStoredData } from "../utils/AuthUtils";

export default function RoleComponent() {
  
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [roleData, setRoleData] = useState({ id: null, roleName: "" });

   // Get companyId from local storage
  const companyId = JSON.parse(localStorage.getItem("user"))?.companyId;

 // Fetch roles on component mount
 useEffect(() => {
  if (companyId) {
    getRolesData();
  }
}, [companyId]);

  const getRolesData = () => {
    getRequest("/api/Roles")
      .then((res) => {
        // Filter roles by companyId
        const filteredRoles = res.data.filter(role => role.companyId === companyId);
        setRoles(filteredRoles);
      })
      .catch((err) => {
        console.error("Error fetching roles:", err);
        toast.error("Failed to fetch roles."); // ❌ Toast on error
      });
  };

  const handleAddOrUpdateRole = () => {
    if (!roleData.roleName.trim()) {
      toast.error("Role name is required!");
      return;
    }
  
    const newRoleData = {
      roleName: roleData.roleName,
      companyId: companyId, // Ensure companyId is included
    };
  
    if (!roleData.id) {
      // Creating a new role
      postRequest("/api/Roles", newRoleData)
        .then((res) => {
          toast.success("Role added successfully! ✅");
          getRolesData();
          closeModal();
        })
        .catch((err) => {
          console.error("Error adding role:", err.response?.data || err.message);
          toast.error("Failed to add role. ❌ Check API requirements.");
        });
    } else {
      // Updating an existing role
      postRequest("/api/Roles", newRoleData)
      .then((res) => {
        toast.success("Role added successfully! ✅");
        setRoles([...roles, res.data]); // Update state instead of fetching again
        closeModal();
      })
        .catch((err) => {
          console.error("Error updating role:", err.response?.data || err.message);
          toast.error("Failed to update role. ❌");
        });
    }
  };
  
  

  const editRole = (role) => {
    setRoleData({ id: role.roleId, roleName: role.roleName });
    setShowModal(true);
  };

  const deleteRole = (id) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      deleteRequest(`${"/api/Roles"}/${id}`)
      .then(() => {
        toast.success("Role deleted successfully! 🗑️");
        setRoles(roles.filter(role => role.roleId !== id)); // Remove deleted role from state
      })
        .catch((err) => {
          console.error("Error deleting role:", err);
          toast.error("Failed to delete role. ❌");
        });
    }
  };

  const closeModal = () => {
    setRoleData({ id: null, roleName: "" });
    setShowModal(false);
  };

  return (
    <div className="container">

<ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="d-flex justify-content-between mb-4">
        <h3>Roles Management</h3>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Add Role
        </button>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Sr.no</th>
            <th>Role Name</th>
             <th>Actions</th> 
          </tr>
        </thead>
        <tbody>
          {roles.length > 0 ? (
            roles.map((role, index) => (
              <tr key={role.roleId}>
                <td>{index + 1}</td>
                <td>{role.roleName}</td>
                <td>
                  <button
                    className="btn text-primary btn-sm me-2"
                    onClick={() => editRole(role)}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button
                    className="btn text-danger btn-sm"
                    onClick={() => deleteRole(role.roleId)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                No roles found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && (
  <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }} tabIndex="-1">
    <div className="modal-dialog modal-dialog-centered"> 
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">
            {roleData.id ? "Edit Role" : "Add Role"}
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={closeModal}
          ></button>
        </div>
        <div className="modal-body">
          <div className="mb-3">
            <label htmlFor="roleName" className="form-label">
              Role Name
            </label>
            <input
              type="text"
              className="form-control"
              id="roleName"
              value={roleData.roleName}
              onChange={(e) =>
                setRoleData({ ...roleData, roleName: e.target.value })
              }
              required
            />
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={closeModal}
          >
            Close
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddOrUpdateRole}
          >
            {roleData.id ? "Update" : "Add"} Role
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
