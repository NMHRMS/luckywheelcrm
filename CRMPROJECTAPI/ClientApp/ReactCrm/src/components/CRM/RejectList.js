import React, { useEffect, useState } from "react";
import { Table, notification } from "antd";
import { getRequest, postRequest } from "../utils/Api";
import AssignModal from "./AssignModal";
import Loader from "../utils/Loader";

function RejectList() {
  const [rejectedLeads, setRejectedLeads] = useState([]);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    branchId: "",
    companyId: "",
    userId: "",
  });

  const fetchRejectedLeads = async () => {
    setLoading(true);
    try {
      const response = await getRequest("/api/LeadAssign/reverted-leads");
      setRejectedLeads(response.data);
    } catch (error) {
      console.error("Error fetching rejected leads!", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRejectedLeads();
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
      fetchRejectedLeads();
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
      title: "Owner Name",
      dataIndex: "ownerName",
      key: "ownerName",
    },
    {
      title: "Father Name",
      dataIndex: "fatherName",
      key: "fatherName",
    },
    {
      title: "Mobile No",
      dataIndex: "mobileNo",
      key: "mobileNo",
    },
    {
      title: "District",
      dataIndex: "districtName",
      key: "districtName",
    },
    {
      title: "State",
      dataIndex: "stateName",
      key: "stateName",
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
      <h4>Rejected Leads</h4>
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
          dataSource={rejectedLeads}
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

export default RejectList;
