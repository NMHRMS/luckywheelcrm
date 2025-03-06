import { useEffect, useState } from "react";
import { Table, Button, message, DatePicker } from "antd";
import { getRequest } from "../utils/Api";
import { useNavigate } from "react-router-dom";
import Loader from "../utils/Loader";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const ListLeads = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedDates, setSelectedDates] = useState(null);
  const navigate = useNavigate();

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date";

    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are 0-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    getRequest("/api/Leads/get_leads_dataList")
      .then((response) => {
        setFiles(response.data);
        setFilteredFiles(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching files:", error);
        message.error("Failed to load files. Please try again later.");
        setLoading(false);
      });
  }, []);

  const handleFileClick = (fileName) => {
    navigate(`/crm/leadsdisplayexcelrecords/${fileName}`);
  };

  // Filtering based on Excel Name & Date Range
  useEffect(() => {
    let filtered = files;

    if (searchText) {
      filtered = filtered.filter((file) =>
        file.excelName.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedDates) {
      filtered = filtered.filter((file) => {
        const fileDate = dayjs(file.createdDate);
        return fileDate.isBetween(
          selectedDates[0],
          selectedDates[1],
          "day",
          "[]"
        );
      });
    }

    setFilteredFiles(filtered);
  }, [searchText, selectedDates, files]);

  const columns = [
    {
      title: "Excel Name",
      dataIndex: "excelName",
      key: "excelName",
      render: (text) =>
        text ? (
          <Button type="link" onClick={() => handleFileClick(text)}>
            {text}
          </Button>
        ) : (
          "Invalid Name"
        ),
      sorter: (a, b) => a.excelName.localeCompare(b.excelName),
      filters: [...new Set(files.map((lead) => lead.excelName))].map(
        (excelName) => ({
          text: excelName,
          value: excelName,
        })
      ),
      onFilter: (value, record) => record.excelName === value,
    },
    {
      title: "Total Leads",
      dataIndex: "totalCount",
      key: "totalCount",
      sorter: (a, b) => a.totalCount - b.totalCount,
    },
    {
      title: "Assigned Leads",
      dataIndex: "assignedCount",
      key: "assignedCount",
      sorter: (a, b) => a.assignedCount - b.assignedCount,
    },
    {
      title: "Not Assigned Leads",
      dataIndex: "notAssignedCount",
      key: "notAssignedCount",
      sorter: (a, b) => a.notAssignedCount - b.notAssignedCount,
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: formatDateTime,
      sorter: (a, b) => new Date(a.createdDate) - new Date(b.createdDate),
    },
  ];

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Leads by Excel File</h2>

      {/* Filters */}
      {/* <div className="mb-3 d-flex gap-3">
        <input
          type="text"
          placeholder="Search by Excel Name"
          className="form-control"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <RangePicker
          onChange={(dates) => setSelectedDates(dates)}
          format="DD/MM/YYYY"
        />
      </div> */}

      {loading ? (
        <Loader />
      ) : (
        <Table
          columns={columns}
          dataSource={filteredFiles.map((file, index) => ({
            ...file,
            key: index,
          }))}
          pagination={{ pageSize: 10 }}
          bordered
        />
      )}
    </div>
  );
};

export default ListLeads;
