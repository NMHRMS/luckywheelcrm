import React, { useState } from "react";

const DSM = () => {
  const [team, setTeam] = useState([
    { id: 1, name: "Alice Johnson", leads: 10, closedDeals: 5, target: 15 },
    { id: 2, name: "Bob Smith", leads: 8, closedDeals: 3, target: 12 },
  ]);

  const [leads, setLeads] = useState([
    { id: 101, name: "Lead A", status: "New", assignedTo: null },
    { id: 102, name: "Lead B", status: "In Progress", assignedTo: "Alice Johnson" },
    { id: 103, name: "Lead C", status: "New", assignedTo: null },
  ]);

  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);
  const [regionTarget, setRegionTarget] = useState(50);

  // Assign Lead to Team Member
  const handleAssignLead = () => {
    if (selectedLead && selectedTeamMember) {
      const updatedLeads = leads.map((lead) =>
        lead.id === selectedLead.id ? { ...lead, status: "Assigned", assignedTo: selectedTeamMember.name } : lead
      );

      const updatedTeam = team.map((member) =>
        member.id === selectedTeamMember.id ? { ...member, leads: member.leads + 1 } : member
      );

      setLeads(updatedLeads);
      setTeam(updatedTeam);
      setSelectedLead(null);
      setSelectedTeamMember(null);
    } else {
      alert("Please select a lead and a team member to assign.");
    }
  };

  // Calculate Regional Performance
  const calculatePerformance = () => {
    const totalClosedDeals = team.reduce((sum, member) => sum + member.closedDeals, 0);
    return Math.round((totalClosedDeals / regionTarget) * 100);
  };

  return (
    <div className="container mt-3">
      <h2 className="mb-4">District Sales Manager Dashboard</h2>

      {/* Regional Performance Overview */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>Regional Performance</h5>
          <p>
            <strong>Target:</strong> {regionTarget} deals
          </p>
          <p>
            <strong>Performance:</strong> {calculatePerformance()}%
          </p>
        </div>
      </div>

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
              </tr>
            </thead>
            <tbody>
              {team.map((member) => (
                <tr key={member.id}>
                  <td>{member.name}</td>
                  <td>{member.leads}</td>
                  <td>{member.closedDeals}</td>
                  <td>{member.target}</td>
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
                      {lead.name}
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

      {/* Update Regional Target */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>Set Regional Target</h5>
          <input
            type="number"
            className="form-control mb-3"
            placeholder="Set target for the region"
            value={regionTarget}
            onChange={(e) => setRegionTarget(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default DSM;
