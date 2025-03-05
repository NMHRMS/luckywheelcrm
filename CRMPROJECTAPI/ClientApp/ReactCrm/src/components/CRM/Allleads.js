import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { getRequest } from "../utils/Api";
import Loader from "../utils/Loader";

function AllLeads() {
  const [leads, setLeads] = useState({
    newLeads: [],
    duplicateLeads: [],
    blockedLeads: [],
  });
  const [activeTab, setActiveTab] = useState("new");
  const [loading, setLoading] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await getRequest("/api/Leads");
      if (response?.data) {
        setLeads({
          newLeads: response.data.newLeads || [],
          duplicateLeads: response.data.duplicateLeads || [],
          blockedLeads: response.data.blockedLeads || [],
        });
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
    setLoading(false)
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const getUniqueFilters = (data, key) => {
    const uniqueValues = [...new Set(data.map((item) => item[key]))];
    return uniqueValues.map((value) => ({ text: value, value }));
  };

  const columns = [
    {
      title: "Owner Name",
      dataIndex: "ownerName",
      key: "ownerName",
      sorter: (a, b) => a.ownerName.localeCompare(b.ownerName),
      filterSearch:true,
      filterMode: "tree",
      filters: getUniqueFilters([...leads.newLeads, ...leads.duplicateLeads, ...leads.blockedLeads], "ownerName"),
      onFilter: (value, record) => record.ownerName === value,
    },
    {
      title: "Mobile No",
      dataIndex: "mobileNo",
      key: "mobileNo",
      render: (text) => (text === "N/A" ? "Not Available" : text),
      sorter: (a, b) => a.mobileNo.localeCompare(b.mobileNo),
      filterSearch:true,
      filterMode: "tree",
      filters: getUniqueFilters([...leads.newLeads, ...leads.duplicateLeads, ...leads.blockedLeads], "mobileNo"),
      onFilter: (value, record) => record.mobileNo === value,
    },
    {
      title: "State",
      dataIndex: "stateName",
      key: "stateName",
      filters: getUniqueFilters([...leads.newLeads, ...leads.duplicateLeads, ...leads.blockedLeads], "stateName"),
      onFilter: (value, record) => record.stateName === value,
      sorter: (a, b) => a.stateName.localeCompare(b.stateName),
      filterSearch:true,
      filterMode: "tree",
    },
    {
      title: "District",
      dataIndex: "districtName",
      key: "districtName",
      filters: getUniqueFilters([...leads.newLeads, ...leads.duplicateLeads, ...leads.blockedLeads], "districtName"),
      onFilter: (value, record) => record.districtName === value,
      sorter: (a, b) => a.districtName.localeCompare(b.districtName),
      filterSearch:true,
      filterMode: "tree",
    },
    {
      title: "Product",
      dataIndex: "productName",
      key: "productName",
      filters: getUniqueFilters([...leads.newLeads, ...leads.duplicateLeads, ...leads.blockedLeads], "productName"),
      onFilter: (value, record) => record.productName === value,
      sorter: (a, b) => a.productName.localeCompare(b.productName),
      filterSearch:true,
      filterMode: "tree",
    },
    {
      title: "Model",
      dataIndex: "modelName",
      key: "modelName",
      filters: getUniqueFilters([...leads.newLeads, ...leads.duplicateLeads, ...leads.blockedLeads], "modelName"),
      onFilter: (value, record) => record.modelName === value,
      sorter: (a, b) => a.modelName.localeCompare(b.modelName),
      filterSearch:true,
      filterMode: "tree",
    },
    {
      title: "Excel Name",
      dataIndex: "excelName",
      key: "excelName",
      filters: getUniqueFilters([...leads.newLeads, ...leads.duplicateLeads, ...leads.blockedLeads], "excelName"),
      onFilter: (value, record) => record.excelName === value,
      sorter: (a, b) => a.excelName.localeCompare(b.excelName),
      filterSearch:true,
      filterMode: "tree",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: getUniqueFilters([...leads.newLeads, ...leads.duplicateLeads, ...leads.blockedLeads], "status"),
      onFilter: (value, record) => record.status === value,
      sorter: (a, b) => a.status.localeCompare(b.status),
      filterSearch:true,
      filterMode: "tree",
    },
  ];

  return (
    <div className="container mt-1">
      <h4 className="mb-4">All Leads</h4>
  
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Bootstrap Tabs */}
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "new" ? "active" : ""}`}
                onClick={() => setActiveTab("new")}
              >
                New Leads ({leads.newLeads.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "duplicate" ? "active" : ""}`}
                onClick={() => setActiveTab("duplicate")}
              >
                Duplicate Leads ({leads.duplicateLeads.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "blocked" ? "active" : ""}`}
                onClick={() => setActiveTab("blocked")}
              >
                Blocked Leads ({leads.blockedLeads.length})
              </button>
            </li>
          </ul>
  
          {/* Tab Content */}
          <div className="tab-content">
            <div className={`tab-pane ${activeTab === "new" ? "show active" : ""}`}>
              <div className="card shadow">
                <div className="card-body">
                  <Table
                    columns={columns}
                    dataSource={leads.newLeads}
                    rowKey="leadId"
                    pagination={{ pageSize: 50 }}
                    scroll={{ x: "max-content", y: 500 }}
                    style={{ overflowX: "auto", whiteSpace: "nowrap" }}
                    bordered
                  />
                </div>
              </div>
            </div>
  
            <div className={`tab-pane ${activeTab === "duplicate" ? "show active" : ""}`}>
              <div className="card shadow mt-3">
                <div className="card-body">
                  <Table
                    columns={columns}
                    dataSource={leads.duplicateLeads}
                    rowKey="leadId"
                    pagination={{ pageSize: 50 }}
                    scroll={{ x: "max-content", y: 500 }}
                    style={{ overflowX: "auto", whiteSpace: "nowrap" }}
                  />
                </div>
              </div>
            </div>
  
            <div className={`tab-pane ${activeTab === "blocked" ? "show active" : ""}`}>
              <div className="card shadow mt-3">
                <div className="card-body">
                  <Table
                    columns={columns}
                    dataSource={leads.blockedLeads}
                    rowKey="leadId"
                    pagination={{ pageSize: 50 }}
                    scroll={{ x: "max-content", y: 500 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
  
}

export default AllLeads;
