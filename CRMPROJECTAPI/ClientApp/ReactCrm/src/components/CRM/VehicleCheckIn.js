import { useState, useEffect } from "react";
import { Table, Button } from "antd";
import { getRequest } from "../utils/Api";

function VehicleEntry() {
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [branches, setBranches] = useState([]);
  const [vehicleData, setVehicleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchKey, setFetchKey] = useState(0); // Force re-fetch

  const getAuthToken = () => localStorage.getItem("authToken") || "";

  const fetchBranches = async () => {
    try {
      const response = await getRequest("/api/Branch");
      if (Array.isArray(response.data)) {
        setBranches(
          response.data.map((branch) => ({
            id: branch.branchId,
            name: branch.name.trim().toLowerCase(), // Normalize name
          }))
        );
      } else {
        console.error("Unexpected API response:", response.data);
      }
    } catch (err) {
      console.error("Error fetching branches:", err);
      setError("Failed to load branches.");
    }
  };

  const fetchVehicleData = async (branch) => {
    setLoading(true);
    setVehicleData([]);
    
    let url = "";
    if (branch === "All") {
      url = "/api/VehicleInOut/all";
    } else {
      const selectedBranchId = branches.find((b) => b.name === branch.trim().toLowerCase())?.id;
      console.log("Selected Branch:", branch);
      console.log("Selected Branch ID:", selectedBranchId);
      
      if (!selectedBranchId) {
        console.error("Branch ID not found!");
        return;
      }
      url = `/api/VehicleInOut/get-checkInOutDetails_by_id?branchId=${selectedBranchId}`;
    }

    try {
      console.log("Fetching URL:", url);
      const response = await getRequest(url);
      const processData = (data) =>
        data.map((vehicle) => ({
          key: vehicle.vehicleNo, // Unique key for AntD table
          branch: branches.find((b) => b.id === vehicle.branchId)?.name || "Unknown",
          vehicleNumber: vehicle.vehicleNo,
          reason: vehicle.checkInReason,
          status: vehicle.status || (vehicle.checkOutDate ? "Checked Out" : "Checked In"),
          date: new Date(vehicle.checkInDate).toLocaleDateString(),
          time: new Date(vehicle.checkInDate).toLocaleTimeString(),
        }));

      setVehicleData(processData(Array.isArray(response.data) ? response.data : response.data.records || []));
    } catch (err) {
      console.error("Error fetching vehicle data:", err);
      setError(`Failed to load data: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    if (branches.length > 0) {
      fetchVehicleData(selectedBranch);
    }
  }, [branches, selectedBranch, fetchKey]); // Force re-fetch

  const handleBranchClick = (branch) => {
    setSelectedBranch(branch);
    setFetchKey((prev) => prev + 1); // Force re-fetch
  };

  const columns = [
    {
      title: "Sr. No",
      dataIndex: "key",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Branch",
      dataIndex: "branch",
      sorter: (a, b) => a.branch.localeCompare(b.branch),
    },
    {
      title: "Vehicle Number",
      dataIndex: "vehicleNumber",
      sorter: (a, b) => a.vehicleNumber.localeCompare(b.vehicleNumber),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      sorter: (a, b) => a.reason.localeCompare(b.reason),
    },
    {
      title: "Status",
      dataIndex: "status",
      filters: [
        { text: "Checked In", value: "Checked In" },
        { text: "Checked Out", value: "Checked Out" },
      ],
      onFilter: (value, record) => record.status === value,
      filterSearch:true,
      filterMode: "tree", 
      render: (status) => (
        <span className={status === "Checked In" ? "text-success fw-bold" : "text-danger fw-bold"}>
          {status}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "Time",
      dataIndex: "time",
      sorter: (a, b) => new Date(`1970-01-01T${a.time}`) - new Date(`1970-01-01T${b.time}`),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-center mb-4">Vehicle Check-In/Check-Out Records</h1>

      <div className="d-flex justify-content-end gap-2 mb-2 flex-wrap">
        <Button
          type={selectedBranch === "All" ? "primary" : "default"}
          onClick={() => handleBranchClick("All")}
        >
          All
        </Button>
        {branches.map((branch) => (
          <Button
            key={branch.id}
            type={selectedBranch === branch.name ? "primary" : "default"}
            onClick={() => handleBranchClick(branch.name)}
          >
            {branch.name}
          </Button>
        ))}
      </div>

      <div className="container my-3">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-danger text-center">{error}</p>
        ) : vehicleData.length === 0 ? (
          <p className="text-center">No records found</p>
        ) : (
          <Table
            columns={columns}
            dataSource={vehicleData}
            pagination={{ pageSize: 10 }}
            bordered
          />
        )}
      </div>
    </div>
  );
}

export default VehicleEntry;
