import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Tooltip } from "antd";
export default function SidebarCRM() {
  const location = useLocation();

  return (
    <aside id="sidebar" className="sidebar">
      <ul className="sidebar-nav" id="sidebar-nav">
        <li className="nav-item">
          <Tooltip title="Dashboard" placement="right" color="#1e2775">
            <Link
              to="/crm/dashboard"
              className={`nav-link ${
                location.pathname === "/crm/dashboard" ? "active" : ""
              } collapsed`}
            >
              <i className="bi bi-speedometer2"></i>
              <span>DashboardCRM</span>
            </Link>
          </Tooltip>
        </li>

        <li className="nav-item">
          <Tooltip title="Upload Excel" placement="right" color="#1e2775">
            <Link
              to="/crm/leads"
              className={`nav-link ${
                location.pathname === "/crm/leads" ? "active" : ""
              } collapsed`}
            >
              <i className="bi bi-upload"></i>
              <span>Upload Excel</span>
            </Link>
          </Tooltip>
        </li>

        <li className="nav-item">
          <Tooltip title="Excel List" placement="right" color="#1e2775">
            <Link
              to="/crm/listleads"
              className={`nav-link ${
                location.pathname === "/crm/listleads" ? "active" : ""
              } collapsed`}
            >
              <i className="bi bi-file-earmark-spreadsheet"></i>
              <span>Excel List</span>
            </Link>
          </Tooltip>
        </li>

        <li className="nav-item">
          <Tooltip title="All Leads" placement="right" color="#1e2775">
            <Link
              to="/crm/allleads"
              className={`nav-link ${
                location.pathname === "/crm/allleads" ? "active" : ""
              } collapsed`}
            >
              <i className="bi bi-people"></i>
              <span>All Leads</span>
            </Link>
          </Tooltip>
        </li>

        <li className="nav-item">
          <Tooltip title="Track Leads" placement="right" color="#1e2775">
            <Link
              to="/crm/assignedleads"
              className={`nav-link ${
                location.pathname === "/crm/assignedleads" ? "active" : ""
              } collapsed`}
            >
              <i className="bi bi-search"></i>
              <span>Track Leads</span>
            </Link>
          </Tooltip>
        </li>

        <li className="nav-item">
          <Tooltip title="User Performance" placement="right" color="#1e2775">
            <Link
              to="/crm/performance"
              className={`nav-link ${
                location.pathname === "/crm/performance" ? "active" : ""
              } collapsed`}
            >
              <i className="bi bi-bar-chart-line"></i>
              <span>User Performance</span>
            </Link>
          </Tooltip>
        </li>

        <li className="nav-item">
          <Tooltip title="Reverted Leads" placement="right" color="#1e2775">
            <Link
              to="/crm/revertleads"
              className={`nav-link ${
                location.pathname === "/crm/revertleads" ? "active" : ""
              } collapsed`}
            >
              <i className="bi bi-x-circle"></i>
              <span>Reverted Leads</span>
            </Link>
          </Tooltip>
        </li>

        <li className="nav-item">
          <Tooltip title="Reports" placement="right" color="#1e2775">
            <a
              className="nav-link collapsed"
              data-bs-target="#icons-nav"
              data-bs-toggle="collapse"
              href="#"
            >
              <i className="bi bi-clipboard-data"></i>
              <span>Reports</span>
              <i className="bi bi-chevron-down ms-auto"></i>
            </a>
          </Tooltip>
          <ul
            id="icons-nav"
            className="nav-content collapse"
            data-bs-parent="#sidebar-nav"
          >
            <li>
              <Tooltip
                title="Employee Report"
                placement="right"
                color="#1e2775"
              >
                <Link
                  to="/crm/dailyreport"
                  className={
                    location.pathname === "/crm/dailyreport" ? "active" : ""
                  }
                >
                  <i className="bi bi-person-lines-fill"></i>
                  <span>Employee Report</span>
                </Link>
              </Tooltip>
            </li>
          </ul>
        </li>

        <li className="nav-item">
          <Tooltip title="Vehicle Check-In" placement="right" color="#1e2775">
            <Link
              to="/crm/vehiclecheck"
              className={`nav-link ${
                location.pathname === "/crm/vehiclecheck" ? "active" : ""
              } collapsed`}
            >
              <i className="bi bi-car-front"></i>
              <span>Vehicle Check-In</span>
            </Link>
          </Tooltip>
        </li>
        <li className="nav-item">
          <Tooltip title="Vehicle Check-In" placement="right" color="#1e2775">
            <Link
              to="/crm/recordings"
              className={`nav-link ${
                location.pathname === "/crm/recordings" ? "active" : ""
              } collapsed`}
            >
              <i className="bi bi-car-front"></i>
              <span>Call Recordings</span>
            </Link>
          </Tooltip>
        </li>
        <li className="nav-item logout-item">
          <Tooltip title="Logout" placement="right" color="#1e2775">
            <Link to="/" className="nav-link">
              <i className="bi bi-box-arrow-right"></i>
              <span>Logout</span>
            </Link>
          </Tooltip>
        </li>
      </ul>
    </aside>
  );
}
// export default function SidebarCRM() {
//   const location = useLocation();

//   return (
//     <aside id="sidebar" className="sidebar">
//       <ul className="sidebar-nav" id="sidebar-nav">
//         <li className="nav-item">
//           <Link
//             to="/crm/dashboard"
//             className={`nav-link ${
//               location.pathname === "/crm/dashboard" ? "active" : ""
//             } collapsed`}
//           >
//             <i className="bi bi-speedometer2"></i>
//             <span>DashboardCRM</span>
//           </Link>
//         </li>

//         <li className="nav-item">
//           <Link
//             to="/crm/leads"
//             className={`nav-link ${
//               location.pathname === "/crm/leads" ? "active" : ""
//             } collapsed`}
//           >
//             <i className="bi bi-upload"></i>
//             <span>Upload Excel</span>
//           </Link>
//         </li>

//         <li className="nav-item">
//           <Link
//             to="/crm/listleads"
//             className={`nav-link ${
//               location.pathname === "/crm/listleads" ? "active" : ""
//             } collapsed`}
//           >
//             <i className="bi bi-file-earmark-spreadsheet"></i>
//             <span>Excel List</span>
//           </Link>
//         </li>

//         <li className="nav-item">
//           <Link
//             to="/crm/allleads"
//             className={`nav-link ${
//               location.pathname === "/crm/allleads" ? "active" : ""
//             } collapsed`}
//           >
//             <i className="bi bi-people"></i>
//             <span>All Leads</span>
//           </Link>
//         </li>

//         <li className="nav-item">
//           <Link
//             to="/crm/assignedleads"
//             className={`nav-link ${
//               location.pathname === "/crm/assignedleads" ? "active" : ""
//             } collapsed`}
//           >
//             <i className="bi bi-search"></i>
//             <span>Track Leads</span>
//           </Link>
//         </li>

//         <li className="nav-item">
//           <Link
//             to="/crm/performance"
//             className={`nav-link ${
//               location.pathname === "/crm/performance" ? "active" : ""
//             } collapsed`}
//           >
//             <i className="bi bi-bar-chart-line"></i>
//             <span>User Performance</span>
//           </Link>
//         </li>

//         <li className="nav-item">
//           <Link
//             to="/crm/revertleads"
//             className={`nav-link ${
//               location.pathname === "/crm/revertleads" ? "active" : ""
//             } collapsed`}
//           >
//             <i className="bi bi-x-circle"></i>
//             <span>Reverted Leads</span>
//           </Link>
//         </li>

//         <li className="nav-item">
//           <a
//             className="nav-link collapsed"
//             data-bs-target="#icons-nav"
//             data-bs-toggle="collapse"
//             href="#"
//           >
//             <i className="bi bi-clipboard-data"></i> {/* Reports Icon */}
//             <span>Reports</span>
//             <i className="bi bi-chevron-down ms-auto"></i>
//           </a>
//           <ul
//             id="icons-nav"
//             className="nav-content collapse"
//             data-bs-parent="#sidebar-nav"
//           >
//             <li>
//               <Link
//                 to="/crm/dailyreport"
//                 className={
//                   location.pathname === "/crm/dailyreport" ? "active" : ""
//                 }
//               >
//                 <i className="bi bi-person-lines-fill"></i>{" "}
//                 {/* Employee Report Icon */}
//                 <span>Employee Report</span>
//               </Link>
//             </li>
//           </ul>
//         </li>

//         <li className="nav-item">
//           <Link
//             to="/crm/vehiclecheck"
//             className={`nav-link ${
//               location.pathname === "/crm/vehiclecheck" ? "active" : ""
//             } collapsed`}
//           >
//             <i className="bi bi-car-front"></i>
//             <span>Vehicle Check-In</span>
//           </Link>
//         </li>

//         <li className="nav-item logout-item">
//           <Link to="/" className="nav-link">
//             <i className="bi bi-box-arrow-right"></i>
//             <span>Logout</span>
//           </Link>
//         </li>
//       </ul>
//     </aside>
//   );
// }
