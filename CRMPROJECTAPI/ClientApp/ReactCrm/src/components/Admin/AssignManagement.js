import React, { useEffect, useState } from "react";
import { Table, Select, Button, Dropdown, Checkbox, Input } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { getRequest, postRequest } from "../utils/Api";

export default function AssignManagement() {
  const [users, setUsers] = useState([]);
  const [assigner, setAssigner] = useState("");
  const [assignees, setAssignees] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [searchText, setSearchText] = useState(""); // Search input for Assignees

  useEffect(() => {
    getRequest("/api/Users")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));

    getRequest("/api/UserAssignmentMapping/get-mappings")
      .then((response) => setAssignments(response.data))
      .catch((error) => console.error("Error fetching assignments:", error));
  }, []);

  const getUserName = (userId) => {
    const user = users.find((u) => u.userId === userId);
    return user ? user.firstName : "Unknown";
  };

  const handleAssign = async () => {
    if (assigner && assignees.length > 0) {
      const payload = {
        assignerUserId: assigner,
        assigneeUserIds: assignees,
      };

      try {
        const response = await postRequest(
          "/api/UserAssignmentMapping/set-mapping",
          payload
        );
        if (response.data === "Mapping updated successfully.") {
          setAssignments([...assignments, payload]);
        } else {
          alert("Assignment failed: " + response.data);
        }
      } catch (error) {
        console.error("Error assigning users:", error);
        alert("Assignment error: " + error.message);
      }
    }
  };

  const handleCheckboxChange = (userId) => {
    setAssignees((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Filter users based on search text
  const filteredUsers = users.filter((user) =>
    user.firstName.toLowerCase().includes(searchText.toLowerCase())
  );

  // Custom Assignees Dropdown with Search Bar
  const assigneeMenu = (
    <div style={{ maxHeight: "250px", width: "250px", padding: "10px", background: "#fff", borderRadius: "5px", boxShadow: "0px 4px 6px rgba(0,0,0,0.1)" }}>
      <Input
        placeholder="Search assignees..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: "10px", width: "100%" }}
      />
      <div style={{ maxHeight: "200px", overflowY: "auto" }}>
        {filteredUsers.map((user) => (
          <div key={user.userId} style={{ display: "flex", alignItems: "center", padding: "5px" }}>
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
      filters: users.map((user) => ({ text: user.firstName, value: user.userId })),
      onFilter: (value, record) => record.assignerUserId === value,
      sorter: (a, b) =>
        getUserName(a.assignerUserId).localeCompare(getUserName(b.assignerUserId)),
      render: (assignerUserId) => getUserName(assignerUserId),
      filterMode: "tree", // Enables tree filtering
      filterSearch: true, // Enables search in the filter
    },
    {
      title: "Assignees",
      dataIndex: "assigneeUserIds",
      key: "assigneeUserIds",
      render: (assigneeUserIds) =>
        assigneeUserIds.map((id) => getUserName(id)).join(", "),
      filters: users.map((user) => ({ text: user.firstName, value: user.userId })),
      onFilter: (value, record) => record.assigneeUserIds.includes(value),
      filterMode: "tree",
      filterSearch: true,
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
            value={assigner}
            onChange={(value) => setAssigner(value)}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
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
            <Button style={{ width: "100%" }}>
              {assignees.length > 0
                ? assignees.map((id) => getUserName(id)).join(", ")
                : "Select Assignees"}{" "}
              <DownOutlined />
            </Button>
          </Dropdown>
        </div>
      </div>
      <Button type="primary" onClick={handleAssign}>
        Assign
      </Button>

      {/* Ant Design Table with sorting and filtering icons */}
      <Table
        columns={columns}
        dataSource={assignments.map((item, index) => ({ ...item, key: index }))}
        bordered
        className="mt-4"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}
