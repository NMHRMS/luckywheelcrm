import React, { useState,useEffect } from 'react';
import { Modal, Button, Form,Select,Input } from 'antd';
import { postRequest,getRequest } from '../utils/Api';
import { fetchStoredData } from "../utils/UserDataUtils"

const AddLeadModal = ({ visible, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    // const [userData, setUserData] = useState({});
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [leadSources, setLeadSources] = useState([]);
    const [Assignedusers, setAssignedusers] = useState([]);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showSourceModal, setShowSourceModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newProductName, setNewProductName] = useState('');
    const [newSourceName, setNewSourceName] = useState('');
  const [userData, setUserData] = useState({
    branchId: "",
    companyId: "",
    userId: "",
    })

    useEffect(() => {
      const loadUserData = async () => {
      const storedData = await fetchStoredData()
      if (storedData) {
        setUserData(storedData)
      }
      }
      loadUserData()
    }, [])

    useEffect(() => {
        const loadData = async () => {
          const storedData = await fetchStoredData();
          if (storedData) setUserData(storedData);
          
          // Fetch initial data
          try {
            const [cats, prods, sources,users] = await Promise.all([
              getRequest("/api/Categories"),
              getRequest("/api/Products"),
              getRequest("/api/LeadSources"),
              getRequest("/api/Users")
            ]);
            
            setCategories(cats.data || []);
            setProducts(prods.data || []);
            setLeadSources(sources.data || []);
            setAssignedusers(users.data || []);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
        loadData();
      }, []);

      const handleAddCategory = async () => {
        try {
          const response = await postRequest("/api/Categories", {
            companyId: userData.companyId,
            categoryName: newCategoryName
          });
          setCategories([...categories, response.data]);
          setNewCategoryName('');
          setShowCategoryModal(false);
        } catch (error) {
          console.error("Error adding category:", error);
        }
      };
    
      const handleAddProduct = async () => {
        try {
          const response = await postRequest("/api/Products", {
            companyId: userData.companyId,
            productName: newProductName
          });
          setProducts([...products, response.data]);
          setNewProductName('');
          setShowProductModal(false);
        } catch (error) {
          console.error("Error adding product:", error);
        }
      };
    
      const handleAddSource = async () => {
        try {
          const response = await postRequest("/api/LeadSources", {
            companyId: userData.companyId,
            sourceName: newSourceName
          });
          setLeadSources([...leadSources, response.data]);
          setNewSourceName('');
          setShowSourceModal(false);
        } catch (error) {
          console.error("Error adding source:", error);
        }
      };

  const handleSubmit = async (values) => {
    console.log("values",values);
    
    try {
      setLoading(true);

      const data=
      {
        companyId:userData.companyId,
        leadSourceName:values.ownerName,
        OwnerName: values.ownerName,
        MobileNo: values.mobileNo,
        DistrictName: values.districtName,
        CurrentAddress: values.currentAddress,
        currentVehicle: values.currentVehicle,
        categoryName: values.categoryName,
        productName: values.productName,
        assignedToName: values.assignedToName,
        Status:"Not Called",
      }
    //   const response = await postRequest("/api/Leads", );
console.log("data",data);

    //   onSuccess(response.data);
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
          rules={[{ required: true, message: 'Please input owner name!' }]}
        >
          <Input placeholder="Enter owner name" />
        </Form.Item>

        <Form.Item
          label="Mobile Number"
          name="mobileNo"
          rules={[{ required: true, message: 'Please input mobile number!' }]}
        >
          <Input placeholder="Enter mobile number" />
        </Form.Item>

        <Form.Item
          label="District Name"
          name="districtName"
          rules={[{ required: true, message: 'Please input district name!' }]}
        >
          <Input placeholder="Enter district name" />
        </Form.Item>

        <Form.Item
          label="Current Address"
          name="currentAddress"
          rules={[{ required: true, message: 'Please input address!' }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          label="current Vehicle"
          name="currentVehicle"
          rules={[{ required: true, message: 'Please input current Vehicle!' }]}
        >
          <Input placeholder="Enter current Vehicle" />
        </Form.Item>

        <Form.Item
            label="Category"
            name="categoryName"
            rules={[{ required: true, message: 'Please select category!' }]}
          >
            <Select
              placeholder="Select Category"
              dropdownRender={menu => (
                <>
                  {menu}
                  <div style={{ padding: '8px', display: 'flex', gap: '8px' }}>
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
              {categories.map(cat => (
                <Select.Option key={cat.categoryId} value={cat.categoryName}>
                  {cat.categoryName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Product"
            name="productName"
            rules={[{ required: true, message: 'Please select product!' }]}
          >
            <Select
              placeholder="Select Product"
              dropdownRender={menu => (
                <>
                  {menu}
                  <div style={{ padding: '8px', display: 'flex', gap: '8px' }}>
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
              {products.map(prod => (
                <Select.Option key={prod.productId} value={prod.productName}>
                  {prod.productName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Lead Source"
            name="leadSourceName"
            rules={[{ required: true, message: 'Please select lead source!' }]}
          >
            <Select
              placeholder="Select Lead Source"
              dropdownRender={menu => (
                <>
                  {menu}
                  <div style={{ padding: '8px', display: 'flex', gap: '8px' }}>
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
              {leadSources.map(source => (
                <Select.Option key={source.sourceId} value={source.sourceName}>
                  {source.sourceName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

        <Form.Item
          label="assignedTo Name"
          name="assignedToName"
          rules={[{ required: true, message: 'Please select assignedTo Name!' }]}
        >
            
          <Select placeholder="Select assignedTo Name">
          {Assignedusers.map(user => (
                <Select.Option key={user.userId} value={user.firstName}>
                  {user.firstName}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
{/* 
        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: 'Please select status!' }]}
        >
          <Select placeholder="Select status">
            <Select.Option value="pending">Pending</Select.Option>
            <Select.Option value="active">Active</Select.Option>
            <Select.Option value="closed">Closed</Select.Option>
          </Select>
        </Form.Item> */}
      </Form>
    </Modal>
  );
};

export default AddLeadModal;