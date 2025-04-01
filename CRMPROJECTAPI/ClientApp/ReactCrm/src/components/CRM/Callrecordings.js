"use client"

import { useEffect, useState } from "react"
import { Table, Select, DatePicker, Spin, Modal, Button, Radio, Checkbox } from "antd"
import { getRequest } from "../utils/Api"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import * as XLSX from "xlsx"

const { RangePicker } = DatePicker
const { Option } = Select

function CallRecordings() {
  const [selectedDate, setSelectedDate] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [users, setUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [daterange, setDaterange] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [callPerformanceData, setCallPerformanceData] = useState(null)
  const [hourlyStatistics, setHourlyStatistics] = useState([])
  const [detailsTab, setDetailsTab] = useState("all")
  const [exportModalVisible, setExportModalVisible] = useState(false)
  const [exportType, setExportType] = useState("excel")
  const [selectDropdownOpen, setSelectDropdownOpen] = useState(false);
    const [editingKey, setEditingKey] = useState("")
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

  useEffect(() => {
    fetchAssignments()
  }, [])

  // Handle select all checkbox
  useEffect(() => {
    if (selectAll) {
      const allUserIds = users.map((user) => user.assigneeId)
      setSelectedUsers(allUserIds)
    }
  }, [selectAll, users])

  const isFormValid = () => {
    return (
      (selectedUsers.length > 0 && !selectedDate && !(daterange.length === 2 && daterange[0] && daterange[1])) ||
      selectedDate ||
      (daterange.length === 2 && daterange[0] && daterange[1])
    )
  }
  const cancel = () => {
    setEditingKey("")
  }

  const submitdata = async () => {
    if (!isFormValid()) {
      alert("Please select at least one user and a valid date range or date.")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Correctly construct userIds query parameters
      const userIdParams = selectedUsers.map((id) => `userIds=${id}`).join("&")
      const startDateParam = daterange.length === 2 ? `&startDate=${daterange[0]}` : ""
      const endDateParam = daterange.length === 2 ? `&endDate=${daterange[1]}` : ""
      const dateParam = selectedDate ? `&date=${selectedDate}` : ""

      // Build final API URL for call performance
      const callPerformanceUrl = `/api/CallRecords/GetUserCallPerformanceReport?${userIdParams}${startDateParam}${endDateParam}${dateParam}`
      console.log("Call Performance API URL:", callPerformanceUrl)

      // Build final API URL for hourly statistics
      const hourlyStatsUrl = `/api/CallRecords/GetHourlyCallStatistics?${userIdParams}${startDateParam}${endDateParam}${dateParam}`
      console.log("Hourly Stats API URL:", hourlyStatsUrl)

      // Fetch both APIs in parallel
      const [callPerformanceResponse, hourlyStatsResponse] = await Promise.all([
        getRequest(callPerformanceUrl),
        getRequest(hourlyStatsUrl),
      ])

      console.log("Call Performance API Response:", callPerformanceResponse.data)
      console.log("Hourly Stats API Response:", hourlyStatsResponse.data)

      setCallPerformanceData(callPerformanceResponse.data)
      setHourlyStatistics(hourlyStatsResponse.data)
    } catch (error) {
      console.error("Data fetch error:", error)
      setError("Failed to load data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const onRangeChange = (dates, dateStrings) => {
    if (!dates || dates.length === 0) {
      setDaterange([]) // Pass null if nothing selected
    } else {
      setDaterange(dateStrings)
    }
  }

  const onDateChange = (selectedDate, dateString) => {
    setSelectedDate(dateString || null) // Pass null if not selected
  }

  // Handle user selection with "Select All" option
  const handleUserChange = (value) => {
    if (value.includes("all")) {
      setSelectAll(true)
      const allUserIds = users.map((user) => user.assigneeId)
      setSelectedUsers(allUserIds)
    } else {
      setSelectAll(false)
      setSelectedUsers(value)
    }
  }

  // Prepare data for pie chart
  const pieData =
    callPerformanceData?.callDetails.map((detail) => ({
      name: detail.callType,
      value: detail.callCount,
      color: getCallTypeColor(detail.callType),
    })) || []

  // Get color based on call type
  function getCallTypeColor(callType) {
    switch (callType) {
      case "Incoming":
        return "#28a745" // green
      case "Outgoing":
        return "#0d6efd" // blue
      case "Missed":
        return "#dc3545" // red
      case "Rejected":
        return "#fd7e14" // orange
      default:
        return "#6c757d" // gray
    }
  }

  // Extract unique values for filters
  function getUniqueValues(records, field) {
    if (!records || !Array.isArray(records)) return []

    const uniqueValues = [...new Set(records.map((record) => record[field]).filter(Boolean))]
    return uniqueValues.map((value) => ({
      text: value,
      value: value,
    }))
  }

  // Get all call records
  function getAllCallRecords() {
    if (!callPerformanceData || !callPerformanceData.callDetails) return []
    return callPerformanceData.callDetails.flatMap((detail) => detail.callRecords || [])
  }

  // Process user summary data
  function processUserSummary(callPerformanceData) {
    if (!callPerformanceData) return []

    // Create a map to store user summaries
    const userSummaryMap = new Map()

    // Process all call records
    callPerformanceData.callDetails.forEach((detail) => {
      detail.callRecords.forEach((record) => {
        const userName = record.userName || "Unknown"

        if (!userSummaryMap.has(userName)) {
          userSummaryMap.set(userName, {
            userName,
            totalCalls: 0,
            totalDuration: "00:00:00",
            incomingCalls: 0,
            outgoingCalls: 0,
            missedCalls: 0,
            rejectedCalls: 0,
            callTypes: {},
          })
        }

        const userSummary = userSummaryMap.get(userName)
        userSummary.totalCalls++

        // Count by call type
        if (!userSummary.callTypes[record.callType]) {
          userSummary.callTypes[record.callType] = 0
        }
        userSummary.callTypes[record.callType]++

        // Update specific call type counters
        if (record.callType === "Incoming") userSummary.incomingCalls++
        if (record.callType === "Outgoing") userSummary.outgoingCalls++
        if (record.callType === "Missed") userSummary.missedCalls++
        if (record.callType === "Rejected") userSummary.rejectedCalls++

        // Add duration logic here if needed
        // This is simplified as proper duration addition would require parsing time strings
      })
    })

    // Convert map to array
    return Array.from(userSummaryMap.values())
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

  // Prepare data for hourly statistics bar chart
  const hourlyBarData = hourlyStatistics
    .filter((stat) => stat.timeSlot !== "Total" && stat.timeSlot !== "Daily Average")
    .map((stat) => ({
      timeSlot: stat.timeSlot,
      totalCalls: stat.totalCalls,
      connectedCalls: stat.totalConnectedCalls,
    }))

  // Get all call records for filters
  const allCallRecords = getAllCallRecords()

  // Extract unique values for filters
  const uniqueUserNames = getUniqueValues(allCallRecords, "userName")
  const uniqueNames = getUniqueValues(allCallRecords, "name")
  const uniqueMobileNos = getUniqueValues(allCallRecords, "mobileNo")
  const uniqueCallTypes = getUniqueValues(allCallRecords, "callType")
  const uniqueStatuses = getUniqueValues(allCallRecords, "status")

  // Columns for call details table
  const callDetailsColumns = [
    {
      title: "Employee Name",
      dataIndex: "userName",
      key: "userName",
      sorter: (a, b) => (a.userName || "").localeCompare(b.userName || ""),
      filters: uniqueUserNames,
      onFilter: (value, record) => record.userName === value,
      filterSearch: true,
      width: 140,
      fixed: 'left',
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
      filters: uniqueNames,
      onFilter: (value, record) => record.name === value,
      filterSearch: true,
      width: 160,
      fixed: 'left',
    },
    {
      title: "Mobile No",
      dataIndex: "mobileNo",
      key: "mobileNo",
      sorter: (a, b) => (a.mobileNo || "").localeCompare(b.mobileNo || ""),
      filters: uniqueMobileNos,
      onFilter: (value, record) => record.mobileNo === value,
      filterSearch: true,
      width: 140,
    },
    {
      title: "Call Type",
      dataIndex: "callType",
      key: "callType",
      sorter: (a, b) => (a.callType || "").localeCompare(b.callType || ""),
      filters: uniqueCallTypes,
      onFilter: (value, record) => record.callType === value,
      filterSearch: true,
      width: 120,
      render: (text) => (
        <span
          style={{
            color: getCallTypeColor(text),
            fontWeight: "bold",
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => (a.status || "").localeCompare(b.status || ""),
      filters: uniqueStatuses,
      onFilter: (value, record) => record.status === value,
      filterSearch: true,
      width: 140,
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
                            : text === "Not Called"
                              ? "#6c757d"
                              : "#000",
          }}
        >
          {text || "N/A"}
        </span>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: (text) => (text ? new Date(text).toLocaleString() : "N/A"),
      width: 180,
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      width: 120,
    },
    {
      title: "Recording",
      dataIndex: "recordings",
      key: "recordings",
      width: 250,
      render: (recording) => {
        if (!recording) {
          return <span className="text-muted">No recording available</span>
        }

        // Extract just the filename from the path
        const filename = recording.split("/").pop()

        // Construct the correct URL to the audio file
        const audioUrl = `https://crmdemotest-001-site1.anytempurl.com/recordings/${recording}`

        return (
          <audio controls style={{ maxWidth: "100%", height: "30px" }} src={audioUrl}>
            Your browser does not support the audio element.
          </audio>
        )
      },
    },
  ]

  // Columns for hourly statistics table
  const hourlyStatsColumns = [
    {
      title: "Time Slot",
      dataIndex: "timeSlot",
      key: "timeSlot",
      width: 140,
      fixed: 'left',
    },
    {
      title: "Total Calls",
      dataIndex: "totalCalls",
      key: "totalCalls",
      sorter: (a, b) => a.totalCalls - b.totalCalls,
      width: 120,
      fixed: 'left',
    },
    {
      title: "Connected Calls",
      dataIndex: "totalConnectedCalls",
      key: "totalConnectedCalls",
      sorter: (a, b) => a.totalConnectedCalls - b.totalConnectedCalls,
      width: 140,
    },
    {
      title: "Total Duration",
      dataIndex: "totalDuration",
      key: "totalDuration",
      width: 140,
    },
    {
      title: "Total Calls %",
      dataIndex: "totalCallsPercentage",
      key: "totalCallsPercentage",
      render: (text) => `${text}%`,
      width: 120,
    },
    {
      title: "Connected Calls %",
      dataIndex: "connectedCallsPercentage",
      key: "connectedCallsPercentage",
      render: (text) => `${text}%`,
      width: 140,
    },
    {
      title: "Duration %",
      dataIndex: "totalDurationPercentage",
      key: "totalDurationPercentage",
      render: (text) => `${text}%`,
      width: 120,
    },
  ]

  // Columns for call summary table
  const callSummaryColumns = [
    {
      title: "Call Type",
      dataIndex: "callType",
      key: "callType",
      width: 140,
      render: (text) => (
        <span
          style={{
            color: getCallTypeColor(text),
            fontWeight: "bold",
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Call Count",
      dataIndex: "callCount",
      key: "callCount",
      width: 120,
    },
    {
      title: "Call Duration",
      dataIndex: "callDuration",
      key: "callDuration",
      width: 140,
    },
    // {
    //   title: "Percentage",
    //   key: "percentage",
    //   width: 200,
    //   render: (_, record) => {
    //     const totalCalls = callPerformanceData?.totalCalls || 0
    //     const percentage = totalCalls > 0 ? ((record.callCount / totalCalls) * 100).toFixed(1) : 0

    //     return (
    //       <div style={{ display: "flex", alignItems: "center" }}>
    //         <div style={{ flex: 1, backgroundColor: "#f0f0f0", borderRadius: "10px", padding: "5px 10px" }}>
    //           <div
    //             style={{
    //               width: `${percentage}%`,
    //               backgroundColor: getCallTypeColor(record.callType),
    //               height: "20px",
    //               borderRadius: "5px",
    //             }}
    //           ></div>
    //         </div>
    //         <span
    //           style={{
    //             marginLeft: "10px",
    //             fontWeight: "bold",
    //             color: getCallTypeColor(record.callType),
    //           }}
    //         >
    //           {`${percentage}%`}
    //         </span>
    //       </div>
    //     )
    //   },
    // },
  ]

  // User summary columns
  const userSummaryColumns = [
    {
      title: "User Name",
      dataIndex: "userName",
      key: "userName",
      sorter: (a, b) => a.userName.localeCompare(b.userName),
      width: 160,
      fixed: 'left',
    },
    {
      title: "Total Calls",
      dataIndex: "totalCalls",
      key: "totalCalls",
      sorter: (a, b) => a.totalCalls - b.totalCalls,
      width: 120,
      fixed: 'left',
    },
    {
      title: "Incoming",
      dataIndex: "incomingCalls",
      key: "incomingCalls",
      sorter: (a, b) => a.incomingCalls - b.incomingCalls,
      width: 120,
      render: (text) => <span style={{ color: getCallTypeColor("Incoming") }}>{text}</span>,
    },
    {
      title: "Outgoing",
      dataIndex: "outgoingCalls",
      key: "outgoingCalls",
      sorter: (a, b) => a.outgoingCalls - b.outgoingCalls,
      width: 120,
      render: (text) => <span style={{ color: getCallTypeColor("Outgoing") }}>{text}</span>,
    },
    {
      title: "Missed",
      dataIndex: "missedCalls",
      key: "missedCalls",
      sorter: (a, b) => a.missedCalls - b.missedCalls,
      width: 120,
      render: (text) => <span style={{ color: getCallTypeColor("Missed") }}>{text}</span>,
    },
    {
      title: "Rejected",
      dataIndex: "rejectedCalls",
      key: "rejectedCalls",
      sorter: (a, b) => a.rejectedCalls - b.rejectedCalls,
      width: 120,
      render: (text) => <span style={{ color: getCallTypeColor("Rejected") }}>{text}</span>,
    },
    {
      title: "Call Distribution",
      key: "distribution",
      width: 200,
      render: (_, record) => {
        return (
          <div style={{ display: "flex", height: "20px", width: "100%", borderRadius: "4px", overflow: "hidden" }}>
            {record.incomingCalls > 0 && (
              <div
                style={{
                  backgroundColor: getCallTypeColor("Incoming"),
                  width: `${(record.incomingCalls / record.totalCalls) * 100}%`,
                }}
              />
            )}
            {record.outgoingCalls > 0 && (
              <div
                style={{
                  backgroundColor: getCallTypeColor("Outgoing"),
                  width: `${(record.outgoingCalls / record.totalCalls) * 100}%`,
                }}
              />
            )}
            {record.missedCalls > 0 && (
              <div
                style={{
                  backgroundColor: getCallTypeColor("Missed"),
                  width: `${(record.missedCalls / record.totalCalls) * 100}%`,
                }}
              />
            )}
            {record.rejectedCalls > 0 && (
              <div
                style={{
                  backgroundColor: getCallTypeColor("Rejected"),
                  width: `${(record.rejectedCalls / record.totalCalls) * 100}%`,
                }}
              />
            )}
          </div>
        )
      },
    },
  ]

  // Handle Excel export
  const handleExport = () => {
    if (!callPerformanceData) return

    // Create a new workbook
    const workbook = XLSX.utils.book_new()

    // Define styles for different sections
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "4472C4" } },
      alignment: { horizontal: "center" },
    }

    const callTypeHeaderStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "70AD47" } },
      alignment: { horizontal: "center" },
    }

    const hourlyHeaderStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "ED7D31" } },
      alignment: { horizontal: "center" },
    }

    const dataStyle = {
      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      },
    }

    // Create styled worksheet function
    const createStyledWorksheet = (data, headerStyle) => {
      const ws = XLSX.utils.json_to_sheet(data)

      // Apply styles to headers (first row)
      const headerRange = XLSX.utils.decode_range(ws["!ref"])
      for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C })
        if (!ws[cellAddress]) continue

        ws[cellAddress].s = headerStyle
      }

      // Apply styles to data cells
      for (let R = 1; R <= headerRange.e.r; ++R) {
        for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C })
          if (!ws[cellAddress]) continue

          ws[cellAddress].s = dataStyle
        }
      }

      return ws
    }

    // 1. Create Summary Data
    const summaryData = [
      {
        Metric: "Total Calls",
        Count: callPerformanceData.totalCalls,
        Duration: callPerformanceData.totalDuration,
      },
    ]

    // Add call type summary
    callPerformanceData.callDetails.forEach((detail) => {
      summaryData.push({
        Metric: detail.callType,
        Count: detail.callCount,
        Duration: detail.callDuration,
      })
    })

    // 2. Create User Summary Data
    const userSummaryData = processUserSummary(callPerformanceData).map((user) => ({
      "User Name": user.userName,
      "Total Calls": user.totalCalls,
      "Incoming Calls": user.incomingCalls,
      "Outgoing Calls": user.outgoingCalls,
      "Missed Calls": user.missedCalls,
      "Rejected Calls": user.rejectedCalls,
    }))

    // 3. Create Call Details Data
    const callDetailsData = getAllCallRecords().map((record) => ({
      User: record.userName || "Unknown",
      Name: record.name || "N/A",
      "Mobile No": record.mobileNo || "N/A",
      "Call Type": record.callType || "N/A",
      Status: record.status || "N/A",
      "Date & Time": record.date ? new Date(record.date).toLocaleString() : "N/A",
      Duration: record.duration || "N/A",
      "Has Recording": record.recordings ? "Yes" : "No",
    }))

    // 4. Create Hourly Statistics Data
    const hourlyStatsData = hourlyStatistics.map((stat) => ({
      "Time Slot": stat.timeSlot,
      "Total Calls": stat.totalCalls,
      "Connected Calls": stat.totalConnectedCalls,
      "Total Duration": stat.totalDuration,
      "Total Calls %": stat.totalCallsPercentage,
      "Connected Calls %": stat.connectedCallsPercentage,
      "Duration %": stat.totalDurationPercentage,
    }))

    // Create worksheets with styles
    const summarySheet = createStyledWorksheet(summaryData, headerStyle)
    const userSummarySheet = createStyledWorksheet(userSummaryData, headerStyle)
    const callDetailsSheet = createStyledWorksheet(callDetailsData, callTypeHeaderStyle)
    const hourlyStatsSheet = createStyledWorksheet(hourlyStatsData, hourlyHeaderStyle)

    // Add worksheets to the workbook
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary")
    XLSX.utils.book_append_sheet(workbook, userSummarySheet, "User Summary")
    XLSX.utils.book_append_sheet(workbook, callDetailsSheet, "Call Details")
    XLSX.utils.book_append_sheet(workbook, hourlyStatsSheet, "Hourly Statistics")

    // Generate filename with date range
    const dateInfo =
      daterange.length === 2 ? `${daterange[0]}-to-${daterange[1]}` : selectedDate ? selectedDate : "all-dates"

    // Write to file and download
    XLSX.writeFile(workbook, `call-report-${dateInfo}.xlsx`)

    setExportModalVisible(false)
  }

  // Render overview tab content
  const renderOverviewTab = () => {
    if (loading) {
      return (
        <div className="card">
          <div className="card-body text-center p-5">
            <Spin size="large" />
            <p className="mt-3">Loading call data...</p>
          </div>
        </div>
      )
    }

    if (!callPerformanceData) {
      return (
        <div className="card">
          <div className="card-body text-center">
            <p>Please select a user and date range to view this report</p>
          </div>
        </div>
      )
    }

    // Process user summary data
    const userSummaryData = processUserSummary(callPerformanceData)
 

    return (
      <div>
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-header">
                <h5 className="card-title mb-0">Call Type Distribution</h5>
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
                        outerRadius={110}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={2} />
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
                  <h5 className="card-title mb-0">Call Performance</h5>
                </div>
              </div>
              <div className="card-body">
                <div style={{ marginBottom: "15px" }}>
                  <h6>
                    Total Calls:{" "}
                    <span style={{ fontWeight: "bold", fontSize: "1.2em" }}>{callPerformanceData.totalCalls}</span>
                  </h6>
                  <h6>
                    Total Duration:{" "}
                    <span style={{ fontWeight: "bold", fontSize: "1.2em" }}>{callPerformanceData.totalDuration}</span>
                  </h6>
                </div>

                <Table
                  columns={callSummaryColumns}
                  dataSource={callPerformanceData.callDetails}
                  pagination={{
                    onChange: cancel,
                    position: ["topRight"],
                    defaultPageSize: 20,
                    pageSizeOptions: [20, 30, 50, 100, 150, 200, 250, 300],
                  }}
                  bordered
                  style={{ boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}
                  rowClassName={() => "custom-row"}
                  scroll={{ x: 'max-content' }}
                  loading={loading}
                  rowKey="callType"
                />
              </div>
            </div>
          </div>
        </div>

        {/* User Summary Section */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">User Call Summary</h5>
              </div>
              <div className="card-body">
                <Table
                  columns={userSummaryColumns}
                  dataSource={userSummaryData}
                  pagination={{
                    onChange: cancel,
                    position: ["topRight"],
                    defaultPageSize: 20,
                    pageSizeOptions: [20, 30, 50, 100, 150, 200, 250, 300],
                  }}
                  bordered
                  style={{ boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}
                  rowClassName={() => "custom-row"}
                  loading={loading}
                  scroll={{ x: 'max-content' }}
                  rowKey="userName"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render details tab content
  const renderDetailsTab = () => {
    if (loading) {
      return (
        <div className="card">
          <div className="card-body text-center p-5">
            <Spin size="large" />
            <p className="mt-3">Loading call details...</p>
          </div>
        </div>
      )
    }

    if (!callPerformanceData) {
      return (
        <div className="card">
          <div className="card-body text-center">
            <p>Please select a user and date range to view this report</p>
          </div>
        </div>
      )
    }

    // Flatten all call records or filter by selected call type
    let callRecords = []

    if (detailsTab === "all") {
      callRecords = callPerformanceData.callDetails.flatMap((detail) => detail.callRecords)
    } else {
      const selectedCallType = callPerformanceData.callDetails.find((detail) => detail.callType === detailsTab)
      callRecords = selectedCallType ? selectedCallType.callRecords : []
    }

    return (
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Call Details</h5>
          <ul className="nav nav-tabs card-header-tabs mt-2">
            <li className="nav-item">
              <button
                className={`nav-link ${detailsTab === "all" ? "active" : ""}`}
                onClick={() => setDetailsTab("all")}
              >
                All Calls ({callPerformanceData.totalCalls})
              </button>
            </li>
            {callPerformanceData.callDetails.map((detail) => (
              <li className="nav-item" key={detail.callType}>
                <button
                  className={`nav-link ${detailsTab === detail.callType ? "active" : ""}`}
                  onClick={() => setDetailsTab(detail.callType)}
                  style={{ color: getCallTypeColor(detail.callType) }}
                >
                  {detail.callType} ({detail.callCount})
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="card-body">
          <Table
            columns={callDetailsColumns}
            dataSource={callRecords}
            pagination={{
              position: ["topRight"],
              defaultPageSize: 20,
              pageSizeOptions: [20, 30, 50, 100],
            }}
            style={{ overflowX: "auto", whiteSpace: "nowrap" }}
            scroll={{ x: "max-content" }}
            bordered
            loading={loading}
            rowKey="recordId"
          />
        </div>
      </div>
    )
  }

  // Render hourly statistics tab content
  const renderHourlyStatsTab = () => {
    if (loading) {
      return (
        <div className="card">
          <div className="card-body text-center p-5">
            <Spin size="large" />
            <p className="mt-3">Loading hourly statistics...</p>
          </div>
        </div>
      )
    }

    if (!hourlyStatistics || hourlyStatistics.length === 0) {
      return (
        <div className="card">
          <div className="card-body text-center">
            <p>Please select a user and date range to view this report</p>
          </div>
        </div>
      )
    }

    return (
      <div className="row">
        <div className="col-12 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Hourly Call Distribution</h5>
            </div>
            <div className="card-body">
              <div style={{ height: "400px" }}>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={hourlyBarData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timeSlot" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalCalls" name="Total Calls" fill="#0d6efd" />
                    <Bar dataKey="connectedCalls" name="Connected Calls" fill="#28a745" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Hourly Call Statistics</h5>
            </div>
            <div className="card-body">
              <Table
                columns={hourlyStatsColumns}
                dataSource={hourlyStatistics} 
                pagination={{
                  onChange: cancel,
                  position: ["topRight"],
                  defaultPageSize: 20,
                  pageSizeOptions: [20, 30, 50, 100, 150, 200, 250, 300],
                }}
                bordered
                style={{ boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}
                rowClassName={(record) =>
                  record.timeSlot === "Total" || record.timeSlot === "Daily Average" ? "bg-light font-weight-bold" : ""
                }
                loading={loading}
                rowKey="timeSlot"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid p-4 bg-light position-relative">
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <Spin size="large" tip="Loading data..." />
        </div>
      )}

      <div className="row mb-4">
        <div className="col-md-3">
          <h6 className="">Call Recordings Dashboard</h6>
        </div>
        <div className="col-md-9 d-flex justify-content-md-end align-items-center gap-2">
          {/* <Select
            mode="multiple"
            showSearch
            style={{ width: 300 }}
            placeholder="Select Users"
            optionFilterProp="label"
            value={selectedUsers}
            onChange={handleUserChange}
            dropdownRender={(menu) => (
              <div>
                <div style={{ padding: "8px", borderBottom: "1px solid #e8e8e8" }}>
                  <Checkbox
                    checked={selectAll}
                    onChange={(e) => {
                      setSelectAll(e.target.checked)
                      if (e.target.checked) {
                        const allUserIds = users.map((user) => user.assigneeId)
                        setSelectedUsers(allUserIds)
                      } else {
                        setSelectedUsers([])
                      }
                    }}
                  >
                    Select All
                  </Checkbox>
                </div>
                {menu}
              </div>
            )}
          >
            {users.length > 0 &&
              users.map((user) => (
                <Option key={user.assigneeId} value={user.assigneeId} label={user.assigneeName}>
                  {user.assigneeName}
                </Option>
              ))}
          </Select> */}

                 <Select
            mode="multiple"
            maxTagCount="responsive"
            showSearch
            style={{ width: 300 }}
            placeholder="Select Users"
            optionFilterProp="label"
            value={selectedUsers}
            open={selectDropdownOpen}  // Control dropdown visibility
            onDropdownVisibleChange={(open) => setSelectDropdownOpen(open)} // Toggle open state
            onChange={handleUserChange}
            dropdownRender={(menu) => (
              <div>
                <div style={{ padding: "8px", borderBottom: "1px solid #e8e8e8" }}>
                  <Checkbox
                    checked={selectAll}
                    onChange={(e) => {
                      setSelectAll(e.target.checked);
                      if (e.target.checked) {
                        const allUserIds = users.map((user) => user.assigneeId);
                        setSelectedUsers(allUserIds);
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                  >
                    Select All
                  </Checkbox>
                </div>
                {menu}
              </div>
            )}
          >
            {users.length > 0 &&
              users.map((user) => (
                <Option key={user.assigneeId} value={user.assigneeId} label={user.assigneeName}>
                  <Checkbox
                    checked={selectedUsers.includes(user.assigneeId)}
                    onChange={(e) => {
                      const updatedUsers = e.target.checked
                        ? [...selectedUsers, user.assigneeId]
                        : selectedUsers.filter((id) => id !== user.assigneeId);
                      setSelectedUsers(updatedUsers);
                    }}
                  >
                    {user.assigneeName}
                  </Checkbox>
                </Option>
              ))}
          </Select>

          <div>
            <RangePicker onChange={onRangeChange} />
          </div>
          {/* <div>
            <DatePicker onChange={onDateChange} placeholder="Select Date" />
          </div> */}
          <button
            className="btn btn-outline-secondary d-flex align-items-center"
            onClick={submitdata}
            disabled={!isFormValid() || loading}
          >
            {loading ? (
              <>
                <Spin size="small" style={{ marginRight: "8px" }} /> Loading...
              </>
            ) : (
              <>
                <i className="bi bi-arrow-right me-1"></i> Submit
              </>
            )}
          </button>
          <button
            className="btn btn-primary d-flex align-items-center"
            disabled={!callPerformanceData || loading}
            onClick={() => setExportModalVisible(true)}
          >
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
            Call Details
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "hourly" ? "active" : ""}`}
            onClick={() => setActiveTab("hourly")}
          >
            Hourly Statistics
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Overview Tab */}
        <div className={`tab-pane fade ${activeTab === "overview" ? "show active" : ""}`}>{renderOverviewTab()}</div>

        {/* Details Tab */}
        <div className={`tab-pane fade ${activeTab === "details" ? "show active" : ""}`}>{renderDetailsTab()}</div>

        {/* Hourly Statistics Tab */}
        <div className={`tab-pane fade ${activeTab === "hourly" ? "show active" : ""}`}>{renderHourlyStatsTab()}</div>
      </div>

      {error && (
        <div className="alert alert-danger mt-3" role="alert">
          {error}
        </div>
      )}

      {/* Export Modal */}
      <Modal
        title="Export Options"
        open={exportModalVisible}
        onCancel={() => setExportModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setExportModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="export" type="primary" onClick={handleExport}>
            Download Excel
          </Button>,
        ]}
      >
        <p>Select the format to export your data:</p>
        <Radio.Group value={exportType} onChange={(e) => setExportType(e.target.value)}>
          <Radio value="excel">Excel (.xlsx)</Radio>
        </Radio.Group>
      </Modal>
    </div>
  )
}

export default CallRecordings

