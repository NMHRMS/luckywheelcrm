import React, { useState } from "react";

const Sales = () => {
  const [team, setTeam] = useState([
    { id: 1, name: "John Doe", assignedLeads: 5, closedDeals: 2, target: 10 },
    { id: 2, name: "Jane Smith", assignedLeads: 8, closedDeals: 5, target: 15 },
  ]);

  const [leads, setLeads] = useState([
    { id: 101, name: "Company A", contact: "1234567890", status: "New" },
    { id: 102, name: "Company B", contact: "0987654321", status: "In Progress" },
  ]);

  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);
  const [newTarget, setNewTarget] = useState("");

  // Assign Lead to Team Member
  const handleAssignLead = () => {
    if (selectedLead && selectedTeamMember) {
      const updatedLeads = leads.map((lead) =>
        lead.id === selectedLead.id ? { ...lead, status: "Assigned" } : lead
      );

      const updatedTeam = team.map((member) =>
        member.id === selectedTeamMember.id
          ? { ...member, assignedLeads: member.assignedLeads + 1 }
          : member
      );

      setLeads(updatedLeads);
      setTeam(updatedTeam);
      setSelectedLead(null);
      setSelectedTeamMember(null);
    } else {
      alert("Please select both a lead and a team member.");
    }
  };

  // Update Target for Team Member
  const handleUpdateTarget = (id) => {
    const updatedTeam = team.map((member) =>
      member.id === id ? { ...member, target: newTarget } : member
    );
    setTeam(updatedTeam);
    setNewTarget("");
  };

  return (
    <div className="container mt-3">
      <h2 className="mb-4">Sales Manager Dashboard</h2>

      {/* Team Overview */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>Team Overview</h5>
          <table className="table table-bordered text-center">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Assigned Leads</th>
                <th>Closed Deals</th>
                <th>Target</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {team.map((member) => (
                <tr key={member.id}>
                  <td>{member.name}</td>
                  <td>{member.assignedLeads}</td>
                  <td>{member.closedDeals}</td>
                  <td>{member.target}</td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Set Target"
                      value={newTarget}
                      onChange={(e) => setNewTarget(e.target.value)}
                    />
                    <button
                      className="btn btn-primary mt-2"
                      onClick={() => handleUpdateTarget(member.id)}
                    >
                      Update Target
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Management */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>Lead Management</h5>
          <div className="row">
            <div className="col-md-6">
              <h6>Available Leads</h6>
              <ul className="list-group">
                {leads
                  .filter((lead) => lead.status === "New")
                  .map((lead) => (
                    <li
                      key={lead.id}
                      className={`list-group-item ${
                        selectedLead?.id === lead.id ? "active" : ""
                      }`}
                      onClick={() => setSelectedLead(lead)}
                      style={{ cursor: "pointer" }}
                    >
                      {lead.name} - {lead.contact}
                    </li>
                  ))}
              </ul>
            </div>
            <div className="col-md-6">
              <h6>Team Members</h6>
              <ul className="list-group">
                {team.map((member) => (
                  <li
                    key={member.id}
                    className={`list-group-item ${
                      selectedTeamMember?.id === member.id ? "active" : ""
                    }`}
                    onClick={() => setSelectedTeamMember(member)}
                    style={{ cursor: "pointer" }}
                  >
                    {member.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <button
            className="btn btn-success mt-3"
            onClick={handleAssignLead}
            disabled={!selectedLead || !selectedTeamMember}
          >
            Assign Lead
          </button>
        </div>
      </div>

      {/* Sales Report */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>Sales Report</h5>
          <table className="table table-bordered text-center">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Assigned Leads</th>
                <th>Closed Deals</th>
                <th>Performance</th>
              </tr>
            </thead>
            <tbody>
              {team.map((member) => (
                <tr key={member.id}>
                  <td>{member.name}</td>
                  <td>{member.assignedLeads}</td>
                  <td>{member.closedDeals}</td>
                  <td>
                    {member.target > 0
                      ? `${Math.round((member.closedDeals / member.target) * 100)}%`
                      : "No Target Set"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Sales;
