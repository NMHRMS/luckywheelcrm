import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Input, Space } from "antd";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode"; // Ensure this is the correct import
import { getRequest, postRequest, putRequest, deleteRequest } from "../utils/Api";
import Loader from "../utils/Loader";

const Products = () => {
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productId, setProductId] = useState(null);

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

  const [productData, setProductData] = useState({
    productName: "",
    companyId: companyId, // Fetch from decoded token
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getRequest("/api/Products");
      console.log("API Response:", res.data);
      setProducts(res.data || []);
    } catch (error) {
      toast.error("Failed to load products!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "Do you really want to delete this product? This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteRequest(`/api/Products/${id}`);
          toast.success("product deleted successfully!");
          loadData();
        } catch (error) {
          toast.error("Failed to delete product!");
        }
      },
    });
  };

  const handleUpdate = (product) => {
    setProductId(product.productId);
    setProductData({
      productName: product.productName,
      companyId: product.companyId,
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!productData.productName.trim()) {
      toast.error("Product name cannot be empty!");
      return;
    }
    try {
      if (productId) {
        await putRequest(`/api/Products/${productId}`, productData);
        toast.success("product updated successfully!");
      } else {
        await postRequest("/api/Products", productData);
        toast.success("product added successfully!");
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      toast.error(productId ? "Failed to update product!" : "Failed to add product!");
    } finally {
      setProductId(null);
      setProductData({
        productName: "",
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
      title: "Product Name",
      dataIndex: "productName",
      sorter: (a, b) => a.productName.localeCompare(b.productName),
      filters: products.map((product) => ({
        text: product.productName, 
        value: product.productId
      })),
      onFilter: (value, record) => record.productId === value,
      filterSearch: true,
      filterMode: "tree",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EditOutlined style={{ color: "#1890ff" }} />} onClick={() => handleUpdate(record)} />
          <Button type="text" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.productId)} />
        </Space>
      ),
    },
  ];
  

  return (
    <div className="container mt-3">
      <ToastContainer />
      <h3>Product Management</h3>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setShowModal(true);
            setProductId(null);
            setProductData({
              productName: "",
              companyId: companyId, // Use decoded token companyId
            });
          }}
        >
          Add Product
        </Button>
      </div>

      {loading ? <Loader /> : <Table columns={columns} dataSource={products} rowKey="productId" pagination={{ pageSize: 30 }} bordered />}

      <Modal title={productId ? "Edit Product" : "Add Product"} open={showModal} onCancel={() => setShowModal(false)} onOk={handleSubmit}>
        <Input placeholder="Product Name" name="productName" value={productData.productName} onChange={handleChange} className="mb-2" />
      </Modal>
    </div>
  );
};

export default Products;
