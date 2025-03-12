import React, { useEffect, useState } from "react";
import { Table,Input } from "antd";
import { getRequest } from "../utils/Api";
import Loader from "../utils/Loader";
import { Spin } from "antd";
function AllLeads() {
  const [leads, setLeads] = useState({
    newLeads: [],
    duplicateLeads: [],
    blockedLeads: [],
  });
  const [activeTab, setActiveTab] = useState("new");
  const [loading, setLoading] = useState(false);
  const [editingKey, setEditingKey] = useState('');
const [searchText, setSearchText] = useState("");
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
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const getUniqueFilters = (data, key) => {
    const uniqueValues = [...new Set(data.map((item) => item[key]))];
    return uniqueValues.map((value) => ({ text: value, value }));
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value.toLowerCase());
  };

  const filteredNewLeads = leads.newLeads.filter(
    (lead) =>
      lead.mobileNo.toLowerCase().includes(searchText) ||
      lead.ownerName.toLowerCase().includes(searchText)
  );
  
  const filteredDuplicateLeads = leads.duplicateLeads.filter(
    (lead) =>
      lead.mobileNo.toLowerCase().includes(searchText) ||
      lead.ownerName.toLowerCase().includes(searchText)
  );

  const filteredBlockedLeads =leads.blockedLeads.filter(
    (lead) =>
      lead.mobileNo.toLowerCase().includes(searchText) ||
      lead.ownerName.toLowerCase().includes(searchText)
  );

  const cancel = () => {
    setEditingKey('');
  };


  const columns = [
    {
      title: "State",
      dataIndex: "stateName",
      key: "stateName",
      filters: getUniqueFilters(
        [...leads.newLeads, ...leads.duplicateLeads, ...leads.blockedLeads],
        "stateName"
      ),
      onFilter: (value, record) => record.stateName === value,
      sorter: (a, b) => {
        const nameA = a.stateName ? a.stateName.toLowerCase() : '';
        const nameB = b.stateName ? b.stateName.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filterSearch: true,
      filterMode: "tree",
      width:140
    },
    {
      title: "District",
      dataIndex: "districtName",
      key: "districtName",
      filters: getUniqueFilters(
        [...leads.newLeads, ...leads.duplicateLeads, ...leads.blockedLeads],
        "districtName"
      ),
      onFilter: (value, record) => record.districtName === value,
      sorter: (a, b) => {
        const nameA = a.districtName ? a.districtName.toLowerCase() : '';
        const nameB = b.districtName ? b.districtName.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filterSearch: true,
      filterMode: "tree",
      width:140
    },
    {
      title: "Owner Name",
      dataIndex: "ownerName",
      key: "ownerName",
      sorter: (a, b) => a.ownerName.localeCompare(b.ownerName),
      filterSearch: true,
      filterMode: "tree",
      filters: getUniqueFilters(
        [...leads.newLeads, ...leads.duplicateLeads, ...leads.blockedLeads],
        "ownerName"
      ),
      sorter: (a, b) => {
        const nameA = a.ownerName ? a.ownerName.toLowerCase() : '';
        const nameB = b.ownerName ? b.ownerName.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filterSearch: true,
      filterMode: "tree",
      width:140
    },
    {
      title: "Mobile No",
      dataIndex: "mobileNo",
      key: "mobileNo",
      render: (text) => (text === "N/A" ? "Not Available" : text),
      sorter: (a, b) => a.mobileNo.localeCompare(b.mobileNo),
      filterSearch: true,
      filterMode: "tree",
      filters: getUniqueFilters(
        [...leads.newLeads, ...leads.duplicateLeads, ...leads.blockedLeads],
        "mobileNo"
      ),
      sorter: (a, b) => {
        const nameA = a.mobileNo ? a.mobileNo.toLowerCase() : '';
        const nameB = b.mobileNo ? b.mobileNo.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filterSearch: true,
      filterMode: "tree",
      width:140
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
      filters: getUniqueFilters(
        [...leads.newLeads, ...leads.duplicateLeads, ...leads.blockedLeads],
        "categoryName"
      ),
      onFilter: (value, record) => record.categoryName === value,
      sorter: (a, b) => {
        const nameA = a.categoryName ? a.categoryName.toLowerCase() : '';
        const nameB = b.categoryName ? b.categoryName.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filterSearch: true,
      filterMode: "tree",
      width:140
    },
    {
      title: "Product",
      dataIndex: "productName",
      key: "productName",
      filters: getUniqueFilters(
        [...leads.newLeads, ...leads.duplicateLeads, ...leads.blockedLeads],
        "productName"
      ),
      onFilter: (value, record) => record.productName === value,
      sorter: (a, b) => {
        const nameA = a.productName ? a.productName.toLowerCase() : '';
        const nameB = b.productName ? b.productName.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filterSearch: true,
      filterMode: "tree",
      width:140
    },
    {
      title: "Model",
      dataIndex: "modelName",
      key: "modelName",
      filters: getUniqueFilters(
        [...leads.newLeads, ...leads.duplicateLeads, ...leads.blockedLeads],
        "modelName"
      ),
      onFilter: (value, record) => record.modelName === value,
      sorter: (a, b) => {
        const nameA = a.modelName ? a.modelName.toLowerCase() : '';
        const nameB = b.modelName ? b.modelName.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filterSearch: true,
      filterMode: "tree",
      width:140
    },
    {
      title: "Lead Type",
      dataIndex: "leadType",
      key: "leadType",
      filters: getUniqueFilters(
        [...leads.newLeads, ...leads.duplicateLeads, ...leads.blockedLeads],
        "leadType"
      ),
      onFilter: (value, record) => record.leadType === value,
      sorter: (a, b) => {
        const nameA = a.leadType ? a.leadType.toLowerCase() : '';
        const nameB = b.leadType ? b.leadType.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filterSearch: true,
      filterMode: "tree",
      width:140
    },
    {
      title: "Assigned To",
      dataIndex: "assignedToName",
      key: "assignedToName",
      filters: getUniqueFilters(
        [...leads.newLeads, ...leads.duplicateLeads, ...leads.blockedLeads],
        "assignedToName"
      ),
      onFilter: (value, record) => record.assignedToName === value,
      sorter: (a, b) => {
        const nameA = a.assignedToName ? a.assignedToName.toLowerCase() : '';
        const nameB = b.assignedToName ? b.assignedToName.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filterSearch: true,
      filterMode: "tree",
      width:140
    },
    {
      title: "Followup Date",
      dataIndex: "followUpDate",
      key: "followUpDate",
      filters: getUniqueFilters(
        [...leads.newLeads, ...leads.duplicateLeads, ...leads.blockedLeads],
        "followUpDate"
      ),
      onFilter: (value, record) => record.followUpDate === value,
      sorter: (a, b) => {
        const nameA = a.followUpDate ? a.followUpDate.toLowerCase() : '';
        const nameB = b.followUpDate ? b.followUpDate.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filterSearch: true,
      filterMode: "tree",
      width:140
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: getUniqueFilters(
        [...leads.newLeads, ...leads.duplicateLeads, ...leads.blockedLeads],
        "status"
      ),
      onFilter: (value, record) => record.status === value,
      sorter: (a, b) => {
        const nameA = a.status ? a.status.toLowerCase() : '';
        const nameB = b.status ? b.status.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filterSearch: true,
      filterMode: "tree",
      width:140
    },
    {
      title: "Excel Name",
      dataIndex: "excelName",
      key: "excelName",
      filters: getUniqueFilters(
        [...leads.newLeads, ...leads.duplicateLeads, ...leads.blockedLeads],
        "excelName"
      ),
      onFilter: (value, record) => record.excelName === value,
      sorter: (a, b) => a.excelName.localeCompare(b.excelName),
      filterSearch: true,
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
          <div className="d-flex justify-content-between align-items-center mb-3">
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
                className={`nav-link ${
                  activeTab === "duplicate" ? "active" : ""
                }`}
                onClick={() => setActiveTab("duplicate")}
              >
                Duplicate Leads ({leads.duplicateLeads.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "blocked" ? "active" : ""
                }`}
                onClick={() => setActiveTab("blocked")}
              >
                Blocked Leads ({leads.blockedLeads.length})
              </button>
            </li>
          </ul>
                <Input
            placeholder="Search by Mobile No or Owner Name"
            value={searchText}
            onChange={handleSearch}
            style={{ marginBottom: 16, width: "300px",marginRight:'10px' }}
          />
          </div>
       

          {/* Tab Content */}
          <div className="tab-content">
            <div
              className={`tab-pane ${activeTab === "new" ? "show active" : ""}`}
            >
              <div className="card shadow">
                <div className="card-body">
                  <Table
                    columns={columns}
                    dataSource={filteredNewLeads}
                    rowKey="leadId"
                    pagination={{onChange: cancel,position: ["topRight"],
                      defaultPageSize: 20,
                      pageSizeOptions:[20,30,50,100,150,200,250,300] }}
                    scroll={{ x: "max-content", y: 500 }}
                    style={{
                      overflowX: "auto",
                      whiteSpace: "nowrap",
                    }}
                    bordered
                  />
                </div>
              </div>
            </div>

            <div
              className={`tab-pane ${
                activeTab === "duplicate" ? "show active" : ""
              }`}
            >
              <div className="card shadow mt-3">
                <div className="card-body">
                  <Table
                    columns={columns}
                    dataSource={filteredDuplicateLeads}
                    rowKey="leadId"
                    pagination={{onChange: cancel,position: ["topRight"],
                      defaultPageSize: 20,
                      pageSizeOptions:[20,30,50,100,150,200,250,300] }}
                    scroll={{ x: "max-content", y: 500 }}
                    style={{ overflowX: "auto", whiteSpace: "nowrap" }}
                  />
                </div>
              </div>
            </div>

            <div
              className={`tab-pane ${
                activeTab === "blocked" ? "show active" : ""
              }`}
            >
              <div className="card shadow mt-3">
                <div className="card-body">
                  <Table
                    columns={columns}
                    dataSource={filteredBlockedLeads}
                    rowKey="leadId"
                    pagination={{onChange: cancel,position: ["topRight"],
                      defaultPageSize: 20,
                      pageSizeOptions:[20,30,50,100,150,200,250,300] }}
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
