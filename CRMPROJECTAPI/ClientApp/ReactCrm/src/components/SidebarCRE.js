import React from "react";
import { Link } from "react-router-dom";

export default function SidebarCRE() {
  const isCollapsed = document.body.classList.contains("toggle-sidebar");

  return (
    <>
      {/* <!-- ======= Sidebar ======= --> */}
      <aside
        id="sidebar"
        className={`sidebar ${isCollapsed ? "collapsed" : ""}`}
      >
        <ul className="sidebar-nav" id="sidebar-nav">
          <li className="nav-item">
            <Link to="/cre/dashboard" className="nav-item">
              <a className="nav-link" href="index.html">
                <i className="bi bi-grid"></i>
                {!isCollapsed && <span>DashboardCRE</span>}
              </a>
            </Link>
          </li>

          <li className="nav-item">
            <Link
              to="#"
              className="nav-link collapsed"
              data-bs-target="#components-nav"
              data-bs-toggle="collapse"
            >
              <i className="bi bi-menu-button-wide"></i>
              <span>CRE</span>
              <i className="bi bi-chevron-down ms-auto"></i>
            </Link>
            <ul
              id="components-nav"
              className="nav-content collapse"
              data-bs-parent="#sidebar-nav"
            >
              <li>
                <Link to="/cre/assignworks">
                  <i className="bi bi-circle"></i>
                  <span>CRELeads</span>
                </Link>
              </li>
              {/* <li>
                <Link to="/teacher/studentlist">
                  <i className="bi bi-circle"></i>
                  <span>CRE2</span>
                </Link>
              </li>
              <li>
                <Link to="/teacher/courses">
                  <i className="bi bi-circle"></i>
                  <span>CRE2</span>
                </Link>
              </li>
              <li>
                <Link to="/teacher/feestatus">
                  <i className="bi bi-circle"></i>
                  <span>CRE3</span>
                </Link>
              </li>
              <li>
                <Link to="/teacher/batches">
                  <i className="bi bi-circle"></i>
                  <span>Leads</span>
                </Link>
              </li> */}
            </ul>
          </li>

          {/* New Admission Nav Item */}
          <li className="nav-item">
            {/* <Link
                 to="#"
                 className="nav-link collapsed"
                 data-bs-target="#admission-nav"
                 data-bs-toggle="collapse"
               >
                 <i className="bi bi-book"></i>
                 <span>Admission</span>
                 <i className="bi bi-chevron-down ms-auto"></i>
               </Link> */}
            <ul
              id="admission-nav"
              className="nav-content collapse"
              data-bs-parent="#sidebar-nav"
            >
              <li>
                <li>
                  <Link to="/teacher/enquiryform">
                    <i className="bi bi-circle"></i>
                    <span>Enquiry </span>
                  </Link>
                </li>
                <li>
                  <Link to="/teacher/admissionform">
                    <i className="bi bi-circle"></i>
                    <span>Admission</span>
                  </Link>
                </li>
                <Link to="/teacher/registration">
                  <i className="bi bi-circle"></i>
                  <span>StudentDataSheet</span>
                </Link>
              </li>
              {/* <li>
                   <Link to="/teacher/enquirylist">
                     <i className="bi bi-circle"></i>
                     <span>EnquiryList </span>
                   </Link>
                 </li> */}
            </ul>
          </li>
          {/* End Admission Nav Item */}

          {/* <Link to="" className="nav-item">
            <a className="nav-link collapsed" href="users-profile.html">
              <i className="bi bi-person"></i>
              <span>Profile</span>
            </a>
          </Link> */}
          <Link to="/" className="nav-item">
            <a className="nav-link collapsed" href="pages-blank.html">
              <i className="bi bi-box-arrow-in-right"></i>
              <span>Logout</span>
            </a>
          </Link>
          {/* <!-- End Blank Page Nav --> */}
        </ul>
      </aside>
      {/* <!-- End Sidebar--> */}
    </>
  );
}
