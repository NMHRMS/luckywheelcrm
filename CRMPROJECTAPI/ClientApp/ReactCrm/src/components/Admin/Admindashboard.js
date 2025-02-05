import React from "react";
import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto";

function Dashboard() {
  // Dummy data for graphs and totals
  const totalData = {
    roles: 20,
    users: 50,
    branches: 15,
    dailySales: 30,
    positiveLeads: 18,
    totalCalls: 100,
    dailyCalls: 40,
  };

  // Data for the bar chart
  const barChartData = {
    labels: ["Daily Sales", "Positive Leads", "Total Calls", "Daily Calls"],
    datasets: [
      {
        label: "Performance Metrics",
        data: [
          totalData.dailySales,
          totalData.positiveLeads,
          totalData.totalCalls,
          totalData.dailyCalls,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  // Data for the line chart
  const lineChartData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Sales Performance",
        data: [10, 20, 15, 30],
        fill: true,
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54,162,235,0.2)",
      },
    ],
  };

  return (
    <div className="container mt-0">
       <div className="pagetitle mb-4">
        <h1>Admin Dashboard</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="#">Home</a>
            </li>
            <li className="breadcrumb-item active">Dashboard</li>
          </ol>
        </nav>
      </div>

      {/* Display total numbers */}
      <div className="row text-center mt-4">
        <div className="col-md-3 mb-3">
          <div
            className="p-3 rounded"
            style={{ backgroundColor: "#FFD700", color: "#000" }}
          >
            <h4>Roles</h4>
            <h2>{totalData.roles}</h2>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div
            className="p-3 rounded"
            style={{ backgroundColor: "#20B2AA", color: "#fff" }}
          >
            <h4>Users</h4>
            <h2>{totalData.users}</h2>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div
            className="p-3 rounded"
            style={{ backgroundColor: "#FF6347", color: "#fff" }}
          >
            <h4>Branches</h4>
            <h2>{totalData.branches}</h2>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div
            className="p-3 rounded"
            style={{ backgroundColor: "#4682B4", color: "#fff" }}
          >
            <h4>Daily Sales</h4>
            <h2>{totalData.dailySales}</h2>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div
            className="p-3 rounded"
            style={{ backgroundColor: "#32CD32", color: "#fff" }}
          >
            <h4>Positive Leads</h4>
            <h2>{totalData.positiveLeads}</h2>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div
            className="p-3 rounded"
            style={{ backgroundColor: "#8A2BE2", color: "#fff" }}
          >
            <h4>Total Calls</h4>
            <h2>{totalData.totalCalls}</h2>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div
            className="p-3 rounded"
            style={{ backgroundColor: "#FF4500", color: "#fff" }}
          >
            <h4>Daily Calls</h4>
            <h2>{totalData.dailyCalls}</h2>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row mt-4">
        <div className="col-md-6">
          <h4>Performance Metrics (Bar Chart)</h4>
          <Bar data={barChartData} />
        </div>
        <div className="col-md-6">
          <h4>Sales Performance (Line Chart)</h4>
          <Line data={lineChartData} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
