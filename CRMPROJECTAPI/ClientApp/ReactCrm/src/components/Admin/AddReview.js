import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Input, Space } from "antd";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode"; // Ensure this is the correct import
import { getRequest, postRequest, putRequest, deleteRequest } from "../utils/Api";
import Loader from "../utils/Loader";

const AddReview = () => {
  const [showModal, setShowModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reviewId, setReviewId] = useState(null);

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

  const [reviewData, setReviewData] = useState({
    reviewType: "",
    companyId: companyId, // Fetch from decoded token
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getRequest("/api/ReviewTypes");
      console.log("API Response:", res.data);
      setReviews(res.data || []);
    } catch (error) {
      toast.error("Failed to load reviews!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "Do you really want to delete this review? This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteRequest(`/api/ReviewTypes/${id}`);
          toast.success("Category deleted successfully!");
          loadData();
        } catch (error) {
          toast.error("Failed to delete review!");
        }
      },
    });
  };

  const handleUpdate = (review) => {
    setReviewId(review.reviewId);
    setReviewData({
      reviewType: review.reviewType,
      companyId: review.companyId,
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    setReviewData({ ...reviewData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (reviewId) {
        await putRequest(`/api/ReviewTypes/${reviewId}`, reviewData);
        toast.success("Category updated successfully!");
      } else {
        await postRequest("/api/ReviewTypes", reviewData);
        toast.success("Category added successfully!");
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      toast.error(reviewId ? "Failed to update review!" : "Failed to add review!");
    } finally {
      setReviewId(null);
      setReviewData({
        reviewType: "",
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
      dataIndex: "reviewType",
      sorter: (a, b) => a.reviewType.localeCompare(b.reviewType),
      filters: reviews.map((review) => ({
        text: review.reviewType, 
        value: review.reviewId
      })),
      onFilter: (value, record) => record.reviewId === value,
      filterSearch: true,
      filterMode: "tree",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EditOutlined style={{ color: "#1890ff" }} />} onClick={() => handleUpdate(record)} />
          <Button type="text" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.reviewId)} />
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
            setReviewId(null);
            setReviewData({
              reviewType: "",
              companyId: companyId, // Use decoded token companyId
            });
          }}
        >
          Add Category
        </Button>
      </div>

      {loading ? <Loader /> : <Table columns={columns} dataSource={reviews} rowKey="reviewId" pagination={{ pageSize: 5 }} bordered />}

      <Modal title={reviewId ? "Edit Category" : "Add Category"} open={showModal} onCancel={() => setShowModal(false)} onOk={handleSubmit}>
        <Input placeholder="Category Name" name="reviewType" value={reviewData.reviewType} onChange={handleChange} className="mb-2" />
      </Modal>
    </div>
  );
};

export default AddReview;
