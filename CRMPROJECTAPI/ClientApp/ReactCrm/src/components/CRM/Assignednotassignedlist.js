import React, { useState, useEffect } from "react";
import { Table, notification,Input } from "antd";
import { Spin } from "antd";
import { getRequest, postRequest } from "../utils/Api";
import AssignModal from "./AssignModal";
import { fetchStoredData } from "../utils/UserDataUtils";
import LeadtrackModal from "./LeadtrackModal";
import { Tooltip } from "antd";
function AssignedNotAssignedList() {
  const [activeTab, setActiveTab] = useState("assigned");
  const [leads, setLeads] = useState({
    assigned: [],
    notAssigned: [],
  });
  const [selectedLead, setSelectedLead] = useState(null);
  const [history, setHistory] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingKey, setEditingKey] = useState('');
    const [error, setError] = useState("");
    const [searchText, setSearchText] = useState("");
  const [userData, setUserData] = useState({
    userId: "",
    companyId: "",
    branchId: "",
  });

  const fetchInitialData = async () => {
    setLoading(true); // Start loading before API calls
    try {
      const storedData = await fetchStoredData();
      if (storedData) setUserData(storedData);

      const [assignedRes, notAssignedRes] = await Promise.all([
        getRequest("/api/Leads/filter?assigned=true"),
        getRequest("/api/Leads/filter?assigned=false"),
      ]);

      setLeads({
        assigned: Array.isArray(assignedRes?.data) ? assignedRes.data : [],
        notAssigned: Array.isArray(notAssignedRes?.data)
          ? notAssignedRes.data
          : [],
      });
    } catch (error) {
      console.error("Initial data fetch error:", error);
      notification.error({ message: "Failed to fetch data" });
    } finally {
      setLoading(false); // Stop loading after API requests complete
    }
  };

  // Fetch initial data
  useEffect(() => {
    fetchInitialData();
  }, []);
  

  // Table columns configuration
  const assignedColumns = [
    {
      title: "Owner Name",
      dataIndex: "ownerName",
      key: "ownerName",
      render: (text) => text || "N/A",
      sorter: (a, b) => {
        const nameA = a.ownerName ? a.ownerName.toLowerCase() : '';
        const nameB = b.ownerName ? b.ownerName.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(leads.assigned.map((lead) => lead.ownerName))].map(
        (ownerName) => ({
          text: ownerName,
          value: ownerName,
        })
        
      ),

      onFilter: (value, record) => record.ownerName.includes(value),
      filterSearch: true,
      filterMode: "tree",
      width:140
    },
    {
      title: "Father Name",
      dataIndex: "fatherName",
      key: "fatherName",
      sorter: (a, b) => {
        const nameA = a.fatherName ? a.fatherName.toLowerCase() : '';
        const nameB = b.fatherName ? b.fatherName.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(leads.assigned.map((lead) => lead.fatherName))].map(
        (fatherName) => ({
          text: fatherName,
          value: fatherName,
        })
      ),
      onFilter: (value, record) => record.fatherName.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
      width:140
    },
    {
      title: "Mobile No.",
      dataIndex: "mobileNo",
      key: "mobileNo",
      sorter: (a, b) => {
        const nameA = a.mobileNo ? a.mobileNo.toLowerCase() : '';
        const nameB = b.mobileNo ? b.mobileNo.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(leads[activeTab].map((lead) => lead.mobileNo))].map(
        (mobileNo) => ({
          text: mobileNo,
          value: mobileNo,
        })
      ),
      onFilter: (value, record) => record.mobileNo.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
      width:140
    },
    {
      title: "District Name",
      dataIndex: "districtName",
      key: "districtName",
      sorter: (a, b) => {
        const nameA = a.districtName ? a.districtName.toLowerCase() : '';
        const nameB = b.districtName ? b.districtName.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [
        ...new Set(leads.assigned.map((lead) => lead.districtName)),
      ].map((districtName) => ({
        text: districtName,
        value: districtName,
      })),
      onFilter: (value, record) => record.districtName.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
      width:140
    },
    {
      title: "Model Name",
      dataIndex: "modelName",
      key: "modelName",
      sorter: (a, b) => {
        const nameA = a.modelName ? a.modelName.toLowerCase() : '';
        const nameB = b.modelName ? b.modelName.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(leads.assigned.map((lead) => lead.modelName))].map(
        (modelName) => ({
          text: modelName,
          value: modelName,
        })
      ),
      onFilter: (value, record) => record.modelName.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
      width:140
    },
  
    {
      title: "Current Address",
      dataIndex: "currentAddress",
      key: "currentAddress",
      sorter: (a, b) => {
        const nameA = a.currentAddress ? a.currentAddress.toLowerCase() : '';
        const nameB = b.currentAddress ? b.currentAddress.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(leads[activeTab].map((lead) => lead.currentAddress))].map(
        (currentAddress) => ({
          text: currentAddress,
          value: currentAddress,
        })
      ),
      onFilter: (value, record) => record.currentAddress.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
      width:160
    },
  

    {
      title: 'chasis No',
      dataIndex: 'chasisNo',
      key: 'chasisNo',
      render: (text) => text === 'N/A' ? 'Not Available' : text,
      sorter: (a, b) => a.chasisNo.localeCompare(b.chasisNo),
      filters: [...new Set(leads.assigned.map((lead) => lead.chasisNo))].map((chasisNo) => ({
        text: chasisNo,
        value: chasisNo,
      })),

      onFilter: (value, record) => record.chasisNo.includes(value),
      filterSearch:true,
      filterMode: "tree",
      width:140
    },
    {
      title: 'Current Vehicle',
      dataIndex: 'currentVehicle',
      key: 'currentVehicle',
      render: (text) => text === 'N/A' ? 'Not Available' : text,
      sorter: (a, b) => a.currentVehicle.localeCompare(b.currentVehicle),
      filters: [...new Set(leads.assigned.map((lead) => lead.currentVehicle))].map((currentVehicle) => ({
        text: currentVehicle,
        value: currentVehicle,
      })),

      onFilter: (value, record) => record.currentVehicle.includes(value),
      filterSearch:true,
      filterMode: "tree",
      width:140
    },
    {
      title: 'Category Name',
      dataIndex: 'categoryName',
      key: 'categoryName',
      render: (text) => text === 'N/A' ? 'Not Available' : text,
      sorter: (a, b) => a.categoryName.localeCompare(b.categoryName),
      filters: [...new Set(leads.assigned.map((lead) => lead.categoryName))].map((categoryName) => ({
        text: categoryName,
        value: categoryName,
      })),

      onFilter: (value, record) => record.categoryName.includes(value),
      filterSearch:true,
      filterMode: "tree",
      width:140
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
      render: (text) => text === 'N/A' ? 'Not Available' : text,
      sorter: (a, b) => a.productName.localeCompare(b.productName),
      filters: [...new Set(leads.assigned.map((lead) => lead.productName))].map((productName) => ({
        text: productName,
        value: productName,
      })),

      onFilter: (value, record) => record.productName.includes(value),
      filterSearch:true,
      filterMode: "tree",
      width:140
    },
    {
      title: 'Followup Date',
      dataIndex: 'followUpDate',
      key: 'followUpDate',
      render: (text) => text === 'N/A' ? 'Not Available' : text,
      sorter: (a, b) => a.followUpDate.localeCompare(b.followUpDate),
      filters: [...new Set(leads.assigned.map((lead) => lead.followUpDate))].map((followUpDate) => ({
        text: followUpDate,
        value: followUpDate,
      })),

      onFilter: (value, record) => record.followUpDate.includes(value),
      filterSearch:true,
      filterMode: "tree",
      width:140
    },
    {
      title: 'Lead Type',
      dataIndex: 'leadType',
      key: 'leadType',
      render: (text) => text === 'N/A' ? 'Not Available' : text,
      sorter: (a, b) => a.leadType.localeCompare(b.leadType),
      filters: [...new Set(leads.assigned.map((lead) => lead.leadType))].map((leadType) => ({
        text: leadType,
        value: leadType,
      })),

      onFilter: (value, record) => record.leadType.includes(value),
      filterSearch:true,
      filterMode: "tree",
      width:140
    },
    {
      title: "Assigned To",
      dataIndex: "assignedToName",
      key: "assignedToName",
      render: (text) => text || "Not Assigned",
      sorter: (a, b) => {
        const nameA = a.assignedToName ? a.assignedToName.toLowerCase() : '';
        const nameB = b.assignedToName ? b.assignedToName.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(leads.assigned.map((lead) => lead.assignedToName))].map((name) => ({
        text: name,
        value: name,
      })),

      onFilter: (value, record) => record.assignedToName.includes(value),
      filterSearch: true,
      filterMode: "tree",
      width:140
    },
    {
      title: "Excel Name",
      dataIndex: "excelName",
      key: "excelName",
      filters: [
        ...new Set(leads.assigned.map((lead) => lead.excelName)),
      ].map((excelName) => ({
        text: excelName,
        value: excelName,
      })),

      onFilter: (value, record) => record.excelName.includes(value),
      filterSearch: true,
      filterMode: "tree",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => {
        const nameA = a.status ? a.status.toLowerCase() : '';
        const nameB = b.status ? b.status.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(leads.assigned.map((lead) => lead.status))].map(
        (status) => ({
          text: status,
          value: status,
        })
      ),

      onFilter: (value, record) => record.status.includes(value),
      filterSearch: true,
      filterMode: "tree",
    },
  ];

  const unassignedColumns = [
    {
      title: "Owner",
      dataIndex: "ownerName",
      key: "ownerName",
      render: (text) => text || "N/A",
      sorter: (a, b) => {
        const nameA = a.ownerName ? a.ownerName.toLowerCase() : '';
        const nameB = b.ownerName ? b.ownerName.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [
        ...new Set(leads.notAssigned.map((lead) => lead.ownerName)),
      ].map((ownerName) => ({
        text: ownerName,
        value: ownerName,
      })),

      onFilter: (value, record) => record.ownerName.includes(value),
      filterSearch: true,
      filterMode: "tree",
    },
    {
      title: "Father Name",
      dataIndex: "fatherName",
      key: "fatherName",
      sorter: (a, b) => {
        const nameA = a.fatherName ? a.fatherName.toLowerCase() : '';
        const nameB = b.fatherName ? b.fatherName.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(leads.notAssigned.map((lead) => lead.fatherName))].map(
        (fatherName) => ({
          text: fatherName,
          value: fatherName,
        })
      ),
      onFilter: (value, record) => record.fatherName.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
      width:140
    },
    {
      title: "Mobile",
      dataIndex: "mobileNo",
      key: "mobileNo",
      render: (text) => (text === "N/A" ? "Not Available" : text),
      sorter: (a, b) => {
        const nameA = a.mobileNo ? a.mobileNo.toLowerCase() : '';
        const nameB = b.mobileNo ? b.mobileNo.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(leads.notAssigned.map((lead) => lead.mobileNo))].map(
        (mobileNo) => ({
          text: mobileNo,
          value: mobileNo,
        })
      ),

      onFilter: (value, record) => record.mobileNo.includes(value),
      filterSearch: true,
      filterMode: "tree",
    },
    {
      title: "District Name",
      dataIndex: "districtName",
      key: "districtName",
      sorter: (a, b) => {
        const nameA = a.districtName ? a.districtName.toLowerCase() : '';
        const nameB = b.districtName ? b.districtName.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [
        ...new Set(leads.notAssigned.map((lead) => lead.districtName)),
      ].map((districtName) => ({
        text: districtName,
        value: districtName,
      })),
      onFilter: (value, record) => record.districtName.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
    },
    {
      title: "Current Address",
      dataIndex: "currentAddress",
      key: "currentAddress",
      filters: [
        ...new Set(leads.notAssigned.map((lead) => lead.currentAddress)),
      ].map((currentAddress) => ({
        text: currentAddress,
        value: currentAddress,
      })),

      onFilter: (value, record) => record.currentAddress.includes(value),
      filterSearch: true,
      filterMode: "tree",
    },
    {
      title: "Model Name",
      dataIndex: "modelName",
      key: "modelName",
      sorter: (a, b) => {
        const nameA = a.modelName ? a.modelName.toLowerCase() : '';
        const nameB = b.modelName ? b.modelName.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [
        ...new Set(leads.notAssigned.map((lead) => lead.modelName)),
      ].map((modelName) => ({
        text: modelName,
        value: modelName,
      })),
      onFilter: (value, record) => record.modelName.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
    },
  
   
    {
      title: 'chasis No',
      dataIndex: 'chasisNo',
      key: 'chasisNo',
      render: (text) => text === 'N/A' ? 'Not Available' : text,
      sorter: (a, b) => a.chasisNo.localeCompare(b.chasisNo),
      filters: [...new Set(leads.notAssigned.map((lead) => lead.chasisNo))].map((chasisNo) => ({
        text: chasisNo,
        value: chasisNo,
      })),

      onFilter: (value, record) => record.chasisNo.includes(value),
      filterSearch:true,
      filterMode: "tree",
      width:140
    },
    {
      title: 'Current Vehicle',
      dataIndex: 'currentVehicle',
      key: 'currentVehicle',
      render: (text) => text === 'N/A' ? 'Not Available' : text,
      sorter: (a, b) => a.currentVehicle.localeCompare(b.currentVehicle),
      filters: [...new Set(leads.notAssigned.map((lead) => lead.currentVehicle))].map((currentVehicle) => ({
        text: currentVehicle,
        value: currentVehicle,
      })),

      onFilter: (value, record) => record.currentVehicle.includes(value),
      filterSearch:true,
      filterMode: "tree",
      width:140
    },
    {
      title: 'Category Name',
      dataIndex: 'categoryName',
      key: 'categoryName',
      render: (text) => text === 'N/A' ? 'Not Available' : text,
      sorter: (a, b) => a.categoryName.localeCompare(b.categoryName),
      filters: [...new Set(leads.notAssigned.map((lead) => lead.categoryName))].map((categoryName) => ({
        text: categoryName,
        value: categoryName,
      })),

      onFilter: (value, record) => record.categoryName.includes(value),
      filterSearch:true,
      filterMode: "tree",
      width:140
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
      render: (text) => text === 'N/A' ? 'Not Available' : text,
      sorter: (a, b) => a.productName.localeCompare(b.productName),
      filters: [...new Set(leads.notAssigned.map((lead) => lead.productName))].map((productName) => ({
        text: productName,
        value: productName,
      })),

      onFilter: (value, record) => record.productName.includes(value),
      filterSearch:true,
      filterMode: "tree",
      width:140
    },
    {
      title: 'Followup Date',
      dataIndex: 'followUpDate',
      key: 'followUpDate',
      render: (text) => text === 'N/A' ? 'Not Available' : text,
      sorter: (a, b) => a.followUpDate.localeCompare(b.followUpDate),
      filters: [...new Set(leads.notAssigned.map((lead) => lead.followUpDate))].map((followUpDate) => ({
        text: followUpDate,
        value: followUpDate,
      })),

      onFilter: (value, record) => record.followUpDate.includes(value),
      filterSearch:true,
      filterMode: "tree",
      width:140
    },
    {
      title: 'Lead Type',
      dataIndex: 'leadType',
      key: 'leadType',
      render: (text) => text === 'N/A' ? 'Not Available' : text,
      sorter: (a, b) => a.leadType.localeCompare(b.leadType),
      filters: [...new Set(leads.notAssigned.map((lead) => lead.leadType))].map((leadType) => ({
        text: leadType,
        value: leadType,
      })),

      onFilter: (value, record) => record.leadType.includes(value),
      filterSearch:true,
      filterMode: "tree",
      width:140
    },
   
    {
      title: "Excel Name",
      dataIndex: "excelName",
      key: "excelName",
      filters: [
        ...new Set(leads.notAssigned.map((lead) => lead.excelName)),
      ].map((excelName) => ({
        text: excelName,
        value: excelName,
      })),

      onFilter: (value, record) => record.excelName.includes(value),
      filterSearch: true,
      filterMode: "tree",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      filters: [...new Set(leads.notAssigned.map((lead) => lead.status))].map(
        (status) => ({
          text: status,
          value: status,
        })
      ),

      onFilter: (value, record) => record.status.includes(value),
      filterSearch: true,
      filterMode: "tree",
    },
  ];

  // Handle lead details click
  const handleShowDetails = async (lead) => {
    console.log("leadhistory", lead.leadId);

    try {
      const [historyRes, reviewsRes,CallRecords] = await Promise.all([
        getRequest(`/api/LeadAssign/lead-history/${lead.leadId}`),
        getRequest("/api/LeadsReview"),
        getRequest(`/api/CallRecords/by-lead/${lead.leadId}`),
      ]);

      // Filter reviews for this lead
      const leadReviews = Array.isArray(reviewsRes?.data)
        ? reviewsRes.data.filter((r) => r.leadId === lead.leadId)
        : [];

      setSelectedLead(lead);
      setHistory(Array.isArray(historyRes?.data) ? historyRes.data : []);
      setReviews(leadReviews);
      setIsDetailsModalVisible(true);
    } catch (error) {
      console.error("Details fetch error:", error);
      alert("Failed to load lead details");
    }
  };

  // Handle lead assignment
  const handleAssignLeads = async (selectedCRE) => {
    try {
      const assignments = selectedLeads.map((leadId) =>
        postRequest("/api/LeadAssign/assign", {
          leadID: leadId,
          assignedTo: selectedCRE,
          assignedBy: userData.userId,
          assignedDate: new Date().toISOString(),
        })
      );
      setSelectedLeads([]);
      await Promise.all(assignments);
      // alert("Leads assigned successfully!");
      notification.success({
        message: "Success",
        description: "Lead assigned successfully!",
      });
      fetchInitialData()
      setAssignModalVisible(false);

      // Refresh leads data
      // const [assignedRes, notAssignedRes] = await Promise.all([
      //   getRequest("/api/Leads/filter?assigned=true"),
      //   getRequest("/api/Leads/filter?assigned=false"),
      // ]);

      // setLeads({
      //   assigned: Array.isArray(assignedRes?.data) ? assignedRes.data : [],
      //   notAssigned: Array.isArray(notAssignedRes?.data)
      //     ? notAssignedRes.data
      //     : [],
      // });
    } catch (error) {
      console.error("Assignment error:", error);
      alert("Failed to assign leads");
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value.toLowerCase());
  };

  const filteredAssignedLeads = leads.assigned.filter(
    (lead) =>
      lead.mobileNo.toLowerCase().includes(searchText) ||
      lead.ownerName.toLowerCase().includes(searchText)
  );
  
  const filteredNotAssignedLeads = leads.notAssigned.filter(
    (lead) =>
      lead.mobileNo.toLowerCase().includes(searchText) ||
      lead.ownerName.toLowerCase().includes(searchText)
  );

  const cancel = () => {
    setEditingKey('');
  };

  return (
    <div className="container mt-1">
      <h4 className="mb-4">Lead Track</h4>
      { loading ? (
            <div className="text-center">
            <Spin size="large" />
          </div>
           ) : error ? (
             <p className="text-danger">{error}</p>
           ) : (
             <>
       <div className="d-flex justify-content-between">
        <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "assigned" ? "active" : ""}`}
            onClick={() => setActiveTab("assigned")}
          >
          Assigned Leads ({leads.assigned.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === "notAssigned" ? "active" : ""
            }`}
            onClick={() => setActiveTab("notAssigned")}
          >
      Unassigned Leads ({leads.notAssigned.length})
          </button>
        </li>
      </ul>
      <div className="d-flex justify-content-between align-items-center mb-3">
      <Input
  placeholder="Search by Mobile No or Owner Name"
  value={searchText}
  onChange={handleSearch}
  style={{ marginBottom: 16, width: "300px",marginRight:'10px' }}
/>

      <button
       style={{ marginBottom: 16,}}
        className="btn btn-primary"
        disabled={selectedLeads.length === 0}
        onClick={() => setAssignModalVisible(true)}
      >
        Assign Selected ({selectedLeads.length})
      </button>
    </div>
        </div>

      {activeTab === "assigned" && (
        <div className="card shadow">
          <div className="card-body">
            <Table
              columns={assignedColumns}
              dataSource={filteredAssignedLeads}
              rowKey="leadId"
              onRow={(record) => ({
                onClick: () => handleShowDetails(record),
              })}
              // bordered
              pagination={{onChange: cancel,position: ["topRight"],defaultPageSize: 20,
                pageSizeOptions:[20,30,50,100,150,200,250,300]  }}
              // scroll={{ x: "max-content", y: 500 }}
              locale={{ emptyText: "No assigned leads found" }}
              style={{ overflowX: "auto", whiteSpace: "nowrap" }}
              components={{
                body: {
                  row: (props) => (
                    <Tooltip title="Click to view lead details">
                      <tr {...props} style={{ cursor: "pointer" }} />
                    </Tooltip>
                  ),
                },
              }}
            />
          </div>
        </div>
      )}

      {activeTab === "notAssigned" && (
        <div className="card shadow">
          <div className="card-body">
            <div className="mb-3">
              {/* <button
                className="btn btn-primary mt-3"
                disabled={selectedLeads.length === 0}
                onClick={() => setAssignModalVisible(true)}
              >
                Assign Selected ({selectedLeads.length})
              </button> */}
            </div>
            <>
            
                <Table
                  columns={unassignedColumns}
                  dataSource={filteredNotAssignedLeads}
                  rowKey="leadId"
                  rowSelection={{
                    type: "checkbox",

                    onChange: (selectedRowKeys, selectedRows) => {
                      setSelectedLeads(selectedRows.map((row) => row.leadId));
                    },
                  }}
                  pagination={{onChange: cancel,position: ["topRight"],defaultPageSize: 20,
                    pageSizeOptions:[20,30,50,100,150,200,250,300] }}
                  // scroll={{ x: "max-content", y: 500 }}
                  locale={{ emptyText: "No unassigned leads found" }}
                  style={{ overflowX: "auto", whiteSpace: "nowrap" }}
                  bordered
                />
            
            </>
          </div>
        </div>
      )}
     </>
       
      )}
      <LeadtrackModal
        visible={isDetailsModalVisible}
        onClose={() => setIsDetailsModalVisible(false)}
        lead={selectedLead}
        history={history}
        reviews={reviews}
      />

      <AssignModal
        visible={assignModalVisible}
        onClose={() => setAssignModalVisible(false)}
        selectedRows={selectedLeads}
        onAssign={handleAssignLeads}
      />
    </div>
  );
}

export default AssignedNotAssignedList;
