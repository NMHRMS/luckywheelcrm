import { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import { getRequest } from "../utils/Api";
import { useNavigate } from "react-router-dom";
import Loader from "../utils/Loader";

const ListLeads = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    if (isNaN(date)) return 'Invalid Date';
  
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are 0-based
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    getRequest("/api/Leads/get_leads_dataList")
      .then((response) => {
        setFiles(response.data);
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
      render:formatDateTime,
      sorter: (a, b) => new Date(a.createdDate) - new Date(b.createdDate),
    },
  ];

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Leads by Excel File</h2>
      {loading ? (
        <Loader />
      ) : (
        <Table
          columns={columns}
          dataSource={files.map((file, index) => ({
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
