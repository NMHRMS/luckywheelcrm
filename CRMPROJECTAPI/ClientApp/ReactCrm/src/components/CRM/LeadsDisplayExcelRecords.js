import React, { useState, useEffect } from "react";
import { Table, Select, Pagination } from "antd";
import { useParams } from "react-router-dom";
import { getRequest } from "../utils/Api";

const { Option } = Select;

const LeadsDisplayExcelRecords = () => {
  const { excelName } = useParams();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({});
  const [sortColumn, setSortColumn] = useState(null); 
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 50;

  // Fetch leads data
  useEffect(() => {
    getRequest(`/api/Leads/get_leads_by_excelname?excelName=${excelName}`)
      .then((response) => {
        setLeads(response.data.leads || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching leads:", error);
        setError("Failed to load leads.");
        setLoading(false);
      });
  }, [excelName]);

  // Handle sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  // // Handle filter changes
  // const handleFilterChange = (value, column) => {
  //   setFilters({
  //     ...filters,
  //     [column]: value,
  //   });
  // };

  // // Reset filters
  // const handleResetFilters = () => {
  //   setFilters({});
  // };

  // Filtering logic
  const filteredLeads = leads.filter((lead) => {
    return Object.keys(filters).every((key) => {
      if (filters[key] && filters[key].length > 0) {
        return filters[key].includes(lead[key]);
      }
      return true;
    });
  });

  // Sorting logic
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (sortColumn) {
      const valA = a[sortColumn] || "";
      const valB = b[sortColumn] || "";
      return sortOrder === "asc" ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    }
    return 0;
  });

  // Pagination logic
  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = sortedLeads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(sortedLeads.length / leadsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Ant Design Table columns configuration
  const columns = [
    
    {
      title: "Owner Name",
      dataIndex: "ownerName",
      sorter: (a, b) => a.ownerName.localeCompare(b.ownerName),
      filters: [...new Set(leads.map((lead) => ({ text: lead.ownerName, value: lead.ownerName })))],
      onFilter: (value, record) => record.ownerName === value,
      filterSearch: true,
      filterMode: "tree",
    },
    {
      title: "Mobile No",
      dataIndex: "mobileNo",
      sorter: (a, b) => a.mobileNo.localeCompare(b.mobileNo),
      filters: [...new Set(leads.map((lead) => ({ text: lead.mobileNo, value: lead.mobileNo })))],
      onFilter: (value, record) => record.mobileNo === value,
      filterSearch: true,
      filterMode: "tree",
    },

    {
      title: "District",
      dataIndex: "districtName",
      sorter: (a, b) => a.districtName.localeCompare(b.districtName),
      filters: [...new Set(leads.map((lead) => ({ text: lead.districtName, value: lead.districtName })))],
      onFilter: (value, record) => record.districtName === value,
      filterSearch: true,
      filterMode: "tree",
    },
    {
      title: "State",
      dataIndex: "stateName",
      sorter: (a, b) => a.stateName.localeCompare(b.stateName),
      filters: [...new Set(leads.map((lead) => ({ text: lead.stateName, value: lead.stateName })))],
      onFilter: (value, record) => record.stateName === value,
      filterSearch: true,
      filterMode: "tree",
    },
    {
      title: "Registration No",
      dataIndex: "registrationNo",
      sorter: (a, b) => a.registrationNo.localeCompare(b.registrationNo),
      filters: [...new Set(leads.map((lead) => ({ text: lead.registrationNo, value: lead.registrationNo })))],
      onFilter: (value, record) => record.registrationNo === value,
      filterSearch: true,
      filterMode: "tree",
    },
   
    {
      title: "Model Name",
      dataIndex: "modelName",
      sorter: (a, b) => a.modelName.localeCompare(b.modelName),
      filters: [...new Set(leads.map((lead) => ({ text: lead.modelName, value: lead.modelName })))],
      onFilter: (value, record) => record.modelName === value,
      filterSearch: true,
      filterMode: "tree",
    },
    

   
    {
      title: "Status",
      dataIndex: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      filters: [...new Set(leads.map((lead) => ({ text: lead.status, value: lead.status })))],
      onFilter: (value, record) => record.status === value,
      filterSearch: true,
      filterMode: "tree",
    }

  ];

  return (
    <div className="container mt-4">
      <h2 className="mb-3 text-left">Leads from: {excelName}</h2>
      {loading ? (
        <p>Loading leads...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : leads.length === 0 ? (
        <p>No leads found.</p>
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={currentLeads}
            rowKey="srNo"
            pagination={false}
            loading={loading}
            onChange={handleSort}
            bordered
            size="middle"
            scroll={{ x: "max-content" }}
          />

          {/* Pagination Controls */}
          <div className="pagination-container" style={{ textAlign: "center", marginTop: "20px" }}>
      <Pagination
        current={currentPage}
        total={totalPages * 10} // AntD uses total items, so multiply by page size if needed
        pageSize={10}
        onChange={handlePageChange}
        showSizeChanger={false}
      />
    </div>
        </>
      )}
    </div>
  );
};

export default LeadsDisplayExcelRecords;
