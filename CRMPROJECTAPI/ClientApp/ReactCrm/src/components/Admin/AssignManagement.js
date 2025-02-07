import React, { useEffect, useState } from "react";
import { getRequest, postRequest } from "../utils/Api";

export default function AssignManagement() {
  const [users, setUsers] = useState([]);
  const [assigner, setAssigner] = useState("");
  const [assignee, setAssignee] = useState("");
  const [assignments, setAssignments] = useState([]);

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
    if (assigner && assignee) {
      const payload = {
        assignerUserId: assigner,
        assigneeUserId: assignee,
      };

      try {
        const response = await postRequest("/api/UserAssignmentMapping/set-mapping", payload);
        if (response.data === "Mapping updated successfully.") {
          setAssignments([...assignments, payload]);
        } else {
          alert("Assignment failed: " + response.data);
        }
      } catch (error) {
        console.error("Error assigning users:", error);
        if (error.response) {
          console.error("Response error:", error.response.data);
        }
        alert("Assignment error: " + error.message);
      }
    }
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
          <label className="form-label">Assignee</label>
          <select
            className="form-select"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
          >
            <option value="">Select Assignee</option>
            {users.map((user) => (
              <option key={user.userId} value={user.userId}>
                {user.firstName}
              </option>
            ))}
          </select>
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
              <td>
                {assignment.assigneeUserIds
                  .map((id) => getUserName(id))
                  .join(", ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
