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

// Register required Chart.js components
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

export default function SalesManagerDashboard() {
  // Dummy data for cards
  const cardData = [
    {
      title: "Total Revenue",
      value: "$124,500",
      icon: "bi bi-cash",
      bg: "primary",
    },
    {
      title: "Total Sales",
      value: "865",
      icon: "bi bi-cart",
      bg: "success",
    },
    {
      title: "Active Clients",
      value: "320",
      icon: "bi bi-person",
      bg: "warning",
    },
    {
      title: "Closed Deals",
      value: "150",
      icon: "bi bi-handshake",
      bg: "secondary",
    },
  ];

  // Dummy chart data
  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Monthly Sales",
        data: [20000, 35000, 45000, 60000, 50000, 70000],
        backgroundColor: "#007bff",
      },
    ],
  };

  const doughnutData = {
    labels: ["New", "Repeat", "Referral"],
    datasets: [
      {
        data: [50, 30, 20],
        backgroundColor: ["#007bff", "#ffc107", "#28a745"],
      },
    ],
  };

  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Sales Growth",
        data: [5000, 10000, 20000, 30000],
        borderColor: "#17a2b8",
        backgroundColor: "rgba(23,162,184,0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div className="container mt-0">
      {/* Page Title */}
      <div className="pagetitle mb-4">
        <h1>Sales Manager Dashboard</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="#">Home</a>
            </li>
            <li className="breadcrumb-item active">Dashboard</li>
          </ol>
        </nav>
      </div>

      {/* Cards Section */}
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

      {/* Charts Section */}
      <div className="row">
        <div className="col-md-7">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title">Sales Performance</h5>
              <Bar data={barData} />
            </div>
          </div>
        </div>

        <div className="col-md-5">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title">Customer Segments</h5>
              <Doughnut data={doughnutData} />
            </div>
          </div>
        </div>

        <div className="col-md-12">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title">Sales Growth Trend</h5>
              <Line data={lineData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
