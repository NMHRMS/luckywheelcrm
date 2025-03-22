import { useEffect, useState } from "react";
import { Table, Select, DatePicker, Spin, Modal, Button, Radio } from "antd";
import { getRequest } from "../utils/Api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import * as XLSX from "xlsx";

const { RangePicker } = DatePicker;
function DailyReport() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [users, Setusers] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [daterange, setDaterange] = useState([]);
  const [reportDataList, setReportDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [exportType, setExportType] = useState("excel");
  const allAssignedLeads = reportDataList.flatMap(
    (userSummary) => userSummary.assignedLeads || []
  );

  const allDelegatedLeads = reportDataList?.flatMap(
    (userSummary) => userSummary.delegatedLeads || []
  );

  const cancel = () => {
    setEditingKey("");
  };

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

  // 1. Add a function to check if user and date range are selected
  // const isFormValid = () => {
  //   return (
  //     selectedUsers.length > 0 &&
  //     (selectedDate || (daterange.length === 2 && daterange[0] && daterange[1]))
  //   );
  // };
  const isFormValid = () => {
    return (
      (selectedUsers.length > 0 &&
        !selectedDate &&
        !(daterange.length === 2 && daterange[0] && daterange[1])) ||
      selectedDate ||
      (daterange.length === 2 && daterange[0] && daterange[1])
    );
  };
  // 2. Update the submitdata function to validate inputs
  const submitdata = async () => {
    if (!isFormValid()) {
      alert("Please select at least one user and a valid date range or date.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Correctly construct userIds query parameters
      const userIdParams = selectedUsers.map((id) => `userIds=${id}`).join("&");
      const startDateParam =
        daterange.length === 2 ? `&startDate=${daterange[0]}` : "";
      const endDateParam =
        daterange.length === 2 ? `&endDate=${daterange[1]}` : "";
      const dateParam = selectedDate ? `&date=${selectedDate}` : "";

      // Build final API URL correctly
      let apiUrl = `/api/Leads/user-report?${userIdParams}${startDateParam}${endDateParam}${dateParam}`;

      console.log("API URL:", apiUrl); // Debugging

      const response = await getRequest(apiUrl);
      console.log("API Response:", response.data);
      setReportDataList(response.data);
    } catch (error) {
      console.error("Data fetch error:", error);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to render reviews for a lead
  // const renderReviews = (lead) => {
  //   if (!lead.leadsReview || lead.leadsReview.length === 0) {
  //     return <span className="text-muted">No reviews</span>;
  //   }

  //   // Filter reviews where reviewBy matches selectedUser
  //   const filteredReviews = lead.leadsReview.filter(
  //     (review) => review.reviewBy === selectedUsers
  //   );

  //   if (filteredReviews.length === 0) {
  //     return <span className="text-muted">No reviews by you</span>;
  //   }

  //   return (
  //     <div style={{ maxHeight: "150px", overflowY: "auto" }}>
  //       {filteredReviews.map((review, index) => (
  //         <div
  //           key={review.leadReviewId}
  //           style={{
  //             padding: "8px",
  //             marginBottom: "5px",
  //             backgroundColor: "#f9f9f9",
  //             borderRadius: "4px",
  //             borderLeft: "3px solid #007bff",
  //           }}
  //         >
  //           <div>
  //             <strong>Review:</strong> {review.review}
  //           </div>
  //           <div className="text-muted small">
  //             <span>Date: {new Date(review.reviewDate).toLocaleString()}</span>
  //           </div>
  //         </div>
  //       ))}
  //     </div>
  //   );
  // };
  const renderReviews = (lead) => {
    if (!lead.leadsReview || lead.leadsReview.length === 0) {
      return <span className="text-muted">No reviews</span>;
    }

    return (
      <div style={{ maxHeight: "150px", overflowY: "auto" }}>
        {lead.leadsReview.map((review, index) => (
          <div
            key={review.leadReviewId}
            style={{
              padding: "8px",
              marginBottom: "5px",
              backgroundColor: "#f9f9f9",
              borderRadius: "4px",
              borderLeft: "3px solid #007bff",
            }}
          >
            <div>
              <strong>Review:</strong> {review.review}
            </div>
            <div>
              <strong>Reviewed By:</strong> {review.reviewByName || "Unknown"}
            </div>
            <div className="text-muted small">
              <span>Date: {new Date(review.reviewDate).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };
  // const handleUserChange = (selectedUsers) => {
  //   if (selectedUsers.includes("All")) {
  //     // Select all user IDs
  //     const allUserIds = users.map((user) => user.id); // `users` is your full user list
  //     setSelectedUsers(allUserIds);
  //   } else {
  //     setSelectedUsers(selectedUsers);
  //   }
  // };
  // Handle Excel export
  const handleExport = () => {
    if (!reportDataList) return;

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Define styles for different sections
    const summaryHeaderStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "4472C4" } },
      alignment: { horizontal: "center" },
    };

    const assignedHeaderStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "70AD47" } },
      alignment: { horizontal: "center" },
    };

    const delegatedHeaderStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "ED7D31" } },
      alignment: { horizontal: "center" },
    };

    const dataStyle = {
      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      },
    };

    // Create styled worksheet function
    const createStyledWorksheet = (data, headerStyle) => {
      const ws = XLSX.utils.json_to_sheet(data);

      // Apply styles to headers (first row)
      const headerRange = XLSX.utils.decode_range(ws["!ref"]);
      for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
        if (!ws[cellAddress]) continue;

        ws[cellAddress].s = headerStyle;
      }

      // Apply styles to data cells
      for (let R = 1; R <= headerRange.e.r; ++R) {
        for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          if (!ws[cellAddress]) continue;

          ws[cellAddress].s = dataStyle;
        }
      }

      return ws;
    };

    // 1. Create Summary Data
    const summaryData = [
      {
        Metric: "Total Leads",
        Count: reportDataList.totalAssignedLeadsCount,
      },
      {
        Metric: "Connected",
        Count: reportDataList.connectedCount,
      },
      {
        Metric: "Pending",
        Count: reportDataList.pendingCount,
      },
      {
        Metric: "Not Called",
        Count: reportDataList.notCalledCount,
      },
      {
        Metric: "Not Connected",
        Count: reportDataList.notConnectedCount,
      },
      {
        Metric: "Positive",
        Count: reportDataList.positiveCount,
      },
      {
        Metric: "Negative",
        Count: reportDataList.negativeCount,
      },
      {
        Metric: "Closed",
        Count: reportDataList.closedCount,
      },
    ];

    // 2. Create Assigned Leads Data

    const assignedLeadsData = allAssignedLeads.map((lead) => ({
      "Owner Name": lead.ownerName,
      "Mobile No": lead.mobileNo,
      District: lead.districtName,
      State: lead.stateName,
      Model: lead.modelName,
      "Lead Type": lead.leadType,
      Status: lead.status,
      "Follow Up Date": lead.followUpDate
        ? new Date(lead.followUpDate).toLocaleString()
        : "N/A",
      Review:
        lead.leadsReview && lead.leadsReview.length > 0
          ? lead.leadsReview
              .filter((r) => r.reviewBy === selectedUsers)
              .map((r) => r.review)
              .join(", ")
          : "No reviews",
    }));

    // 3. Create Delegated Leads Data
    const delegatedLeadsData = allDelegatedLeads.map((lead) => ({
      "Owner Name": lead.ownerName,
      "Mobile No": lead.mobileNo,
      District: lead.districtName,
      State: lead.stateName,
      Model: lead.modelName,
      "Lead Type": lead.leadType,
      Status: lead.status,
      "Follow Up Date": lead.followUpDate
        ? new Date(lead.followUpDate).toLocaleString()
        : "N/A",
      Review:
        lead.leadsReview && lead.leadsReview.length > 0
          ? lead.leadsReview
              .filter((r) => r.reviewBy === selectedUsers)
              .map((r) => r.review)
              .join(", ")
          : "No reviews",
    }));

    // Create worksheets with styles
    const summarySheet = createStyledWorksheet(summaryData, summaryHeaderStyle);
    const assignedSheet = createStyledWorksheet(
      assignedLeadsData,
      assignedHeaderStyle
    );
    const delegatedSheet = createStyledWorksheet(
      delegatedLeadsData,
      delegatedHeaderStyle
    );

    // Add worksheets to the workbook
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");
    XLSX.utils.book_append_sheet(workbook, assignedSheet, "Active Leads");
    XLSX.utils.book_append_sheet(workbook, delegatedSheet, "Delegated Leads");

    // Write to file and download
    XLSX.writeFile(
      workbook,
      `lead-report-${selectedUsers.join("-")}-${daterange[0] || "default"}-to-${
        daterange[1] || "default"
      }.xlsx`
    );

    setExportModalVisible(false);
  };

  // Prepare data for table
  const data = reportDataList.map((report, index) => ({
    id: index + 1,
    date:
      daterange.length === 2
        ? `${daterange[0]} to ${daterange[1]}`
        : selectedDate,
    "Total Lead": report.totalAssignedLeadsCount || 0,
    Connected: report.connectedCount || 0,
    Pending: report.pendingCount || 0,
    "Not called": report.notCalledCount || 0,
    "Not Connected": report.notConnectedCount || 0,
    Positive: report.positiveCount || 0,
    Negative: report.negativeCount || 0,
    Closed: report.closedCount || 0,
    "Blocked user": 0, // If not applicable, remove or update accordingly
    userid: report.userId,
    username: report.userName || "Unknown",
    location: "", // Add if applicable
  }));

  // Prepare data for pie chart
  const pieData = [
    {
      name: "Connected",
      value: reportDataList?.connectedCount || 0,
      color: "#28a745",
    },
    {
      name: "Pending",
      value: reportDataList?.pendingCount || 0,
      color: "#ffc107",
    },
    {
      name: "Not called",
      value: reportDataList?.notCalledCount || 0,
      color: "#6c757d",
    },
    {
      name: "Positive",
      value: reportDataList?.positiveCount || 0,
      color: "#0d6efd",
    },
    {
      name: "Negative",
      value: reportDataList?.negativeCount || 0,
      color: "#dc3545",
    },
    {
      name: "Closed",
      value: reportDataList?.closedCount || 0,
      color: "#6610f2",
    },
    {
      name: "Not Connected",
      value: reportDataList?.notConnectedCount || 0,
      color: "#17a2b8",
    },
  ];

  // Calculate total metrics
  const totalLeads = reportDataList
    ? reportDataList.totalAssignedLeadsCount
    : 0;
  const totalConnected = reportDataList ? reportDataList.connectedCount : 0;
  const totalPending = reportDataList ? reportDataList.pendingCount : 0;
  const totalNotcalled = reportDataList ? reportDataList.notCalledCount : 0;
  const totalNegative = reportDataList ? reportDataList.negativeCount : 0;
  const totalClosed = reportDataList ? reportDataList.closedCount : 0;
  const totalPositive = reportDataList ? reportDataList.positiveCount : 0;
  const totalNotConnected = reportDataList
    ? reportDataList.notConnectedCount
    : 0;
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
      render: (_, record) =>
        selectedUsers
          .map((id) => users.find((u) => u.assigneeId === id)?.assigneeName)
          .join(", "),
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
  const totalAssignedCount = reportDataList?.reduce(
    (sum, user) => sum + (user.assignedLeadsCount || 0),
    0
  );

  const totalDelegatedCount = reportDataList?.reduce(
    (sum, user) => sum + (user.delegatedLeadsCount || 0),
    0
  );

  const totalConnectedCount = reportDataList?.reduce(
    (sum, user) => sum + (user.connectedCount || 0),
    0
  );

  const totalPendingCount = reportDataList?.reduce(
    (sum, user) => sum + (user.pendingCount || 0),
    0
  );

  const totalNotCalledCount = reportDataList?.reduce(
    (sum, user) => sum + (user.notCalledCount || 0),
    0
  );

  const totalNotConnectedCount = reportDataList?.reduce(
    (sum, user) => sum + (user.notConnectedCount || 0),
    0
  );

  const totalPositiveCount = reportDataList?.reduce(
    (sum, user) => sum + (user.positiveCount || 0),
    0
  );

  const totalNegativeCount = reportDataList?.reduce(
    (sum, user) => sum + (user.negativeCount || 0),
    0
  );

  const totalClosedCount = reportDataList?.reduce(
    (sum, user) => sum + (user.closedCount || 0),
    0
  );

  const useperformanceData = reportDataList
    ? [
        {
          statusType: "Active Leads",
          count: totalAssignedCount,
          key: "assigned",
        },
        {
          statusType: "Total Delegated",
          count: totalDelegatedCount,
          key: "delegated",
        },
        {
          statusType: "Connected",
          count: totalConnectedCount,
          key: "connected",
        },
        {
          statusType: "Pending",
          count: totalPendingCount,
          key: "pending",
        },
        {
          statusType: "Not called",
          count: totalNotCalledCount,
          key: "notcalled",
        },
        {
          statusType: "Not Connected",
          count: totalNotConnectedCount,
          key: "notconnected",
        },
        {
          statusType: "Positive",
          count: totalPositiveCount,
          key: "positive",
        },
        {
          statusType: "Negative",
          count: totalNegativeCount,
          key: "negative",
        },
        {
          statusType: "Closed",
          count: totalClosedCount,
          key: "closed",
        },
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
      "Active Leads": "#007bff",
      "Total Delegated": "#28a745",
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

  // Custom label for pie chart
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    name,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const onRangeChange = (dates, dateStrings) => {
    if (!dates || dates.length === 0) {
      setDaterange([]); // Pass null if nothing selected
    } else {
      setDaterange(dateStrings);
    }
  };

  const onDateChange = (selectedDate, dateString) => {
    setSelectedDate(dateString || null); // Pass null if not selected
  };
  const [detailsTab, setDetailsTab] = useState("assigned");
  const assignedLeadOwnerNames = [
    ...new Set(allAssignedLeads.map((lead) => lead.ownerName).filter(Boolean)),
  ];
  const assignedLeadFatherName = [
    ...new Set(allAssignedLeads.map((lead) => lead.fatherName).filter(Boolean)),
  ];
  const assignedLeadMobileNo = [
    ...new Set(allAssignedLeads.map((lead) => lead.mobileNo).filter(Boolean)),
  ];
  const assignedLeadDistrictName = [
    ...new Set(
      allAssignedLeads.map((lead) => lead.districtName).filter(Boolean)
    ),
  ];
  const assignedLeadCurrentAddress = [
    ...new Set(
      allAssignedLeads.map((lead) => lead.currentAddress).filter(Boolean)
    ),
  ];
  const assignedLeadRegistrationNo = [
    ...new Set(
      allAssignedLeads.map((lead) => lead.registrationNo).filter(Boolean)
    ),
  ];
  const assignedLeadRegistrationDate = [
    ...new Set(
      allAssignedLeads.map((lead) => lead.registrationDate).filter(Boolean)
    ),
  ];
  const assignedLeadchasisNo = [
    ...new Set(allAssignedLeads.map((lead) => lead.chasisNo).filter(Boolean)),
  ];
  const assignedLeadCurrentVehicle = [
    ...new Set(
      allAssignedLeads.map((lead) => lead.currentVehicle).filter(Boolean)
    ),
  ];
  const assignedLeadCategoryName = [
    ...new Set(
      allAssignedLeads.map((lead) => lead.categoryName).filter(Boolean)
    ),
  ];
  const assignedLeadProductNames = [
    ...new Set(
      allAssignedLeads.map((lead) => lead.productName).filter(Boolean)
    ),
  ];

  const assignedLeadStateNames = [
    ...new Set(allAssignedLeads.map((lead) => lead.stateName).filter(Boolean)),
  ];

  const assignedLeadLeadType = [
    ...new Set(allAssignedLeads.map((lead) => lead.leadType).filter(Boolean)),
  ];
  const assignedLeadFollowUpDate = [
    ...new Set(
      allAssignedLeads.map((lead) => lead.followUpDate).filter(Boolean)
    ),
  ];

  const assignedLeadStatusNames = [
    ...new Set(allAssignedLeads.map((lead) => lead.status).filter(Boolean)),
  ];
  //////////////////////////////////////////////////////////////////////////////////
  const delegatedLeadOwnerNames = [
    ...new Set(allAssignedLeads.map((lead) => lead.ownerName).filter(Boolean)),
  ];
  const delegatedLeadFatherName = [
    ...new Set(allAssignedLeads.map((lead) => lead.fatherName).filter(Boolean)),
  ];
  const delegatedLeadMobileNo = [
    ...new Set(allAssignedLeads.map((lead) => lead.mobileNo).filter(Boolean)),
  ];
  const delegatedLeadDistrictName = [
    ...new Set(
      allAssignedLeads.map((lead) => lead.districtName).filter(Boolean)
    ),
  ];
  const delegatedLeadCurrentAddress = [
    ...new Set(
      allAssignedLeads.map((lead) => lead.currentAddress).filter(Boolean)
    ),
  ];
  const delegatedLeadRegistrationNo = [
    ...new Set(
      allAssignedLeads.map((lead) => lead.registrationNo).filter(Boolean)
    ),
  ];
  const delegatedLeadRegistrationDate = [
    ...new Set(
      allAssignedLeads.map((lead) => lead.registrationDate).filter(Boolean)
    ),
  ];
  const delegatedLeadchasisNo = [
    ...new Set(allAssignedLeads.map((lead) => lead.chasisNo).filter(Boolean)),
  ];
  const delegatedLeadCurrentVehicle = [
    ...new Set(
      allAssignedLeads.map((lead) => lead.currentVehicle).filter(Boolean)
    ),
  ];
  const delegatedLeadCategoryName = [
    ...new Set(
      allAssignedLeads.map((lead) => lead.categoryName).filter(Boolean)
    ),
  ];
  const delegatedLeadProductNames = [
    ...new Set(
      allAssignedLeads.map((lead) => lead.productName).filter(Boolean)
    ),
  ];

  const delegatedLeadStateNames = [
    ...new Set(allAssignedLeads.map((lead) => lead.stateName).filter(Boolean)),
  ];

  const delegatedLeadLeadType = [
    ...new Set(allAssignedLeads.map((lead) => lead.leadType).filter(Boolean)),
  ];

  const delegatedLeadModelNames = [
    ...new Set(allAssignedLeads.map((lead) => lead.modelName).filter(Boolean)),
  ];

  const delegatedLeadStatusNames = [
    ...new Set(allAssignedLeads.map((lead) => lead.status).filter(Boolean)),
  ];

  const delegatedLeadAssignedToName = [
    ...new Set(
      allAssignedLeads.map((lead) => lead.assignedToName).filter(Boolean)
    ),
  ];

  const assignedLeadAssignedDate = [
    ...new Set(
      allAssignedLeads.map((lead) => lead.assignedDate).filter(Boolean)
    ),
  ];

  // 3. Replace the assignedLeadsColumns definition with this safer version
  const assignedLeadsColumns = [
    {
      title: "Owner Name",
      dataIndex: "ownerName",
      key: "ownerName",
      sorter: (a, b) => (a.ownerName || "").localeCompare(b.ownerName || ""),
      filters: assignedLeadOwnerNames.map((name) => ({
        text: name,
        value: name,
      })),
      onFilter: (value, record) =>
        record.ownerName && record.ownerName.indexOf(value) === 0,
      filterSearch: true,
      width: 140,
    },
    {
      title: "Father Name",
      dataIndex: "fatherName",
      key: "fatherName",
      sorter: (a, b) => (a.fatherName || "").localeCompare(b.fatherName || ""),
      filters: assignedLeadFatherName.map((name) => ({
        text: name,
        value: name,
      })),
      onFilter: (value, record) =>
        record.fatherName && record.fatherName.indexOf(value) === 0,
      filterSearch: true,
      width: 160,
    },
    {
      title: "Mobile No",
      dataIndex: "mobileNo",
      key: "mobileNo",
      sorter: (a, b) => (a.mobileNo || "").localeCompare(b.mobileNo || ""),
      filters: assignedLeadMobileNo.map((name) => ({
        text: name,
        value: name,
      })),
      onFilter: (value, record) =>
        record.mobileNo && record.mobileNo.indexOf(value) === 0,
      filterSearch: true,
      width: 160,
    },
    {
      title: "District",
      dataIndex: "districtName",
      key: "districtName",
      sorter: (a, b) =>
        (a.districtName || "").localeCompare(b.districtName || ""),
      filters: assignedLeadDistrictName.map((name) => ({
        text: name,
        value: name,
      })),
      onFilter: (value, record) =>
        record.districtName && record.districtName.indexOf(value) === 0,
      filterSearch: true,
      width: 160,
    },
    {
      title: "Current Address",
      dataIndex: "currentAddress",
      key: "currentAddress",
      sorter: (a, b) =>
        (a.currentAddress || "").localeCompare(b.currentAddress || ""),
      filters: assignedLeadCurrentAddress.map((name) => ({
        text: name,
        value: name,
      })),
      onFilter: (value, record) =>
        record.currentAddress && record.currentAddress.indexOf(value) === 0,
      filterSearch: true,
      width: 160,
    },
    {
      title: "Registration No",
      dataIndex: "registrationNo",
      key: "registrationNo",
      sorter: (a, b) =>
        (a.registrationNo || "").localeCompare(b.registrationNo || ""),
      filters: assignedLeadRegistrationNo.map((name) => ({
        text: name,
        value: name,
      })),
      onFilter: (value, record) =>
        record.registrationNo && record.registrationNo.indexOf(value) === 0,
      filterSearch: true,
      width: 160,
    },
    {
      title: "Registration Date",
      dataIndex: "registrationDate",
      key: "registrationDate",
      sorter: (a, b) =>
        (a.registrationDate || "").localeCompare(b.registrationDate || ""),
      filters: assignedLeadRegistrationDate.map((name) => ({
        text: name,
        value: name,
      })),
      onFilter: (value, record) =>
        record.registrationDate && record.registrationDate.indexOf(value) === 0,
      filterSearch: true,
      width: 160,
    },
    {
      title: "chasis No",
      dataIndex: "chasisNo",
      key: "chasisNo",
      sorter: (a, b) => (a.chasisNo || "").localeCompare(b.chasisNo || ""),
      filters: assignedLeadchasisNo.map((name) => ({
        text: name,
        value: name,
      })),
      onFilter: (value, record) =>
        record.chasisNo && record.chasisNo.indexOf(value) === 0,
      filterSearch: true,
      width: 160,
    },
    {
      title: "Current Vehicle",
      dataIndex: "currentVehicle",
      key: "currentVehicle",
      sorter: (a, b) =>
        (a.currentVehicle || "").localeCompare(b.currentVehicle || ""),
      filters: assignedLeadCurrentVehicle.map((name) => ({
        text: name,
        value: name,
      })),
      onFilter: (value, record) =>
        record.currentVehicle && record.currentVehicle.indexOf(value) === 0,
      filterSearch: true,
      width: 160,
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
      sorter: (a, b) =>
        (a.categoryName || "").localeCompare(b.categoryName || ""),
      filters: assignedLeadCategoryName.map((name) => ({
        text: name,
        value: name,
      })),
      onFilter: (value, record) =>
        record.categoryName && record.categoryName.indexOf(value) === 0,
      filterSearch: true,
      width: 160,
    },
    {
      title: "Product",
      dataIndex: "productName",
      key: "productName",
      sorter: (a, b) =>
        (a.productName || "").localeCompare(b.productName || ""),
      filters: assignedLeadProductNames.map((name) => ({
        text: name,
        value: name,
      })),
      onFilter: (value, record) =>
        record.productName && record.productName.indexOf(value) === 0,
      filterSearch: true,
      width: 160,
    },
    {
      title: "State",
      dataIndex: "stateName",
      key: "stateName",
      sorter: (a, b) => (a.stateName || "").localeCompare(b.stateName || ""),
      filters: assignedLeadStateNames.map((name) => ({
        text: name,
        value: name,
      })),
      onFilter: (value, record) =>
        record.stateName && record.stateName.indexOf(value) === 0,
      filterSearch: true,
    },
    {
      title: "Model",
      dataIndex: "modelName",
      key: "modelName",
      sorter: (a, b) => (a.modelName || "").localeCompare(b.modelName || ""),
    },
    {
      title: "Lead Type",
      dataIndex: "leadType",
      key: "leadType",
      sorter: (a, b) => (a.leadType || "").localeCompare(b.leadType || ""),
      filters: assignedLeadLeadType.map((name) => ({
        text: name,
        value: name,
      })),
      onFilter: (value, record) =>
        record.leadType && record.leadType.indexOf(value) === 0,
      filterSearch: true,
      width: 140,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => (a.status || "").localeCompare(b.status || ""),
      filters: assignedLeadStatusNames.map((name) => ({
        text: name,
        value: name,
      })),
      onFilter: (value, record) =>
        record.status && record.status.indexOf(value) === 0,
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
      sorter: (a, b) => {
        if (!a.followUpDate) return -1;
        if (!b.followUpDate) return 1;
        return new Date(a.followUpDate) - new Date(b.followUpDate);
      },
      render: (text) => (text ? new Date(text).toLocaleString() : "N/A"),
    },

    {
      title: "Your Reviews",
      key: "reviews",
      render: (_, record) => renderReviews(record),
      width: 390,
    },
    {
      title: "Assigned Date",
      dataIndex: "assignedDate",
      key: "assignedDate",
      sorter: (a, b) =>
        (a.assignedDate || "").localeCompare(b.assignedDate || ""),
      filters: assignedLeadFollowUpDate.map((name) => ({
        text: name,
        value: name,
      })),
      onFilter: (value, record) =>
        record.assignedDate && record.assignedDate.indexOf(value) === 0,
      filterSearch: true,
      width: 160,
    },
  ];

  // 4. Create a function to get delegated leads columns with proper filters
  const getDelegatedLeadsColumns = [
    {
      title: "Owner Name",
      dataIndex: "ownerName",
      key: "ownerName",
      sorter: (a, b) => (a.ownerName || "").localeCompare(b.ownerName || ""),
      filters: delegatedLeadOwnerNames.map((name) => ({
        text: name,
        value: name,
      })),
      onFilter: (value, record) =>
        record.ownerName && record.ownerName.indexOf(value) === 0,
      filterSearch: true,
      width: 140,
    },
    {
      title: "Father Name",
      dataIndex: "fatherName",
      key: "fatherName",
      sorter: (a, b) => (a.fatherName || "").localeCompare(b.fatherName || ""),
      filters: delegatedLeadFatherName.map((name) => ({
        text: name,
        value: name,
      })),
      onFilter: (value, record) =>
        record.fatherName && record.fatherName.indexOf(value) === 0,
      filterSearch: true,
      width: 140,
    },
    {
      title: "Mobile No",
      dataIndex: "mobileNo",
      key: "mobileNo",
      sorter: (a, b) => (a.mobileNo || "").localeCompare(b.mobileNo || ""),
      filters: delegatedLeadMobileNo.map((name) => ({
        text: name,
        value: name,
      })),
      onFilter: (value, record) =>
        record.mobileNo && record.mobileNo.indexOf(value) === 0,
      filterSearch: true,
      width: 140,
    },
    {
      title: "District",
      dataIndex: "districtName",
      key: "districtName",
      sorter: (a, b) =>
        (a.districtName || "").localeCompare(b.districtName || ""),
      filters: delegatedLeadDistrictName.map((name) => ({
        text: name,
        value: name,
      })),
      onFilter: (value, record) =>
        record.districtName && record.districtName.indexOf(value) === 0,
      filterSearch: true,
      width: 140,
    },
    {
      title: "Current Address",
      dataIndex: "currentAddress",
      key: "currentAddress",
      sorter: (a, b) =>
        (a.currentAddress || "").localeCompare(b.currentAddress || ""),
      filters: delegatedLeadCurrentAddress.map((name) => ({
        text: name,
        value: name,
      })),
      onFilter: (value, record) =>
        record.currentAddress && record.currentAddress.indexOf(value) === 0,
      filterSearch: true,
      width: 160,
    },
    {
      title: "Registration No",
      dataIndex: "registrationNo",
      key: "registrationNo",
      sorter: (a, b) =>
        (a.registrationNo || "").localeCompare(b.registrationNo || ""),
      filters: delegatedLeadRegistrationNo.map((name) => ({
        text: name,
        value: name,
      })),
      onFilter: (value, record) =>
        record.registrationNo && record.registrationNo.indexOf(value) === 0,
      filterSearch: true,
      width: 160,
    },
    {
      title: "Registration Date",
      dataIndex: "registrationDate",
      key: "registrationDate",
      sorter: (a, b) =>
        (a.registrationDate || "").localeCompare(b.registrationDate || ""),
      filters: delegatedLeadRegistrationDate.map((name) => ({
        text: name,
        value: name,
      })),
      onFilter: (value, record) =>
        record.registrationDate && record.registrationDate.indexOf(value) === 0,
      filterSearch: true,
      width: 160,
    },
    {
      title: "chasis No",
      dataIndex: "chasisNo",
      key: "chasisNo",
      sorter: (a, b) => (a.chasisNo || "").localeCompare(b.chasisNo || ""),
      filters: delegatedLeadchasisNo.map((name) => ({
        text: name,
        value: name,
      })),
      onFilter: (value, record) =>
        record.chasisNo && record.chasisNo.indexOf(value) === 0,
      filterSearch: true,
      width: 160,
    },
    {
      title: "Current Vehicle",
      dataIndex: "currentVehicle",
      key: "currentVehicle",
      sorter: (a, b) =>
        (a.currentVehicle || "").localeCompare(b.currentVehicle || ""),
      filters: delegatedLeadCurrentVehicle.map((name) => ({
        text: name,
        value: name,
      })),
      onFilter: (value, record) =>
        record.currentVehicle && record.currentVehicle.indexOf(value) === 0,
      filterSearch: true,
      width: 160,
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
      sorter: (a, b) =>
        (a.categoryName || "").localeCompare(b.categoryName || ""),
      filters: delegatedLeadCategoryName.map((name) => ({
        text: name,
        value: name,
      })),
      onFilter: (value, record) =>
        record.categoryName && record.categoryName.indexOf(value) === 0,
      filterSearch: true,
      width: 160,
    },
    {
      title: "Product",
      dataIndex: "productName",
      key: "productName",
      sorter: (a, b) =>
        (a.productName || "").localeCompare(b.productName || ""),
      filters: delegatedLeadProductNames.map((name) => ({
        text: name,
        value: name,
      })),
      onFilter: (value, record) =>
        record.productName && record.productName.indexOf(value) === 0,
      filterSearch: true,
      width: 160,
    },
    {
      title: "State",
      dataIndex: "stateName",
      key: "stateName",
      sorter: (a, b) => (a.stateName || "").localeCompare(b.stateName || ""),
      filters: delegatedLeadStateNames.map((name) => ({
        text: name,
        value: name,
      })),
      onFilter: (value, record) =>
        record.stateName && record.stateName.indexOf(value) === 0,
      filterSearch: true,
      width: 140,
    },
    {
      title: "Model",
      dataIndex: "modelName",
      key: "modelName",
      sorter: (a, b) => (a.modelName || "").localeCompare(b.modelName || ""),
      filters: delegatedLeadModelNames.map((name) => ({
        text: name,
        value: name,
      })),
      onFilter: (value, record) =>
        record.modelName && record.modelName.indexOf(value) === 0,
      filterSearch: true,
      width: 140,
    },
    {
      title: "Lead Type",
      dataIndex: "leadType",
      key: "leadType",
      sorter: (a, b) => (a.leadType || "").localeCompare(b.leadType || ""),
      filters: delegatedLeadLeadType.map((name) => ({
        text: name,
        value: name,
      })),
      onFilter: (value, record) =>
        record.leadType && record.leadType.indexOf(value) === 0,
      filterSearch: true,
      width: 140,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => (a.status || "").localeCompare(b.status || ""),
      filters: delegatedLeadStatusNames.map((name) => ({
        text: name,
        value: name,
      })),
      onFilter: (value, record) =>
        record.status && record.status.indexOf(value) === 0,
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
      sorter: (a, b) => {
        if (!a.followUpDate) return -1;
        if (!b.followUpDate) return 1;
        return new Date(a.followUpDate) - new Date(b.followUpDate);
      },
      render: (text) => (text ? new Date(text).toLocaleString() : "N/A"),
    },
    {
      title: "Your Reviews",
      key: "reviews",
      render: (_, record) => renderReviews(record),
      width: 390,
    },
    {
      title: "Assigned To",
      dataIndex: "assignedToName",
      key: "assignedToName",
      sorter: (a, b) =>
        (a.assignedToName || "").localeCompare(b.assignedToName || ""),
      filters: delegatedLeadAssignedToName.map((name) => ({
        text: name,
        value: name,
      })),
      onFilter: (value, record) =>
        record.assignedToName && record.assignedToName.indexOf(value) === 0,
      filterSearch: true,
      width: 160,
    },
    {
      title: "Assigned Date",
      dataIndex: "assignedDate",
      key: "assignedDate",
      sorter: (a, b) =>
        (a.assignedDate || "").localeCompare(b.assignedDate || ""),
      filters: assignedLeadAssignedDate.map((name) => ({
        text: name,
        value: name,
      })),
      onFilter: (value, record) =>
        record.assignedDate && record.assignedDate.indexOf(value) === 0,
      filterSearch: true,
      width: 160,
    },
  ];

  // 5. Update the renderDetailsTab function to use the new columns
  const renderDetailsTab = () => {
    if (loading) {
      return (
        <div className="card">
          <div className="card-body text-center p-5">
            <Spin size="large" />
            <p className="mt-3">Loading lead details...</p>
          </div>
        </div>
      );
    }

    if (!reportDataList) {
      return (
        <div className="card">
          <div className="card-body text-center">
            <p>Please select a user and date range to view this report</p>
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
                Active Leads ({reportDataList.assignedLeadsCount})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  detailsTab === "delegated" ? "active" : ""
                }`}
                onClick={() => setDetailsTab("delegated")}
              >
                Delegated Leads ({reportDataList.delegatedLeadsCount})
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
              dataSource={allAssignedLeads.map((lead) => ({
                ...lead,
                key: lead.leadId,
                assignedToName:
                  users.find((u) => u.assigneeId === lead.assignedTo)
                    ?.assigneeName || "Unknown",
              }))}
              pagination={{
                onChange: cancel,
                position: ["topRight"],
                defaultPageSize: 20,
                pageSizeOptions: [20, 30, 50, 100, 150, 200, 250, 300],
              }}
              style={{ overflowX: "auto", whiteSpace: "nowrap" }}
              scroll={{ x: "max-content", y: 500 }}
              // scroll={{ x: true }}
              bordered
              loading={loading}
            />
          )}
          {detailsTab === "delegated" && (
            <Table
              columns={getDelegatedLeadsColumns}
              dataSource={allDelegatedLeads.map((lead) => ({
                ...lead,
                key: lead.leadId,
                assignedToName:
                  users.find((u) => u.assigneeId === lead.assignedTo)
                    ?.assigneeName || "Unknown",
              }))}
              pagination={{
                onChange: cancel,
                position: ["topRight"],
                defaultPageSize: 20,
                pageSizeOptions: [20, 30, 50, 100, 150, 200, 250, 300],
              }}
              style={{ overflowX: "auto", whiteSpace: "nowrap" }}
              // scroll={{ x: "max-content", y: 500 }}
              scroll={{ x: true }}
              bordered
              loading={loading}
            />
          )}
          {detailsTab === "summary" && (
            <Table
              columns={columns}
              dataSource={data}
              rowKey="id"
              pagination={{
                onChange: cancel,
                position: ["topRight"],
                defaultPageSize: 20,
                pageSizeOptions: [20, 30, 50, 100, 150, 200, 250, 300],
              }}
              style={{ overflowX: "auto", whiteSpace: "nowrap" }}
              // scroll={{ x: "true", y: 500 }}
              bordered
              loading={loading}
            />
          )}
        </div>
      </div>
    );
  };

  // 6. Update the Overview tab to show a message when no data is available
  const renderOverviewTab = () => {
    if (loading) {
      return (
        <div className="card">
          <div className="card-body text-center p-5">
            <Spin size="large" />
            <p className="mt-3">Loading overview data...</p>
          </div>
        </div>
      );
    }

    if (!reportDataList) {
      return (
        <div className="card">
          <div className="card-body text-center">
            <p>Please select a user and date range to view this report</p>
          </div>
        </div>
      );
    }

    return (
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="card-title mb-0">Lead Status Distribution</h5>
            </div>
            <div className="card-body">
              <div style={{ height: "300px" }}>
                <ResponsiveContainer width="100%" height={300}>
                  {reportDataList && (
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
                  )}
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
                  Total Assigned Leads:{" "}
                  <span style={{ fontWeight: "bold", fontSize: "1.2em" }}>
                    {totalLeads}
                  </span>
                </h6>
              </div>

              {/* ✅ Add the Table Back Here */}
              <Table
                columns={useperformanceColumns}
                dataSource={useperformanceData}
                pagination={false}
                bordered
                style={{ boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}
                rowClassName={() => "custom-row"}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 7. Update the submit button to be disabled when form is invalid
  // Replace the return statement with this updated version
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
          <h6 className="">Daily Report Dashboard</h6>
        </div>
        <div className="col-md-9 d-flex justify-content-md-end align-items-center gap-2">
          <Select
            mode="multiple"
            showSearch
            style={{ width: 300 }}
            placeholder="Select Users"
            optionFilterProp="label"
            value={selectedUsers} // This will now hold multiple users
            onChange={(value) => setSelectedUsers(value)}
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
          <div>
            <DatePicker onChange={onDateChange} placeholder="Select Date" />
          </div>
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
                <i className="bi bi-arrow me-1"></i> Submit
              </>
            )}
          </button>
          <button
            className="btn btn-primary d-flex align-items-center"
            disabled={!reportDataList || loading}
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
            Details
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Overview Tab */}
        <div
          className={`tab-pane fade ${
            activeTab === "overview" ? "show active" : ""
          }`}
        >
          {renderOverviewTab()}
        </div>

        {/* Details Tab */}
        <div
          className={`tab-pane fade ${
            activeTab === "details" ? "show active" : ""
          }`}
        >
          {renderDetailsTab()}
        </div>
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
        <Radio.Group
          value={exportType}
          onChange={(e) => setExportType(e.target.value)}
        >
          <Radio value="excel">Excel (.xlsx)</Radio>
        </Radio.Group>
      </Modal>
    </div>
  );
}

export default DailyReport;
