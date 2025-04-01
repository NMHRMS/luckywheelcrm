import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Tooltip } from "antd";

function Sidebar() {
  const location = useLocation();

  return (
    <aside id="sidebar" className="sidebar">
      <ul className="sidebar-nav" id="sidebar-nav">
        <li className="nav-item">
             <Tooltip title="Dashboard" placement="right" color="#1e2775">
          <Link
            to="/admin/dashboard"
            className={`nav-link ${
              location.pathname === "/admin/dashboard" ? "active" : ""
            }`}
          >
            <i className="bi bi-speedometer2"></i>
            <span className="ms-2">Dashboard Admin</span>
          </Link>
          </Tooltip>
        </li>

        <li className="nav-item">
        <Tooltip title="Assigns" placement="right" color="#1e2775">
          <Link
            to="/admin/assignmanagement"
            className={`nav-link ${
              location.pathname === "/admin/assignmanagement" ? "active" : ""
            }`}
          >
            <i className="bi bi-clipboard-check"></i>
            <span className="ms-2">Assign </span>
          </Link>
          </Tooltip>
        </li>

               <li className="nav-item">
                  <Tooltip title="Masters" placement="right" color="#1e2775">
                    <a
                      className="nav-link collapsed"
                      data-bs-target="#icons-nav"
                      data-bs-toggle="collapse"
                      href="#"
                    >
                      <i className="bi bi-clipboard-data"></i>
                      <span>Masters</span>
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
                        title="Add Role"
                        placement="right"
                        color="#1e2775"
                      >
                        <Link
                          to="/admin/addrole"
                          className={
                            location.pathname === "/admin/addrole" ? "active" : ""
                          }
                        >
                            <i className="bi bi-person-plus"></i>
                          <span>Add Role</span>
                        </Link>
                      </Tooltip>
                    </li>
                    <li>
                      <Tooltip
                        title="Add Branch"
                        placement="right"
                        color="#1e2775"
                      >
                        <Link
                          to="/admin/addbranch"
                          className={
                            location.pathname === "/admin/addbranch" ? "active" : ""
                          }
                        >
                          <i className="bi bi-building"></i>
                          <span>Add Branch</span>
                        </Link>
                      </Tooltip>
                    </li>
                    <li>
                      <Tooltip
                        title="Add User"
                        placement="right"
                        color="#1e2775"
                      >
                        <Link
                          to="/admin/addusers"
                          className={
                            location.pathname === "/admin/addusers" ? "active" : ""
                          }
                        >
                        <i className="bi bi-people"></i>
                          <span>Add User</span>
                        </Link>
                      </Tooltip>
                    </li>
                    <li>
                      <Tooltip
                        title="Add Categories"
                        placement="right"
                        color="#1e2775"
                      >
                        <Link
                          to="/admin/categories"
                          className={
                            location.pathname === "/admin/categories" ? "active" : ""
                          }
                        >
                         <i className="bi bi-people"></i>
                          <span>Add Categories</span>
                        </Link>
                      </Tooltip>
                    </li>
                    <li>
                      <Tooltip
                        title="Add products"
                        placement="right"
                        color="#1e2775"
                      >
                        <Link
                          to="/admin/products"
                          className={
                            location.pathname === "/admin/products" ? "active" : ""
                          }
                        >
                          <i className="bi bi-box-seam"></i>
                          <span>Add products</span>
                        </Link>
                      </Tooltip>
                    </li>
                    <li>
                      <Tooltip
                        title="Add addreview"
                        placement="right"
                        color="#1e2775"
                      >
                        <Link
                          to="/admin/addreview"
                          className={
                            location.pathname === "/admin/addreview" ? "active" : ""
                          }
                        >
                            <i className="bi bi-star"></i>
                          <span>Add addreview</span>
                        </Link>
                      </Tooltip>
                    </li>
                  </ul>
                </li>

        <li className="nav-item">
        <Tooltip title="User Performance" placement="right" color="#1e2775">
          <Link
            to="/admin/userperformance"
            className={`nav-link ${
              location.pathname === "/admin/userperformance" ? "active" : ""
            }`}
          >
            <i className="bi bi-bar-chart"></i>
            <span className="ms-2">User Performance</span>
          </Link>
          </Tooltip>
        </li>

        <li className="nav-item logout-item">
        <Tooltip title="Logout" placement="right" color="#1e2775">
          <Link to="/" className="nav-link">
            <i className="bi bi-box-arrow-right"></i>
            <span className="ms-2">Logout</span>
          </Link>
          </Tooltip>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
