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

export default function CREDashboard() {
  const cardData = [
    {
      title: "Assigned Leads",
      value: "450",
      icon: "bi bi-people",
      bg: "primary",
    },
    {
      title: "Pending Follow-ups",
      value: "220",
      icon: "bi bi-telephone",
      bg: "warning",
    },
    {
      title: "Positive Leads",
      value: "150",
      icon: "bi bi-handshake",
      bg: "success",
    },
    {
      title: "Negative Leads",
      value: "80",
      icon: "bi bi-x-circle",
      bg: "danger",
    },
    {
      title: "Rejected Leads",
      value: "150",
      icon: "bi bi-handshake",
      bg: "danger",
    },
    {
      title: "Closed Leads",
      value: "80",
      icon: "bi bi-x-circle",
      bg: "secondary",
    },
  ];

  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "New Leads",
        data: [50, 80, 90, 120, 100, 140],
        backgroundColor: "#007bff",
      },
    ],
  };

  const doughnutData = {
    labels: ["New", "Follow-up", "Closed", "Rejected"],
    datasets: [
      {
        data: [40, 30, 20, 10],
        backgroundColor: ["#007bff", "#ffc107", "#28a745", "#dc3545"],
      },
    ],
  };

  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Follow-ups",
        data: [10, 25, 35, 30],
        borderColor: "#17a2b8",
        backgroundColor: "rgba(23,162,184,0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div className="container mt-0">
      <div className="pagetitle mb-4">
        <h1>CRE Dashboard</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="#">Home</a>
            </li>
            <li className="breadcrumb-item active">Dashboard</li>
          </ol>
        </nav>
      </div>

      <div className="row">
        {cardData.map((card, index) => (
          <div key={index} className="col-md-3">
            <div className={`card text-white bg-${card.bg} mb-3`}>
              <div className="card-body">
                <h5 className="card-title">
                  <i className={card.icon}></i> {card.title}
                </h5>
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
              <h5 className="card-title">Leads Overview</h5>
              <Bar data={barData} />
            </div>
          </div>
        </div>

        <div className="col-md-5">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title">Leads Status</h5>
              <Doughnut data={doughnutData} />
            </div>
          </div>
        </div>

        <div className="col-md-12">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title">Follow-ups Trend</h5>
              <Line data={lineData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
