import React, { useEffect, useState } from "react";
import { Table, notification, Checkbox } from "antd";
import { getRequest, postRequest } from "../utils/Api";
import AssignModal from "./AssignModal";

function RejectList() {
  const [rejectedLeads, setRejectedLeads] = useState([]);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [userData, setUserData] = useState({
    branchId: "",
    companyId: "",
    userId: "",
  });

  useEffect(() => {
    getRequest("/api/LeadAssign/rejected-leads")
      .then((response) => {
        setRejectedLeads(response.data);
      })
      .catch((error) => {
        console.error("Error fetching rejected leads!", error);
      });
  }, []);

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

  const handleCheckboxChange = (lead, checked) => {
    console.log("Selected Lead:", lead); // Debugging log
    setSelectedLeads((prev) => {
      if (checked) {
        return [...prev, lead.leadId]; // ✅ Use 'leadId' instead of 'leadID'
      } else {
        return prev.filter((id) => id !== lead.leadId);
      }
    });
  };

  const columns = [
    {
      title: "Select",
      dataIndex: "leadID",
      key: "select",
      render: (leadID) => (
        <Checkbox
          onChange={(e) => handleCheckboxChange(leadID, e.target.checked)}
          checked={selectedLeads.includes(leadID)}
        />
      ),
    },
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
      <Table
        columns={columns}
        dataSource={rejectedLeads}
        rowKey="leadId"
        pagination={{ pageSize: 10 }}
        bordered
      />
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
