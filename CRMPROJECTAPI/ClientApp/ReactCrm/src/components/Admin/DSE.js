import React, { useState } from "react";

const DSE = () => {
  const [leads, setLeads] = useState([
    { id: 1, name: "Client A", status: "New", followUp: "2025-01-18" },
    { id: 2, name: "Client B", status: "In Progress", followUp: "2025-01-20" },
    { id: 3, name: "Client C", status: "New", followUp: "2025-01-22" },
  ]);

  const [personalTarget, setPersonalTarget] = useState({ target: 10, achieved: 5 });
  const [dailyReport, setDailyReport] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);

  // Update lead status
  const handleUpdateStatus = (status) => {
    if (selectedLead) {
      const updatedLeads = leads.map((lead) =>
        lead.id === selectedLead.id ? { ...lead, status } : lead
      );
      setLeads(updatedLeads);
      setSelectedLead(null);
    } else {
      alert("Please select a lead to update its status.");
    }
  };

  // Submit daily report
  const handleReportSubmit = () => {
    if (dailyReport) {
      alert(`Daily report submitted: ${dailyReport}`);
      setDailyReport("");
    } else {
      alert("Please enter a report before submitting.");
    }
  };

  return (
    <div className="container mt-3">
      <h2 className="mb-4">District Sales Executive Dashboard</h2>

      {/* Personal Performance Overview */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>Personal Performance</h5>
          <p>
            <strong>Target:</strong> {personalTarget.target}
          </p>
          <p>
            <strong>Achieved:</strong> {personalTarget.achieved}
          </p>
          <p>
            <strong>Performance:</strong>{" "}
            {Math.round((personalTarget.achieved / personalTarget.target) * 100)}%
          </p>
        </div>
      </div>

      {/* Assigned Leads */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>Assigned Leads</h5>
          <table className="table table-bordered text-center">
            <thead className="table-light">
              <tr>
                <th>Lead Name</th>
                <th>Status</th>
                <th>Follow-Up Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  className={selectedLead?.id === lead.id ? "table-primary" : ""}
                >
                  <td>{lead.name}</td>
                  <td>{lead.status}</td>
                  <td>{lead.followUp}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => setSelectedLead(lead)}
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Update Lead Status */}
          <div className="mt-3">
            <h6>Update Lead Status</h6>
            <div className="btn-group">
              <button
                className="btn btn-success"
                onClick={() => handleUpdateStatus("Positive")}
              >
                Positive
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleUpdateStatus("Negative")}
              >
                Negative
              </button>
              <button
                className="btn btn-warning"
                onClick={() => handleUpdateStatus("Follow-Up")}
              >
                Follow-Up
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Report Submission */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>Submit Daily Report</h5>
          <textarea
            className="form-control"
            rows="3"
            placeholder="Enter today's report..."
            value={dailyReport}
            onChange={(e) => setDailyReport(e.target.value)}
          ></textarea>
          <button className="btn btn-primary mt-3" onClick={handleReportSubmit}>
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default DSE;
