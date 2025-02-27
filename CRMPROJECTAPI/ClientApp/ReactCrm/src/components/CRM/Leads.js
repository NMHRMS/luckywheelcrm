"use client";

import { useState, useEffect } from "react";
import { Table, notification } from "antd";
import { getRequest, postRequest, deleteRequest } from "../utils/Api";
import AssignModal from "./AssignModal";
import { fetchStoredData } from "../utils/UserDataUtils";
import Loader from "../utils/Loader";
import AddLeadModal from "./AddLeadModal";
import { Spin } from "antd";
const LeadsTable = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    branchId: "",
    companyId: "",
    userId: "",
  });
  const [leads, setLeads] = useState({
    newLeads: [],
    duplicateLeads: [],
    blockedLeads: [],
  });
  const [activeTab, setActiveTab] = useState("newLeads");
  const [selectedLeads, setSelectedLeads] = useState([]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/CRMtemplete.xlsx"; // Path to your Excel file
    link.download = "CRMtemplete.xlsx"; // File name when downloaded
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const loadUserData = async () => {
      const storedData = await fetchStoredData();
      if (storedData) {
        setUserData(storedData);
      }
    };
    loadUserData();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await getRequest("/api/Leads/latest-leads");
      if (response && response.data) {
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
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile?.name || ""); // Initialize with original filename
    setShowModal(true);
  };
  const handleUpload = async () => {
    if (!file) {
      alert("No file selected!");
      return;
    }

    const formData = new FormData();
    console.log("formData", formData);

    formData.append("file", file);
    formData.append("fileName", fileName);
    setLoading(true);
    try {
      const url = `/api/Leads/upload-excel?fileName=${encodeURIComponent(
        fileName
      )}`;
      const response = await postRequest(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("File uploaded successfully:", response.data);
      notification.success({
        message: "Success",
        description: "File uploaded successfully!",
      });

      setShowModal(false);
      setFile(null);
      fetchLeads();
    } catch (error) {
      console.error("Error uploading file:", error.response?.data || error);
      notification.error({
        message: "Upload Failed",
        description: error.response?.data?.message || "Unknown error occurred",
      });
    }
    setLoading(false);
  };

  const columns = [
    {
      title: "State Name",
      dataIndex: "stateName",
      key: "stateName",
      sorter: (a, b) => a.stateName.localeCompare(b.stateName),
      filters: [...new Set(leads[activeTab].map((lead) => lead.stateName))].map(
        (stateName) => ({
          text: stateName,
          value: stateName,
        })
      ),
      onFilter: (value, record) => record.stateName.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
    },
    {
      title: "District Name",
      dataIndex: "districtName",
      key: "districtName",
      sorter: (a, b) => a.districtName.localeCompare(b.districtName),
      filters: [
        ...new Set(leads[activeTab].map((lead) => lead.districtName)),
      ].map((districtName) => ({
        text: districtName,
        value: districtName,
      })),
      onFilter: (value, record) => record.districtName.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
    },
    {
      title: "Owner Name",
      dataIndex: "ownerName",
      key: "ownerName",
      sorter: (a, b) => a.ownerName.localeCompare(b.ownerName),
      filters: [...new Set(leads[activeTab].map((lead) => lead.ownerName))].map(
        (ownerName) => ({
          text: ownerName,
          value: ownerName,
        })
      ),
      onFilter: (value, record) => record.ownerName.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
    },
    {
      title: "Father Name",
      dataIndex: "fatherName",
      key: "fatherName",
      sorter: (a, b) => a.fatherName.localeCompare(b.fatherName),
      filters: [
        ...new Set(leads[activeTab].map((lead) => lead.fatherName)),
      ].map((fatherName) => ({
        text: fatherName,
        value: fatherName,
      })),
      onFilter: (value, record) => record.fatherName.indexOf(value) === 0,
      filterSearch: true,
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
      title: "Current Address",
      dataIndex: "currentAddress",
      key: "currentAddress",
    },
    {
      title: "Current Vehical",
      dataIndex: "currentVehical",
      key: "currentVehical",
    },
    {
      title: "Model Name",
      dataIndex: "modelName",
      key: "modelName",
      sorter: (a, b) => a.modelName.localeCompare(b.modelName),
      filters: [...new Set(leads[activeTab].map((lead) => lead.modelName))].map(
        (modelName) => ({
          text: modelName,
          value: modelName,
        })
      ),
      onFilter: (value, record) => record.modelName.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
    },
    // {
    //   title: "Dealer Name",
    //   dataIndex: "dealerName",
    //   key: "dealerName",
    //   sorter: (a, b) => a.dealerName.localeCompare(b.dealerName),
    //   filters: [...new Set(leads[activeTab].map((lead) => lead.dealerName))].map((dealerName) => ({
    //     text: dealerName,
    //     value: dealerName,
    //   })),
    //   onFilter: (value, record) => record.dealerName.indexOf(value) === 0,
    //   filterSearch: true,
    //   filterMode: "tree",
    // },
    {
      title: "Chasis No.",
      dataIndex: "chasisNo",
      key: "chasisNo",
      sorter: (a, b) => new Date(a.chasisNo) - new Date(b.chasisNo),
      filters: [...new Set(leads[activeTab].map((lead) => lead.chasisNo))].map(
        (chasisNo) => ({
          text: chasisNo,
          value: chasisNo,
        })
      ),
      onFilter: (value, record) => record.chasisNo.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
    },
    {
      title: "Registration No.",
      dataIndex: "registrationNo",
      key: "registrationNo",
      sorter: (a, b) => a.registrationNo.localeCompare(b.registrationNo),
      filters: [
        ...new Set(leads[activeTab].map((lead) => lead.registrationNo)),
      ].map((registrationNo) => ({
        text: registrationNo,
        value: registrationNo,
      })),
      onFilter: (value, record) => record.registrationNo.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
    },
    {
      title: "Registration Date",
      dataIndex: "registrationDate",
      key: "registrationDate",
      sorter: (a, b) =>
        new Date(a.registrationDate) - new Date(b.registrationDate),
      filters: [
        ...new Set(leads[activeTab].map((lead) => lead.registrationDate)),
      ].map((registrationDate) => ({
        text: registrationDate,
        value: registrationDate,
      })),
      onFilter: (value, record) => record.registrationDate.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      sorter: (a, b) => new Date(a.productName) - new Date(b.productName),
      filters: [
        ...new Set(leads[activeTab].map((lead) => lead.productName)),
      ].map((productName) => ({
        text: productName,
        value: productName,
      })),
      onFilter: (value, record) => record.productName.indexOf(value) === 0,
      filterSearch: true,
      filterMode: "tree",
    },
  ];

  const rowSelection = {
    selectedRowKeys: selectedLeads,
    onChange: (selectedRowKeys) => {
      setSelectedLeads(selectedRowKeys);
    },
  };

  const handleAssign = async (selectedCRE) => {
    console.log("selectedLeadsdd", selectedLeads);

    try {
      for (const leadId of selectedLeads) {
        const requestBody = {
          leadID: leadId,
          assignedTo: selectedCRE,
          assignedBy: userData.userId,
          assignedDate: new Date().toISOString(),
        };

        console.log("Request Payload:", JSON.stringify(requestBody, null, 2));

        const response = await postRequest(
          "/api/LeadAssign/assign",
          requestBody
        );
      }
      notification.success({
        message: "Success",
        description: "Leads assigned successfully!",
      });
      setAssignModalVisible(false);
      fetchLeads(); // Refresh the leads list
    } catch (error) {
      console.error("Error assigning leads:", error);
      notification.error({
        message: "assigning leads Failed",
        description: error.response?.data?.message || "Unknown error occurred.",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const deletePromises = selectedLeads.map((leadId) =>
        deleteRequest(`/api/Leads/${leadId}`)
      );
      await Promise.all(deletePromises);
      // alert("Leads deleted successfully!");
      notification.success({
        message: "Success",
        description: "Lead deleted successfully!",
      });

      fetchLeads();
    } catch (error) {
      console.error("Error deleting leads:", error);
      alert("Failed to delete leads. Please try again.");
    }
  };
  return (
    <div className="container ">
      <div className="d-flex justify-content-between align-items-center">
        {/* Heading (Left) */}
        <h5 className="card-title" style={{ fontSize: 20 }}>
          Leads Management
        </h5>
        {/* Buttons (Right) */}
        <div className="d-flex align-items-center">
          <i
            className="bi bi-file-earmark-arrow-up me-2"
            style={{
              cursor: "pointer",
              color: "blue",
              fontSize: "1.5rem",
            }}
            onClick={() => document.getElementById("fileUploadInput").click()}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Upload File"
          ></i>

          <input
            id="fileUploadInput"
            type="file"
            accept=".xls,.xlsx"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <button
            className="btn btn-outline-success me-2"
            onClick={handleDownload}
          >
            Download xlsx template
          </button>
          <button
            className="btn btn-outline-info me-2"
            onClick={() => setAssignModalVisible(true)}
            disabled={selectedLeads.length === 0}
          >
            Assign to
          </button>
          <button
            className="btn btn-outline-danger me-2"
            onClick={handleDelete}
            disabled={selectedLeads.length === 0}
          >
            Delete
          </button>
          <button
            className="btn btn-outline-primary"
            onClick={() => setAddModalVisible(true)}
          >
            Add Lead
          </button>
        </div>
      </div>

      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Save File Name</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <label className="form-label">File Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="fileName"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  onClick={handleUpload}
                  disabled={loading}
                >
                  {loading ? <Spin size="small" /> : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ul className="nav nav-tabs mb-3">
        {Object.keys(leads).map((key) => (
          <li className="nav-item" key={key}>
            <button
              className={`nav-link ${activeTab === key ? "active" : ""}`}
              onClick={() => {
                setActiveTab(key);
                setSelectedLeads([]);
              }}
            >
              {key === "newLeads"
                ? "New Leads"
                : key === "duplicateLeads"
                ? "Duplicate Leads"
                : "Blocked Leads"}{" "}
              ({leads[key].length})
            </button>
          </li>
        ))}
      </ul>
      {loading ? (
        <Loader />
      ) : (
        <Table
          className="table table-border mt-1"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={leads[activeTab]}
          rowKey="leadId"
          scroll={{ x: true }}
          bordered
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
          }}
          onChange={(pagination, filters, sorter) => {
            console.log("Table params:", pagination, filters, sorter);
          }}
          style={{ overflowX: "auto", whiteSpace: "nowrap" }}
        />
      )}

      <AssignModal
        visible={assignModalVisible}
        onClose={() => setAssignModalVisible(false)}
        selectedRows={selectedLeads}
        onAssign={handleAssign}
      />
      <AddLeadModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSuccess={(newLead) => {
          setLeads((prev) => ({
            ...prev,
            newLeads: [newLead, ...prev.newLeads],
          }));
        }}
      />
    </div>
  );
};

export default LeadsTable;
