import { useState, useEffect } from "react";
import { Table, Button } from "antd";
import { getRequest } from "../utils/Api";

function VehicleEntry() {
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [branches, setBranches] = useState([]);
  const [vehicleData, setVehicleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAuthToken = () => localStorage.getItem("authToken") || "";

  const fetchBranches = async () => {
    try {
      const response = await getRequest("/api/Branch");
      if (Array.isArray(response.data)) {
        setBranches(
          response.data.map((branch) => ({
            id: branch.branchId,
            name: branch.name,
          }))
        );
      }
    } catch (err) {
      setError("Failed to load branches.");
    }
  };

  const fetchVehicleData = async (branch) => {
    setLoading(true);
    setVehicleData([]);

    let url = branch === "All"
      ? "/api/VehicleInOut/all"
      : `/api/VehicleInOut/get-checkInOutDetails_by_id?branchId=${branches.find(b => b.name === branch)?.id}`;

    try {
      const response = await getRequest(url);
      const processData = (data) => data.map((vehicle, index) => ({
        key: index + 1,
        branch: branches.find((b) => b.id === vehicle.branchId)?.name || "Unknown",
        vehicleNumber: vehicle.vehicleNo,
        reason: vehicle.checkInReason,
        status: vehicle.status || (vehicle.checkOutDate ? "Checked Out" : "Checked In"),
        date: new Date(vehicle.checkInDate).toLocaleDateString(),
        time: new Date(vehicle.checkInDate).toLocaleTimeString(),
      }));

      setVehicleData(processData(response.data?.records || response.data || []));
    } catch (err) {
      setError(`Failed to load vehicle data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    if (branches.length > 0) fetchVehicleData(selectedBranch);
  }, [branches, selectedBranch]);

  const handleBranchClick = (branch) => setSelectedBranch(branch);

  const columns = [
    {
      title: "Sr. No",
      dataIndex: "key",
      key: "key",
      sorter: (a, b) => a.key - b.key,
    },
    {
      title: "Branch",
      dataIndex: "branch",
      key: "branch",
      filters: branches.map((b) => ({ text: b.name, value: b.name })),
      onFilter: (value, record) => record.branch === value,
      sorter: (a, b) => a.branch.localeCompare(b.branch),
      filterSearch:true,
      filterMode: "tree", 
    },
    {
      title: "Vehicle Number",
      dataIndex: "vehicleNumber",
      key: "vehicleNumber",
      sorter: (a, b) => a.vehicleNumber.localeCompare(b.vehicleNumber),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      sorter: (a, b) => a.reason.localeCompare(b.reason),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Checked In", value: "Checked In" },
        { text: "Checked Out", value: "Checked Out" },
      ],
      onFilter: (value, record) => record.status === value,
      sorter: (a, b) => a.status.localeCompare(b.status),
      filterSearch:true,
      filterMode: "tree", 
      render: (text) => (
        <span className={text === "Checked In" ? "text-success fw-bold" : "text-danger fw-bold"}>
          {text}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      sorter: (a, b) => a.time.localeCompare(b.time),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-center mb-4">Vehicle Check-In/Check-Out Records</h1>

      <div className="d-flex justify-content-end gap-2 mb-2" >
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
        ) : (
          <Table columns={columns} dataSource={vehicleData} bordered pagination={{ pageSize: 10 }} />
        )}
      </div>
    </div>
  );
}

export default VehicleEntry;
