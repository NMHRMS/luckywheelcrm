import React, { useEffect, useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
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

export default function DashboardCRM() {
  const [leads, setLeads] = useState([]);

  // Fetch Leads Data from API
  useEffect(() => {
    getRequest("/api/Leads")
      .then((response) => {
        console.log("API Response:", response.data); // Debugging
        // Ensure response.data contains an array
        const leadData = response.data?.newLeads || []; // Adjust if API structure differs
        setLeads(Array.isArray(leadData) ? leadData : []);
      })
      .catch((error) => {
        console.error("Error fetching leads:", error);
        setLeads([]); // Prevent errors
      });
  }, []);

  // Safe filtering by ensuring leads is an array
  const totalLeads = Array.isArray(leads) ? leads.length : 0;
  const assignedLeads = Array.isArray(leads)
    ? leads.filter((lead) => lead.assignedTo !== null).length
    : 0;
  const pending = Array.isArray(leads)
    ? leads.filter((lead) => lead.status === "Pending").length
    : 0;
  const closedDeals = Array.isArray(leads)
    ? leads.filter((lead) => lead.status === "Closed").length
    : 0;

  // Card Data
  const cardData = [
    { title: "Total Leads", value: totalLeads, icon: "bi bi-people", bg: "primary" },
    { title: "Assigned Leads", value: assignedLeads, icon: "bi bi-person-check", bg: "success" },
    { title: "Pending", value: pending, icon: "bi bi-telephone", bg: "warning" },
    { title: "Closed Deals", value: closedDeals, icon: "bi bi-handshake", bg: "secondary" },
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
    labels: ["New", "In Progress", "Closed"],
    datasets: [
      {
        data: [
          Array.isArray(leads) ? leads.filter((lead) => lead.status === "Not Called").length : 0,
          Array.isArray(leads) ? leads.filter((lead) => lead.status === "In Progress").length : 0,
          closedDeals,
        ],
        backgroundColor: ["#007bff", "#ffc107", "#28a745"],
      },
    ],
  };

  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Follow-ups",
        data: [15, 30, 50, 40],
        borderColor: "#17a2b8",
        backgroundColor: "rgba(23,162,184,0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div className="container mt-0">
      {/* {/ Page Title /} */}
      <div className="pagetitle mb-4">
        <h1>CRM Dashboard</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="#">Home</a>
            </li>
            <li className="breadcrumb-item active">Dashboard</li>
          </ol>
        </nav>
      </div>

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

      {/* {/ Charts Section /} */}
      <div className="row">
        {/* <div className="col-md-7">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title">Leads Overview</h5>
              <Bar data={barData} />
            </div>
          </div>
        </div> */}

        <div className="col-md-5">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title">Leads Status</h5>
              <Doughnut data={doughnutData} />
            </div>
          </div>
        </div>
{/* 
        <div className="col-md-12">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title">Follow-ups Trend</h5>
              <Line data={lineData} />
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
