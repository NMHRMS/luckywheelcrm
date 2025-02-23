"use client";

import { useState, useEffect } from "react";
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
} from "../utils/Api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchStoredData } from "../utils/UserDataUtils";

const AddUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [roles, setRoles] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [branches, setBranches] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [getUser, setGetuser] = useState("");
  const [errors, setErrors] = useState({});
  const [showBranchesAndCategories, setShowBranchesAndCategories] =
    useState(false);
  const [showOnlyBranches, setShowOnlyBranches] = useState(false);

  const [newUser, setNewUser] = useState({
    firstName: "",
    // lastName: "",
    emailId: "",
    password: "",
    contactNumber: "",
    branchId: "",
    roleId: "",
    categoriesId: "",
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    // First Name validation
    if (!newUser.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    // Last Name validation
    // if (!newUser.lastName.trim()) {
    //   newErrors.lastName = "Last name is required";
    // }

    // Email validation
    if (!newUser.emailId) {
      newErrors.emailId = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(newUser.emailId)) {
      newErrors.emailId = "Invalid email format";
    }

    // Password validation
    if (!newUser.password) {
      newErrors.password = "Password is required";
    }

    // Contact Number validation
    if (!newUser.contactNumber) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!/^\d{10}$/.test(newUser.contactNumber)) {
      newErrors.contactNumber = "Contact number must be 10 digits";
    }

    // Role validation
    if (!newUser.roleId) {
      newErrors.roleId = "Role is required";
    }

    // Branch validation (if required)
    if ((showBranchesAndCategories || showOnlyBranches) && !newUser.branchId) {
      newErrors.branchId = "Branch is required";
    }

    // Category validation (if required)
    if (showBranchesAndCategories && !newUser.categoriesId) {
      newErrors.categoriesId = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const loadUserData = async () => {
      const storedData = await fetchStoredData();
      if (storedData) {
        setGetuser(storedData);
      }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    getRequest("/api/users")
      .then((res) => {
        setUsers(res.data);
        setFilteredUsers(res.data);
      })
      .catch((error) => toast.error("Error fetching users: ", error));

    getRequest("/api/Roles")
      .then((res) => setRoles(res.data))
      .catch((error) => toast.error("Error fetching roles: ", error));

    getRequest("/api/Companies")
      .then((res) => setCompanies(res.data))
      .catch((error) => toast.error("Error fetching companies: ", error));

    getRequest("/api/Branch")
      .then((res) => setBranches(res.data))
      .catch((error) => toast.error("Error fetching branches: ", error));
  }, []);

  const handleRoleFilterChange = (e) => {
    const selectedRoleId = e.target.value;
    setSelectedRole(selectedRoleId);
    if (selectedRoleId) {
      const filtered = users.filter(
        (user) => user.roleId.toString() === selectedRoleId
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  };

  const handleClearFilter = () => {
    setSelectedRole("");
    setFilteredUsers(users);
  };

  const handleDelete = (userId) => {
    deleteRequest(`/api/users/${userId}`)
      .then(() => {
        const updatedUsers = users.filter((user) => user.userId !== userId);
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        toast.success("User deleted successfully");
      })
      .catch((error) => toast.error("Error deleting user: ", error));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    if (name === "roleId") {
      const selectedRoleId = value.toLowerCase();
      const roleWithBranchesAndCategories = [
        "633b4045-ae76-43ce-9419-cbf91b4bfd07",
        "82cf21da-45cd-4fe2-b892-7b5cb2bc8883",
      ];
      const roleWithOnlyBranches = [
        "da9f9bc0-e58a-4a9f-8d59-183099ce2ba9",
        "a8c8ea20-7154-4d78-97ea-a4d5cf217a27",
      ];

      if (roleWithBranchesAndCategories.includes(selectedRoleId)) {
        setShowBranchesAndCategories(true);
        setShowOnlyBranches(false);
      } else if (roleWithOnlyBranches.includes(selectedRoleId)) {
        setShowBranchesAndCategories(false);
        setShowOnlyBranches(true);
      } else {
        setShowBranchesAndCategories(false);
        setShowOnlyBranches(false);

        setNewUser((prevUser) => ({
          ...prevUser,
          branchId: null,
          categoriesId: null,
        }));
      }
    }

    setNewUser((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (!getUser.companyId) return;

    if (validateForm()) {
      if (isEditMode) {
        const updateUser = { ...newUser, userId: currentUserId };

        putRequest(`/api/users/${currentUserId}`, updateUser)
          .then((res) => {
            const updatedUsers = users.map((user) =>
              user.userId === currentUserId ? res.data : user
            );
            setUsers(updatedUsers);
            setFilteredUsers(updatedUsers);
            setShowModal(false);
            resetNewUser();
            toast.success("User updated successfully");
          })
          .catch((error) => {
            console.error("Error updating user:", error);
            toast.error("Error updating user");
          });
      } else {
        const data = {
          ...newUser,
          companyId: getUser.companyId,
        };

        postRequest("/api/users", data)
          .then((res) => {
            const updatedUsers = [...users, res.data];
            setUsers(updatedUsers);
            setFilteredUsers(updatedUsers);
            setShowModal(false);
            resetNewUser();
            toast.success("User added successfully");
          })
          .catch((error) => {
            console.error("Error adding user:", error);
            toast.error("Error adding user");
          });
      }
    } else {
      toast.error("Please fill in all required fields correctly");
    }
  };

  const handleEdit = (userId) => {
    const user = users.find((user) => user.userId === userId);
    if (user) {
      setIsEditMode(true);
      setCurrentUserId(userId);
      setNewUser({ ...user });
      setShowModal(true);
    }
  };

  const resetNewUser = () => {
    setNewUser({
      firstName: "",
      lastName: "",
      emailId: "",
      password: "",
      contactNumber: "",
      branchId: 0,
      roleId: 0,
      categoriesId: 0,
    });
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredUsers(users);
    } else {
      const searchResults = users.filter((user) => {
        const firstName = user.firstName ? user.firstName.toLowerCase() : "";
        const lastName = user.lastName ? user.lastName.toLowerCase() : "";
        const emailId = user.emailId ? user.emailId.toLowerCase() : "";

        return (
          firstName.includes(query.toLowerCase()) ||
          lastName.includes(query.toLowerCase()) ||
          emailId.includes(query.toLowerCase())
        );
      });

      setFilteredUsers(searchResults);
    }
  };

  return (
    <div className="container mt-1">
      <ToastContainer />
      <h3>User List</h3>

      <div className="mb-2 d-flex">
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search users..."
          value={searchQuery}
          onChange={handleSearchChange}
        />

        <select
          id="roleFilter"
          className="form-control w-25 ms-2"
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

        <button
          className="btn btn-outline-secondary ms-2"
          onClick={handleClearFilter}
        >
          Clear Filter
        </button>

        <button
          className="btn btn-primary ms-auto"
          onClick={() => {
            setIsEditMode(false);
            resetNewUser();
            setShowModal(true);
          }}
        >
          Add User
        </button>
      </div>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Full Name</th>
            {/* <th>Last Name</th> */}
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
                {/* <td>{user.lastName}</td> */}
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
                      Full Name
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.firstName ? "is-invalid" : ""
                      } `}
                      // className="d-none"
                      id="firstName"
                      name="firstName"
                      value={newUser.firstName}
                      onChange={handleInputChange}
                    />
                    {errors.firstName && (
                      <div className="invalid-feedback">{errors.firstName}</div>
                    )}
                  </div>
                  {/* <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.lastName ? "is-invalid" : ""
                      }`}
                      id="lastName"
                      name="lastName"
                      value={newUser.lastName}
                      onChange={handleInputChange}
                    />
                    {errors.lastName && (
                      <div className="invalid-feedback">{errors.lastName}</div>
                    )}
                  </div> */}
                  <div className="mb-3">
                    <label htmlFor="emailId" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className={`form-control ${
                        errors.emailId ? "is-invalid" : ""
                      }`}
                      id="emailId"
                      name="emailId"
                      value={newUser.emailId}
                      onChange={handleInputChange}
                    />
                    {errors.emailId && (
                      <div className="invalid-feedback">{errors.emailId}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className={`form-control ${
                        errors.password ? "is-invalid" : ""
                      }`}
                      id="password"
                      name="password"
                      value={newUser.password}
                      onChange={handleInputChange}
                    />
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="contactNumber" className="form-label">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.contactNumber ? "is-invalid" : ""
                      }`}
                      id="contactNumber"
                      name="contactNumber"
                      value={newUser.contactNumber}
                      onChange={handleInputChange}
                    />
                    {errors.contactNumber && (
                      <div className="invalid-feedback">
                        {errors.contactNumber}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="roleId" className="form-label">
                      Role
                    </label>
                    <select
                      id="roleId"
                      name="roleId"
                      className={`form-control ${
                        errors.roleId ? "is-invalid" : ""
                      }`}
                      value={newUser.roleId}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Role</option>
                      {roles.map((role) => (
                        <option key={role.roleId} value={role.roleId}>
                          {role.roleName}
                        </option>
                      ))}
                    </select>
                    {errors.roleId && (
                      <div className="invalid-feedback">{errors.roleId}</div>
                    )}
                  </div>

                  {(showBranchesAndCategories || showOnlyBranches) && (
                    <div className="mb-3">
                      <label htmlFor="branchId" className="form-label">
                        Branch
                      </label>
                      <select
                        id="branchId"
                        name="branchId"
                        className={`form-control ${
                          errors.branchId ? "is-invalid" : ""
                        }`}
                        value={newUser.branchId}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Branch</option>
                        {branches.map((branch) => (
                          <option key={branch.branchId} value={branch.branchId}>
                            {branch.name}
                          </option>
                        ))}
                      </select>
                      {errors.branchId && (
                        <div className="invalid-feedback">
                          {errors.branchId}
                        </div>
                      )}
                    </div>
                  )}
                  {showBranchesAndCategories && (
                    <div className="mb-3">
                      <label htmlFor="categoriesId" className="form-label">
                        Categories/Vertical
                      </label>
                      <select
                        id="categoriesId"
                        name="categoriesId"
                        className={`form-control ${
                          errors.categoriesId ? "is-invalid" : ""
                        }`}
                        value={newUser.categoriesId}
                        onChange={handleInputChange}
                      >
                        <option value="">Select categories</option>
                        <option value="1"> HCV </option>
                        <option value="2"> Bus </option>
                        <option value="3"> Icv </option>
                      </select>
                      {errors.categoriesId && (
                        <div className="invalid-feedback">
                          {errors.categoriesId}
                        </div>
                      )}
                    </div>
                  )}
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
