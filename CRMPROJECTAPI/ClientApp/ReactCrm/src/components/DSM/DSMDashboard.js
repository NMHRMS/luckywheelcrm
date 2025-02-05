import React from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

export default function DSMDashboard() {
  const cardData = [
    { title: "Total Deals", value: "2,340", icon: "bi bi-briefcase", bg: "primary" },
    { title: "Closed Deals", value: "1,120", icon: "bi bi-handshake", bg: "success" },
    { title: "Pending Approvals", value: "215", icon: "bi bi-clock", bg: "warning" },
    { title: "Rejected Deals", value: "105", icon: "bi bi-x-circle", bg: "danger" },
  ];

  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{ label: "Deals Closed", data: [30, 45, 55, 70, 65, 80], backgroundColor: "#007bff" }],
  };

  const doughnutData = {
    labels: ["Closed", "Pending", "Rejected"],
    datasets: [{ data: [55, 30, 15], backgroundColor: ["#28a745", "#ffc107", "#dc3545"] }],
  };

  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [{ label: "Deals Progress", data: [25, 40, 60, 50], borderColor: "#17a2b8", backgroundColor: "rgba(23,162,184,0.2)", fill: true }],
  };

  return (
    <div className="container mt-0">
      <div className="pagetitle mb-4">
        <h1>DSM Dashboard</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="#">Home</a></li>
            <li className="breadcrumb-item active">Dashboard</li>
          </ol>
        </nav>
      </div>

      <div className="row">
        {cardData.map((card, index) => (
          <div key={index} className="col-md-3">
            <div className={`card text-white bg-${card.bg} mb-3`}>
              <div className="card-body">
                <h5 className="card-title"><i className={card.icon}></i> {card.title}</h5>
                <h2 className="card-text">{card.value}</h2>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row">
        <div className="col-md-7">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title">Deals Overview</h5>
              <Bar data={barData} />
            </div>
          </div>
        </div>

        <div className="col-md-5">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title">Deals Status</h5>
              <Doughnut data={doughnutData} />
            </div>
          </div>
        </div>

        <div className="col-md-12">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title">Progress Trend</h5>
              <Line data={lineData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
