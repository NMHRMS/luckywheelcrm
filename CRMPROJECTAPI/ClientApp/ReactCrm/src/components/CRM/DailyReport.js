"use client"

import { useState } from "react"
import { Table, Modal, Button, Select, DatePicker, Space } from "antd"
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
} from "recharts"
import { format } from "date-fns"
const { RangePicker } = DatePicker;
function DailyReport() {
  const [date, setDate] = useState(new Date())
  const [activeTab, setActiveTab] = useState("overview")

  const data = [
    {
      id: "1",
      date: "2025-01-01",
      "Total Lead": 32,
      Connected: 20,
      Pending: 7,
      "Not called": 2,
      "Not Connected": 2,
      Positive: 1,
      Negative: 2,
      Closed: 2,
      "Blocked user": 1,
      userid: "1",
      username: "Aniket",
      location: "Kolhapur",
    }
  ]

  // Prepare data for pie chart
  const pieData = [
    {
      name: "Connected",
      value: data.reduce((sum, item) => sum + Number.parseInt(item["Connected"]), 0),
      color: "#28a745",
    },
    { name: "Pending", value: data.reduce((sum, item) => sum + Number.parseInt(item["Pending"]), 0), color: "#ffc107" },
    {
      name: "Not called",
      value: data.reduce((sum, item) => sum + Number.parseInt(item["Not called"]), 0),
      color: "#6c757d",
    },
    {
      name: "Positive",
      value: data.reduce((sum, item) => sum + Number.parseInt(item["Positive"]), 0),
      color: "#0d6efd",
    },
    {
      name: "Negative",
      value: data.reduce((sum, item) => sum + Number.parseInt(item["Negative"]), 0),
      color: "#dc3545",
    },
    { name: "Closed", value: data.reduce((sum, item) => sum + Number.parseInt(item["Closed"]), 0), color: "#6610f2" },
    {
      name: "Blocked user",
      value: data.reduce((sum, item) => sum + Number.parseInt(item["Blocked user"]), 0),
      color: "#fd7e14",
    },
    {
      name: "Not Connected",
      value: data.reduce((sum, item) => sum + Number.parseInt(item["Not Connected"]), 0),
      color: "#17a2b8",
    },
  ]

  // Calculate total metrics
  const totalLeads = data.reduce((sum, item) => sum + Number.parseInt(item["Total Lead"]), 0)
  const totalConnected = data.reduce((sum, item) => sum + Number.parseInt(item["Connected"]), 0)
  const totalPending = data.reduce((sum, item) => sum + Number.parseInt(item["Pending"]), 0)
  const totalNotcalled = data.reduce((sum, item) => sum + Number.parseInt(item["Not called"]), 0)
  const totalNegative = data.reduce((sum, item) => sum + Number.parseInt(item["Negative"]), 0)
  const totalClosed = data.reduce((sum, item) => sum + Number.parseInt(item["Closed"]), 0)
  const totalPositive = data.reduce((sum, item) => sum + Number.parseInt(item["Positive"]), 0)
  const totalBlockedUser = data.reduce((sum, item) => sum + Number.parseInt(item["Blocked user"]), 0)
  const totalNotConnected = data.reduce((sum, item) => sum + Number.parseInt(item["Not Connected"]), 0)


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
  ]
  const useperformanceColumns = [
    {
      title: "Status Type",
      dataIndex: "statusType",
      key: "statusType",
      render: (text,record) => <span style={{ fontWeight: "bold",color: getStatusColor(record.statusType), }}>{text}</span>,
    },
    {
      title: "Count",
      dataIndex: "count",
      key: "count",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ marginLeft: "10px", fontWeight: "bold",color: getStatusColor(record.statusType), }}>{text}</span>
        </div>
      ),
    },
  ]

  const useperformanceData = [
    { statusType: "Connected", count: totalConnected },
    { statusType: "Pending", count: totalPending },
    { statusType: "Not called", count: totalNotcalled },
    { statusType: "Positive", count: totalPositive },
    { statusType: "Negative", count: totalNegative},
    { statusType: "Closed", count:totalClosed },
    { statusType: "Blocked user", count:totalBlockedUser },
    { statusType: "Not Connected", count:totalNotConnected },
  ]

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
    }
    return colors[statusType] || "#000000"
  }

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
      )
    }
    return null
  }

  // Custom label for pie chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }
  const onRangeChange = (dates, dateStrings) => {
    console.log('From:', dateStrings[0], 'To:', dateStrings[1]);
  };

  return (
    <div className="container-fluid p-4 bg-light">
      <div className="row mb-4">
        <div className="col-md-4">
          <h6 className="">Daily Report Dashboard</h6>
          {/* <p className="text-muted">Track and analyze your lead performance metrics</p> */}
        </div>
        <div className="col-md-8 d-flex justify-content-md-end align-items-center gap-2">
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select User"
            optionFilterProp="label"
            options={[
              { value: '1', label: 'Aniket' },
              { value: '2', label: 'Rahul' },
            ]}
          />
          <div >
            <RangePicker onChange={onRangeChange} />
          </div>
          <button className="btn btn-outline-secondary d-flex align-items-center">
            <i className="bi bi-arrow-repeat me-1"></i> Refresh
          </button>
          <button className="btn btn-primary d-flex align-items-center">
            <i className="bi bi-download me-1"></i> Export
          </button>
        </div>
      </div>

      {/* Tabs */}
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

      {/* Tab Content */}
      <div className="tab-content">
        {/* Overview Tab */}
        <div className={`tab-pane fade ${activeTab === "overview" ? "show active" : ""}`}>
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-header">
                  <h5 className="card-title mb-0">Lead Status Distribution</h5>
                  {/* <p className="card-text text-muted small">Breakdown of all lead statuses</p> */}
                </div>
                <div className="card-body">
                  <div style={{ height: "300px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomizedLabel}
                          outerRadius={100}
                          innerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
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
                      Total Leads: <span style={{ fontWeight: "bold", fontSize: "1.2em" }}>{totalLeads}</span>
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


        {/* Details Tab */}
        <div className={`tab-pane fade ${activeTab === "details" ? "show active" : ""}`}>
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Detailed Report</h5>
              <p className="card-text text-muted small">Complete breakdown of all lead data</p>
            </div>
            <div className="card-body">
              <Table columns={columns} dataSource={data} rowKey="id" pagination={false} scroll={{ x: true }} bordered />
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default DailyReport

