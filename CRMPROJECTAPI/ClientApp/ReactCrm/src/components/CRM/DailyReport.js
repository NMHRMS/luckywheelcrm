import { useEffect, useState } from "react";
import { Table, Modal, Button, Select, DatePicker, Space } from "antd";
import { getRequest, postRequest } from "../utils/Api";
import Loader from "../utils/Loader";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import axios from "axios";
const { RangePicker } = DatePicker;
function DailyReport() {
  const [date, setDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("overview");
  const [users, Setusers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [daterange, setDaterange] = useState([]);
  const [reportData, setReportData] = useState(null);

  const fetchAssignments = async () => {
    try {
      const response = await getRequest("/api/UserAssignmentMapping/assignees");
      console.log("Assignments Response:", response.data);

      Setusers(
        response.data.map((item) => ({
          ...item,
          key: item.assigneeId,
        }))
      );
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const submitdata = async () => {
    try {
      const response = await getRequest(
        `/api/Leads/user-report?userId=${selectedUser}&startDate=${daterange[0]}&endDate=${daterange[1]}`
      );
      console.log(response.data);
      setReportData(response.data);
    } catch (error) {
      console.error("Initial data fetch error:", error);
    }
  };

  const data = reportData
    ? [
        {
          id: "1",
          date: `${daterange[0]} to ${daterange[1]}`,
          "Total Lead": reportData.totalAssignedLeadsCount,
          Connected: reportData.connectedCount,
          Pending: reportData.pendingCount,
          "Not called": reportData.notCalledCount,
          "Not Connected": reportData.notConnectedCount,
          Positive: reportData.positiveCount,
          Negative: reportData.negativeCount,
          Closed: reportData.closedCount,
          "Blocked user": 0,
          userid: selectedUser,
          username:
            users.find((u) => u.assigneeId === selectedUser)?.assigneeName ||
            "Unknown",
          location: "",
        },
      ]
    : [];

  // Prepare data for pie chart
  const pieData = reportData
    ? [
        {
          name: "Connected",
          value: reportData.connectedCount,
          color: "#28a745",
        },
        { name: "Pending", value: reportData.pendingCount, color: "#ffc107" },
        {
          name: "Not called",
          value: reportData.notCalledCount,
          color: "#6c757d",
        },
        {
          name: "Positive",
          value: reportData.positiveCount,
          color: "#0d6efd",
        },
        {
          name: "Negative",
          value: reportData.negativeCount,
          color: "#dc3545",
        },
        { name: "Closed", value: reportData.closedCount, color: "#6610f2" },
        {
          name: "Not Connected",
          value: reportData.notConnectedCount,
          color: "#17a2b8",
        },
      ]
    : [];

  // Calculate total metrics
  const totalLeads = reportData ? reportData.totalAssignedLeadsCount : 0;
  const totalConnected = reportData ? reportData.connectedCount : 0;
  const totalPending = reportData ? reportData.pendingCount : 0;
  const totalNotcalled = reportData ? reportData.notCalledCount : 0;
  const totalNegative = reportData ? reportData.negativeCount : 0;
  const totalClosed = reportData ? reportData.closedCount : 0;
  const totalPositive = reportData ? reportData.positiveCount : 0;
  const totalNotConnected = reportData ? reportData.notConnectedCount : 0;
  const totalBlockedUser = 0;

  // Table columns for Ant Design table
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "User",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Total Lead",
      dataIndex: "Total Lead",
      key: "totalLead",
    },
    {
      title: "Connected",
      dataIndex: "Connected",
      key: "connected",
    },
    {
      title: "Pending",
      dataIndex: "Pending",
      key: "pending",
    },
    {
      title: "Not called",
      dataIndex: "Not called",
      key: "notCalled",
    },
    {
      title: "Positive",
      dataIndex: "Positive",
      key: "positive",
    },
    {
      title: "Negative",
      dataIndex: "Negative",
      key: "negative",
    },
    {
      title: "Closed",
      dataIndex: "Closed",
      key: "closed",
    },
    {
      title: "Blocked",
      dataIndex: "Blocked user",
      key: "blocked",
    },
  ];
  const useperformanceColumns = [
    {
      title: "Status Type",
      dataIndex: "statusType",
      key: "statusType",
      render: (text, record) => (
        <span
          style={{
            fontWeight: "bold",
            color: getStatusColor(record.statusType),
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Count",
      dataIndex: "count",
      key: "count",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{
              marginLeft: "10px",
              fontWeight: "bold",
              color: getStatusColor(record.statusType),
            }}
          >
            {text}
          </span>
        </div>
      ),
    },
  ];

  const useperformanceData = reportData
    ? [
        {
          statusType: "Total Assigned",
          count: reportData.assignedLeadsCount,
          key: "assigned",
        },
        {
          statusType: "Total Delegated",
          count: reportData.delegatedLeadsCount,
          key: "delegated",
        },
        {
          statusType: "Connected",
          count: reportData.connectedCount,
          key: "connected",
        },
        {
          statusType: "Pending",
          count: reportData.pendingCount,
          key: "pending",
        },
        {
          statusType: "Not called",
          count: reportData.notCalledCount,
          key: "notcalled",
        },
        {
          statusType: "Not Connected",
          count: reportData.notConnectedCount,
          key: "notconnected",
        },
        {
          statusType: "Positive",
          count: reportData.positiveCount,
          key: "positive",
        },
        {
          statusType: "Negative",
          count: reportData.negativeCount,
          key: "negative",
        },
        { statusType: "Closed", count: reportData.closedCount, key: "closed" },
      ]
    : [];

  const getStatusColor = (statusType) => {
    const colors = {
      Connected: "#28a745",
      Pending: "#ffc107",
      "Not called": "#6c757d",
      Positive: "#0d6efd",
      Negative: "#dc3545",
      Closed: "#6610f2",
      "Blocked user": "#fd7e14",
      "Not Connected": "#17a2b8",
      "Total Assigned": "#007bff",
      "Total Delegated": "#6dcfe8",
    };
    return colors[statusType] || "#000000";
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="fw-bold">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  const RADIAN = Math.PI / 180;
  // Custom label for pie chart
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5; // Position label inside pie
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={14}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const onRangeChange = (dates, dateStrings) => {
    console.log("From:", dateStrings[0], "To:", dateStrings[1]);
    setDaterange(dateStrings);
  };

  const [detailsTab, setDetailsTab] = useState("assigned");

  const assignedLeadsColumns = [
    {
      title: "Owner Name",
      dataIndex: "ownerName",
      key: "ownerName",
    },
    {
      title: "Mobile No",
      dataIndex: "mobileNo",
      key: "mobileNo",
    },
    {
      title: "District",
      dataIndex: "districtName",
      key: "districtName",
    },
    {
      title: "State",
      dataIndex: "stateName",
      key: "stateName",
    },
    {
      title: "Model",
      dataIndex: "modelName",
      key: "modelName",
    },
    {
      title: "Lead Type",
      dataIndex: "leadType",
      key: "leadType",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <span
          style={{
            color:
              text === "Pending"
                ? "#ffc107"
                : text === "Positive"
                ? "#0d6efd"
                : text === "Connected"
                ? "#28a745"
                : text === "Closed"
                ? "#6610f2"
                : text === "Blocked user"
                ? "#fd7e14"
                : text === "Not Connected"
                ? "#17a2b8"
                : text === "Negative"
                ? "#dc3545"
                : "#000",
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Follow Up Date",
      dataIndex: "followUpDate",
      key: "followUpDate",
      render: (text) => (text ? new Date(text).toLocaleString() : "N/A"),
    },
  ];

  const renderDetailsTab = () => {
    if (!reportData) {
      return (
        <div className="card">
          <div className="card-body text-center">
            <p>Please select a user and date range to view details</p>
          </div>
        </div>
      );
    }

    return (
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Detailed Report</h5>
          <ul className="nav nav-tabs card-header-tabs mt-2">
            <li className="nav-item">
              <button
                className={`nav-link ${
                  detailsTab === "assigned" ? "active" : ""
                }`}
                onClick={() => setDetailsTab("assigned")}
              >
                Assigned Leads ({reportData.assignedLeadsCount})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  detailsTab === "delegated" ? "active" : ""
                }`}
                onClick={() => setDetailsTab("delegated")}
              >
                Delegated Leads ({reportData.delegatedLeadsCount})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  detailsTab === "summary" ? "active" : ""
                }`}
                onClick={() => setDetailsTab("summary")}
              >
                Summary
              </button>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {detailsTab === "assigned" && (
            <Table
              columns={assignedLeadsColumns}
              dataSource={reportData.assignedLeads.map((lead) => ({
                ...lead,
                key: lead.leadId,
              }))}
              pagination={{ pageSize: 5 }}
              scroll={{ x: true }}
              bordered
            />
          )}
          {detailsTab === "delegated" && (
            <Table
              columns={assignedLeadsColumns}
              dataSource={reportData.delegatedLeads.map((lead) => ({
                ...lead,
                key: lead.leadId,
              }))}
              pagination={{ pageSize: 5 }}
              scroll={{ x: true }}
              bordered
            />
          )}
          {detailsTab === "summary" && (
            <Table
              columns={columns}
              dataSource={data}
              rowKey="id"
              pagination={false}
              scroll={{ x: true }}
              bordered
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid p-4 bg-light">
      <div className="row mb-4">
        <div className="col-md-4">
          <h6 className="">Daily Report Dashboard</h6>
          {/* {/ <p className="text-muted">Track and analyze your lead performance metrics</p> /} */}
        </div>
        <div className="col-md-8 d-flex justify-content-md-end align-items-center gap-2">
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select User"
            optionFilterProp="label"
            value={selectedUser}
            onChange={(value) => setSelectedUser(value)} // ✅ Fix here
          >
            {users.length > 0 &&
              users.map((user) => (
                <Select.Option
                  key={user.assigneeId}
                  value={user.assigneeId}
                  label={user.assigneeName}
                >
                  {user.assigneeName}
                </Select.Option>
              ))}
          </Select>
          <div>
            <RangePicker onChange={onRangeChange} />
          </div>
          <button
            className="btn btn-outline-secondary d-flex align-items-center"
            onClick={submitdata}
          >
            <i className="bi bi-arrow me-1"></i> Submit
          </button>
          <button className="btn btn-primary d-flex align-items-center">
            <i className="bi bi-download me-1"></i> Export
          </button>
        </div>
      </div>

      {/* {/ Tabs /} */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "details" ? "active" : ""}`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
        </li>
      </ul>

      {/* {/ Tab Content /} */}
      <div className="tab-content">
        {/* {/ Overview Tab /} */}
        <div
          className={`tab-pane fade ${
            activeTab === "overview" ? "show active" : ""
          }`}
        >
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-header">
                  <h5 className="card-title mb-0">Lead Status Distribution</h5>
                  {/* {/ <p className="card-text text-muted small">Breakdown of all lead statuses</p> /} */}
                </div>
                <div className="card-body">
                  <div style={{ height: "300px" }}>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomizedLabel}
                          outerRadius={110} // Increased size for better visibility
                          innerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                              stroke="white"
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            borderRadius: "10px",
                            backgroundColor: "#fff",
                            color: "#333",
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="card-title mb-0">Lead Performance</h5>
                  </div>
                </div>
                <div className="card-body">
                  <div style={{ marginBottom: "15px" }}>
                    <h6>
                      Total Leads:{" "}
                      <span style={{ fontWeight: "bold", fontSize: "1.2em" }}>
                        {totalLeads}
                      </span>
                    </h6>
                  </div>
                  <Table
                    columns={useperformanceColumns}
                    dataSource={useperformanceData}
                    pagination={false}
                    bordered
                    style={{ boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}
                    rowClassName={() => "custom-row"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* {/ Details Tab /} */}
        <div
          className={`tab-pane fade ${
            activeTab === "details" ? "show active" : ""
          }`}
        >
          {renderDetailsTab()}
        </div>
      </div>
    </div>
  );
}

export default DailyReport;
