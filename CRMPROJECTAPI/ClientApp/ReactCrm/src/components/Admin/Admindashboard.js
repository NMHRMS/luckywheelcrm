import React from "react";

const cardData = [
  { title: "Total Assigned", value: 20, bgColor: "#007bff" },
  { title: "Positive", value: 10, bgColor: "#28a745" },
  { title: "Negative", value: 4, bgColor: "#dc3545" },
  { title: "Not Called", value: 4, bgColor: "#ffc107" },
  { title: "Connected", value: 5, bgColor: "#17a2b8" },
  { title: "Not Connected", value: 1, bgColor: "#6f42c1" },
  { title: "Pending", value: 3, bgColor: "#fd7e14" },
  { title: "Closed", value: 1, bgColor: "#6c757d" },
];

const cardStyle = {
  color: "white",
  padding: "20px",
  borderRadius: "8px",
  textAlign: "center",
  minHeight: "120px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const containerStyle = {
  padding: "30px",
  backgroundColor: "#f8f9fa",
  minHeight: "100vh",
};

const AdminDashboard = () => {
  return (
    <div style={containerStyle}>
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

      <div className="row">
        {cardData.map((card, index) => (
          <div key={index} className="col-md-3 mb-4">
            <div style={{ ...cardStyle, backgroundColor: card.bgColor }}>
              <h5>{card.title}</h5>
              <h2>{card.value}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
