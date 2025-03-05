import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Input, Space } from "antd";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
} from "../utils/Api";
import Loader from "../utils/Loader";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const AddBranch = () => {
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState({ name: "", contact: "", address: "" });
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(null);

  const userData = JSON.parse(localStorage.getItem("userDetails"));
  const companyId = userData?.companyId;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    getRequest("/api/Branch")
      .then((res) => {
        setBranches(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Load Error:", error.response?.data);
        toast.error("Failed to load branches!");
        setLoading(false);
      });
  };

  const handleDelete = async (branchId) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "Do you really want to delete this branch?",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteRequest(`/api/Branch/${branchId}`);
          toast.success("Branch deleted successfully!");
          loadData();
        } catch (error) {
          console.error("Delete Error:", error.response?.data);
          toast.error("Failed to delete branch!");
        }
      },
    });
  };

  const handleUpdate = (branch) => {
    setId(branch.branchId);
    setData({
      name: branch.name,
      contact: branch.contact,
      address: branch.address,
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!companyId) {
      toast.error("Company ID is missing");
      return;
    }

    const branchData = {
      name: data.name,
      contact: data.contact,
      address: data.address,
      companyId,
    };

    const request = id
      ? putRequest(`/api/Branch/${id}`, { branchId: id, ...branchData })
      : postRequest("/api/Branch", branchData);

    request
      .then(() => {
        loadData();
        setShowModal(false);
        toast.success(id ? "Branch updated successfully!" : "Branch added successfully!");
      })
      .catch((error) => {
        console.error("Error:", error.response?.data);
        toast.error(id ? "Failed to update branch!" : "Failed to add branch!");
      });

    setData({ name: "", contact: "", address: "" });
    setId(null);
  };

  const columns = [
    {
      title: "Sr. No",
      dataIndex: "srNo",
      key: "srNo",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Branch Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      filters: [...new Set(branches.map((b) => b.name))].map((name) => ({
        text: name,
        value: name,
      })),
      onFilter: (value, record) => record.name.includes(value),
      filterSearch:true,
      filterMode: "tree", 
    },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
      sorter: (a, b) => a.contact.localeCompare(b.contact),
      filters: [...new Set(branches.map((b) => b.contact))].map((contact) => ({
        text: contact,
        value: contact,
      })),
      onFilter: (value, record) => record.contact.includes(value),
      filterSearch:true,
      filterMode: "tree", 
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      sorter: (a, b) => a.address.localeCompare(b.address),
      filters: [...new Set(branches.map((b) => b.address))].map((address) => ({
        text: address,
        value: address,
      })),
      onFilter: (value, record) => record.address.includes(value),
      filterSearch:true,
      filterMode: "tree", 
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined style={{ color: "#1890ff" }} />}
            onClick={() => handleUpdate(record)}
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.branchId)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="container mt-3">
      <ToastContainer />
      <h3>Add Branch</h3>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowModal(true)}>
          Add Branch
        </Button>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <Table
          columns={columns}
          dataSource={branches}
          rowKey="branchId"
          pagination={{ pageSize: 5 }}
          bordered
        />
      )}

      <Modal
        title={id ? "Edit Branch" : "Add Branch"}
        open={showModal}
        onCancel={() => setShowModal(false)}
        onOk={handleSubmit}
      >
        <Input
          placeholder="Branch Name"
          name="name"
          value={data.name}
          onChange={handleChange}
          className="mb-2"
        />
        <Input
          placeholder="Contact"
          name="contact"
          value={data.contact}
          onChange={handleChange}
          className="mb-2"
        />
        <Input
          placeholder="Address"
          name="address"
          value={data.address}
          onChange={handleChange}
        />
      </Modal>
    </div>
  );
};

export default AddBranch;
