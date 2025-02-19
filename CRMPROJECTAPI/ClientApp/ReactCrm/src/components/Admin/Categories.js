import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Input, Space } from "antd";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode"; // Ensure this is the correct import
import { getRequest, postRequest, putRequest, deleteRequest } from "../utils/Api";
import Loader from "../utils/Loader";

const CategoryTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryId, setCategoryId] = useState(null);

  // Decode token and extract companyId
  let companyId = "";
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      companyId = decodedToken?.companyId || "";
    } catch (error) {
      console.error("Error decoding token:", error);
      toast.error("Invalid token!");
    }
  }

  const [categoryData, setCategoryData] = useState({
    categoryName: "",
    companyId: companyId, // Fetch from decoded token
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getRequest("/api/Categories");
      console.log("API Response:", res.data);
      setCategories(res.data || []);
    } catch (error) {
      toast.error("Failed to load categories!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "Do you really want to delete this category? This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteRequest(`/api/Categories/${id}`);
          toast.success("Category deleted successfully!");
          loadData();
        } catch (error) {
          toast.error("Failed to delete category!");
        }
      },
    });
  };

  const handleUpdate = (category) => {
    setCategoryId(category.categoryId);
    setCategoryData({
      categoryName: category.categoryName,
      companyId: category.companyId,
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    setCategoryData({ ...categoryData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (categoryId) {
        await putRequest(`/api/Categories/${categoryId}`, categoryData);
        toast.success("Category updated successfully!");
      } else {
        await postRequest("/api/Categories", categoryData);
        toast.success("Category added successfully!");
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      toast.error(categoryId ? "Failed to update category!" : "Failed to add category!");
    } finally {
      setCategoryId(null);
      setCategoryData({
        categoryName: "",
        companyId: companyId, // Keep the companyId from token
      });
    }
  };

  const columns = [
    { 
      title: "Sr. No", 
      dataIndex: "srNo", 
      key: "srNo", 
      render: (_, __, index) => index + 1 
    },
    {
      title: "Category Name",
      dataIndex: "categoryName",
      sorter: (a, b) => a.categoryName.localeCompare(b.categoryName),
      filters: categories.map((category) => ({
        text: category.categoryName, 
        value: category.categoryId
      })),
      onFilter: (value, record) => record.categoryId === value,
      filterSearch: true,
      filterMode: "tree",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EditOutlined style={{ color: "#1890ff" }} />} onClick={() => handleUpdate(record)} />
          <Button type="text" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.categoryId)} />
        </Space>
      ),
    },
  ];
  

  return (
    <div className="container mt-3">
      <ToastContainer />
      <h3>Category Management</h3>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setShowModal(true);
            setCategoryId(null);
            setCategoryData({
              categoryName: "",
              companyId: companyId, // Use decoded token companyId
            });
          }}
        >
          Add Category
        </Button>
      </div>

      {loading ? <Loader /> : <Table columns={columns} dataSource={categories} rowKey="categoryId" pagination={{ pageSize: 5 }} bordered />}

      <Modal title={categoryId ? "Edit Category" : "Add Category"} open={showModal} onCancel={() => setShowModal(false)} onOk={handleSubmit}>
        <Input placeholder="Category Name" name="categoryName" value={categoryData.categoryName} onChange={handleChange} className="mb-2" />
      </Modal>
    </div>
  );
};

export default CategoryTable;
