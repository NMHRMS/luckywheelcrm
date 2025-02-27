import React, { useState, useEffect } from "react";
import { getRequest } from "../utils/Api";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import Loader from "../utils/Loader";

const UserPerformance = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [assignedLeads, setAssignedLeads] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch users on mount
  useEffect(() => {
    setLoading(true);
    getRequest("/api/users")
      .then((res) => {
        const validRoleIds = [
          "a8c8ea20-7154-4d78-97ea-a4d5cf217a27",
          "82cf21da-45cd-4fe2-b892-7b5cb2bc8883",
        ];
        const filteredUsers = res.data.filter((user) =>
          validRoleIds.includes(user.roleId)
        );
        setUsers(filteredUsers);

        // Set the first user as selected by default
        if (filteredUsers.length > 0) {
          setSelectedUser(filteredUsers[0].userId);
        }
      })
      .catch((error) => console.error("Error fetching users: ", error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedUser) {
      setLoading(true);
      getRequest(`/api/Leads/dashboard_leads_user?userId=${selectedUser}`)
        .then((res) => {
          setAssignedLeads(res.data);
        })
        .catch((error) =>
          console.error("Error fetching assigned leads: ", error)
        )
        .finally(() => setLoading(false));
    } else {
      setAssignedLeads(null);
    }
  }, [selectedUser]);

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
  };

  const leadStatuses = [
    { label: "Total Assigned", key: "totalAssignedCount", color: "#FFCE56" },
    { label: "Positive", key: "interestedCount", color: "#32CD32" },
    { label: "Negative", key: "notInterestedCount", color: "#FF4500" },
    { label: "Not Called", key: "notCalledCount", color: "#8A2BE2" },
    { label: "Connected", key: "connectedCount", color: "#36A2EB" },
    { label: "Not Connected", key: "notConnectedCount", color: "#FF6384" },
    { label: "Pending", key: "pendingCount", color: "#FFA500" },
    { label: "Closed", key: "closedCount", color: "#4BC0C0" },
  ];

  const totalLeads = assignedLeads ? assignedLeads.totalAssignedCount || 0 : 0;

  const generateLabelsWithPercentages = () => {
    if (!assignedLeads || totalLeads === 0) return [];
    return leadStatuses.map((status) => {
      const value = assignedLeads[status.key] || 0;
      return `${status.label} (${((value / totalLeads) * 100).toFixed(2)}%)`;
    });
  };

  const pieChartData = assignedLeads
    ? {
        labels: generateLabelsWithPercentages(),
        datasets: [
          {
            data: leadStatuses.map((status) => assignedLeads[status.key] || 0),
            backgroundColor: leadStatuses.map((status) => status.color),
          },
        ],
      }
    : null;

  return (
    <div className="container mt-3">
      <h4>User Performance</h4>

      {loading && <Loader />}
      {/* {/ Show Loader when loading /} */}

      {!loading && (
        <>
          <div className="mb-3 col-sm-3">
            <label htmlFor="userSelect" className="form-label">
              Select User:
            </label>
            <select
              id="userSelect"
              className="form-control"
              value={selectedUser}
              onChange={handleUserChange}
            >
              {users.map((user) => (
                <option key={user.userId} value={user.userId}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
          </div>

          {selectedUser && assignedLeads && (
            <>
              <h4>Lead Details</h4>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {leadStatuses.map((status, index) => (
                    <tr key={index}>
                      <td>
                        <span
                          style={{
                            display: "inline-block",
                            width: "15px",
                            height: "15px",
                            backgroundColor: status.color,
                            marginRight: "5px",
                          }}
                        ></span>
                        {status.label}
                      </td>
                      <td>{assignedLeads[status.key] || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4">
                <h4>Lead Distribution</h4>
                <div style={{ width: "50%", margin: "0 auto" }}>
                  {pieChartData && (
                    <Pie data={pieChartData} plugins={[ChartDataLabels]} />
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default UserPerformance;
