import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <>
      {/* <!-- ======= Sidebar ======= --> */}
      <aside id="sidebar" className="sidebar">
        <ul className="sidebar-nav" id="sidebar-nav">
          <li className="nav-item">
            <Link to="/admin/dashboard" className="nav-link">
              <i className="bi bi-speedometer2"></i> {/* Dashboard Icon */}
              <span className="ms-2">Dashboard Admin</span>
            </Link>
          </li>

          {/* Move items outside dropdown */}
          <li className="nav-item">
            <Link to="/admin/assignmanagement" className="nav-link">
              <i className="bi bi-clipboard-check"></i> {/* Assign Icon */}
              <span className="ms-2">Assign </span>
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/admin/addrole" className="nav-link">
              <i className="bi bi-person-plus"></i> {/* Add Role Icon */}
              <span className="ms-2">Add Role</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/admin/addbranch" className="nav-link">
              <i className="bi bi-building"></i> {/* Branch Icon */}
              <span className="ms-2">Add Branch</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/admin/addusers" className="nav-link">
              <i className="bi bi-people"></i> {/* Add User Icon */}
              <span className="ms-2">Add User</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/categories" className="nav-link">
              <i className="bi bi-people"></i> {/* Add User Icon */}
              <span className="ms-2">Add Categories</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/userperformance" className="nav-link">
              <i className="bi bi-bar-chart"></i> {/* Performance Icon */}
              <span className="ms-2">User Performance</span>
            </Link>
          </li>
          {/* <li className="nav-item">
            <a
              className="nav-link collapsed"
              data-bs-target="#components-nav"
              data-bs-toggle="collapse"
              href="#"
            >
              <i className="bi bi-menu-button-wide"></i>
              <span className="ms-2">Components</span>
              <i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul
              id="components-nav"
              className="nav-content collapse"
              data-bs-parent="#sidebar-nav"
            >
            </ul>
          </li> */}

          <li className="nav-item">
            <Link to="/" className="nav-link">
              <i className="bi bi-box-arrow-right"></i> {/* Logout Icon */}
              <span className="ms-2">Logout</span>
            </Link>
          </li>
        </ul>
      </aside>

      {/* <!-- End Sidebar--> */}
    </>
  );
}

export default Sidebar;
