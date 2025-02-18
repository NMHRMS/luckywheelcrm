import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
} from "../utils/Api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuthData, fetchStoredData } from "../utils/UserDataUtils";

const AddUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [roles, setRoles] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [branches, setBranches] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [getUser, setGetuser] = useState("");
  const [showBranchesAndCategories, setShowBranchesAndCategories] =
    useState(false);
  const [showOnlyBranches, setShowOnlyBranches] = useState(false);

  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
    contactNumber: "",
    branchId: "",
    roleId: "",
    categoriesId: "",
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

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

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setNewUser((prevUser) => ({
  //     ...prevUser,
  //     [name]: value,
  //   }));
  // };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    console.log(`Selected ${name}:`, value);

    if (name === "roleId") {
      const selectedRoleId = value.toLowerCase(); // Normalize case

      // Define role IDs for case-insensitive comparison
      const roleWithBranchesAndCategories = [
        "633b4045-ae76-43ce-9419-cbf91b4bfd07",
        "82cf21da-45cd-4fe2-b892-7b5cb2bc8883",
        "a8c8ea20-7154-4d78-97ea-a4d5cf217a27",
      ];
      const roleWithOnlyBranches = ["da9f9bc0-e58a-4a9f-8d59-183099ce2ba9"];

      console.log("Normalized roleId:", selectedRoleId);

      if (roleWithBranchesAndCategories.includes(selectedRoleId)) {
        console.log(
          "Matched roleId for showing branches & categories:",
          selectedRoleId
        );
        setShowBranchesAndCategories(true);
        setShowOnlyBranches(false);
      } else if (roleWithOnlyBranches.includes(selectedRoleId)) {
        console.log(
          "Matched roleId for showing only branches:",
          selectedRoleId
        );
        setShowBranchesAndCategories(false);
        setShowOnlyBranches(true);
      } else {
        console.log("No matching roleId:", selectedRoleId);
        setShowBranchesAndCategories(false);
        setShowOnlyBranches(false);

        // Set branchId and categoriesId to null when not needed
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
        .catch((error) => console.error("Error updating user:", error));
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
        .catch((error) => toast.error("Error adding user"));
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

                  {(showBranchesAndCategories || showOnlyBranches) && (
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
                  )}
                  {showBranchesAndCategories && (
                    <div className="mb-3">
                      <label htmlFor="categoriesId" className="form-label">
                        Categories/Vertical
                      </label>
                      <select
                        id="categoriesId"
                        name="categoriesId"
                        className="form-control"
                        value={newUser.categoriesId}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select categories</option>
                        <option value="1"> HCV </option>
                        <option value="2"> Bus </option>
                        <option value="3"> Icv </option>
                      </select>
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
