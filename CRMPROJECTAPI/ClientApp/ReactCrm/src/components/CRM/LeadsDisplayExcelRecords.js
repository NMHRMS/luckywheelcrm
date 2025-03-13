import React, { useState, useEffect } from "react";
import { Table, Pagination, Button, Tabs ,notification,Tooltip,Input} from "antd";
import { useParams, Link } from "react-router-dom";
import { Spin } from "antd";
import { getRequest,postRequest } from "../utils/Api";
import LeadtrackModal from "./LeadtrackModal";
import AssignModal from "./AssignModal";
const { TabPane } = Tabs;

const LeadsDisplayExcelRecords = () => {
  const { excelName } = useParams();
  const [assignedLeads, setAssignedLeads] = useState([]);
  const [notAssignedLeads, setNotAssignedLeads] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("assigned");
    const [editingKey, setEditingKey] = useState('');
    const [selectedLead, setSelectedLead] = useState(null);
    const [history, setHistory] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
    const [selectedLeads, setSelectedLeads] = useState([]);
    const [assignModalVisible, setAssignModalVisible] = useState(false);
      const [userData, setUserData] = useState({
        userId: "",
        companyId: "",
        branchId: "",
      });
  // Fetch leads data

  const handleSearch = (e) => {
    setSearchText(e.target.value.toLowerCase());
  };
  

  const fetchInitialData = async () => {
    setLoading(true);

try {
getRequest(`/api/Leads/get_leads_by_excelname?excelName=${excelName}`)
.then((response) => {
  setAssignedLeads(response.data.assignedLeads || []);
  setNotAssignedLeads(response.data.notAssignedLeads || []);
  setLoading(false);
})
} catch (error) {
console.error("Error fetching leads:", error);
setError("Failed to load leads.");
setLoading(false);
}
  }
  
  useEffect(() => {
    fetchInitialData()
  }, [excelName]);

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
  
        setAssignModalVisible(false);
         fetchInitialData()
      } catch (error) {
        console.error("Assignment error:", error);
        alert("Failed to assign leads");
      }
    };

     const handleShowDetails = async (lead) => {
        console.log("leadhistory", lead.leadId);
        try {
          const [historyRes, reviewsRes] = await Promise.all([
            getRequest(`/api/LeadAssign/lead-history/${lead.leadId}`),
            getRequest("/api/LeadsReview"),
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

  // Columns for the table

  const Assignedcolumns = [
    {
      title: "Owner Name",
      dataIndex: "ownerName",
      sorter: (a, b) => {
        const nameA = a.ownerName ? a.ownerName.toLowerCase() : '';
        const nameB = b.ownerName ? b.ownerName.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(assignedLeads.map((lead) => lead.ownerName))].map(
        (ownerName) => ({
          text: ownerName,
          value: ownerName,
        })
      ),
      onFilter: (value, record) => record.ownerName.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
      width:140
      
    },
    {
      title: "Father Name",
      dataIndex: "fatherName",
      sorter: (a, b) => {
        const nameA = a.fatherName ? a.fatherName.toLowerCase() : '';
        const nameB = b.fatherName ? b.fatherName.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(assignedLeads.map((lead) => lead.fatherName))].map(
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
      title: "Mobile No",
      dataIndex: "mobileNo",
      sorter: (a, b) => {
        const nameA = a.mobileNo ? a.mobileNo.toLowerCase() : '';
        const nameB = b.mobileNo ? b.mobileNo.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(assignedLeads.map((lead) => lead.mobileNo))].map(
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
      title: "District",
      dataIndex: "districtName",
      sorter: (a, b) => {
        const nameA = a.districtName ? a.districtName.toLowerCase() : '';
        const nameB = b.districtName ? b.districtName.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(assignedLeads.map((lead) => lead.districtName))].map(
        (districtName) => ({
          text: districtName,
          value: districtName,
        })
      ),
      onFilter: (value, record) => record.districtName.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
      width:140

    },
    {
      title: "Current Address",
      dataIndex: "currentAddress",
      sorter: (a, b) => {
        const nameA = a.currentAddress ? a.currentAddress.toLowerCase() : '';
        const nameB = b.currentAddress ? b.currentAddress.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(assignedLeads.map((lead) => lead.currentAddress))].map(
        (currentAddress) => ({
          text: currentAddress,
          value: currentAddress,
        })
      ),
      onFilter: (value, record) => record.currentAddress.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
      width:140

    },
    {
      title: "State",
      dataIndex: "stateName",
      sorter: (a, b) => {
        const nameA = a.stateName ? a.stateName.toLowerCase() : '';
        const nameB = b.stateName ? b.stateName.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(assignedLeads.map((lead) => lead.stateName))].map(
        (stateName) => ({
          text: stateName,
          value: stateName,
        })
      ),
      onFilter: (value, record) => record.stateName.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
      width:140

    },
    {
      title: "Registration Date",
      dataIndex: "registrationDate",
      sorter: (a, b) => {
        const nameA = a.registrationDate ? a.registrationDate.toLowerCase() : '';
        const nameB = b.registrationDate ? b.registrationDate.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(assignedLeads.map((lead) => lead.registrationDate))].map(
        (registrationDate) => ({
          text: registrationDate,
          value: registrationDate,
        })
      ),
      onFilter: (value, record) => record.registrationDate.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
      width:180

    },
    {
      title: "Registration No",
      dataIndex: "registrationNo",
      sorter: (a, b) => {
        const nameA = a.registrationNo ? a.registrationNo.toLowerCase() : '';
        const nameB = b.registrationNo ? b.registrationNo.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(assignedLeads.map((lead) => lead.registrationNo))].map(
        (registrationNo) => ({
          text: registrationNo,
          value: registrationNo,
        })
      ),
      onFilter: (value, record) => record.registrationNo.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
      width:180

    },
    {
      title: "Current Vehicle",
      dataIndex: "currentVehicle",
      sorter: (a, b) => {
        const nameA = a.currentVehicle ? a.currentVehicle.toLowerCase() : '';
        const nameB = b.currentVehicle ? b.currentVehicle.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(assignedLeads.map((lead) => lead.currentVehicle))].map(
        (currentVehicle) => ({
          text: currentVehicle,
          value: currentVehicle,
        })
      ),
      onFilter: (value, record) => record.currentVehicle.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
      width:180

    },
    {
      title: "Category Name",
      dataIndex: "categoryName",
      sorter: (a, b) => {
        const nameA = a.categoryName ? a.categoryName.toLowerCase() : '';
        const nameB = b.categoryName ? b.categoryName.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(assignedLeads.map((lead) => lead.categoryName))].map(
        (categoryName) => ({
          text: categoryName,
          value: categoryName,
        })
      ),
      onFilter: (value, record) => record.categoryName.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
      width:180

    },
    {
      title: "Product Name",
      dataIndex: "productName",
      sorter: (a, b) => {
        const nameA = a.productName ? a.productName.toLowerCase() : '';
        const nameB = b.productName ? b.productName.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(assignedLeads.map((lead) => lead.productName))].map(
        (productName) => ({
          text: productName,
          value: productName,
        })
      ),
      onFilter: (value, record) => record.productName.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
      width:180

    },
    {
      title: "Lead Type",
      dataIndex: "leadType",
      sorter: (a, b) => {
        const nameA = a.leadType ? a.leadType.toLowerCase() : '';
        const nameB = b.leadType ? b.leadType.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(assignedLeads.map((lead) => lead.leadType))].map(
        (leadType) => ({
          text: leadType,
          value: leadType,
        })
      ),
      onFilter: (value, record) => record.leadType.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
      width:140

    },
    {
      title: "AssignedTo Name",
      dataIndex: "assignedToName",
      sorter: (a, b) => {
        const nameA = a.assignedToName ? a.assignedToName.toLowerCase() : '';
        const nameB = b.assignedToName ? b.assignedToName.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(assignedLeads.map((lead) => lead.assignedToName))].map(
        (assignedToName) => ({
          text: assignedToName,
          value: assignedToName,
        })
      ),
      onFilter: (value, record) => record.assignedToName.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
      width:180

    },
    {
      title: "FollowUp Date",
      dataIndex: "followUpDate",
      sorter: (a, b) => {
        const nameA = a.followUpDate ? a.followUpDate.toLowerCase() : '';
        const nameB = b.followUpDate ? b.followUpDate.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(assignedLeads.map((lead) => lead.followUpDate))].map(
        (followUpDate) => ({
          text: followUpDate,
          value: followUpDate,
        })
      ),
      onFilter: (value, record) => record.followUpDate.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
      width:160

    },
    {
      title: "Chasis No",
      dataIndex: "chasisNo",
      sorter: (a, b) => {
        const nameA = a.chasisNo ? a.chasisNo.toLowerCase() : '';
        const nameB = b.chasisNo ? b.chasisNo.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(assignedLeads.map((lead) => lead.chasisNo))].map(
        (chasisNo) => ({
          text: chasisNo,
          value: chasisNo,
        })
      ),
      onFilter: (value, record) => record.chasisNo.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
      width:160

    },
    {
      title: "Model Name",
      dataIndex: "modelName",
      sorter: (a, b) => {
        const nameA = a.modelName ? a.modelName.toLowerCase() : '';
        const nameB = b.modelName ? b.modelName.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(assignedLeads.map((lead) => lead.modelName))].map(
        (modelName) => ({
          text: modelName,
          value: modelName,
        })
      ),
      onFilter: (value, record) => record.modelName.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
      width:160
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: (a, b) => {
        const nameA = a.status ? a.status.toLowerCase() : '';
        const nameB = b.status ? b.status.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(assignedLeads.map((lead) => lead.status))].map(
        (status) => ({
          text: status,
          value: status,
        })
      ),
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
      width:140
    },
  ];

  const notAssignedcolumns = [
    {
      title: "Owner Name",
      dataIndex: "ownerName",
      sorter: (a, b) => {
        const nameA = a.ownerName ? a.ownerName.toLowerCase() : '';
        const nameB = b.ownerName ? b.ownerName.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(notAssignedLeads.map((lead) => lead.ownerName))].map(
        (ownerName) => ({
          text: ownerName,
          value: ownerName,
        })
      ),
      onFilter: (value, record) => record.ownerName.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
      width:140
      
    },
    {
      title: "Father Name",
      dataIndex: "fatherName",
      sorter: (a, b) => {
        const nameA = a.fatherName ? a.fatherName.toLowerCase() : '';
        const nameB = b.fatherName ? b.fatherName.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(notAssignedLeads.map((lead) => lead.fatherName))].map(
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
      title: "Mobile No",
      dataIndex: "mobileNo",
      sorter: (a, b) => {
        const nameA = a.mobileNo ? a.mobileNo.toLowerCase() : '';
        const nameB = b.mobileNo ? b.mobileNo.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(notAssignedLeads.map((lead) => lead.mobileNo))].map(
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
      title: "District",
      dataIndex: "districtName",
      sorter: (a, b) => {
        const nameA = a.districtName ? a.districtName.toLowerCase() : '';
        const nameB = b.districtName ? b.districtName.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(notAssignedLeads.map((lead) => lead.districtName))].map(
        (districtName) => ({
          text: districtName,
          value: districtName,
        })
      ),
      onFilter: (value, record) => record.districtName.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
      width:140

    },
    {
      title: "Current Address",
      dataIndex: "currentAddress",
      sorter: (a, b) => {
        const nameA = a.currentAddress ? a.currentAddress.toLowerCase() : '';
        const nameB = b.currentAddress ? b.currentAddress.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(notAssignedLeads.map((lead) => lead.currentAddress))].map(
        (currentAddress) => ({
          text: currentAddress,
          value: currentAddress,
        })
      ),
      onFilter: (value, record) => record.currentAddress.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
      width:140

    },
    {
      title: "State",
      dataIndex: "stateName",
      sorter: (a, b) => {
        const nameA = a.stateName ? a.stateName.toLowerCase() : '';
        const nameB = b.stateName ? b.stateName.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(notAssignedLeads.map((lead) => lead.stateName))].map(
        (stateName) => ({
          text: stateName,
          value: stateName,
        })
      ),
      onFilter: (value, record) => record.stateName.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
      width:140

    },
    {
      title: "Registration Date",
      dataIndex: "registrationDate",
      sorter: (a, b) => {
        const nameA = a.registrationDate ? a.registrationDate.toLowerCase() : '';
        const nameB = b.registrationDate ? b.registrationDate.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(notAssignedLeads.map((lead) => lead.registrationDate))].map(
        (registrationDate) => ({
          text: registrationDate,
          value: registrationDate,
        })
      ),
      onFilter: (value, record) => record.registrationDate.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
      width:180

    },
    {
      title: "Registration No",
      dataIndex: "registrationNo",
      sorter: (a, b) => {
        const nameA = a.registrationNo ? a.registrationNo.toLowerCase() : '';
        const nameB = b.registrationNo ? b.registrationNo.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(notAssignedLeads.map((lead) => lead.registrationNo))].map(
        (registrationNo) => ({
          text: registrationNo,
          value: registrationNo,
        })
      ),
      onFilter: (value, record) => record.registrationNo.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
      width:180

    },
    {
      title: "Current Vehicle",
      dataIndex: "currentVehicle",
      sorter: (a, b) => {
        const nameA = a.currentVehicle ? a.currentVehicle.toLowerCase() : '';
        const nameB = b.currentVehicle ? b.currentVehicle.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(notAssignedLeads.map((lead) => lead.currentVehicle))].map(
        (currentVehicle) => ({
          text: currentVehicle,
          value: currentVehicle,
        })
      ),
      onFilter: (value, record) => record.currentVehicle.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
      width:180

    },
    {
      title: "Category Name",
      dataIndex: "categoryName",
      sorter: (a, b) => {
        const nameA = a.categoryName ? a.categoryName.toLowerCase() : '';
        const nameB = b.categoryName ? b.categoryName.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(notAssignedLeads.map((lead) => lead.categoryName))].map(
        (categoryName) => ({
          text: categoryName,
          value: categoryName,
        })
      ),
      onFilter: (value, record) => record.categoryName.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
      width:180

    },
    {
      title: "Product Name",
      dataIndex: "productName",
      sorter: (a, b) => {
        const nameA = a.productName ? a.productName.toLowerCase() : '';
        const nameB = b.productName ? b.productName.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(notAssignedLeads.map((lead) => lead.productName))].map(
        (productName) => ({
          text: productName,
          value: productName,
        })
      ),
      onFilter: (value, record) => record.productName.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
      width:180

    },
    {
      title: "Lead Type",
      dataIndex: "leadType",
      sorter: (a, b) => {
        const nameA = a.leadType ? a.leadType.toLowerCase() : '';
        const nameB = b.leadType ? b.leadType.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(notAssignedLeads.map((lead) => lead.leadType))].map(
        (leadType) => ({
          text: leadType,
          value: leadType,
        })
      ),
      onFilter: (value, record) => record.leadType.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
      width:140

    },
    {
      title: "AssignedTo Name",
      dataIndex: "assignedToName",
      sorter: (a, b) => {
        const nameA = a.assignedToName ? a.assignedToName.toLowerCase() : '';
        const nameB = b.assignedToName ? b.assignedToName.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(notAssignedLeads.map((lead) => lead.assignedToName))].map(
        (assignedToName) => ({
          text: assignedToName,
          value: assignedToName,
        })
      ),
      onFilter: (value, record) => record.assignedToName.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
      width:180

    },
    {
      title: "FollowUp Date",
      dataIndex: "followUpDate",
      sorter: (a, b) => {
        const nameA = a.followUpDate ? a.followUpDate.toLowerCase() : '';
        const nameB = b.followUpDate ? b.followUpDate.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(notAssignedLeads.map((lead) => lead.followUpDate))].map(
        (followUpDate) => ({
          text: followUpDate,
          value: followUpDate,
        })
      ),
      onFilter: (value, record) => record.followUpDate.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
      width:160

    },
    {
      title: "Chasis No",
      dataIndex: "chasisNo",
      sorter: (a, b) => {
        const nameA = a.chasisNo ? a.chasisNo.toLowerCase() : '';
        const nameB = b.chasisNo ? b.chasisNo.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(notAssignedLeads.map((lead) => lead.chasisNo))].map(
        (chasisNo) => ({
          text: chasisNo,
          value: chasisNo,
        })
      ),
      onFilter: (value, record) => record.chasisNo.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
      width:160

    },
    {
      title: "Model Name",
      dataIndex: "modelName",
      sorter: (a, b) => {
        const nameA = a.modelName ? a.modelName.toLowerCase() : '';
        const nameB = b.modelName ? b.modelName.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(notAssignedLeads.map((lead) => lead.modelName))].map(
        (modelName) => ({
          text: modelName,
          value: modelName,
        })
      ),
      onFilter: (value, record) => record.modelName.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
      width:160
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: (a, b) => {
        const nameA = a.status ? a.status.toLowerCase() : '';
        const nameB = b.status ? b.status.toLowerCase() : '';
        return nameA.localeCompare(nameB);
      },
      filters: [...new Set(notAssignedLeads.map((lead) => lead.status))].map(
        (status) => ({
          text: status,
          value: status,
        })
      ),
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
      width:140
    },
  ];

  // Handle pagination
  const cancel = () => {
    setEditingKey('');
  };

  const filteredAssignedLeads = assignedLeads.filter(
    (lead) =>
      lead.mobileNo.toLowerCase().includes(searchText) ||
      lead.ownerName.toLowerCase().includes(searchText)
  );
  
  const filteredNotAssignedLeads = notAssignedLeads.filter(
    (lead) =>
      lead.mobileNo.toLowerCase().includes(searchText) ||
      lead.ownerName.toLowerCase().includes(searchText)
  );
  

  return (
    <div className="container mt-4">
      <Link to="/crm/listleads" className="nav-link collapsed">
        <Button>
          <i className="bi bi-arrow-left-short" size={26}></i>
        </Button>
      </Link>

      <h5 className="mb-3 text-left">Leads from: {excelName}</h5>

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
            Assigned Leads ({assignedLeads.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === "notAssigned" ? "active" : ""
            }`}
            onClick={() => setActiveTab("notAssigned")}
          >
            Unassigned Leads ({notAssignedLeads.length})
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
          <Spin spinning={loading}>

            <Table
              columns={Assignedcolumns}
              dataSource={filteredAssignedLeads}
              rowKey="leadId"         
              onRow={(record) => ({
                onClick: () => handleShowDetails(record),
              })}
              components={{
                body: {
                  row: (props) => (
                    <Tooltip title="Click to view lead details">
                      <tr {...props} style={{ cursor: "pointer" }} />
                    </Tooltip>
                  ),
                },
              }}
              pagination={{onChange: cancel,position: ["topRight"],
                defaultPageSize: 20,
                pageSizeOptions:[20,30,50,100,150,200,250,300] }}
              // scroll={{ x: "max-content", y: 500 }}
              locale={{ emptyText: "No unassigned leads found" }}
              style={{ overflowX: "auto", whiteSpace: "nowrap" }}
              scroll={{ x: "max-content", y: 500 }}
              bordered  
            />
               </Spin>
           </div>
        </div>
      )}
          {activeTab === "notAssigned" && (
            <>
              <div className="card shadow">
          <div className="card-body">
          <Spin spinning={loading}>
            <Table
              columns={notAssignedcolumns}
              dataSource={filteredNotAssignedLeads}
              rowKey="leadId"
              rowSelection={{
                type: "checkbox",

                onChange: (selectedRowKeys, selectedRows) => {
                  setSelectedLeads(selectedRows.map((row) => row.leadId));
                },
              }}
              
              pagination={{onChange: cancel,position: ["topRight"],
                defaultPageSize: 20,
                pageSizeOptions:[20,30,50,100,150,200,250,300] }}
              // scroll={{ x: "max-content", y: 500 }}
              locale={{ emptyText: "No unassigned leads found" }}
              style={{ overflowX: "auto", whiteSpace: "nowrap" }}
              scroll={{ x: "max-content", y: 500 }}
              bordered
            />
            </Spin>
               </div>
        </div>
            </>
      
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
};

export default LeadsDisplayExcelRecords;
