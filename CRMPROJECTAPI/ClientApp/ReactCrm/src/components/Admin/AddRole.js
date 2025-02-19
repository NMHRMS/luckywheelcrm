import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Input, message, Checkbox } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  getRequest,
  postRequest,
  deleteRequest,
  putRequest,
} from "../utils/Api";
import { fetchStoredData } from "../utils/UserDataUtils";
import Loader from "../utils/Loader";

export default function RoleComponent() {
  const [roles, setRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleData, setRoleData] = useState({ id: null, roleName: "" });
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    branchId: "",
    companyId: "",
    userId: "",
  });
  const [searchText, setSearchText] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const loadUserData = async () => {
      const storedData = await fetchStoredData();
      if (storedData) {
        setUserData(storedData);
      }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    if (userData.companyId) {
      getRolesData();
    }
  }, [userData]);

  const getRolesData = () => {
    setLoading(true);
    getRequest("/api/Roles")
      .then((res) => {
        const filteredRoles = res.data.filter(
          (role) => role.companyId === userData.companyId
        );
        setRoles(filteredRoles);
        setFilteredData(filteredRoles);
      })
      .catch((err) => {
        console.error("Error fetching roles:", err);
        message.error("Failed to fetch roles.");
      })
      .finally(() => setLoading(false));
  };

  const handleAddOrUpdateRole = () => {
    if (!roleData.roleName.trim()) {
      message.error("Role name is required!");
      return;
    }

    const newRoleData = {
      roleId: roleData.id,
      roleName: roleData.roleName,
      companyId: userData.companyId,
    };

    if (!roleData.id) {
      postRequest("/api/Roles", newRoleData)
        .then((res) => {
          message.success("Role added successfully!");
          setRoles([...roles, res.data]);
          setFilteredData([...roles, res.data]);
          closeModal();
        })
        .catch((err) => {
          console.error("Error adding role:", err);
          message.error("Failed to add role.");
        });
    } else {
      putRequest(`/api/Roles/${roleData.id}`, newRoleData)
        .then(() => {
          message.success("Role updated successfully!");
          setRoles((prevRoles) =>
            prevRoles.map((role) =>
              role.roleId === roleData.id
                ? { ...role, roleName: roleData.roleName }
                : role
            )
          );
          setFilteredData((prevRoles) =>
            prevRoles.map((role) =>
              role.roleId === roleData.id
                ? { ...role, roleName: roleData.roleName }
                : role
            )
          );
          closeModal();
        })
        .catch((err) => {
          console.error("Error updating role:", err);
          message.error("Failed to update role.");
        });
    }
  };

  const editRole = (role) => {
    setRoleData({ id: role.roleId, roleName: role.roleName });
    setIsModalOpen(true);
  };

  const deleteRole = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this role?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        deleteRequest(`/api/Roles/${id}`)
          .then(() => {
            message.success("Role deleted successfully!");
            setRoles(roles.filter((role) => role.roleId !== id));
            setFilteredData(roles.filter((role) => role.roleId !== id));
          })
          .catch((err) => {
            console.error("Error deleting role:", err);
            message.error("Failed to delete role.");
          });
      },
    });
  };

  const closeModal = () => {
    setRoleData({ id: null, roleName: "" });
    setIsModalOpen(false);
  };

  // **Filter Dropdown with Reset Option**
  const getColumnFilterDropdown = ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }) => (
    <div style={{ padding: 10, width: 250 }}>
      {/* Search Input */}
      <Input
        placeholder="Search in filters"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 8, width: "100%" }}
      />

      {/* Select All Option */}
      <Checkbox
        onChange={(e) => {
          if (e.target.checked) {
            setSelectedRoles(roles.map((role) => role.roleName));
            setSelectedKeys(roles.map((role) => role.roleName));
          } else {
            setSelectedRoles([]);
            setSelectedKeys([]);
          }
        }}
        checked={selectedRoles.length === roles.length}
      >
        Select all
      </Checkbox>

      {/* Role Checkboxes */}
      <div
        style={{
          maxHeight: 200,
          overflowY: "auto",
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        {roles
          .filter((role) =>
            role.roleName.toLowerCase().includes(searchText.toLowerCase())
          )
          .map((role) => (
            <div
              key={role.roleId}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <Checkbox
                checked={selectedRoles.includes(role.roleName)}
                onChange={(e) => {
                  const newSelectedRoles = e.target.checked
                    ? [...selectedRoles, role.roleName]
                    : selectedRoles.filter((r) => r !== role.roleName);
                  setSelectedRoles(newSelectedRoles);
                  setSelectedKeys(newSelectedRoles);
                }}
              />
              <span>{role.roleName}</span>
            </div>
          ))}
      </div>

      {/* Filter Action Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        <Button
          type="default"
          onClick={() => {
            clearFilters();
            setSelectedRoles([]); // Clear selected checkboxes
            setSearchText(""); // Clear search text
          }}
          style={{ width: "48%" }}
        >
          Reset
        </Button>
        <Button
          type="primary"
          onClick={() => confirm()}
          style={{ width: "48%" }}
        >
          OK
        </Button>
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
      title: "Role Name",
      dataIndex: "roleName",
      key: "roleName",
      sorter: (a, b) => a.roleName.localeCompare(b.roleName),
      filterDropdown: getColumnFilterDropdown,
      onFilter: (value, record) =>
        record.roleName.toLowerCase().includes(value.toLowerCase()),
      
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => editRole(record)}
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => deleteRole(record.roleId)}
          />
        </>
      ),
    },
  ];

  return (
    <div className="container">
      <h3>Roles Management</h3>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "10px",
        }}
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Role
        </Button>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="roleId"
          bordered
          pagination={{ pageSize: 5 }}
        />
      )}

      <Modal
        title={roleData.id ? "Edit Role" : "Add Role"}
        open={isModalOpen}
        onCancel={closeModal}
        onOk={handleAddOrUpdateRole}
      >
        <Input
          placeholder="Enter role name"
          value={roleData.roleName}
          onChange={(e) =>
            setRoleData({ ...roleData, roleName: e.target.value })
          }
        />
      </Modal>
    </div>
  );
}
