import React, { useState, useEffect } from "react";
import { getRequest } from "../utils/Api";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

const UserPerformance = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [assignedLeads, setAssignedLeads] = useState(null);

  useEffect(() => {
    getRequest("/api/users")
      .then((res) => setUsers(res.data))
      .catch((error) => console.error("Error fetching users: ", error));
  }, []);

  const handleUserChange = (e) => {
    const userId = e.target.value;
    setSelectedUser(userId);

    if (userId) {
      getRequest(`/api/Leads/dashboard_leads_user?userId=${userId}`)
        .then((res) => setAssignedLeads(res.data))
        .catch((error) =>
          console.error("Error fetching assigned leads: ", error)
        );
    } else {
      setAssignedLeads(null);
    }
  };

  // Calculate total leads dynamically
  const totalLeads = assignedLeads
    ? Object.values(assignedLeads).reduce((sum, count) => sum + count, 0)
    : 0;

  const leadStatuses = [
    { label: "Pending", value: assignedLeads?.pendingCount || 0, color: "#FFCE56" },
    { label: "Connected", value: assignedLeads?.connectedCount || 0, color: "#36A2EB" },
    { label: "Not Connected", value: assignedLeads?.notConnectedCount || 0, color: "#FF6384" },
    { label: "Interested", value: assignedLeads?.interestedCount || 0, color: "#32CD32" },
    { label: "Not Interested", value: assignedLeads?.notInterestedCount || 0, color: "#FF4500" },
    { label: "Not Called", value: assignedLeads?.notCalledCount || 0, color: "#8A2BE2" },
    { label: "Closed", value: assignedLeads?.closedCount || 0, color: "#4BC0C0" },
  ];

  // Generate labels with percentages dynamically
  const generateLabelsWithPercentages = () => {
    if (!assignedLeads || totalLeads === 0) return [];

    return leadStatuses.map(
      (status) =>
        `${status.label} (${((status.value / totalLeads) * 100).toFixed(2)}%)`
    );
  };

  // Pie Chart Data
  const pieChartData = assignedLeads
    ? {
        labels: generateLabelsWithPercentages(),
        datasets: [
          {
            data: leadStatuses.map((status) => status.value),
            backgroundColor: leadStatuses.map((status) => status.color),
          },
        ],
      }
    : null;

  // Pie Chart Options for Displaying Percentages
  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      datalabels: {
        color: "#fff",
        font: {
          weight: "bold",
        },
        formatter: (value, ctx) => {
          let sum = ctx.dataset.data.reduce((a, b) => a + b, 0);
          let percentage = ((value / sum) * 100).toFixed(2) + "%";
          return percentage;
        },
      },
    },
  };

  return (
    <div className="container mt-3">
      <h3>User Performance</h3>
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
          <option value="">Select a User</option>
          {users.map((user) => (
            <option key={user.userId} value={user.userId}>
              {user.firstName} {user.lastName}
            </option>
          ))}
        </select>
      </div>

      {selectedUser && (
        <div>
          {assignedLeads && assignedLeads.totalAssignedCount > 0 ? (
            <>
              {/* {/ Table for Lead Distribution /} */}
              <h4>Lead Details</h4>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Count</th>
                    {/* {/ <th>Percentage</th> /} */}
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
                      <td>{status.value}</td>
                      {/* <td>
                        {totalLeads > 0
                          ? ((status.value / totalLeads) * 100).toFixed(2) + "%"
                          : "0%"}
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* {/ Pie Chart Section /} */}
              <div className="mt-4">
                <h4>Lead Distribution</h4>
                <div style={{ width: "50%", margin: "0 auto" }}>
                  <Pie
                    data={pieChartData}
                    options={pieChartOptions}
                    plugins={[ChartDataLabels]}
                  />
                </div>
              </div>
            </>
          ) : (
            <p>No assigned leads found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default UserPerformance;
