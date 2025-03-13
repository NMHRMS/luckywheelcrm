import React, { useEffect, useState } from "react";
import {
  Table,
  Select,
  Button,
  Dropdown,
  Checkbox,
  Input,
  Modal,
  message,
} from "antd";
import {
  DownOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
} from "../utils/Api";

export default function AssignManagement() {
  const [users, setUsers] = useState([]);
  const [assigner, setAssigner] = useState("");
  const [assignees, setAssignees] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  useEffect(() => {
    getRequest("/api/Users")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));

    fetchAssignments();
  }, []);

  const fetchAssignments = () => {
    getRequest("/api/UserAssignmentMapping/get-mappings")
      .then((response) => setAssignments(response.data))
      .catch((error) => console.error("Error fetching assignments:", error));
  };

  const getUserName = (userId) => {
    const user = users.find((u) => u.userId === userId);
    return user ? user.firstName : "Unknown";
  };

  const handleAssign = async () => {
    if (assigner && assignees.length > 0) {
      const payload = { assignerUserId: assigner, assigneeUserIds: assignees };

      try {
        const response = await postRequest(
          "/api/UserAssignmentMapping/set-mapping",
          payload
        );
        if (response.data === "Mapping updated successfully.") {
          fetchAssignments();
          message.success("Users assigned successfully.");
        } else {
          message.error("Assignment failed: " + response.data);
        }
      } catch (error) {
        console.error("Error assigning users:", error);
        message.error("Assignment error: " + error.message);
      }
    }
  };

  const handleEdit = (record) => {
    setEditingAssignment(record);
    setAssigner(record.assignerUserId);
    setAssignees(record.assigneeUserIds);
  };
  const handleUpdate = async () => {
    if (editingAssignment) {
      const payload = { assignerUserId: assigner, assigneeUserIds: assignees };

      try {
        await putRequest(`/api/UserAssignmentMapping/update-mapping`, payload);
        message.success("Assignment updated successfully.");
        fetchAssignments();
        setEditingAssignment(null);
        setAssigner("");
        setAssignees([]);
      } catch (error) {
        console.error("Error updating assignment:", error);
        message.error("Update failed.");
      }
    }
  };

  const handleDelete = async (record) => {
    Modal.confirm({
      title: "Are you sure you want to delete this assignment?",
      icon: <ExclamationCircleOutlined />,
      content: `Deleting assignment for ${getUserName(record.assignerUserId)}.`,
      onOk: async () => {
        try {
          await deleteRequest(
            `/api/UserAssignmentMapping/delete-mapping/${record.assignerUserId}`,
            {
              assignerUserId: record.assignerUserId,
              assigneeUserIds: record.assigneeUserIds,
            }
          );
          message.success("Assignment deleted successfully.");
          fetchAssignments();
        } catch (error) {
          console.error("Error deleting assignment:", error);
          message.error("Delete failed.");
        }
      },
    });
  };

  const handleCheckboxChange = (userId) => {
    setAssignees((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const filteredUsers = users.filter((user) =>
    user.firstName.toLowerCase().includes(searchText.toLowerCase())
  );

  const assigneeMenu = (
    <div
      style={{
        maxHeight: "250px",
        width: "250px",
        padding: "10px",
        background: "#fff",
        borderRadius: "5px",
        boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      <Input
        placeholder="Search assignees..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: "10px", width: "100%" }}
      />
      <div style={{ maxHeight: "200px", overflowY: "auto" }}>
        {filteredUsers.map((user) => (
          <div
            key={user.userId}
            style={{ display: "flex", alignItems: "center", padding: "5px" }}
          >
            <Checkbox
              checked={assignees.includes(user.userId)}
              onChange={() => handleCheckboxChange(user.userId)}
            >
              {user.firstName}
            </Checkbox>
          </div>
        ))}
      </div>
    </div>
  );

  const columns = [
    {
      title: "Sr. No",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Assigner",
      dataIndex: "assignerUserId",
      key: "assignerUserId",
      render: (assignerUserId) => getUserName(assignerUserId),
    },
    {
      title: "Assignees",
      dataIndex: "assigneeUserIds",
      key: "assigneeUserIds",
      render: (assigneeUserIds) =>
        assigneeUserIds.map((id) => getUserName(id)).join(", "),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div>
          <EditOutlined
            style={{ color: "blue", marginRight: 10, cursor: "pointer" }}
            onClick={() => handleEdit(record)}
          />
          <DeleteOutlined
            style={{ color: "red", cursor: "pointer" }}
            onClick={() => handleDelete(record)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="container mt-4">
      <h2>Assign Management</h2>
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">Assigner</label>
          <Select
            style={{ width: "100%" }}
            placeholder="Select Assigner"
            value={assigner ? assigner : undefined}
            onChange={setAssigner}
            showSearch
            allowClear
          >
            {users.map((user) => (
              <Select.Option key={user.userId} value={user.userId}>
                {user.firstName}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div className="col-md-6">
          <label className="form-label">Assignees</label>
          <Dropdown overlay={assigneeMenu} trigger={["click"]}>
            <Button
              style={{
                width: "100%",
                textAlign: "left",
                color: assignees.length > 0 ? "inherit" : "#aaa",
                whiteSpace: "normal", // Allow the text to wrap
                maxWidth: "100%", // Ensure button doesn't grow too wide
                overflow: "hidden", // Hide overflowed text
                textOverflow: "ellipsis", // Adds ellipsis if text overflows
              }}
            >
              {assignees.length > 0
                ? assignees.map((id) => getUserName(id)).join(", ")
                : "Select Assignees"}{" "}
              <DownOutlined />
            </Button>
          </Dropdown>
        </div>
      </div>
      <Button
        type="primary"
        onClick={editingAssignment ? handleUpdate : handleAssign}
      >
        {editingAssignment ? "Update" : "Assign"}
      </Button>

      <Table
        columns={columns}
        dataSource={assignments.map((item, index) => ({ ...item, key: index }))}
        bordered
        className="mt-4"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Edit Assignment"
        visible={isModalVisible}
        onOk={handleUpdate}
        onCancel={() => setIsModalVisible(false)}
      >
        <label className="form-label">Assigner</label>
        <Select
          style={{ width: "100%", marginBottom: "10px" }}
          placeholder="Select Assigner"
          value={assigner || undefined} // Ensure empty value when null
          onChange={(value) => setAssigner(value)}
          showSearch
        >
          {users.map((user) => (
            <Select.Option key={user.userId} value={user.userId}>
              {user.firstName}
            </Select.Option>
          ))}
        </Select>

        <label className="form-label">Assignees</label>
        <Dropdown overlay={assigneeMenu} trigger={["click"]}>
          <Button style={{ width: "100%" }}>
            {assignees.length > 0
              ? assignees.map((id) => getUserName(id)).join(", ")
              : "Select Assignees"}{" "}
            <DownOutlined />
          </Button>
        </Dropdown>
      </Modal>
    </div>
  );
}
