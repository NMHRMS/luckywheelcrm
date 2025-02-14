import { useState, useEffect } from "react";
import axios from "axios";
import { getRequest, postRequest, putRequest, deleteRequest } from "../utils/Api";
import { getAuthData, fetchStoredData } from "../utils/AuthUtils";
function VehicleEntry() {
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [branches, setBranches] = useState([]);
  const [vehicleData, setVehicleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAuthToken = () => {
    return localStorage.getItem("authToken") || "";
  };

  const fetchBranches = async () => {
    const token = getAuthToken();
    // if (!token) {
    //   console.error("No auth token found");
    //   window.location.href = "/login";
    //   return;
    // }

    try {
      const response = await getRequest("/api/Branch")

      if (Array.isArray(response.data)) {
        setBranches(
          response.data.map((branch) => ({
            id: branch.branchId,
            name: branch.name,
          }))
        );
      } else {
        console.error("Unexpected API response format:", response.data);
      }
    } catch (err) {
      console.error("Error fetching branches:", err);
      setError("Failed to load branches.");
    }
  };

  const fetchVehicleData = async (branch) => {
    setLoading(true);
    setVehicleData([]);

    const token = getAuthToken();
    // if (!token) {
    //   console.error("No auth token found");
    //   window.location.href = "/login";
    //   return;
    // }

    let url = "";
    if (branch === "All") {
      url = "/api/VehicleInOut/all";
    } else {
      const selectedBranchId = branches.find((b) => b.name === branch)?.id;
      if (!selectedBranchId) {
        console.error("Branch ID not found for:", branch);
        return;
      }
      url = `/api/VehicleInOut/get-checkInOutDetails_by_id?branchId=${selectedBranchId}`;
    }

    try {
      const response = await getRequest(url);

      const processData = (data) => {
        return data.map((vehicle) => ({
          branch: branches.find((b) => b.id === vehicle.branchId)?.name || "Unknown",
          vehicleNumber: vehicle.vehicleNo,
          reason: vehicle.checkInReason,
          status: vehicle.status || (vehicle.checkOutDate ? "Checked Out" : "Checked In"),
          date: new Date(vehicle.checkInDate).toLocaleDateString(),
          time: new Date(vehicle.checkInDate).toLocaleTimeString(),
        }));
      };

      setVehicleData(
        processData(Array.isArray(response.data) ? response.data : response.data.records || [])
      );
    } catch (err) {
      console.error("Error fetching vehicle data:", err);
      setError(`Failed to load vehicle data: ${err.response?.data?.message || err.message}`);
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
  }, [branches, selectedBranch]);

  const handleBranchClick = (branch) => {
    setSelectedBranch(branch);
  };

  return (
    <div className="p-4">
      <h1 className="text-center mb-4">Vehicle Check-In/Check-Out Records</h1>

      <div className="d-flex justify-content-end gap-2 mb-2 me-2">
        <button
          className={`btn btn-sm px-3 py-2 rounded-3 shadow-sm ${
            selectedBranch === "All" ? "btn-primary" : "btn-outline-secondary"
          }`}
          style={{ width: "100px", height: "40px" }}
          onClick={() => handleBranchClick("All")}
        >
          All
        </button>
        {branches.map((branch) => (
          <button
            key={branch.id}
            className={`btn btn-sm px-3 py-2 rounded-3 shadow-sm ${
              selectedBranch === branch.name ? "btn-primary" : "btn-outline-secondary"
            }`}
            style={{ width: "100px", height: "40px" }}
            onClick={() => handleBranchClick(branch.name)}
          >
            {branch.name}
          </button>
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
          <div className="table-responsive shadow-sm rounded">
            <table className="table table-bordered table-hover">
              <thead className="bg-primary text-white">
                <tr>
                  <th>Sr. No</th>
                  <th>Branch</th>
                  <th>Vehicle Number</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {vehicleData.map((vehicle, index) => (
                  <tr key={index}>
                   
                    <td>{index + 1}</td>
                    <td>{vehicle.branch}</td>
                    <td>{vehicle.vehicleNumber}</td>
                    <td>{vehicle.reason}</td>
                    <td
                      className={`${
                        vehicle.status === "Checked In" ? "text-success fw-bold" : "text-danger fw-bold"
                      }`}
                    >
                      {vehicle.status}
                    </td>
                    <td>{vehicle.date}</td>
                    <td>{vehicle.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default VehicleEntry;
