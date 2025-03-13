"use client"

import { useEffect, useState } from "react"
import { Doughnut } from "react-chartjs-2"
import { Table, Select, DatePicker, Spin, Button, Empty } from "antd"
import { useNavigate } from "react-router-dom"
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
} from "chart.js"
import { getRequest } from "../utils/Api"
import Loader from "../utils/Loader"
import moment from "moment"

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement)

export default function DashboardCRM() {
  const navigate = useNavigate()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [users, setUsers] = useState([])
  const [followUpLeads, setFollowUpLeads] = useState([])
  const [followUpLoading, setFollowUpLoading] = useState(false)

  // Fetch assignments (users)
  const fetchAssignments = async () => {
    try {
      const response = await getRequest("/api/UserAssignmentMapping/assignees")
      console.log("Assignments Response:", response.data)

      setUsers(
        response.data.map((item) => ({
          ...item,
          key: item.assigneeId,
        })),

      )
    } catch (error) {
      console.error("Error fetching assignments:", error)
    }
  }

  // Fetch dashboard leads
  useEffect(() => {
    fetchAssignments()

    getRequest("/api/Leads/dashboard_leads")
      .then((response) => {
        console.log("API Response:", response.data.leads)
        setLeads(response.data.leads)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching leads:", error)
        setLeads([])
        setLoading(false)
      })
  }, [])

  // Fetch follow-up leads when both user and date are selected
  useEffect(() => {
    if (selectedUser && selectedDate) {
      fetchFollowUpLeads()
    }
  }, [selectedUser, selectedDate])

  // Function to fetch follow-up leads
  const fetchFollowUpLeads = async () => {
    if (!selectedUser || !selectedDate) return

    setFollowUpLoading(true)
    const formattedDate = selectedDate.format("YYYY-MM-DD")

    try {
      const response = await getRequest(
        `/api/Leads/leads_by_followUpDate?userId=${selectedUser}&followUpDate=${formattedDate}`,
      )
      console.log("Follow-up Leads Response:", response.data)
      setFollowUpLeads(response.data || [])
    } catch (error) {
      console.error("Error fetching follow-up leads:", error)
      setFollowUpLeads([])
    } finally {
      setFollowUpLoading(false)
    }
  }

  // Handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date)
  }

  // Handle user change
  const handleUserChange = (value) => {
    setSelectedUser(value)
  }

  // Navigate to detailed view
  const handleViewAll = () => {
    if (selectedUser && selectedDate) {
      navigate("/crm/follow-up-details", {
        state: {
          userId: selectedUser,
          followUpDate: selectedDate.format("YYYY-MM-DD"),
          userName: users.find((user) => user.assigneeId === selectedUser)?.assigneeName || "Unknown",
        },
      })
    }
  }

  // Safe filtering by ensuring leads is an array
  const totalLeads = leads.length
  const assignedLeads = leads.filter((lead) => lead.assignedTo !== null).length
  const pending = leads.filter((lead) => lead.status === "Pending").length
  const closedLeads = leads.filter((lead) => lead.status === "Closed").length

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
  ]

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
  }

  const doughnutData = {
    labels: ["Not Called", "Pending", "Closed", "Not Connected", "Positive", "Negative", "Connected"],
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
  }

  // Follow-up leads table columns
  const followUpColumns = [
    {
      title: "Owner Name",
      dataIndex: "ownerName",
      key: "ownerName",
    },
    {
      title: "Mobile Number",
      dataIndex: "mobileNo",
      key: "mobileNo",
    },
  ]

  return (
    <div className="container mt-0">
      {/* Page Title */}
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

      {loading ? (
        <Loader />
      ) : (
        <>
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
            <div className="col-md-6">
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <h5 className="card-title">Leads Status</h5>
                  <Doughnut data={doughnutData} />
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <h5 className="card-title">Follow-up Leads</h5>
                  <div className="d-flex gap-2 mb-3">
                    <Select
                      showSearch
                      style={{ width: 200 }}
                      placeholder="Select User"
                      optionFilterProp="label"
                      value={selectedUser}
                      onChange={handleUserChange}
                    >
                      {users.length > 0 &&
                        users.map((user) => (
                          <Select.Option key={user.assigneeId} value={user.assigneeId} label={user.assigneeName}>
                            {user.assigneeName}
                          </Select.Option>
                        ))}
                    </Select>
                    <DatePicker onChange={handleDateChange} value={selectedDate} placeholder="Select Date" />
                  </div>

                  {followUpLoading ? (
                    <div className="text-center py-4">
                      <Spin size="large" />
                      <p className="mt-2">Loading follow-up leads...</p>
                    </div>
                  ) : followUpLeads.length > 0 ? (
                    <div>
                      <Table
                        columns={followUpColumns}
                        dataSource={followUpLeads.slice(0, 5).map((lead, index) => ({
                          ...lead,
                          key: index,
                        }))}
                        pagination={false}
                        size="small"
                      />
                      <div className="text-end mt-3">
                        <Button type="primary" onClick={handleViewAll} disabled={!selectedUser || !selectedDate}>
                          View All
                        </Button>
                      </div>
                    </div>
                  ) : selectedUser && selectedDate ? (
                    <Empty description="No follow-up leads found for this date" />
                  ) : (
                    <div className="text-center py-4">
                      <p>Please select both a user and date to view follow-up leads</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

