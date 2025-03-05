import { useState, useEffect } from "react"
import { getRequest } from "../utils/Api"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { fetchStoredData } from "../utils/UserDataUtils"

function Practise() {
  const [showModal, setShowModal] = useState(false)
  const [roles, setRoles] = useState([])
  const [branches, setBranches] = useState([])
  const [getUser, setGetuser] = useState("")
  const [showBranchesAndCategories, setShowBranchesAndCategories] = useState(false)
  const [showOnlyBranches, setShowOnlyBranches] = useState(false)

  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
    contactNumber: "",
    branchId: "",
    roleId: "",
    categoriesId: "",
  })

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     console.log("Selected roleId:", value, typeof value); // Debugging
  
//     setNewUser((prevUser) => ({
//       ...prevUser,
//       [name]: value,
//     }));
  
//     if (name === "roleId") {
//       if (
//         value.trim() === "341FE51D-B3BB-4CE0-901F-06443BB61830" || 
//         value.trim() === "5C13FC2F-6C3A-412D-86CF-E83BA26BDB42"
//       ) {
//         console.log("Matched roleId for Branches & Categories:", value);
//         setShowBranchesAndCategories(true);
//         setShowOnlyBranches(false);
//       } else if (value.trim() === "9180D316-711F-49B9-AD0C-097B7F15132D") {
//         console.log("Matched roleId for Only Branches:", value);
//         setShowBranchesAndCategories(false);
//         setShowOnlyBranches(true);
//       } else {
//         console.log("No matching roleId:", value);
//         setShowBranchesAndCategories(false);
//         setShowOnlyBranches(false);
//       }
//     }
//   };
  

//   const handleInputChange = (e) => {
//     console.log(showBranchesAndCategories);
//     console.log(showOnlyBranches);
    
//     const { name, value } = e.target
//     setNewUser((prevUser) => ({
//       ...prevUser,
//       [name]: value,
//     }))

//     console.log(name);

//     if (name === "roleId") {
//       const roleId = value
//       console.log("out",roleId);
      
//       if (roleId === "341FE51D-B3BB-4CE0-901F-06443BB61830" || roleId === "5C13FC2F-6C3A-412D-86CF-E83BA26BDB42") {
//         console.log("in",roleId);
        
//     console.log(showBranchesAndCategories);
//         setShowBranchesAndCategories(true)
//         setShowOnlyBranches(false)
//       } else if (roleId === "9180D316-711F-49B9-AD0C-097B7F15132D") {
//         setShowBranchesAndCategories(false)
//         setShowOnlyBranches(true)
//       } else {
//         setShowBranchesAndCategories(false)
//         setShowOnlyBranches(false)
//       }
//     }
//   }

const handleInputChange = (event) => {
    const { name, value } = event.target;
  
    console.log(`Selected ${name}:`, value);
  
    if (name === "roleId") {
      const selectedRoleId = value.toLowerCase(); // Normalize case
  
      // Define role IDs for case-insensitive comparison
      const roleWithBranchesAndCategories = [
        "341fe51d-b3bb-4ce0-901f-06443bb61830",
        "5c13fc2f-6c3a-412d-86cf-e83ba26bdb42"
      ];
      const roleWithOnlyBranches = ["9180d316-711f-49b9-ad0c-097b7f15132d"];
  
      // Debugging logs
      console.log("Normalized roleId:", selectedRoleId);
  
      if (roleWithBranchesAndCategories.includes(selectedRoleId)) {
        console.log("Matched roleId for showing branches & categories:", selectedRoleId);
        setShowBranchesAndCategories(true);
        setShowOnlyBranches(false);
      } else if (roleWithOnlyBranches.includes(selectedRoleId)) {
        console.log("Matched roleId for showing only branches:", selectedRoleId);
        setShowBranchesAndCategories(false);
        setShowOnlyBranches(true);
      } else {
        console.log("No matching roleId:", selectedRoleId);
        setShowBranchesAndCategories(false);
        setShowOnlyBranches(false);
      }
    }
  
    setNewUser((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };
  

  useEffect(() => {
    const loadUserData = async () => {
      const storedData = await fetchStoredData()
      if (storedData) {
        setGetuser(storedData)
      }
    }
    loadUserData()
  }, [])

  useEffect(() => {
    getRequest("/api/Roles")
      .then((res) => setRoles(res.data))
      .catch((error) => toast.error("Error fetching roles: ", error))

    getRequest("/api/Branch")
      .then((res) => setBranches(res.data))
      .catch((error) => toast.error("Error fetching branches: ", error))
  }, [])

  useEffect(() => {
  console.log("Updated showBranchesAndCategories:", showBranchesAndCategories);
}, [showBranchesAndCategories]);


  const handleSave = () => {
    console.log("data", newUser)
  }

  return (
    <div>
      <button
        className="btn btn-primary ms-auto"
        onClick={() => {
          setShowModal(true)
        }}
      >
        Add User
      </button>
      {showModal && (
        <>
          <div className="modal-backdrop show"></div>
          <div className="modal show" style={{ display: "block" }} tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add User</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="firstName"
                      name="firstName"
                      value={newUser.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      name="lastName"
                      value={newUser.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="emailId" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="emailId"
                      name="emailId"
                      value={newUser.emailId}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={newUser.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="contactNumber" className="form-label">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="contactNumber"
                      name="contactNumber"
                      value={newUser.contactNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="roleId" className="form-label">
                      Role
                    </label>
                    <select
                      id="roleId"
                      name="roleId"
                      className="form-control"
                      value={newUser.roleId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Role</option>
                      {roles.map((role) => (
                        <option key={role.roleId} value={role.roleId}>
                          {role.roleName}
                        </option>
                      ))}
                    </select>
                  </div>
                  {(showBranchesAndCategories || showOnlyBranches) && (
                    <div className="mb-3">
                      <label htmlFor="branchId" className="form-label">
                        Branch
                      </label>
                      <select
                        id="branchId"
                        name="branchId"
                        className="form-control"
                        value={newUser.branchId}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Branch</option>
                        {branches.map((branch) => (
                          <option key={branch.branchId} value={branch.branchId}>
                            {branch.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {showBranchesAndCategories && (
                    <div className="mb-3">
                      <label htmlFor="categoriesId" className="form-label">
                        Categories/Vertical
                      </label>
                      <select
                        id="categoriesId"
                        name="categoriesId"
                        className="form-control"
                        value={newUser.categoriesId}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select categories</option>
                        <option value="1"> HCV </option>
                        <option value="2"> Bus </option>
                        <option value="3"> Icv </option>
                      </select>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Close
                  </button>
                  <button type="button" className="btn btn-primary" onClick={handleSave}>
                    Add User
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Practise

