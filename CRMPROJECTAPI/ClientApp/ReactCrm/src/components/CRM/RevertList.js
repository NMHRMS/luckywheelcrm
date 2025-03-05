import React, { useEffect, useState } from "react";
import { Table, notification } from "antd";
import { getRequest, postRequest, deleteRequest } from "../utils/Api";
import AssignModal from "./AssignModal";
import Loader from "../utils/Loader";

function RevertList() {
  const [RevertedLeads, setRevertedLeads] = useState([]);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    branchId: "",
    companyId: "",
    userId: "",
  });

  const fetchRevertedLeads = async () => {
    setLoading(true);
    try {
      const response = await getRequest("/api/LeadAssign/reverted-leads");
      setRevertedLeads(response.data);
    } catch (error) {
      console.error("Error fetching Reverted leads!", error);
    } finally {
      setLoading(false);
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

      fetchRevertedLeads();
    } catch (error) {
      console.error("Error deleting leads:", error);
      alert("Failed to delete leads. Please try again.");
    }
  };
  useEffect(() => {
    fetchRevertedLeads();
  }, []);

  const rowSelection = {
    selectedRowKeys: selectedLeads,
    onChange: (selectedRowKeys) => {
      setSelectedLeads(selectedRowKeys);
    },
  };

  const handleAssign = async (selectedCRE) => {
    try {
      for (const leadId of selectedLeads) {
        const requestBody = {
          leadID: leadId,
          assignedTo: selectedCRE,
          assignedBy: userData.userId,
          assignedDate: new Date().toISOString(),
        };
        await postRequest("/api/LeadAssign/assign", requestBody);
      }
      fetchRevertedLeads();
      notification.success({
        message: "Success",
        description: "Leads assigned successfully!",
      });
      setAssignModalVisible(false);
      setSelectedLeads([]);
    } catch (error) {
      console.error("Error assigning leads:", error);
      notification.error({
        message: "Assigning Leads Failed",
        description: error.response?.data?.message || "Unknown error occurred.",
      });
    }
  };

  const columns = [
    {
      title: "State",
      dataIndex: "stateName",
      key: "stateName",
    },
    {
      title: "District",
      dataIndex: "districtName",
      key: "districtName",
    },
    {
      title: "Owner Name",
      dataIndex: "ownerName",
      key: "ownerName",
    },
    {
      title: "Mobile No",
      dataIndex: "mobileNo",
      key: "mobileNo",
    },
    {
      title: "Reverted By",
      dataIndex: "lastRevertedBy",
      key: "lastRevertedBy",
    },
    {
      title: "Remark",
      dataIndex: "remark",
      key: "remark",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ];

  return (
    <div>
      <h4>Reverted Leads</h4>
      <button
        className="btn btn-outline-info me-2 mb-2"
        onClick={() => setAssignModalVisible(true)}
        disabled={selectedLeads.length === 0}
      >
        Assign to
      </button>

      {loading ? (
        <Loader />
      ) : (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={RevertedLeads}
          rowKey="leadId"
          pagination={{ pageSize: 10 }}
          bordered
        />
      )}

      <AssignModal
        visible={assignModalVisible}
        onClose={() => setAssignModalVisible(false)}
        selectedRows={selectedLeads}
        onAssign={handleAssign}
      />
    </div>
  );
}

export default RevertList;
