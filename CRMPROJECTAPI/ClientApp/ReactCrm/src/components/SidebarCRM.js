import React from "react";
import { Link } from "react-router-dom";

export default function SidebarCRM() {
  return (
    <div>
      {/* {/ <!-- Sidebar --> /} */}
      <aside id="sidebar" className="sidebar">
        <ul className="sidebar-nav" id="sidebar-nav">
          <li className="nav-item">
            <Link to="/crm/dashboard" className="nav-link">
              <i className="bi bi-speedometer2"></i>
              <span>DashboardCRM</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/crm/leads" className="nav-link collapsed">
              <i className="bi bi-upload"></i>
              <span>Upload Excel</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/crm/listleads" className="nav-link collapsed">
              <i className="bi bi-file-earmark-spreadsheet"></i>
              <span>Excel List</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/crm/allleads" className="nav-link collapsed">
              <i className="bi bi-people"></i>
              <span>All Leads</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/crm/asiignedleads" className="nav-link collapsed">
              <i className="bi bi-search"></i>
              <span>Track Leads</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/crm/performance" className="nav-link collapsed">
              <i className="bi bi-bar-chart-line"></i>
              <span>User Performance</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/crm/revertleads" className="nav-link collapsed">
              <i className="bi bi-x-circle"></i>
              <span>Reject Leads</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/crm/reports" className="nav-link collapsed">
              <i className="bi bi-x-circle"></i>
              <span>Reports</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/crm/vehiclecheck" className="nav-link collapsed">
              <i className="bi bi-car-front"></i>
              <span>Vehicle Check-In</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/" className="nav-link collapsed">
              <i className="bi bi-box-arrow-right"></i>
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </aside>
      {/* {/ <!-- End Sidebar--> /} */}
    </div>
  );
}
