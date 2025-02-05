import React, { useState, useEffect } from "react";
import axios from "axios";
import { getRequest, postRequest, putRequest, deleteRequest } from "../utils/Api";
import { getAuthData, fetchStoredData } from "../utils/AuthUtils";
const AddUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // Filtered user list
  const [selectedRole, setSelectedRole] = useState(""); // Selected role filter
  const [showModal, setShowModal] = useState(false); // Manage modal visibility
  const [roles, setRoles] = useState([]); // List of roles for dropdown
  const [companies, setCompanies] = useState([]); // List of companies for dropdown
  const [branches, setBranches] = useState([]);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
    contactNumber: "",
    companyId: 0,
    branchId: 0,
    roleId: 0,
  }); // Store user data
  const [isEditMode, setIsEditMode] = useState(false); // Track if editing
  const [currentUserId, setCurrentUserId] = useState(null); // Track user ID being edited

  // Fetch users from API
  useEffect(() => {
    getRequest("/api/users")
      .then((res) => {
        setUsers(res.data); // Set the fetched users to state
        setFilteredUsers(res.data); // Initialize filtered users
      })
      .catch((error) => console.error("Error fetching users: ", error));

    // Fetch roles
    getRequest("/api/Roles")
      .then((res) => setRoles(res.data))
      .catch((error) => console.error("Error fetching roles: ", error));

    // Fetch companies
   getRequest("/api/Companies")
      .then((res) => setCompanies(res.data))
      .catch((error) => console.error("Error fetching companies: ", error));

    // Fetch branch
   getRequest("/api/Branch")
      .then((res) => setBranches(res.data))
      .catch((error) => console.error("Error fetching companies: ", error));
  }, []);

  // Handle role filter change
  const handleRoleFilterChange = (e) => {
    const selectedRoleId = e.target.value;
    setSelectedRole(selectedRoleId);

    if (selectedRoleId) {
      // Filter users by selected role
      const filtered = users.filter(
        (user) => user.roleId.toString() === selectedRoleId
      );
      setFilteredUsers(filtered);
    } else {
      // Show all users if no role is selected
      setFilteredUsers(users);
    }
  };

  // Handle clear filter
  const handleClearFilter = () => {
    setSelectedRole(""); // Reset the selected role
    setFilteredUsers(users); // Reset the filtered users to the full list
  };

  // Handle delete user
  function handleDelete(userId) {
    deleteRequest(`/api/users/${userId}`)
      .then((res) => {
        console.log("User deleted:", res.data);
        const updatedUsers = users.filter((user) => user.userId !== userId);
        setUsers(updatedUsers); // Update user list
        setFilteredUsers(updatedUsers); // Update filtered user list
      })
      .catch((error) => console.error("Error deleting user: ", error));
  }

  // Handle input changes for the modal fields
  function handleInputChange(e) {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  }

  // Handle Add or Edit User submission
  function handleSave() {
    if (isEditMode) {
      // Update user
      const updateuser = {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        emailId: newUser.emailId,
        password: newUser.password,
        contactNumber: newUser.contactNumber,
        companyId: newUser.companyId,
        branchId: newUser.branchId,
        roleId: newUser.roleId,
        userId: currentUserId,
      };
     putRequest(`/api/users/${currentUserId}`, updateuser)
        .then((res) => {
          const updatedUsers = users.map((user) =>
            user.userId === currentUserId ? res.data : user
          );
          setUsers(updatedUsers);
          setFilteredUsers(updatedUsers);
          setShowModal(false);
          setNewUser({
            firstName: "",
            lastName: "",
            emailId: "",
            password: "",
            contactNumber: "",
            companyId: 0,
            branchId: 0,
            roleId: 0,
          });
        })
        .catch((error) => console.error("Error updating user:", error));
    } else {
      // Add new user
      postRequest("/api/users", newUser)
        .then((res) => {
          const updatedUsers = [...users, res.data];
          setUsers(updatedUsers);
          setFilteredUsers(updatedUsers);
          setShowModal(false);
          setNewUser({
            firstName: "",
            lastName: "",
            emailId: "",
            password: "",
            contactNumber: "",
            companyId: 0,
            branchId: 0,
            roleId: 0,
          });
        })
        .catch((error) => console.error("Error adding user:", error));
    }
  }

  // Handle edit button click
  function handleEdit(userId) {
    const user = users.find((user) => user.userId === userId);
    if (user) {
      setIsEditMode(true); // Set to edit mode
      setCurrentUserId(userId); // Set current user ID
      setNewUser({
        firstName: user.firstName,
        lastName: user.lastName,
        emailId: user.emailId,
        password: user.password,
        contactNumber: user.contactNumber,
        companyId: user.companyId,
        branchId: user.branchId,
        roleId: user.roleId,
      }); // Populate modal with user data
      setShowModal(true); // Show modal
    }
  }

  return (
    <div className="container mt-1">
      <h3>User List</h3>

      {/* Role Filter Dropdown */}
      <div className="mb-2 d-flex">
        <select
          id="roleFilter"
          className="form-control w-25"
          value={selectedRole}
          onChange={handleRoleFilterChange}
        >
          <option value="">All Roles</option>
          {roles.map((role) => (
            <option key={role.roleId} value={role.roleId}>
              {role.roleName}
            </option>
          ))}
        </select>

        <button className="btn btn-outline-secondary  ms-2" onClick={handleClearFilter}>
          Clear Filter
        </button>

        <button
          className="btn btn-primary ms-auto d-block"
          onClick={() => {
            setIsEditMode(false); 
            setNewUser({
              firstName: "",
              lastName: "",
              emailId: "",
              password: "",
              contactNumber: "",
              companyId: 0,
              branchId: 0,
              roleId: 0,
            });
            setShowModal(true);
          }}
        >
          Add User
        </button>
      </div>

      <table className="table table-bordered mt-3">
  <thead>
    <tr>
      <th>First Name</th>
      <th>Last Name</th>
      <th>Email</th>
      <th>Password</th>
      <th>Contact Number</th>
      <th>Branch</th>
      <th>Role</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
  {filteredUsers.map((user) => {
    const role = roles.find((r) => r.roleId === user.roleId);
    const branch = branches.find((b) => b.branchId === user.branchId);

    return (
      <tr key={user.userId}>
        <td>{user.firstName}</td>
        <td>{user.lastName}</td>
        <td>{user.emailId}</td>
        <td>{user.password}</td>
        <td>{user.contactNumber}</td>
        <td>{branch ? branch.name : "N/A"}</td> 
        <td>{role ? role.roleName : "N/A"}</td> 
        <td>
          <button
            className="btn btn-sm text-primary me-2"
            onClick={() => handleEdit(user.userId)}
          >
            <i className="bi bi-pencil-square"></i>
          </button>
          <button
            className="btn btn-sm text-danger"
            onClick={() => handleDelete(user.userId)}
          >
             <i className="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    );
  })}
</tbody>
</table>


      {showModal && (
        <>
          <div className="modal-backdrop show"></div>
          <div
            className="modal show"
            style={{ display: "block" }}
            tabIndex="-1"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {isEditMode ? "Edit User" : "Add User"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="firstName"
                      name="firstName"
                      value={newUser.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      name="lastName"
                      value={newUser.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="emailId" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="emailId"
                      name="emailId"
                      value={newUser.emailId}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="emailId" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={newUser.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="contactNumber" className="form-label">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="contactNumber"
                      name="contactNumber"
                      value={newUser.contactNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="companyId" className="form-label">
                      Company
                    </label>
                    <select
                      id="companyId"
                      name="companyId"
                      className="form-control"
                      value={newUser.companyId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Company</option>
                      {companies.map((company) => (
                        <option
                          key={company.companyId}
                          value={company.companyId}
                        >
                          {company.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="branchId" className="form-label">
                      Branch
                    </label>
                    <select
                      id="branchId"
                      name="branchId"
                      className="form-control"
                      value={newUser.branchId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Branch</option>
                      {branches.map((branch) => (
                        <option key={branch.branchId} value={branch.branchId}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="roleId" className="form-label">
                      Role
                    </label>
                    <select
                      id="roleId"
                      name="roleId"
                      className="form-control"
                      value={newUser.roleId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Role</option>
                      {roles.map((role) => (
                        <option key={role.roleId} value={role.roleId}>
                          {role.roleName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSave}
                  >
                    {isEditMode ? "Update User" : "Add User"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AddUsers;
