import React, { useEffect, useState } from "react";
import UserPerformance from "./UserPerformance";
import {
  Chart as ChartJS,
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
import { getRequest } from "../utils/Api";
import Loader from "../utils/Loader";

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

export default function AdminDashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Leads Data from API
  useEffect(() => {
    getRequest("/api/Leads/dashboard_leads")
      .then((response) => {
        console.log("API Response:", response.data.leads);
        setLeads(response.data.leads);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching leads:", error);
        setLeads([]);
        setLoading(false);
      });
  }, []);

  // Safe filtering by ensuring leads is an array
  const totalLeads = leads.length;
  const assignedLeads = leads.filter((lead) => lead.assignedTo !== null).length;
  const pending = leads.filter((lead) => lead.status === "Pending").length;
  const closedLeads = leads.filter((lead) => lead.status === "Closed").length;

  // Card Data
  const cardData = [
    {
      title: "Total Leads",
      value: totalLeads,
      icon: "bi bi-people",
      bg: "primary",
    },
    {
      title: "Assigned Leads",
      value: assignedLeads,
      icon: "bi bi-person-check",
      bg: "success",
    },
    {
      title: "Pending",
      value: pending,
      icon: "bi bi-telephone",
      bg: "warning",
    },
    {
      title: "Closed Leads",
      value: closedLeads,
      icon: "bi bi-handshake",
      bg: "secondary",
    },
  ];

  // Chart Data
  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "New Leads",
        data: [20, 35, 45, 60, 50, 70],
        backgroundColor: "#007bff",
      },
    ],
  };

  const doughnutData = {
    labels: [
      "Not Called",
      "Pending",
      "Closed",
      "Not Connected",
      "Positive",
      "Negative",
      "Connected",
    ],
    datasets: [
      {
        data: [
          leads.filter((lead) => lead.status === "Not Called").length,
          leads.filter((lead) => lead.status === "Pending").length,
          leads.filter((lead) => lead.status === "Closed").length,
          leads.filter((lead) => lead.status === "Not Connected").length,
          leads.filter((lead) => lead.status === "Positive").length,
          leads.filter((lead) => lead.status === "Negative").length,
          leads.filter((lead) => lead.status === "Connected").length,
        ],
        backgroundColor: [
          "#007bff", // Not Called (Blue)
          "#ffc107", // Pending (Yellow)
          "#28a745", // Closed (Green)
          "#dc3545", // Not Connected (Red)
          "#20c997", // Positive (Teal)
          "#6610f2", // Negative (Dark Purple)
          "#fd7e14", // Connected (Orange)
        ],
      },
    ],
  };

  return (
    <div className="container mt-0">
      {/* {/ Page Title /} */}
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

      {loading ? (
        <Loader />
      ) : (
        <>
          {/* {/ Cards Section /} */}
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
        </>
      )}
      <UserPerformance />
    </div>
  );
}
