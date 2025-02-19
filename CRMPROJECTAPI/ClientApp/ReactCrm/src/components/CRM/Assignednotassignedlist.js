import React, { useState, useEffect } from 'react';
import { Table,notification } from 'antd';
import { getRequest, postRequest } from "../utils/Api";
import AssignModal from './AssignModal';
import { fetchStoredData } from "../utils/UserDataUtils";
import LeadtrackModal from './LeadtrackModal';
import Loader from "../utils/Loader";

function AssignedNotAssignedList() {
  const [activeTab, setActiveTab] = useState('assigned');
  const [leads, setLeads] = useState({ 
    assigned: [], 
    notAssigned: [] 
  });
  const [selectedLead, setSelectedLead] = useState(null);
  const [history, setHistory] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({ 
    userId: '', 
    companyId: '', 
    branchId: '' 
  });

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true)
      try {
        const storedData = await fetchStoredData();
        if (storedData) setUserData(storedData);
        
        const [assignedRes, notAssignedRes] = await Promise.all([
          getRequest("/api/Leads/filter?assigned=true"),
          getRequest("/api/Leads/filter?assigned=false")
        ]);

        setLeads({
          assigned: Array.isArray(assignedRes?.data) ? assignedRes.data : [],
          notAssigned: Array.isArray(notAssignedRes?.data) ? notAssignedRes.data : []
        });
      } catch (error) {
        console.error("Initial data fetch error:", error);
      }
    };
    fetchInitialData();
    setLoading(false)
  }, []);

  // Table columns configuration
  const assignedColumns = [
    { 
      title: 'Owner', 
      dataIndex: 'ownerName', 
      key: 'ownerName',
      render: (text) => text || 'N/A',
      sorter: (a, b) => a.ownerName.localeCompare(b.ownerName),
      filters: [...new Set(leads.assigned.map((lead) => lead.ownerName))].map((ownerName) => ({
        text: ownerName,
        value: ownerName,
      })),
      
      onFilter: (value, record) => record.ownerName.includes(value),
      filterSearch:true,
      filterMode: "tree", 
      
    },
    {
      title: "District Name",
      dataIndex: "districtName",
      key: "districtName",
      sorter: (a, b) => a.districtName.localeCompare(b.districtName),
      filters: [
        ...new Set(leads.assigned.map((lead) => lead.districtName)),
      ].map((districtName) => ({
        text: districtName,
        value: districtName,
      })),
      onFilter: (value, record) => record.districtName.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
    },
    {
      title: "Model Name",
      dataIndex: "modelName",
      key: "modelName",
      sorter: (a, b) => a.modelName.localeCompare(b.modelName),
      filters: [...new Set(leads.assigned.map((lead) => lead.modelName))].map(
        (modelName) => ({
          text: modelName,
          value: modelName,
        })
      ),
      onFilter: (value, record) => record.modelName.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
    },
    {
      title: "Father Name",
      dataIndex: "fatherName",
      key: "fatherName",
      sorter: (a, b) => a.fatherName.localeCompare(b.fatherName),
      filters: [
        ...new Set(leads.assigned.map((lead) => lead.fatherName)),
      ].map((fatherName) => ({
        text: fatherName,
        value: fatherName,
      })),
      onFilter: (value, record) => record.fatherName.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
    },
    {
      title: "Current Address",
      dataIndex: "currentAddress",
      key: "currentAddress",
      filters: [...new Set(leads.assigned.map((lead) => lead.currentAddress))].map((currentAddress) => ({
        text: currentAddress,
        value: currentAddress,
      })),
      
      onFilter: (value, record) => record.currentAddress.includes(value),
      filterSearch:true,
      filterMode: "tree", 
    },
    {
      title: "Mobile No.",
      dataIndex: "mobileNo",
      key: "mobileNo",
      sorter: (a, b) => a.mobileNo.localeCompare(b.mobileNo),
      filters: [...new Set(leads[activeTab].map((lead) => lead.mobileNo))].map(
        (mobileNo) => ({
          text: mobileNo,
          value: mobileNo,
        })
      ),
      onFilter: (value, record) => record.mobileNo.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
    },
    
    { 
      title: 'Mobile', 
      dataIndex: 'mobileNo', 
      key: 'mobileNo',
      render: (text) => text === 'N/A' ? 'Not Available' : text,
      sorter: (a, b) => a.mobileNo.localeCompare(b.mobileNo),
      filters: [...new Set(leads.assigned.map((lead) => lead.mobileNo))].map((mobileNo) => ({
        text: mobileNo,
        value: mobileNo,
      })),
      
      onFilter: (value, record) => record.mobileNo.includes(value),
      filterSearch:true,
      filterMode: "tree", 
      

    },
    { 
      title: 'Assigned To', 
      dataIndex: 'assignedToName', 
      key: 'assignedToName',
      render: (text) => text || 'Not Assigned',
      sorter: (a, b) => a.ownerName.localeCompare(b.ownerName),
      // filters: [...new Set(leads.assigned.map((lead) => lead.assignedToName))].map((name) => ({
      //   text: name,
      //   value: name,
      // })),
      
      // onFilter: (value, record) => record.assignedToName.includes(value),
      filterSearch:true,
      filterMode: "tree",
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status' ,
      sorter: (a, b) => a.status.localeCompare(b.status),
      filters: [...new Set(leads.assigned.map((lead) => lead.status))].map((status) => ({
        text: status,
        value: status,
      })),
      
      onFilter: (value, record) => record.status.includes(value),
      filterSearch:true,
      filterMode: "tree", 

    }
  ];

  const unassignedColumns = [
    { 
      title: 'Owner', 
      dataIndex: 'ownerName', 
      key: 'ownerName',
      render: (text) => text || 'N/A',
      sorter: (a, b) => a.ownerName.localeCompare(b.ownerName),
      filters: [...new Set(leads.notAssigned.map((lead) => lead.ownerName))].map((ownerName) => ({
        text: ownerName,
        value: ownerName,
      })),
      
      onFilter: (value, record) => record.ownerName.includes(value),
      filterSearch:true,
      filterMode: "tree", 

    },
    
    {
      title: "District Name",
      dataIndex: "districtName",
      key: "districtName",
      sorter: (a, b) => a.districtName.localeCompare(b.districtName),
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
      title: "Model Name",
      dataIndex: "modelName",
      key: "modelName",
      sorter: (a, b) => a.modelName.localeCompare(b.modelName),
      filters: [...new Set(leads.notAssigned.map((lead) => lead.modelName))].map(
        (modelName) => ({
          text: modelName,
          value: modelName,
        })
      ),
      onFilter: (value, record) => record.modelName.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
    },
    { 
      title: 'Mobile', 
      dataIndex: 'mobileNo', 
      key: 'mobileNo',
      render: (text) => text === 'N/A' ? 'Not Available' : text,
      sorter: (a, b) => a.mobileNo.localeCompare(b.mobileNo),
      filters: [...new Set(leads.notAssigned.map((lead) => lead.mobileNo))].map((mobileNo) => ({
        text: mobileNo,
        value: mobileNo,
      })),
      
      onFilter: (value, record) => record.mobileNo.includes(value),
      filterSearch:true,
      filterMode: "tree", 

    },
    {
      title: "Current Address",
      dataIndex: "currentAddress",
      key: "currentAddress",
      filters: [...new Set(leads.notAssigned.map((lead) => lead.currentAddress))].map((currentAddress) => ({
        text: currentAddress,
        value: currentAddress,
      })),
      
      onFilter: (value, record) => record.currentAddress.includes(value),
      filterSearch:true,
      filterMode: "tree", 
    },
    {
      title: "Excel Name",
      dataIndex: "excelName",
      key: "excelName",
      filters: [...new Set(leads.notAssigned.map((lead) => lead.excelName))].map((excelName) => ({
        text: excelName,
        value: excelName,
      })),
      
      onFilter: (value, record) => record.excelName.includes(value),
      filterSearch:true,
      filterMode: "tree", 
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status' ,
      sorter: (a, b) => a.status.localeCompare(b.status),
      filters: [...new Set(leads.notAssigned.map((lead) => lead.status))].map((status) => ({
        text: status,
        value: status,
      })),
      
      onFilter: (value, record) => record.status.includes(value),
      filterSearch:true,
      filterMode: "tree", 

    }
  ];

  // Handle lead details click
  const handleShowDetails = async (lead) => {
    console.log("leadhistory",lead.leadId);
    
    try {
      const [historyRes, reviewsRes] = await Promise.all([
        getRequest(`/api/LeadAssign/lead-history/${lead.leadId}`),
        getRequest('/api/LeadsReview')
      ]);

      // Filter reviews for this lead
      const leadReviews = Array.isArray(reviewsRes?.data) 
        ? reviewsRes.data.filter(r => r.leadId === lead.leadId)
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
      const assignments = selectedLeads.map(leadId => 
        postRequest("/api/LeadAssign/assign", {
          leadID: leadId,
          assignedTo: selectedCRE,
          assignedBy: userData.userId,
          assignedDate: new Date().toISOString()
        })
      );

      await Promise.all(assignments);
      // alert("Leads assigned successfully!");
      notification.success({ message: "Success", description: "Lead assigned successfully!" });

      setAssignModalVisible(false);
      
      // Refresh leads data
      const [assignedRes, notAssignedRes] = await Promise.all([
        getRequest("/api/Leads/filter?assigned=true"),
        getRequest("/api/Leads/filter?assigned=false")
      ]);
      
      setLeads({
        assigned: Array.isArray(assignedRes?.data) ? assignedRes.data : [],
        notAssigned: Array.isArray(notAssignedRes?.data) ? notAssignedRes.data : []
      });
    } catch (error) {
      console.error("Assignment error:", error);
      alert("Failed to assign leads");
    }
  };

  return (
    <div className="container mt-1">
      <h4 className="mb-4">Lead Track</h4>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'assigned' ? 'active' : ''}`}
            onClick={() => setActiveTab('assigned')}
          >
            Assigned Leads ({leads.assigned.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'notAssigned' ? 'active' : ''}`}
            onClick={() => setActiveTab('notAssigned')}
          >
            Unassigned Leads ({leads.notAssigned.length})
          </button>
        </li>
      </ul>

      {activeTab === 'assigned' && (
        <div className="card shadow">
          <div className="card-body">
            <Table
              columns={assignedColumns}
              dataSource={leads.assigned}
              rowKey="leadId"
              onRow={(record) => ({
                onClick: () => handleShowDetails(record)
              })}
              bordered
              pagination={{ pageSize: 5 }}
              locale={{ emptyText: 'No assigned leads found' }}
              style={{ overflowX: "auto", whiteSpace: "nowrap" }}
            />
          </div>
        </div>
      )}

      {activeTab === 'notAssigned' && (
        <div className="card shadow">
          <div className="card-body">
            <div className="mb-3">
              <button
                className="btn btn-primary mt-3"
                disabled={selectedLeads.length === 0}
                onClick={() => setAssignModalVisible(true)}
              >
                Assign Selected ({selectedLeads.length})
              </button>
            </div>
            <>
            {loading ? (
        <Loader />
      ) : (
            <Table
              columns={unassignedColumns}
              dataSource={leads.notAssigned}
              rowKey="leadId"
              rowSelection={{
                type: 'checkbox',
                
                onChange: (selectedRowKeys, selectedRows) => {
                  setSelectedLeads(selectedRows.map(row => row.leadId));
                }
              }}
               pagination={{ pageSize: 10 }}
              locale={{ emptyText: 'No unassigned leads found' }}
              style={{ overflowX: "auto", whiteSpace: "nowrap" }}
              bordered

            />
          )}
            </>
       
          </div>
        </div>
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