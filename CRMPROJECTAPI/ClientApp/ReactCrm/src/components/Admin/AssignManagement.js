import React, { useEffect, useState } from "react";
import { getRequest, postRequest } from "../utils/Api";

export default function AssignManagement() {
  const [users, setUsers] = useState([]);
  const [assigner, setAssigner] = useState("");
  const [assignees, setAssignees] = useState([]); // Array for multiple selections
  const [assignments, setAssignments] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Toggle for custom dropdown

  useEffect(() => {
    getRequest("/api/Users")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));

    getRequest("/api/UserAssignmentMapping/get-mappings")
      .then((response) => setAssignments(response.data))
      .catch((error) => console.error("Error fetching assignments:", error));
  }, []);

  const getUserName = (userId) => {
    const user = users.find((u) => u.userId === userId);
    return user ? user.firstName : "Unknown";
  };

  const handleAssign = async () => {
    if (assigner && assignees.length > 0) {
      const payload = {
        assignerUserId: assigner,
        assigneeUserIds: assignees, // Send multiple assignees
      };

      try {
        const response = await postRequest(
          "/api/UserAssignmentMapping/set-mapping",
          payload
        );
        if (response.data === "Mapping updated successfully.") {
          setAssignments([...assignments, payload]);
        } else {
          alert("Assignment failed: " + response.data);
        }
      } catch (error) {
        console.error("Error assigning users:", error);
        alert("Assignment error: " + error.message);
      }
    }
  };

  const handleCheckboxChange = (userId) => {
    setAssignees((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId) // Remove if already selected
        : [...prev, userId] // Add if not selected
    );
  };

  return (
    <div className="container mt-4">
      <h2>Assign Management</h2>
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">Assigner</label>
          <select
            className="form-select"
            value={assigner}
            onChange={(e) => setAssigner(e.target.value)}
          >
            <option value="">Select Assigner</option>
            {users.map((user) => (
              <option key={user.userId} value={user.userId}>
                {user.firstName}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Assignees</label>
          <div className="dropdown">
            <button
              className="form-select"
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {assignees.length > 0
                ? assignees.map((id) => getUserName(id)).join(", ")
                : "Select Assignees"}
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu show w-100" style={{ maxHeight: "200px", overflowY: "auto" }}>
                {users.map((user) => (
                  <div key={user.userId} className="dropdown-item">
                    <input
                      type="checkbox"
                      className="form-check-input me-2"
                      checked={assignees.includes(user.userId)}
                      onChange={() => handleCheckboxChange(user.userId)}
                    />
                    {user.firstName}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <button className="btn btn-primary" onClick={handleAssign}>
        Assign
      </button>
      <table className="table table-bordered mt-4">
        <thead>
          <tr>
            <th>Sr. No</th>
            <th>Assigner</th>
            <th>Assignees</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{getUserName(assignment.assignerUserId)}</td>
              <td>{assignment.assigneeUserIds.map((id) => getUserName(id)).join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
