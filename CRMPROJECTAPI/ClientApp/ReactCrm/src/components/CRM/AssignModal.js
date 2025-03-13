"use client";

import { useState, useEffect } from "react";
import { getRequest } from "../utils/Api";
import { fetchStoredData } from "../utils/UserDataUtils";

function AssignModal({ visible, onClose, selectedRows, onAssign }) {
  const [creOptions, setCreOptions] = useState([]);
  const [assignUsers, setAssignUsers] = useState([]);
  const [selectedCRE, setSelectedCRE] = useState("");
  const [loading, setLoading] = useState(false); // New state for loader
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
    loadUserData();
  }, []);

  useEffect(() => {
    console.log("selectedRows", selectedRows);
    if (visible) {
      fetchAssignments();
    }
  }, [visible, selectedRows]);

  const fetchAssignments = async () => {
    setLoading(true); // Start loader
    try {
      const response = await getRequest("/api/UserAssignmentMapping/assignees");
      console.log("Assignments Response:", response.data);

      setAssignUsers(
        response.data.map((item) => ({
          ...item,
          key: item.assigneeId,
        }))
      );
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false); // Stop loader
    }
  };

  const handleAssign = () => {
    if (!selectedCRE) {
      alert("Please select a CRE to assign the leads.");
      return;
    }
    onAssign(selectedCRE);
  };

  if (!visible) return null;

  return (
    <div
      className="modal"
      tabIndex="-1"
      role="dialog"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Assign to </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {loading ? (
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <select
                className="form-select"
                value={selectedCRE}
                onChange={(e) => setSelectedCRE(e.target.value)}
              >
                <option value="">Select a CRE</option>
                {assignUsers.length > 0 &&
                  assignUsers.map((cre) => (
                    <option key={cre.assigneeId} value={cre.assigneeId}>
                      {cre.assigneeName}
                    </option>
                  ))}
              </select>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAssign}
              disabled={loading} // Disable button while loading
            >
              {loading ? "Assigning..." : "Assign"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignModal;
