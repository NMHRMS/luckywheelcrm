import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // Import useNavigate

const VehicleCheck = () => {
  const [branches, setBranches] = useState([]);
  const [vehicleData, setVehicleData] = useState([]);
  const [displayedData, setDisplayedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startIndex, setStartIndex] = useState(0);

  const recordsPerPage = 6;
  const intervalTime = 20000;

  const navigate = useNavigate(); // Initialize useNavigate

  // Retrieve auth token from local storage
  const getAuthToken = () => localStorage.getItem("authToken") || "";

  // Fetch branches
  const fetchBranches = async () => {
    const token = getAuthToken();
    // if (!token) {
    //   console.error("No auth token found");
    //   navigate("/login");  // Use navigate instead of window.location.href
    //   return;
    // }

    try {
      const response = await axios.get("https://localhost:7258/api/Branch", {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      if (Array.isArray(response.data)) {
        setBranches(response.data);
      } else {
        console.error("Unexpected API response format:", response.data);
      }
    } catch (err) {
      console.error("Error fetching branches:", err);
      setError("Failed to load branches.");
    }
  };

  // Fetch vehicle data
  const fetchVehicleData = async () => {
    setLoading(true);
    const token = getAuthToken();
    // if (!token) {
    //   console.error("No auth token found");
    //   navigate("/login");  // Use navigate instead of window.location.href
    //   return;
    // }

    try {
      const response = await axios.get("https://localhost:7258/api/VehicleInOut/all", {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      const processData = (data) =>
        data.map((vehicle) => ({
          branch: branches.find((b) => b.branchId === vehicle.branchId)?.name || "Unknown",
          vehicleNumber: vehicle.vehicleNo,
          reason: vehicle.checkInReason,
          status: vehicle.status || (vehicle.checkOutDate ? "Checked Out" : "Checked In"),
          age: vehicle.age || "N/A", // Assuming age exists in API response
          date: new Date(vehicle.checkInDate).toLocaleDateString(),
          time: new Date(vehicle.checkInDate).toLocaleTimeString(),
        }));

      const formattedData = processData(response.data || []);
      setVehicleData(formattedData);
      setStartIndex(0);
      setDisplayedData(formattedData.slice(0, recordsPerPage));
    } catch (err) {
      console.error("Error fetching vehicle data:", err);
      setError("Failed to load vehicle data.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch branches first, then fetch vehicle data
  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    if (branches.length > 0) {
      fetchVehicleData();
    }
  }, [branches]);

  // Auto-pagination effect
  useEffect(() => {
    if (vehicleData.length > recordsPerPage) {
      const interval = setInterval(() => {
        setStartIndex((prevIndex) => {
          let newIndex = prevIndex + recordsPerPage;
          if (newIndex >= vehicleData.length) {
            newIndex = 0;
          }
          setDisplayedData(vehicleData.slice(newIndex, newIndex + recordsPerPage));
          return newIndex;
        });
      }, intervalTime);

      return () => clearInterval(interval);
    }
  }, [vehicleData]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-50">
      <div className="container my-3">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-danger text-center">{error}</p>
        ) : displayedData.length === 0 ? (
          <p className="text-center">No records found</p>
        ) : (
          <div className="table-responsive shadow-sm rounded mt-5">
            <table className="table table-bordered table-hover text-center">
              <thead className="bg-primary text-white">
                <tr>
                  <th>Sr. No</th>
                  <th>Branch</th>
                  <th>Vehicle Number</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Age</th> 
                  <th>Date</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {displayedData.map((vehicle, index) => (
                  <tr key={index}>
                    <td>{startIndex + index + 1}</td>
                    <td>{vehicle.branch}</td>
                    <td>{vehicle.vehicleNumber}</td>
                    <td>{vehicle.reason}</td>
                    <td className={vehicle.status === "Checked In" ? "text-success fw-bold" : "text-danger fw-bold"}>
                      {vehicle.status}
                    </td>
                    <td>{vehicle.age}</td> 
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
};

export default VehicleCheck;
