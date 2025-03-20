import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Select, Input } from "antd";
import { postRequest, getRequest } from "../utils/Api";
import { fetchStoredData } from "../utils/UserDataUtils";

const AddLeadModal = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  // const [userData, setUserData] = useState({});
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [leadSources, setLeadSources] = useState([]);
  const [Assignedusers, setAssignedusers] = useState([]);
  const [Districts, setDistricts] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newProductName, setNewProductName] = useState("");

  const [newSourceName, setNewSourceName] = useState("");
  const [userData, setUserData] = useState({
    branchId: "",
    companyId: "",
    userId: "",
  });

  useEffect(() => {
    const loadUserData = async () => {
      const storedData = await fetchStoredData();
      if (storedData) {
        setUserData(storedData);
      }
    };
    console.log("Districts", Districts);

    loadUserData();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const storedData = await fetchStoredData();
      if (storedData) setUserData(storedData);

      try {
        const [cats, prods, sources, users, District] = await Promise.all([
          getRequest("/api/Categories"),
          getRequest("/api/Products"),
          getRequest("/api/LeadSources"),
          getRequest("/api/UserAssignmentMapping/assignees"),
          getRequest(`/api/states/districts/statename/${"Maharashtra"}`),
        ]);
        setCategories(cats.data || []);
        setProducts(prods.data || []);
        setLeadSources(sources.data || []);
        // Filter users with roleId "a8c8ea20-7154-4d78-97ea-a4d5cf217a27"
        // const filteredUsers = (users.data || []).filter(
        //   (user) => user.roleId === "a8c8ea20-7154-4d78-97ea-a4d5cf217a27"
        // );
        // const formattedUsers = users.data.map(user => ({
        //   label: user.assigneeName, // Displayed in the dropdown
        //   value: user.assigneeId,   // Selected value
        // }));
        // setAssignedusers(formattedUsers);
        setAssignedusers(users.data || []);

        setDistricts(District.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    loadData();
  }, []);

  console.log("Assignedusers", Assignedusers);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      alert("Source name cannot be empty!");
      return;
    }
    try {
      const response = await postRequest("/api/Categories", {
        companyId: userData.companyId,
        categoryName: newCategoryName,
      });
      setCategories([...categories, response.data]);
      setNewCategoryName("");
      setShowCategoryModal(false);
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleAddProduct = async () => {
    if (!newProductName.trim()) {
      alert("Source name cannot be empty!");
      return;
    }
    try {
      const response = await postRequest("/api/Products", {
        companyId: userData.companyId,
        productName: newProductName,
      });
      setProducts([...products, response.data]);
      setNewProductName("");
      setShowProductModal(false);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleAddSource = async () => {
    if (!newSourceName.trim()) {
      alert("Source name cannot be empty!");
      return;
    }
    try {
      const response = await postRequest("/api/LeadSources", {
        companyId: userData.companyId,
        sourceName: newSourceName,
      });
      setLeadSources([...leadSources, response.data]);
      setNewSourceName("");
      setShowSourceModal(false);
    } catch (error) {
      console.error("Error adding source:", error);
    }
  };

  const handleSubmit = async (values) => {
    console.log("values", values);

    try {
      setLoading(true);

      const data = {
        companyId: userData.companyId,
        leadSourceName: values.ownerName,
        OwnerName: values.ownerName,
        MobileNo: values.mobileNo,
        DistrictName: values.districtName,
        CurrentAddress: values.currentAddress,
        currentVehicle: values.currentVehicle,
        categoryName: values.categoryName,
        productName: values.productName,
        assignedToName: values.assignedToName,
        excelName: "Walking",
        Status: "Not Called",
      };

      console.log("data", data);
      const response = await postRequest("/api/Leads", data);
      console.log("response", response);

      const leadID = response?.data?.leadId || null;
      const assignedTo = response?.data?.assignedTo || null;
      const assignedBy = userData.userId;
      const assignedDate = new Date().toISOString();
      const assigndata = { leadID, assignedTo, assignedDate, assignedBy };
      console.log("assigndata", assigndata);
      const assignresponse = await postRequest(
        "/api/LeadAssign/assign",
        assigndata
      );
      console.log("assignresponse", assignresponse);

      onSuccess(response.data);
      form.resetFields();
      onClose();
      alert("Lead added successfully!");
    } catch (error) {
      console.error("Error saving lead:", error);
      alert(`Error: ${error.response?.data?.message || "Failed to save lead"}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal
      title="Add New Lead"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={() => form.submit()}
        >
          Save
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Owner Name"
          name="ownerName"
          rules={[{ required: true, message: "Please input owner name!" }]}
        >
          <Input placeholder="Enter owner name" />
        </Form.Item>

        <Form.Item
          label="Mobile Number"
          name="mobileNo"
          rules={[{ required: true, message: "Please input mobile number!" }]}
        >
          <Input placeholder="Enter mobile number" />
        </Form.Item>
        <Form.Item
          label="District Name"
          name="districtName"
          rules={[{ required: true, message: "Please select District Name!" }]}
        >
          <Select
            showSearch
            placeholder="Select District Name"
            dropdownRender={(menu) => <>{menu}</>}
          >
            {Districts.map((district) => (
              <Select.Option
                key={district.districtId}
                value={district.districtName}
              >
                {district.districtName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Current Address"
          name="currentAddress"
          // rules={[{ required: true, message: "Please input address!" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          label="Current Vehicle"
          name="currentVehicle"
          // rules={[{ required: true, message: "Please input current Vehicle!" }]}
        >
          <Input placeholder="Enter current Vehicle" />
        </Form.Item>

        <Form.Item
          label="Category"
          name="categoryName"
          // rules={[{ required: true, message: "Please select category!" }]}
        >
          <Select
            showSearch
            placeholder="Select Category"
            dropdownRender={(menu) => (
              <>
                {menu}
                <div style={{ padding: "8px", display: "flex", gap: "8px" }}>
                  <Input
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="New category name"
                  />
                  <Button onClick={handleAddCategory}>+ Add</Button>
                </div>
              </>
            )}
          >
            {categories.map((cat) => (
              <Select.Option key={cat.categoryId} value={cat.categoryName}>
                {cat.categoryName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Product"
          name="productName"
          // rules={[{ required: true, message: "Please select product!" }]}
        >
          <Select
            showSearch
            placeholder="Select Product"
            dropdownRender={(menu) => (
              <>
                {menu}
                <div style={{ padding: "8px", display: "flex", gap: "8px" }}>
                  <Input
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    placeholder="New product name"
                  />
                  <Button onClick={handleAddProduct}>+ Add</Button>
                </div>
              </>
            )}
          >
            {products.map((prod) => (
              <Select.Option key={prod.productId} value={prod.productName}>
                {prod.productName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Lead Source"
          name="leadSourceName"
          // rules={[{ required: true, message: "Please select a lead source!" }]}
        >
          <Select
            showSearch
            placeholder="Select Lead Source"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            dropdownRender={(menu) => (
              <>
                {menu}
                <div style={{ padding: "8px", display: "flex", gap: "8px" }}>
                  <Input
                    value={newSourceName}
                    onChange={(e) => setNewSourceName(e.target.value)}
                    placeholder="New source name"
                  />
                  <Button onClick={handleAddSource}>+ Add</Button>
                </div>
              </>
            )}
          >
            {leadSources.map((source) => (
              <Select.Option key={source.sourceId} value={source.sourceName}>
                {source.sourceName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="AssignedTo Name"
          name="assignedToName"
          rules={[
            { required: false, message: "Please select assignedTo Name!" },
          ]}
        >
          <Select placeholder="Select assignedTo Name">
            {Assignedusers.map((user) => (
              <Select.Option key={user.assigneeId} value={user.assigneeName}>
                {user.assigneeName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddLeadModal;
