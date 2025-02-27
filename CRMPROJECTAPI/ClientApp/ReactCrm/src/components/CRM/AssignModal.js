"use client"

import { useState, useEffect } from "react"
import { getRequest } from "../utils/Api"
import { fetchStoredData } from "../utils/UserDataUtils"

function AssignModal({ visible, onClose, selectedRows, onAssign }) {
  const [creOptions, setCreOptions] = useState([])
  const [assignUsers, setAssignUsers] = useState([])
  const [selectedCRE, setSelectedCRE] = useState("")
  const [userData, setUserData] = useState({
    branchId: "",
    companyId: "",
    userId: "",
  })

  console.log("assignUsers",assignUsers);
  

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
    console.log("selectedRows", selectedRows)
    if (visible) {
      fetchCreUsers()
      fetchAssignments()
    }
  }, [visible, selectedRows]) // Added selectedRows to dependencies

    const fetchAssignments = () => {
      getRequest("/api/UserAssignmentMapping/get-mappings")
        .then((response) => setAssignUsers({
          ...response.data.map((item)=>{
            return { ...item, key: item.userId }
          })
        }))
        .catch((error) => console.error("Error fetching assignments:", error));
    };

  const fetchCreUsers = async () => {
    try {
      const response = await getRequest("/api/Users")
      console.log("responsedata", response.data)

      const creUsersList = response.data.filter((user) => user.roleId === "a8c8ea20-7154-4d78-97ea-a4d5cf217a27")
      console.log("creUsersList", creUsersList)

      setCreOptions(creUsersList)
    } catch (error) {
      console.error("Error fetching CRE users:", error)
    }
  }

  const handleAssign = () => {
    if (!selectedCRE) {
      alert("Please select a CRE to assign the leads.")
      return
    }
    onAssign(selectedCRE)
  }

  if (!visible) return null

  return (
    <div className="modal" tabIndex="-1" role="dialog" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Assign to CRE</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <select className="form-select" value={selectedCRE} onChange={(e) => setSelectedCRE(e.target.value)}>
              <option value="">Select CRE</option>
              {assignUsers.map((cre) => (
                <option key={cre.userId} value={cre.userId}>
                  {cre.firstName} {cre.lastName}
                </option>
              ))}
            </select>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={handleAssign}>
              Assign
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssignModal

