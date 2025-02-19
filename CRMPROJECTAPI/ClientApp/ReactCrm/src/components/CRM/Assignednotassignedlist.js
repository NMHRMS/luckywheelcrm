import React, { useState, useEffect } from 'react';
import { Table,notification } from 'antd';
import { getRequest, postRequest } from "../utils/Api";
import AssignModal from './AssignModal';
import { fetchStoredData } from "../utils/UserDataUtils";
import LeadtrackModal from './LeadtrackModal';

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
  const [userData, setUserData] = useState({ 
    userId: '', 
    companyId: '', 
    branchId: '' 
  });

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
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

  // Lead details modal component
//   const LeadDetailsModal = () => (
//     <Modal
//       title={`Lead Details - ${selectedLead?.ownerName || 'Unknown'}`}
//       visible={isDetailsModalVisible}
//       onCancel={() => setIsDetailsModalVisible(false)}
//       footer={null}
//       width={800}
//     >
//       <div className="mb-4">
//         <p><strong>Mobile:</strong> {selectedLead?.mobileNo || 'N/A'}</p>
//         <p><strong>Vehicle Model:</strong> {selectedLead?.modelName || 'N/A'}</p>
//         <p><strong>Registration:</strong> {selectedLead?.registrationNo || 'N/A'}</p>
//       </div>

//       <ul className="nav nav-tabs">
//         <li className="nav-item">
//           <button 
//             className="nav-link active" 
//             data-bs-toggle="tab" 
//             data-bs-target="#history"
//           >
//             Assignment History
//           </button>
//         </li>
//         <li className="nav-item">
//           <button 
//             className="nav-link" 
//             data-bs-toggle="tab" 
//             data-bs-target="#reviews"
//           >
//             Reviews
//           </button>
//         </li>
//       </ul>

//       <div className="tab-content mt-3">
//         <div className="tab-pane show active" id="history">
//           <Table
//             columns={[
//               { title: 'Assigned To', dataIndex: 'assignedToName' },
//               { title: 'Assigned By', dataIndex: 'assignedByName' },
//               { title: 'Date', dataIndex: 'assignedDate' },
//               { title: 'Duration', dataIndex: 'leadDurationFormatted' }
//             ]}
//             dataSource={history}
//             rowKey="trackId"
//             pagination={false}
//             locale={{ emptyText: 'No assignment history found' }}
//           />
//         </div>

//         <div className="tab-pane" id="reviews">
//           <Table
//             columns={[
//               { title: 'Review Date', dataIndex: 'reviewDate' },
//               { title: 'Follow-up Date', dataIndex: 'followUpDate' },
//               { title: 'Comments', dataIndex: 'review' }
//             ]}
//             dataSource={reviews}
//             rowKey="leadReviewId"
//             pagination={false}
//             locale={{ emptyText: 'No reviews found for this lead' }}
//           />
//         </div>
//       </div>
//     </Modal>
//   );

  return (
    <div className="container mt-1">
      <h4 className="mb-4">Lead Track</h4>

      {/* Tabs Navigation */}
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

      {/* Assigned Leads Table */}
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
            />
          </div>
        </div>
      )}

      {/* Unassigned Leads Table */}
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