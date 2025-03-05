import React from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  return (
    <aside id="sidebar" className="sidebar">
      <ul className="sidebar-nav" id="sidebar-nav">
        <li className="nav-item">
          <Link
            to="/admin/dashboard"
            className={`nav-link ${
              location.pathname === "/admin/dashboard" ? "active" : ""
            }`}
          >
            <i className="bi bi-speedometer2"></i>
            <span className="ms-2">Dashboard Admin</span>
          </Link>
        </li>

        <li className="nav-item">
          <Link
            to="/admin/assignmanagement"
            className={`nav-link ${
              location.pathname === "/admin/assignmanagement" ? "active" : ""
            }`}
          >
            <i className="bi bi-clipboard-check"></i>
            <span className="ms-2">Assign </span>
          </Link>
        </li>

        <li className="nav-item">
          <Link
            to="/admin/addrole"
            className={`nav-link ${
              location.pathname === "/admin/addrole" ? "active" : ""
            }`}
          >
            <i className="bi bi-person-plus"></i>
            <span className="ms-2">Add Role</span>
          </Link>
        </li>

        <li className="nav-item">
          <Link
            to="/admin/addbranch"
            className={`nav-link ${
              location.pathname === "/admin/addbranch" ? "active" : ""
            }`}
          >
            <i className="bi bi-building"></i>
            <span className="ms-2">Add Branch</span>
          </Link>
        </li>

        <li className="nav-item">
          <Link
            to="/admin/addusers"
            className={`nav-link ${
              location.pathname === "/admin/addusers" ? "active" : ""
            }`}
          >
            <i className="bi bi-people"></i>
            <span className="ms-2">Add User</span>
          </Link>
        </li>

        <li className="nav-item">
          <Link
            to="/admin/categories"
            className={`nav-link ${
              location.pathname === "/admin/categories" ? "active" : ""
            }`}
          >
            <i className="bi bi-people"></i>
            <span className="ms-2">Add Categories</span>
          </Link>
        </li>

        <li className="nav-item">
          <Link
            to="/admin/products"
            className={`nav-link ${
              location.pathname === "/admin/products" ? "active" : ""
            }`}
          >
            <i className="bi bi-people"></i>
            <span className="ms-2">Add Products</span>
          </Link>
        </li>

        <li className="nav-item">
          <Link
            to="/admin/userperformance"
            className={`nav-link ${
              location.pathname === "/admin/userperformance" ? "active" : ""
            }`}
          >
            <i className="bi bi-bar-chart"></i>
            <span className="ms-2">User Performance</span>
          </Link>
        </li>

        <li className="nav-item logout-item">
          <Link to="/" className="nav-link">
            <i className="bi bi-box-arrow-right"></i>
            <span className="ms-2">Logout</span>
          </Link>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
