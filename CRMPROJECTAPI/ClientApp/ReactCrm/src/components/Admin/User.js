import { useState, useEffect } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function User() {
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    roleid: "",
    branchid: "",
    status: "",
  });
  const [newData, setNewData] = useState([]);
  const [id, setId] = useState(undefined);
  const [roles, setRoles] = useState([]);
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    // Fetch roles
    axios
      .get("http://localhost:8081/role")
      .then((res) => {
        if (Array.isArray(res.data.data)) {
          setRoles(res.data.data);
        } else {
          console.error("Error: Roles data is not an array");
        }
      })
      .catch((error) => console.log(error));

    // Fetch branches
    axios
      .get("http://localhost:8081/branches")
      .then((res) => {
        if (Array.isArray(res.data.data)) {
          setBranches(res.data.data);
        } else {
          console.error("Error: Branches data is not an array");
        }
      })
      .catch((error) => console.log(error));

    loadData();
  }, []);

  function handleChange(e) {
    console.log(`Updating field ${e.target.id} to value ${e.target.value}`);
    setData({ ...data, [e.target.id]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (id === undefined) {
      axios
        .post("http://localhost:8081/user", data)
        .then((res) => {
          console.log(res.data);
          loadData();
        })
        .catch((error) => console.log(error));
    } else {
      axios
        .put(`http://localhost:8081/user/${id}`, data)
        .then((res) => {
          console.log(res.data);
          loadData();
          setId(undefined);
        })
        .catch((error) => console.log(error));
    }

    // Reset data and close modal
    setData({
      username: "",
      email: "",
      password: "",
      roleid: "",
      branchid: "",
      status: "",
    });
    handleCloseModal();
  }

  function loadData() {
    axios
      .get("http://localhost:8081/user")
      .then((res) => {
        console.log(res.data.data);
        setNewData(res.data.data);
      })
      .catch((error) => console.log(error));
  }

  function handleDelete(id) {
    axios
      .delete(`http://localhost:8081/user/${id}`)
      .then((res) => {
        console.log(res.data);
        loadData();
      })
      .catch((error) => console.log(error));
  }

  function handleUpdate(id) {
    console.log("Editing user with ID:", id);
    setId(id);
    axios
      .get(`http://localhost:8081/user/${id}`)
      .then((res) => {
        console.log("Fetched data for edit:", res.data); // Debug
        const user = res.data.data[0]; // Assuming the user data is in an array
        setData({
          username: user.username || "",
          email: user.email || "",
          password: user.password || "",
          roleid: user.roleid || "",
          branchid: user.branchid || "",
          status: user.status || "",
        });
        setShowModal(true);
      })
      .catch((error) => console.error("Error fetching user data:", error));
  }

  const handleAddButtonClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Helper function to get role name by roleid
  const getRoleNameById = (roleid) => {
    const role = roles.find((role) => role.id === roleid);
    return role ? role.name : "Unknown Role";
  };

  // Helper function to get branch name by branchid
  const getBranchNameById = (branchid) => {
    const branch = branches.find((branch) => branch.id === branchid);
    return branch ? branch.name : "Unknown Branch";
  };

  return (
    <div className="container mt-2">
      <div className="row justify-content-center">
        <div className="card-body mt-2">
          <h5 className="card-title text-left mb-3" style={{ fontSize: 25 }}>
            User Form
          </h5>

          <div className="card mt-1">
            <div className="card-body">
              <div className="row align-items-center mb-3">
                <div className="col-auto ms-auto" style={{ marginTop: 10 }}>
                  <button
                    type="button"
                    className="btn text-light bg-primary"
                    onClick={handleAddButtonClick}
                  >
                    Add User
                  </button>
                </div>
              </div>

              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th className="text-da">Id</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Branch</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {newData.length > 0 ? (
                    newData.map((user, index) => (
                      <tr key={user.id}>
                        <td>{index + 1}</td> {/* Auto-incremented index */}
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.status}</td>
                        <td>{getBranchNameById(user.branchid)}</td>
                        <td>{getRoleNameById(user.roleid)}</td>
                        <td>
                          <button
                            className="btn btn-sm mx-1"
                            onClick={() => handleUpdate(user.id)}
                          >
                            <i className="fas fa-pen text-primary"></i>
                          </button>
                          <button
                            className="btn btn-sm mx-1"
                            onClick={() => handleDelete(user.id)}
                          >
                            <i className="fas fa-trash text-danger"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {showModal && (
            <div
              className="modal fade show"
              style={{ display: "block", background: "rgba(0, 0, 0, 0.5)" }}
              role="dialog"
            >
              <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content w-50 mx-auto">
                  <div className="modal-header">
                    <h5 className="modal-title">Add/Update User</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={handleCloseModal}
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <form className="row g-3">
                      <div className="col-12">
                        <label htmlFor="username" className="form-label">
                          Username
                        </label>
                        <input
                          name="username"
                          id="username"
                          value={data.username}
                          onChange={handleChange}
                          type="text"
                          className="form-control"
                        />
                      </div>
                      <div className="col-12">
                        <label htmlFor="email" className="form-label">
                          Email
                        </label>
                        <input
                          name="email"
                          id="email"
                          value={data.email}
                          onChange={handleChange}
                          type="email"
                          className="form-control"
                        />
                      </div>
                      <div className="col-12">
                        <label htmlFor="password" className="form-label">
                          Password
                        </label>
                        <input
                          name="password"
                          id="password"
                          value={data.password}
                          onChange={handleChange}
                          type="password"
                          className="form-control"
                          autoComplete="current-password"
                        />
                      </div>
                      <div className="col-12">
                        <label htmlFor="roleid" className="form-label">
                          Role
                        </label>
                        <select
                          id="roleid"
                          value={data.roleid || ""}
                          onChange={handleChange}
                          className="form-select"
                        >
                          <option value="">Select Role</option>
                          {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-12">
                        <label htmlFor="branchid" className="form-label">
                          Branch
                        </label>
                        <select
                          id="branchid"
                          value={data.branchid}
                          onChange={handleChange}
                          className="form-select"
                        >
                          <option value="">Select Branch</option>
                          {branches.map((branch) => (
                            <option key={branch.id} value={branch.id}>
                              {branch.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-12">
                        <label htmlFor="status" className="form-label">
                          Status
                        </label>
                        <select
                          id="status"
                          value={data.status}
                          onChange={handleChange}
                          className="form-select"
                        >
                          <option value="">Select Status</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCloseModal}
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      onClick={handleSubmit}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
