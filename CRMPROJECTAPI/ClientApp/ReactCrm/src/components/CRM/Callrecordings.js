"use client"

import { useEffect, useState } from "react"
import { Table, Select, DatePicker, Spin, Modal, Button, Radio, Checkbox } from "antd"
import { getRequest } from "../utils/Api"
import { responsiveArray } from "antd/es/_util/responsiveObserver"

function CallRecordings() {
    const [selectedDate, setSelectedDate] = useState(null)
  const [recordings, setRecordings] = useState([])
  const [users, setUsers] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([])
   const [selectAll, setSelectAll] = useState(false)
   const [daterange, setDaterange] = useState([])
     const [loading, setLoading] = useState(false)
     const [error, setError] = useState(null)
     const [selectDropdownOpen, setSelectDropdownOpen] = useState(false);
     const { RangePicker } = DatePicker
const { Option } = Select

    const fetchAssignments = async () => {
      try {
        const response = await getRequest("/api/UserAssignmentMapping/assignees")
        console.log("Assignments Response:", response.data)
  
        setUsers(
          response.data.map((item) => ({
            ...item,
            key: item.assigneeId,
          })),
        )
      } catch (error) {
        console.error("Error fetching assignments:", error)
      }
    }
    const isFormValid = () => {
        return (
          (selectedUsers.length > 0 && !selectedDate && !(daterange.length === 2 && daterange[0] && daterange[1])) ||
          selectedDate ||
          (daterange.length === 2 && daterange[0] && daterange[1])
        )
      }

      const onRangeChange = (dates, dateStrings) => {
        if (!dates || dates.length === 0) {
          setDaterange([]) // Pass null if nothing selected
        } else {
          setDaterange(dateStrings)
        }
      }
    
      const onDateChange = (selectedDate, dateString) => {
        setSelectedDate(dateString || null) // Pass null if not selected
      }

      // Handle user selection with "Select All" option
  const handleUserChange = (value) => {
    if (value.includes("all")) {
      setSelectAll(true)
      const allUserIds = users.map((user) => user.assigneeId)
      setSelectedUsers(allUserIds)
    } else {
      setSelectAll(false)
      setSelectedUsers(value)
    }
  }

  const submitdata = async () => {
      if (!isFormValid()) {
        alert("Please select at least one user and a valid date range or date.")
        return
      }
  
      setLoading(true)
      setError("")
  
    //   try {
    //     // Correctly construct userIds query parameters
    //     const userIdParams = selectedUsers.map((id) => `userIds=${id}`).join("&")
    //     const startDateParam = daterange.length === 2 ? `&startDate=${daterange[0]}` : ""
    //     const endDateParam = daterange.length === 2 ? `&endDate=${daterange[1]}` : ""
    //     const dateParam = selectedDate ? `&date=${selectedDate}` : ""
  
    //     // Build final API URL correctly
    //     const apiUrl = `/api/Leads/user-report?${userIdParams}${startDateParam}${endDateParam}${dateParam}`
  
    //     console.log("API URL:", apiUrl) // Debugging
  
    //     const response = await getRequest(apiUrl)
    //     console.log("API Response:", response.data)
    //     setReportDataList(response.data)
    //   } catch (error) {
    //     console.error("Data fetch error:", error)
    //     setError("Failed to load data. Please try again.")
    //   } finally {
    //     setLoading(false)
    //   }
    }

  // Handle select all checkbox
  useEffect(() => {
    if (selectAll) {
      const allUserIds = users.map((user) => user.assigneeId)
      setSelectedUsers(allUserIds)
    }
  }, [selectAll, users])

    useEffect(()=>{
        fetchAssignments()
    },[])

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const response = await getRequest("/api/CallRecords/GetAllCallRecords")
        console.log("API Response:", response.data)
        setRecordings(response.data)
      } catch (error) {
        console.error("Error fetching recordings:", error)
      }
    }
    fetchRecordings()
  }, [])

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mobile No",
      dataIndex: "mobileNo",
      key: "mobileNo",
    },
    {
      title: "Call Type",
      dataIndex: "callType",
      key: "callType",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Recording",
      dataIndex: "recordings",
      key: "recordings",
      render: (recording) => {
        // Extract just the filename from the path
        const filename = recording.split("/").pop()

        // Construct the correct URL to the audio file
        // Remove /wwwroot from the URL path since it's likely part of the server's file system path
        // but not part of the URL path
        const audioUrl = `https://dotnetcrm-001-site1.otempurl.com/recordings/${filename}`

        return (
          <audio controls>
            <source
              src={audioUrl}
              type={
                filename.endsWith(".mp3") ? "audio/mpeg" : filename.endsWith(".wav") ? "audio/wav" : filename.endsWith(".m4a") ? "audio/aac" : "audio/mpeg"
              }
            />
            Your browser does not support the audio element.
          </audio>
        )
      },
    },
  ]

  return (
    <div className="container-fluid p-4 bg-light position-relative">
 
      <h2>Call Recordings</h2>
       <div className="row mb-4">
              <div className="col-md-3">
                <h6 className="">Daily Report Dashboard</h6>
              </div>
              <div className="col-md-9 d-flex justify-content-md-end align-items-center gap-2">
              <Select
  mode="multiple"
  maxTagCount="responsive"
  showSearch
  style={{ width: 300 }}
  placeholder="Select Users"
  optionFilterProp="label"
  value={selectedUsers}
  open={selectDropdownOpen}  // Control dropdown visibility
  onDropdownVisibleChange={(open) => setSelectDropdownOpen(open)} // Toggle open state
  onChange={handleUserChange}
  dropdownRender={(menu) => (
    <div>
      <div style={{ padding: "8px", borderBottom: "1px solid #e8e8e8" }}>
        <Checkbox
          checked={selectAll}
          onChange={(e) => {
            setSelectAll(e.target.checked);
            if (e.target.checked) {
              const allUserIds = users.map((user) => user.assigneeId);
              setSelectedUsers(allUserIds);
            } else {
              setSelectedUsers([]);
            }
          }}
        >
          Select All
        </Checkbox>
      </div>
      {menu}
    </div>
  )}
>
  {users.length > 0 &&
    users.map((user) => (
      <Option key={user.assigneeId} value={user.assigneeId} label={user.assigneeName}>
        <Checkbox
          checked={selectedUsers.includes(user.assigneeId)}
          onChange={(e) => {
            const updatedUsers = e.target.checked
              ? [...selectedUsers, user.assigneeId]
              : selectedUsers.filter((id) => id !== user.assigneeId);
            setSelectedUsers(updatedUsers);
          }}
        >
          {user.assigneeName}
        </Checkbox>
      </Option>
    ))}
</Select>

      
                <div>
                  <RangePicker onChange={onRangeChange} />
                </div>
                <div>
                  <DatePicker onChange={onDateChange} placeholder="Select Date" />
                </div>
                <button
                  className="btn btn-outline-secondary d-flex align-items-center"
                  onClick={submitdata}
                  disabled={!isFormValid() || loading}
                >
                  {loading ? (
                    <>
                      <Spin size="small" style={{ marginRight: "8px" }} /> Loading...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-arrow-right me-1"></i> Submit
                    </>
                  )}
                </button>
             
              </div>
            </div>
      <Table dataSource={recordings} columns={columns} rowKey="recordId" />
    </div>
  )
}

export default CallRecordings

