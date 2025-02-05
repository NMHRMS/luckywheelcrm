import React from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export default function DSEDashboard() {
  const cardData = [
    { title: "Total Deals", value: "950", icon: "bi bi-briefcase", bg: "primary" },
    { title: "Pending Deals", value: "340", icon: "bi bi-hourglass", bg: "warning" },
    { title: "Successful Deals", value: "610", icon: "bi bi-check-circle", bg: "success" },
    { title: "Failed Deals", value: "75", icon: "bi bi-x-circle", bg: "danger" },
  ];

  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{ label: "Monthly Deals", data: [30, 50, 65, 80, 70, 95], backgroundColor: "#007bff" }],
  };

  const doughnutData = {
    labels: ["Pending", "Successful", "Failed"],
    datasets: [{ data: [35, 55, 10], backgroundColor: ["#ffc107", "#28a745", "#dc3545"] }],
  };

  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [{ label: "Weekly Performance", data: [20, 45, 65, 50], borderColor: "#17a2b8", backgroundColor: "rgba(23,162,184,0.2)", fill: true }],
  };

  return (
    <div className="container mt-0">
      <div className="pagetitle mb-4">
        <h1>DSE Dashboard</h1>
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
              <h5 className="card-title">Monthly Deals Overview</h5>
              <Bar data={barData} />
            </div>
          </div>
        </div>

        <div className="col-md-5">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title">Deal Status</h5>
              <Doughnut data={doughnutData} />
            </div>
          </div>
        </div>

        <div className="col-md-12">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title">Weekly Performance Trend</h5>
              <Line data={lineData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
