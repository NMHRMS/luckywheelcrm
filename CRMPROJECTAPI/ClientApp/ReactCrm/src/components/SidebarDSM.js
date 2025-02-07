import React from 'react'
import { Link } from "react-router-dom";

export default function SidebarDSM() {
    const isCollapsed = document.body.classList.contains("toggle-sidebar");

    return (
      <>
          {/* <!-- ======= Sidebar ======= --> */}
          <aside id="sidebar" className="sidebar">
            <ul className="sidebar-nav" id="sidebar-nav">
              <li className="nav-item">
                <a className="nav-link " href="index.html">
                  <i className="bi bi-grid"></i>
                  <span>DashboardDSM</span>
                </a>
              </li>
              {/* <!-- End Dashboard Nav --> */}
    
              <li className="nav-item">
                <a
                  className="nav-link collapsed"
                  data-bs-target="#components-nav"
                  data-bs-toggle="collapse"
                  href="#"
                >
                  <i className="bi bi-menu-button-wide"></i>
                  <span>Components</span>
                  <i className="bi bi-chevron-down ms-auto"></i>
                </a>
                <ul
                  id="components-nav"
                  className="nav-content collapse "
                  data-bs-parent="#sidebar-nav"
                >
                  <li>
                    <Link to="/crm/excelform">
                      <i className="bi bi-circle"></i>
                      <span>Leads</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/crm">
                      <i className="bi bi-circle"></i>
                      <span>CRM</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/cre">
                      <i className="bi bi-circle"></i>
                      <span>CRE</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/sales">
                      <i className="bi bi-circle"></i>
                      <span>Sales</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/dsm">
                      <i className="bi bi-circle"></i>
                      <span>DSM</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/dse">
                      <i className="bi bi-circle"></i>
                      <span>DSE</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/leads">
                      <i className="bi bi-circle"></i>
                      <span>Leads</span>
                    </Link>
                  </li>
                </ul>
              </li>
    
              {/* Dropdown Menu for Reports */}
              <li className="nav-item">
                <a
                  className="nav-link collapsed"
                  data-bs-target="#reports-nav"
                  data-bs-toggle="collapse"
                  href="#"
                >
                  <i className="bi bi-bar-chart"></i>
                  <span>Reports</span>
                  <i className="bi bi-chevron-down ms-auto"></i>
                </a>
                <ul
                  id="reports-nav"
                  className="nav-content collapse "
                  data-bs-parent="#sidebar-nav"
                >
                  <li>
                    <Link to="/admin/tabcontent">
                      <i className="bi bi-circle"></i>
                      <span>Reports</span>
                    </Link>
                  </li>
                  
                </ul>
              </li>
    
              {/* End Dropdown Menu */}
    
              <li className="nav-item">
                <a className="nav-link collapsed" href="users-profile.html">
                  <i className="bi bi-person"></i>
                  <span>Profile</span>
                </a>
              </li>
              {/* <!-- End Profile Page Nav --> */}
    
              <li className="nav-item">
                <a className="nav-link collapsed" href="pages-contact.html">
                  <i className="bi bi-envelope"></i>
                  <span>Contact</span>
                </a>
              </li>
              {/* <!-- End Contact Page Nav --> */}
    
              
    
              <li className="nav-item">
                <Link to="/adminlogin" className="nav-link collapsed">
                  <i className="bi bi-box-arrow-in-right"></i>
                  <span>Logout</span>
                </Link>
              </li>
              {/* <!-- End Register Page Nav --> */}
            </ul>
          </aside>
          {/* <!-- End Sidebar--> */}
        </>
    );
  }
  
