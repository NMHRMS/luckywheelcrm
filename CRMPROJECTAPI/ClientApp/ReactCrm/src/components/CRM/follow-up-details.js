"use client"

import { useEffect, useState } from "react"
import { Table, Select, DatePicker, Spin, Button, Empty, Card } from "antd"
import { useLocation, useNavigate } from "react-router-dom"
import { getRequest } from "../utils/Api"

export default function FollowUpDetails() {
  const location = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [followUpLeads, setFollowUpLeads] = useState([])
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)

  // Get state from navigation
  useEffect(() => {
    if (location.state) {
      const { userId, followUpDate } = location.state
      setSelectedUser(userId)
      setSelectedDate(followUpDate)
    }
    fetchAssignments()
  }, [location])

  // Fetch assignments (users)
  const fetchAssignments = async () => {
    try {
      const response = await getRequest("/api/UserAssignmentMapping/assignees")
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

  // Fetch follow-up leads when component mounts or when user/date changes
  useEffect(() => {
    if (selectedUser && selectedDate) {
      fetchFollowUpLeads()
    }
  }, [selectedUser, selectedDate])

  // Function to fetch follow-up leads
  const fetchFollowUpLeads = async () => {
    setLoading(true)
    try {
      const response = await getRequest(
        `/api/Leads/leads_by_followUpDate?userId=${selectedUser}&followUpDate=${selectedDate}`,
      )
      console.log("Follow-up Leads Response:", response.data)
      setFollowUpLeads(response.data || [])
    } catch (error) {
      console.error("Error fetching follow-up leads:", error)
      setFollowUpLeads([])
    } finally {
      setLoading(false)
    }
  }

  // Handle date change
  const handleDateChange = (date, dateString) => {
    setSelectedDate(dateString)
  }

  // Handle user change
  const handleUserChange = (value) => {
    setSelectedUser(value)
  }

  // Go back to dashboard
  const handleBack = () => {
    navigate(-1)
  }

  // Follow-up leads table columns
  const followUpColumns = [
    {
      title: "Owner Name",
      dataIndex: "ownerName",
      key: "ownerName",
      sorter: (a, b) => (a.ownerName || "").localeCompare(b.ownerName || ""),
    },
    {
      title: "Mobile Number",
      dataIndex: "mobileNo",
      key: "mobileNo",
    },
    {
      title: "District",
      dataIndex: "districtName",
      key: "districtName",
      sorter: (a, b) => (a.districtName || "").localeCompare(b.districtName || ""),
    },
    {
      title: "State",
      dataIndex: "stateName",
      key: "stateName",
      sorter: (a, b) => (a.stateName || "").localeCompare(b.stateName || ""),
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
      render: (text) => (text ? new Date(text).toLocaleDateString() : "N/A"),
    },
  ]

  const userName =
    users.find((user) => user.assigneeId === selectedUser)?.assigneeName || location.state?.userName || "Unknown"

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Follow-up Leads</h2>
          <p className="text-muted">
            Viewing follow-up leads for {userName} on {selectedDate}
          </p>
        </div>
        <Button onClick={handleBack}>Back to Dashboard</Button>
      </div>

      <Card className="mb-4">
        <div className="d-flex gap-3 mb-3">
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
          <DatePicker
            onChange={handleDateChange}
            defaultValue={selectedDate ? new Date(selectedDate) : null}
            format="YYYY-MM-DD"
          />
          <Button type="primary" onClick={fetchFollowUpLeads} disabled={!selectedUser || !selectedDate}>
            Search
          </Button>
        </div>
      </Card>

      {loading ? (
        <div className="text-center py-5">
          <Spin size="large" />
          <p className="mt-3">Loading follow-up leads...</p>
        </div>
      ) : followUpLeads.length > 0 ? (
        <Table
          columns={followUpColumns}
          dataSource={followUpLeads.map((lead, index) => ({
            ...lead,
            key: index,
          }))}
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
          bordered
        />
      ) : (
        <Empty description="No follow-up leads found for this date" />
      )}
    </div>
  )
}

