import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import {
  FaSortAlphaDown,
  FaSortAlphaUp,
  FaTimes,
  FaSearch,
} from "react-icons/fa";
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
} from "../utils/Api";
import { getAuthData, fetchStoredData } from "../utils/AuthUtils";
export default function Excelform() {
  const [fileData, setFileData] = useState([]);
  const [filters, setFilters] = useState({});
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState({});
  // const [recordsPerPage, setRecordsPerPage] = useState(50);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [sortByColumn, setSortByColumn] = useState("");
  const [sortOn, setSortOn] = useState("Cell Values");
  const [order, setOrder] = useState("A to Z");
  const [sortLevels, setSortLevels] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [creOptions, setCreOptions] = useState([]); // State for CRE options
  const [selectedCRE, setSelectedCRE] = useState(""); // Store selected CRE
  const [fileName, setFileName] = useState(""); // For storing file name
  const [fileNames, setFileNames] = useState([]); // For storing list of file names
  const [showModal, setShowModal] = useState(false); // For modal visibility
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // const rowsPerPage = 50;
  const [leadsData, setLeadsData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const fieldsToHide = ["companyId", "leadSource", "excelName", "leadId"];
  const [products, setProducts] = useState([]);
  // const [filteredLeads, setFilteredLeads] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [filterSearch, setFilterSearch] = useState({});
  const [uniqueColumnValues, setUniqueColumnValues] = useState({});
  const [leadModalVisible, setLeadModalVisible] = useState(false);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [tempFilters, setTempFilters] = useState({});
  const [recordsPerPage, setRecordsPerPage] = useState(50);
  const [showFileNameModal, setShowFileNameModal] = useState(false);
  const [totalLeads, setTotalLeads] = useState(0);
  const [assignedLeads, setAssignedLeads] = useState(0);
  const [notAssignedLeads, setNotAssignedLeads] = useState(0);
  const [filteredLeads, setFilteredLeads] = useState(leadsData);
  const [assignStatus, setAssignStatus] = useState("");
  const [filteredFileNames, setFilteredFileNames] = useState([]);
  const recordsToShow =
    recordsPerPage === "all" ? fileData : fileData.slice(0, recordsPerPage);

  useEffect(() => {
    const fetchCreUsers = async () => {
      setLoading(true);
      try {
        const usersResponse = await getRequest("/api/Users");
        console.log("Fetched Users:", usersResponse.data); // Debugging log

        const creUsersList = usersResponse.data.filter(
          (user) => user.roleId === "ad851efd-cd73-43ff-aca5-9f3bc12127b2"
        );

        console.log("Filtered CRE Users:", creUsersList); // Debugging log

        setCreOptions(creUsersList);
      } catch (error) {
        console.error("Error fetching CRE users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreUsers();
  }, [modalVisible]);
  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    // eslint-disable-next-line no-undef
    tooltipTriggerList.forEach((tooltip) => new bootstrap.Tooltip(tooltip));
  }, []);
  const toggleFilterDropdown = (key) => {
    if (key) {
      setTempFilters(filters); // Copy current filters when opening dropdown
    }
    setActiveFilter((prev) => (prev === key ? null : key));
  };

  useEffect(() => {
    let filtered = [...leadsData];
    Object.keys(filters).forEach((column) => {
      if (filters[column].length > 0) {
        filtered = filtered.filter((lead) =>
          filters[column].includes(lead[column])
        );
      }
    });
    setFilteredLeads(filtered);
  }, [filters, leadsData]);

  // const filteredLeads = leads.filter((lead) =>
  //   Object.entries(lead)
  //     .filter(([key]) => !fieldsToHide.includes(key)) // Exclude hidden fields
  //     .some(([_, value]) =>
  //       value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
  //     )
  // );
  useEffect(() => {
    const uniqueValues = {};
    leadsData.forEach((lead) => {
      Object.keys(lead).forEach((key) => {
        if (!uniqueValues[key]) uniqueValues[key] = new Set();
        uniqueValues[key].add(lead[key]);
      });
    });
    Object.keys(uniqueValues).forEach(
      (key) => (uniqueValues[key] = Array.from(uniqueValues[key]))
    );
    setUniqueColumnValues(uniqueValues);
  }, [leadsData]);

  useEffect(() => {
    const filtered = leadsData.filter((lead) =>
      Object.values(lead).some((value) =>
        value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setFilteredLeads(filtered);
  }, [searchQuery, leadsData]);
  // Search within filter dropdown
  const handleFilterSearch = (key, value) => {
    setFilterSearch((prev) => ({ ...prev, [key]: value }));
  };
  // Fetching Excel file data
  const handleFetchFileData = async () => {
    if (!fileName) {
      alert("Please enter a file name.");
      return;
    }

    try {
      const response = await getRequest(
        `/api/Leads/get_leads_by_excelname?excelName=${fileName}`
      );
      console.log(response); // Log the response to inspect its structure

      // Axios automatically parses JSON, so use response.data directly
      const data = response.data;

      setLeadsData(data.leads);
      const totalLeads = data.leads.length;
      const assignedLeads = data.leads.filter((lead) => lead.assigned).length;
      const notAssignedLeads = totalLeads - assignedLeads;

      setTotalLeads(totalLeads);
      setAssignedLeads(assignedLeads);
      setNotAssignedLeads(notAssignedLeads);

      alert("File data fetched successfully!");
    } catch (error) {
      console.error("Error fetching file data:", error);
      alert(`Error: ${error.message}`);
    }

    setShowFileNameModal(false);
  };

  // Apply multi-filter selection
  const handleFilterChange = (column, value) => {
    setTempFilters((prevTempFilters) => {
      const prevSelected = prevTempFilters[column] || [];
      const updatedSelected = prevSelected.includes(value)
        ? prevSelected.filter((item) => item !== value)
        : [...prevSelected, value];

      return { ...prevTempFilters, [column]: updatedSelected };
    });
  };

  const handleStatusFilter = async (status) => {
    setAssignStatus(status); // Update dropdown state

    try {
      // Ensure the correct boolean is passed to the API
      const apiStatus =
        status === "true" ? true : status === "false" ? false : "";

      const response = await getRequest(
        `/api/Leads/filter?assigned=${apiStatus}`
      );
      const data = response.data || [];

      console.log("API Response:", data); // Debugging: Check API response

      setLeadsData(data); // Store full dataset
      setFilteredLeads(data); // Update UI with correct leads
    } catch (error) {
      console.error("Error fetching filtered leads:", error);
    }
  };

  const [newLead, setNewLead] = useState({
    OwnerName: "",
    MobileNo: "",
    DistrictName: "",
    CurrentAddress: "",
    StateName: "",
    Product: "",
    LeadType: "",
    Status: "Not Called", // Default status
    Company: "",
    LeadSource: "",
    leadId: "", // For edit purposes
  });
  const [companies, setCompanies] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const productsResponse = await getRequest("/api/Products");
      setProducts(productsResponse.data);

      const companiesResponse = await getRequest("/api/Companies");
      setCompanies(companiesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchLeadsData = () => {
      setLoading(true);
      getRequest("/api/Leads")
        .then((response) => {
          setLeadsData(response.data || []);
        })
        .catch((error) => {
          console.error("Error fetching leads data:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchLeadsData();
  }, []);

  useEffect(() => {
    setLoading(true);
    getRequest("/api/Leads")
      .then((response) => {
        const data = response.data || [];
        setLeadsData(data);

        // Extract unique file names
        const uniqueFileNames = [
          ...new Set(data.map((lead) => lead.excelName).filter(Boolean)),
        ];
        setFileNames(uniqueFileNames);
        setFilteredFileNames(uniqueFileNames);
      })
      .catch((error) => {
        console.error("Error fetching leads data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setFileName(e.target.value);
    setFilteredFileNames(
      fileNames.filter((name) => name.toLowerCase().includes(searchValue))
    );
  };
  // Empty dependency array to run only once when the component mounts
  const filterFields = (data) => {
    if (!data || typeof data !== "object") return {}; // Prevent null/undefined errors
    const hiddenFields = ["companyId", "leadSource", "excelName", "leadId"];
    return Object.fromEntries(
      Object.entries(data).filter(([key]) => !hiddenFields.includes(key))
    );
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    paginateData(fileData); // Reapply pagination
  };

  const handleFilter = () => {
    setIsFilterVisible((prev) => !prev); // Toggle filter visibility
    // Initialize filters for each field if needed
    if (!filters) {
      const initialFilters = Object.keys(filterFields(leadsData[0])).reduce(
        (acc, key) => ({ ...acc, [key]: [] }),
        {}
      );
      setFilters(initialFilters);
    }
  };

  useEffect(() => {
    const savedData = localStorage.getItem("fileData");
    if (savedData) setFileData(JSON.parse(savedData));
  }, []);

  useEffect(() => {
    if (fileData.length > 0)
      localStorage.setItem("fileData", JSON.stringify(fileData));
  }, [fileData]);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to an array

    if (!files.length) {
      alert("No file selected!");
      return;
    }

    // Validate file type
    const validFile = files.find(
      (file) =>
        file.name.toLowerCase().endsWith(".xls") ||
        file.name.toLowerCase().endsWith(".xlsx")
    );

    if (!validFile) {
      alert("Invalid file type! Please upload an Excel file.");
      return;
    }

    // Store file data
    setFileData([validFile]); // Ensure it's an array
    setFileName(validFile.name);
    setShowModal(true);
  };
  const handleSaveFileName = () => {
    if (!fileData || !Array.isArray(fileData) || fileData.length === 0) {
      alert("No valid file selected!");
      return;
    }

    const selectedFile = fileData[0]; // Extract file from array

    if (!(selectedFile instanceof File)) {
      alert("Invalid file format!");
      return;
    }

    // Check if the file name already exists
    if (fileNames.includes(selectedFile.name)) {
      alert("File already exists!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    postRequest("/api/Leads/upload-excel", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((response) => {
        console.log("File uploaded successfully:", response.data);
        alert("File uploaded successfully!");

        // Update filenames list
        setFileNames((prev) => [...prev, selectedFile.name]);

        // Reset state
        setShowModal(false);
        setFileName("");
        setFileData([]);
      })
      .catch((error) => {
        console.error("Error uploading file:", error.response?.data || error);
        alert(
          `Failed to upload file: ${
            error.response?.data?.message || "Unknown error"
          }`
        );
      });
  };

  const toggleDropdown = (columnName) => {
    setDropdownVisible(dropdownVisible === columnName ? null : columnName);
    setSearchQuery("");
  };
  // const handleFilterChange = (column, value) => {
  //   setFilters((prevFilters) => {
  //     const prevSelected = prevFilters[column] || [];
  //     let updatedSelected;

  //     if (prevSelected.includes(value)) {
  //       updatedSelected = prevSelected.filter((item) => item !== value);
  //     } else {
  //       updatedSelected = [...prevSelected, value];
  //     }

  //     return { ...prevFilters, [column]: updatedSelected };
  //   });
  // };
  const handleCheckboxChange = (leadId) => {
    setSelectedRows((prev) => ({
      ...prev,
      [leadId]: !prev[leadId],
    }));
  };

  const handleSelectAll = () => {
    debugger;
    const checked = !selectAllChecked;
    setSelectAllChecked(checked);

    const newSelection = {};
    if (checked) {
      paginateData().forEach((lead) => (newSelection[lead.leadId] = true));
    }
    setSelectedRows(newSelection);
  };
  const handleSelectAllFilters = (column) => {
    const allValues = uniqueColumnValues[column] || [];
    const newFilters =
      filters[column]?.length === allValues.length ? [] : allValues;

    setTempFilters((prev) => ({
      ...prev,
      [column]: newFilters,
    }));
  };

  const filteredData = leadsData.filter((lead) => {
    return Object.keys(filters).every((column) => {
      if (!filters[column].length) return true; // No filter, return all
      return filters[column].includes(lead[column]);
    });
  });
  const paginateData = () => {
    // Ensure leadsData is an array before using slice
    if (Array.isArray(leadsData) && leadsData.length > 0) {
      const startIndex = (currentPage - 1) * recordsPerPage;
      return leadsData.slice(startIndex, startIndex + recordsPerPage);
    }
    return []; // Return empty array if leadsData is undefined or empty
  };
  const handleRecordsChange = (e) => {
    const value = e.target.value;
    console.log("Selected value:", value); // Debugging the selected value
    if (value === "all") {
      setRecordsPerPage(fileData.length); // Set to all records if "all" is selected
    } else {
      setRecordsPerPage(parseInt(value)); // Convert the value to integer for other options
    }
  };

  const handleSort = (order) => {
    const sortedData = [...fileData].sort((a, b) => {
      const keys = Object.keys(a);
      // Sort based on the first key or adjust as needed
      const key = keys[0];
      if (order === "asc") {
        return a[key].toString().localeCompare(b[key].toString());
      } else {
        return b[key].toString().localeCompare(a[key].toString());
      }
    });
    setFileData(sortedData);
  };
  const handleCustomSort = () => {
    alert("Custom Sort clicked! Implement your custom sort logic here.");
  };
  const handleClear = () => {
    setFilters({});
    setDropdownVisible(null); // Close dropdowns after clearing
    alert("All filters cleared!");
  };
  // Function to reapply filters based on last applied state
  const handleReapply = () => {
    if (Object.keys(filters).length === 0) {
      alert("No filters to reapply!");
      return;
    }
    setFilters({ ...filters }); // Trigger state update to reapply existing filters
    alert("Filters reapplied!");
  };
  const addSortLevel = () => {
    if (sortByColumn) {
      setSortLevels((prev) => [
        ...prev,
        { column: sortByColumn, sortOn, order },
      ]);
    } else {
      alert("Please select a column to sort by.");
    }
  };

  const removeSortLevel = (index) => {
    setSortLevels((prev) => prev.filter((_, i) => i !== index));
  };
  const applySort = () => {
    let sortedData = [...fileData];

    // Apply sorting levels in sequence
    sortLevels.forEach(({ column, order }) => {
      sortedData.sort((a, b) => {
        if (order === "A to Z") {
          return a[column] > b[column] ? 1 : -1;
        } else {
          return a[column] < b[column] ? 1 : -1;
        }
      });
    });
    setFileData(sortedData);
    alert("Sorting applied successfully!");
  };
  const handleApplySort = () => {
    // Apply custom sort logic if needed
    setModalVisible(false); // This ensures the modal's state is updated
  };
  const handleDownload = () => {
    if (filteredData.length === 0) {
      alert("No data available to download!");
      return;
    }
    // Prepare the data for Excel export
    const worksheet = XLSX.utils.json_to_sheet(filteredData); // Convert JSON data to worksheet
    const workbook = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1"); // Append the worksheet

    // Generate Excel file and download it
    XLSX.writeFile(workbook, "FilteredData.xlsx"); // File name
  };
  const handleAssign = async () => {
    if (!selectedCRE) {
      alert("Please select a CRE.");
      return;
    }

    console.log("Selected CRE ID:", selectedCRE);

    const selectedCreUser = creOptions.find(
      (user) => user.userId === selectedCRE
    );

    if (!selectedCreUser) {
      alert("Invalid CRE selected.");
      return;
    }

    const selectedRowIds = Object.keys(selectedRows).filter(
      (key) => selectedRows[key]
    );

    if (selectedRowIds.length === 0) {
      alert("No valid records selected for assignment.");
      return;
    }

    console.log("Selected Row IDs:", selectedRowIds);

    const currentUserId = "141d915d-617b-437a-9ef7-9511fd3646fe";

    try {
      for (const leadId of selectedRowIds) {
        const requestBody = {
          leadID: leadId,
          assignedTo: selectedCreUser.userId,
          assignedBy: currentUserId,
          assignedDate: new Date().toISOString(),
        };

        console.log("Request Payload:", JSON.stringify(requestBody, null, 2));

        const response = await postRequest(
          "/api/LeadAssign/assign",
          requestBody
        );

        if (!response || response.status !== 200) {
          throw new Error(response.data?.message || "Failed to assign CRE");
        }
      }

      // Update UI: Assign the selected CRE to the leads in the table
      const updatedData = fileData.map((row) =>
        selectedRowIds.includes(row.id)
          ? {
              ...row,
              status: "Assigned",
              cre: `${selectedCreUser.firstName} ${
                selectedCreUser.lastName || ""
              }`.trim(),
              creId: selectedCreUser.userId,
            }
          : row
      );

      setFileData(updatedData);
      setSelectedRows({});
      setSelectAllChecked(false);
      setAssignModalVisible(false);
      setSelectedCRE("");

      alert("Selected records have been assigned successfully!");
    } catch (error) {
      console.error("Error assigning CRE:", error);
      alert(`Error: ${error.message}`);
    }
  };

  // const handleModalClose = () => {
  //   setModalVisible(false); // Close modal without assigning
  //   setSelectedCRE(""); // Clear CRE selection
  // };
  const handleNavigateToList = () => {
    navigate("/crm/listleads"); // Navigate to ListLeads component
  };
  const handleInputChange = (e) => {
    setNewLead({ ...newLead, [e.target.name]: e.target.value });
  };
  const handleSave = async () => {
    const leadData = {
      CompanyId: selectedCompany,
      OwnerName: newLead.OwnerName,
      MobileNo: newLead.MobileNo,
      DistrictName: newLead.DistrictName,
      CurrentAddress: newLead.CurrentAddress,
      StateName: newLead.StateName,
      ProductId: selectedProduct, // Assuming this is a product code like 'Truck'
      LeadType: newLead.LeadType,
      Status: newLead.Status,
    };

    try {
      const res = await postRequest("/api/Leads", leadData);

      // Make sure filterFields is iterable before spreading, or set an empty array if undefined
      setFilteredLeads((prevFilteredLeads) => [
        ...(Array.isArray(prevFilteredLeads) ? prevFilteredLeads : []),
        res.data,
      ]);

      // Display success alert
      alert("Lead added successfully!");

      // Log the lead details in the console
      console.log("Lead Details:", res.data);

      setModalVisible(false);
      resetLeadForm();
    } catch (error) {
      console.error("Error saving lead:", error.message);
      alert("Error occurred: " + error.message);
    }
  };

  const resetLeadForm = () => {
    setNewLead({
      OwnerName: "",
      MobileNo: "",
      DistrictName: "",
      CurrentAddress: "",
      StateName: "",
      LeadSource: "",
      LeadType: "",
      Product: "",
      Company: "",
      Status: "Not Called",
    });
    setSelectedProduct("");
    setSelectedCompany("");
  };
  const toggleSelectAll = (column) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [column]:
        prevFilters[column]?.length === uniqueColumnValues[column].length
          ? []
          : [...uniqueColumnValues[column]],
    }));
  };
  const sortColumn = (key, order) => {
    const sortedData = [...filteredLeads].sort((a, b) => {
      if (order === "asc") return a[key] > b[key] ? 1 : -1;
      return a[key] < b[key] ? 1 : -1;
    });
    setFilteredLeads(sortedData);
  };
  const applyFilters = () => {
    let newFilteredLeads = leadsData.filter((lead) => {
      return Object.keys(filters).every((key) => {
        return filters[key].length === 0 || filters[key].includes(lead[key]);
      });
    });
    setFilteredLeads(newFilteredLeads);
    setActiveFilter(null);
  };
  const handleRecordsChangedrop = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "all") {
      setRecordsPerPage("all"); // Ensure it stays as "all" instead of using fileData.length
    } else {
      setRecordsPerPage(Number(selectedValue)); // Set selected records per page
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="card-body">
          <h5 className="card-title text-left mb-1" style={{ fontSize: 25 }}>
            Export Excel
          </h5>

          <div className="d-flex mb-3 align-items-center w-100">
            <div className="d-flex me-3">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select
                className="form-select"
                onChange={handleRecordsChangedrop}
                value={
                  recordsPerPage === fileData.length ? "all" : recordsPerPage
                }
              >
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="150">150</option>
                <option value="200">200</option>
                <option value="250">250</option>
                <option value="all">All</option>
              </select>
            </div>
            <div className="dropdown">
              <button
                className="btn btn-outline-primary dropdown-toggle"
                type="button"
                id="filterSortDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Filter and Sort
              </button>
              <ul
                className="dropdown-menu"
                aria-labelledby="filterSortDropdown"
                style={{ minWidth: "200px" }}
              >
                <li>
                  <button
                    className="dropdown-item d-flex align-items-center"
                    onClick={() => handleSort("asc")}
                  >
                    <i className="bi bi-sort-alpha-down me-2"></i> Sort A to Z
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item d-flex align-items-center"
                    onClick={() => handleSort("desc")}
                  >
                    <i className="bi bi-sort-alpha-down-alt me-2"></i> Sort Z to
                    A
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item d-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#customSortModal"
                  >
                    <i className="bi bi-layout-text-sidebar-reverse me-2"></i>{" "}
                    Custom Sort
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item d-flex align-items-center"
                    onClick={handleFilter}
                  >
                    <i className="bi bi-funnel me-2"></i> Filter
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item d-flex align-items-center"
                    onClick={handleClear}
                  >
                    <i className="bi bi-x-circle me-2"></i> Clear
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item d-flex align-items-center"
                    onClick={handleReapply}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i> Reapply
                  </button>
                </li>
              </ul>
            </div>

            <div className="d-flex " style={{ marginLeft: "auto" }}>
              <button
                onClick={() => setLeadModalVisible(true)}
                className="btn btn-outline-success me-2"
              >
                Add New Lead
              </button>
              <button
                className="btn btn-outline-info me-2"
                onClick={() => setShowFileNameModal(true)}
              >
                Search File
              </button>
              {/* <button
                className="btn btn-outline-primary me-2"
                // onClick={handleTemplateDownload}
              >
                Download Template
              </button> */}

              <button
                className="btn btn-outline-success me-2"
                onClick={() => setAssignModalVisible(true)}
                disabled={selectedRows.length === 0}
              >
                Assign to
              </button>
              {/* <button
                className="btn btn-outline-info me-2"
                // onClick={saveDataToServer}
              >
                Save to Server
              </button> */}
              <button
                className="btn btn-outline-secondary"
                onClick={handleNavigateToList}
              >
                List
              </button>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <h5 className="card-title">Excel Table</h5>
                <div className="d-flex justify-content-end align-items-start mt-3">
                  <div className="mb-3 me-3">
                    <select
                      id="assignStatus"
                      className="form-select"
                      value={assignStatus}
                      onChange={(e) => handleStatusFilter(e.target.value)}
                    >
                      <option value="false">Not Assigned</option>
                      <option value="true">Assigned</option>
                    </select>
                  </div>

                  {/* Download Icon with Tooltip */}
                  <i
                    className="bi bi-file-earmark-arrow-down me-2"
                    style={{
                      cursor: "pointer",
                      color: "green",
                      fontSize: "1.5rem",
                    }}
                    onClick={handleDownload}
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Download File"
                  ></i>

                  {/* Upload Icon with Tooltip */}
                  <i
                    className="bi bi-file-earmark-arrow-up"
                    style={{
                      cursor: "pointer",
                      color: "blue",
                      fontSize: "1.5rem",
                    }}
                    onClick={() =>
                      document.getElementById("fileUploadInput").click()
                    }
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Upload File"
                  ></i>

                  <input
                    id="fileUploadInput"
                    type="file"
                    accept=".xls,.xlsx"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                  />
                </div>
              </div>

              <div className="table-container">
                {/* Pagination Top */}
                <div className="pagination justify-content-left mb-0">
                  <ul className="pagination">
                    {/* Previous Group Button */}
                    <li className="page-item">
                      <button
                        className={`page-link ${
                          currentPage <= 10 ? "disabled" : ""
                        }`}
                        onClick={() => handlePageChange(currentPage - 10)}
                        disabled={currentPage <= 10}
                      >
                        Previous
                      </button>
                    </li>

                    {/* Page Number Buttons */}
                    {Array.from({
                      length: Math.min(
                        10,
                        Math.ceil(leadsData.length / recordsPerPage) -
                          Math.floor((currentPage - 1) / 10) * 10
                      ),
                    }).map((_, index) => {
                      const page =
                        Math.floor((currentPage - 1) / 10) * 10 + index + 1;
                      if (
                        page <= Math.ceil(leadsData.length / recordsPerPage)
                      ) {
                        return (
                          <li className="page-item" key={index}>
                            <button
                              className={`page-link ${
                                currentPage === page ? "disabled" : ""
                              }`}
                              onClick={() => handlePageChange(page)}
                              disabled={currentPage === page}
                            >
                              {page}
                            </button>
                          </li>
                        );
                      }
                      return null;
                    })}

                    {/* Next Group Button */}
                    <li className="page-item">
                      <button
                        className={`page-link ${
                          currentPage >=
                          Math.ceil(leadsData.length / recordsPerPage) - 10
                            ? "disabled"
                            : ""
                        }`}
                        onClick={() => handlePageChange(currentPage + 10)}
                        disabled={
                          currentPage >=
                          Math.ceil(leadsData.length / recordsPerPage) - 10
                        }
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Table */}
                <div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
                  <table className="table table-bordered text-left">
                    <thead>
                      <tr>
                        {/* Select All Checkbox */}
                        <th
                          style={{
                            width: "50px",
                            textAlign: "center",
                            borderRight: "1px solid #ddd",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={
                              Object.keys(selectedRows).length ===
                                filteredLeads.length && filteredLeads.length > 0
                            }
                            onChange={handleSelectAll}
                          />
                        </th>

                        {/* Serial Number Column */}
                        <th>SR. No.</th>

                        {/* Dynamic Columns */}
                        {Object.keys(filteredLeads[0] || {})
                          .filter((key) => !fieldsToHide.includes(key))
                          .map((key) => (
                            <th key={key} className="position-relative">
                              <div className="d-flex align-items-center">
                                {key}
                                <button
                                  className={`btn btn-sm ms-2 ${
                                    filters[key]?.length
                                      ? "btn-primary"
                                      : "btn-outline-secondary"
                                  }`}
                                  style={{
                                    padding: "2px 5px",
                                    borderRadius: "5px",
                                  }}
                                  onClick={() => toggleFilterDropdown(key)}
                                >
                                  <i className="bi bi-funnel"></i>
                                </button>
                              </div>

                              {/* Filter Dropdown */}
                              {activeFilter === key && (
                                <div
                                  className="position-absolute border shadow p-2"
                                  style={{
                                    width: "250px",
                                    zIndex: 1000,
                                    top: "100%",
                                    left: "0",
                                    backgroundColor: "#ecf2fd",
                                    borderRadius: "5px",
                                  }}
                                >
                                  <div className="d-flex justify-content-between align-items-center">
                                    <span>Filter Options</span>
                                    <FaTimes
                                      onClick={() => toggleFilterDropdown(null)}
                                      style={{ cursor: "pointer" }}
                                    />
                                  </div>

                                  <div className="d-grid gap-1 mt-2">
                                    <button
                                      className="btn btn-light btn-sm w-100 text-start"
                                      onClick={() => sortColumn(key, "asc")}
                                    >
                                      <FaSortAlphaDown /> Sort A to Z
                                    </button>
                                    <button
                                      className="btn btn-light btn-sm w-100 text-start"
                                      onClick={() => sortColumn(key, "desc")}
                                    >
                                      <FaSortAlphaUp /> Sort Z to A
                                    </button>
                                  </div>

                                  <hr className="my-2" />

                                  <div className="input-group mb-2">
                                    <span className="input-group-text">
                                      <FaSearch />
                                    </span>
                                    <input
                                      type="text"
                                      placeholder="Search..."
                                      value={filterSearch[key] || ""}
                                      onChange={(e) =>
                                        handleFilterSearch(key, e.target.value)
                                      }
                                      className="form-control"
                                    />
                                  </div>

                                  <div
                                    className="overflow-auto border rounded p-2"
                                    style={{ maxHeight: "150px" }}
                                  >
                                    {/* Select All in Filter */}
                                    <div className="form-check">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={
                                          filters[key]?.length ===
                                          uniqueColumnValues[key]?.length
                                        }
                                        onChange={() =>
                                          handleSelectAllFilters(key)
                                        }
                                      />
                                      <label className="form-check-label">
                                        (Select All)
                                      </label>
                                    </div>

                                    {uniqueColumnValues[key]
                                      ?.filter((value) =>
                                        value
                                          ?.toString()
                                          .toLowerCase()
                                          .includes(
                                            filterSearch[key]?.toLowerCase() ||
                                              ""
                                          )
                                      )
                                      .map((value) => (
                                        <div
                                          key={`${key}-${value}`}
                                          className="form-check"
                                        >
                                          <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={
                                              filters[key]?.includes(value) ||
                                              false
                                            }
                                            onChange={() =>
                                              handleFilterChange(key, value)
                                            }
                                          />
                                          <label
                                            className="form-check-label"
                                            style={{ fontWeight: "normal" }}
                                          >
                                            {value}
                                          </label>
                                        </div>
                                      ))}
                                  </div>

                                  <div className="d-flex justify-content-end mt-2">
                                    <button
                                      className="btn btn-primary btn-sm me-2"
                                      onClick={() => {
                                        setFilters(tempFilters);
                                        toggleFilterDropdown(null);
                                      }}
                                    >
                                      OK
                                    </button>
                                    <button
                                      className="btn btn-secondary btn-sm"
                                      onClick={() => toggleFilterDropdown(null)}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              )}
                            </th>
                          ))}
                      </tr>
                    </thead>

                    <tbody>
                      {(recordsPerPage === "all"
                        ? filteredLeads
                        : filteredLeads.slice(
                            (currentPage - 1) * recordsPerPage,
                            currentPage * recordsPerPage
                          )
                      ).map((lead, index) => (
                        <tr key={lead.leadId}>
                          {/* Individual Checkboxes */}
                          <td
                            style={{
                              textAlign: "center",
                              borderRight: "1px solid #ddd",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={!!selectedRows[lead.leadId]}
                              onChange={() => handleCheckboxChange(lead.leadId)}
                            />
                          </td>

                          {/* Serial Number */}
                          <td>
                            {recordsPerPage === "all"
                              ? index + 1
                              : (currentPage - 1) * recordsPerPage + index + 1}
                          </td>

                          {/* Data Cells */}
                          {Object.entries(lead)
                            .filter(([key]) => !fieldsToHide.includes(key))
                            .map(([key, value]) => (
                              <td key={key}>{value}</td>
                            ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Bottom */}
                <div className="pagination justify-content-left mb-0">
                  <ul className="pagination">
                    {/* Previous Group Button */}
                    <li className="page-item">
                      <button
                        className={`page-link ${
                          currentPage <= 10 ? "disabled" : ""
                        }`}
                        onClick={() => handlePageChange(currentPage - 10)}
                        disabled={currentPage <= 10}
                      >
                        Previous
                      </button>
                    </li>

                    {/* Page Number Buttons */}
                    {Array.from({
                      length: Math.min(
                        10,
                        Math.ceil(leadsData.length / recordsPerPage) -
                          Math.floor((currentPage - 1) / 10) * 10
                      ),
                    }).map((_, index) => {
                      const page =
                        Math.floor((currentPage - 1) / 10) * 10 + index + 1;
                      if (
                        page <= Math.ceil(leadsData.length / recordsPerPage)
                      ) {
                        return (
                          <li className="page-item" key={index}>
                            <button
                              className={`page-link ${
                                currentPage === page ? "disabled" : ""
                              }`}
                              onClick={() => handlePageChange(page)}
                              disabled={currentPage === page}
                            >
                              {page}
                            </button>
                          </li>
                        );
                      }
                      return null;
                    })}

                    {/* Next Group Button */}
                    <li className="page-item">
                      <button
                        className={`page-link ${
                          currentPage >=
                          Math.ceil(leadsData.length / recordsPerPage) - 10
                            ? "disabled"
                            : ""
                        }`}
                        onClick={() => handlePageChange(currentPage + 10)}
                        disabled={
                          currentPage >=
                          Math.ceil(leadsData.length / recordsPerPage) - 10
                        }
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              <p>
                Selected Records:{" "}
                {Object.values(selectedRows).filter(Boolean).length}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="customSortModal"
        tabIndex="-1"
        aria-labelledby="customSortModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="customSortModalLabel">
                Custom Sort
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="row mb-3">
                <div className="col-md-4">
                  <label htmlFor="sortByColumn" className="form-label">
                    Sort By
                  </label>
                  <select
                    className="form-select"
                    id="sortByColumn"
                    onChange={(e) => setSortByColumn(e.target.value)}
                  >
                    {fileData.length > 0 &&
                      Object.keys(fileData[0]).map((column, index) => (
                        <option key={index} value={column}>
                          {column}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label htmlFor="sortOn" className="form-label">
                    Sort On
                  </label>
                  <select
                    className="form-select"
                    id="sortOn"
                    onChange={(e) => setSortOn(e.target.value)}
                  >
                    <option value="Cell Values">Cell Values</option>
                    <option value="Font Color">Font Color</option>
                    <option value="Cell Color">Cell Color</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label htmlFor="order" className="form-label">
                    Order
                  </label>
                  <select
                    className="form-select"
                    id="order"
                    onChange={(e) => setOrder(e.target.value)}
                  >
                    <option value="A to Z">A to Z</option>
                    <option value="Z to A">Z to A</option>
                  </select>
                </div>
              </div>
              <button className="btn btn-primary" onClick={addSortLevel}>
                Add Level
              </button>
              <div className="mt-3">
                <h6>Sort Levels:</h6>
                <ul className="list-group">
                  {sortLevels.map((level, index) => (
                    <li
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {`Column: ${level.column}, Sort On: ${level.sortOn}, Order: ${level.order}`}
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => removeSortLevel(index)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleApplySort}
                data-bs-dismiss="modal"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
      {assignModalVisible && (
        <div
          className="modal show"
          style={{
            display: "block",
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1050,
          }}
          onClick={() => setAssignModalVisible(false)}
        >
          <div
            className="modal-dialog"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              maxWidth: "600px",
            }}
            onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside the modal
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Assign to CRE</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setAssignModalVisible(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="creSelect" className="form-label">
                    Select CRE:
                  </label>
                  <select
                    id="creSelect"
                    className="form-select"
                    value={selectedCRE}
                    onChange={(e) => setSelectedCRE(e.target.value)}
                  >
                    {creOptions.map((cre) => (
                      <option key={cre.userId} value={cre.userId}>
                        {cre.firstName ? cre.firstName : "Unknown"}{" "}
                        {cre.lastName ? cre.lastName : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setAssignModalVisible(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAssign}
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* <input type="file" onChange={handleFileUpload} /> */}

      {/* Modal for File Name */}
      {showModal && (
        <div
          className="modal fade show"
          tabIndex="-1"
          role="dialog"
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black background
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Enter File Name</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowModal(false)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "10px",
                    background: "none",
                    border: "none",
                    fontSize: "20px",
                    cursor: "pointer",
                  }}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="Enter file name"
                  className="form-control"
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveFileName}
                >
                  Save File Name
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {leadModalVisible && (
        <div
          className="modal show"
          style={{
            display: "block",
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1050,
            overflowY: "auto",
          }}
          onClick={() => setLeadModalVisible(false)}
        >
          <div
            className="modal-dialog"
            style={{
              position: "fixed", // Fixed positioning
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              maxWidth: "600px",
              minHeight: "600px", // Optional for a minimum height
            }}
            onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {newLead.leadId ? "Edit Lead" : "Add New Lead"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setLeadModalVisible(false)}
                ></button>
              </div>
              <div
                className="modal-body"
                style={{
                  maxHeight: "400px", // Set a max height to allow scrolling
                  overflowY: "auto", // Enable vertical scrollbar
                }}
              >
                <form>
                  {/* <div className="mb-3">
                    <label htmlFor="CompanyId" className="form-label">
                      Company ID
                    </label>
                    <select
                      id="Company"
                      className="form-select"
                      value={selectedCompany}
                      onChange={(e) => setSelectedCompany(e.target.value)}
                    >
                      <option value="">Select Company</option>
                      {companies.map((company) => (
                        <option
                          key={company.companyId}
                          value={company.companyId}
                        >
                          {company.name}
                        </option>
                      ))}
                    </select>
                  </div> */}

                  <div className="mb-3">
                    <label htmlFor="OwnerName" className="form-label">
                      Owner Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="OwnerName"
                      name="OwnerName"
                      value={newLead.OwnerName}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="MobileNo" className="form-label">
                      Mobile No
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="MobileNo"
                      name="MobileNo"
                      value={newLead.MobileNo}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="CurrentAddress" className="form-label">
                      Current Address
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="CurrentAddress"
                      name="CurrentAddress"
                      value={newLead.CurrentAddress}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="StateName" className="form-label">
                      State Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="StateName"
                      name="StateName"
                      value={newLead.StateName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="DistrictName" className="form-label">
                      District Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="DistrictName"
                      name="DistrictName"
                      value={newLead.DistrictName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="ProductId" className="form-label">
                      Product
                    </label>
                    <select
                      id="Product"
                      className="form-select"
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                    >
                      <option value="">Select Product</option>
                      {products.map((product) => (
                        <option
                          key={product.productId}
                          value={product.productId}
                        >
                          {product.productName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="LeadType" className="form-label">
                      Lead Type
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="LeadType"
                      name="LeadType"
                      value={newLead.LeadType}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="Status" className="form-label">
                      Status
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="Status"
                      name="Status"
                      value={newLead.Status}
                      onChange={handleInputChange}
                    />
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSave}
                  >
                    {newLead.leadId ? "Update Lead" : "Add Lead"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* {/ Modal for Excel File Search /} */}
      {showFileNameModal && (
        <div
          className="modal fade show"
          tabIndex="-1"
          role="dialog"
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Enter File Name</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowFileNameModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {/* Searchable Dropdown for File Name */}
                <div className="mb-3 position-relative">
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="Search file name..."
                    className="form-control"
                  />
                  {filteredFileNames.length > 0 && (
                    <ul
                      className="dropdown-menu show"
                      style={{ width: "100%" }}
                    >
                      {filteredFileNames.map((name, index) => (
                        <li
                          key={index}
                          className="dropdown-item"
                          onClick={() => setFileName(name)}
                        >
                          {name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Partition for lead details */}
                <div className="border rounded p-3">
                  <p className="mb-1">
                    <strong>Total Leads:</strong> {totalLeads}
                  </p>
                  <hr className="my-2" />
                  <p className="mb-1">
                    <strong>Assigned Leads:</strong> {assignedLeads}
                  </p>
                  <hr className="my-2" />
                  <p>
                    <strong>Not Assigned Leads:</strong> {notAssignedLeads}
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowFileNameModal(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleFetchFileData}
                >
                  Okay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ul>
        {fileNames.map((name, index) => (
          <li key={index}>{name}</li>
        ))}
      </ul>
      <p>Total Leads: {totalLeads}</p>
      <p>Assigned Leads: {assignedLeads}</p>
      <p>Not Assigned Leads: {notAssignedLeads}</p>
    </div>
  );
}
