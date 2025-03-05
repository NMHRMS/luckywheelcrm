import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
// import { getRequest } from "../utils/Api";
import { getRequest } from "./utils/Api";
import { jwtDecode } from "jwt-decode"; // Correct import

function Header() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [userName, setUserName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [userRole, setUserRole] = useState("");
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
 
  const toggleSidebar = () => {
    setIsSidebarActive((prev) => !prev);
    const body = document.body;
    const sidebar = document.getElementById("sidebar");

    if (isSidebarActive) {
      body.classList.remove("toggle-sidebar");
      sidebar.classList.remove("collapsed");
    } else {
      body.classList.add("toggle-sidebar");
      sidebar.classList.add("collapsed");
    }
  };
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);

        const extractedName =
          decodedToken[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
          ]?.trim() || "User";

        const extractedRole =
          decodedToken["roleName"]?.trim() || "No Role Assigned"; // ✅ Fix here

        setUserName(extractedName);
        setUserRole(extractedRole);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.log("No token found in localStorage.");
    }
  }, [localStorage.getItem("token")]); // ✅ Added dependency for updates

  const signout=()=>{
    localStorage.clear();
    navigate('/');
  
  }



  return (
    <>
      {/* <!-- ======= Header ======= --> */}
      <header
        id="header"
        className="header fixed-top d-flex align-items-center"
      >
        <div className="d-flex align-items-center justify-content-between">
          <a href="index.html" className="logo d-flex align-items-center">
            <img src="/assets/img/logo.png" alt="" />
            {/* <span className="d-none d-lg-block">{branchName}</span> */}
            <span>CRM</span>
          </a>
          <i
            className="bi bi-list toggle-sidebar-btn"
            onClick={toggleSidebar}
          ></i>
        </div>
        {/* <!-- End Logo --> */}

        {/* <div className="search-bar">
          <form
            className="search-form d-flex align-items-center"
            method="POST"
            action="#"
          >
            <input
              type="text"
              name="query"
              placeholder="Search"
              title="Enter search keyword"
            />
            <button type="submit" title="Search">
              <i className="bi bi-search"></i>
            </button>
          </form>
        </div> */}
        {/* <!-- End Search Bar --> */}

        <nav className="header-nav ms-auto">
          <ul className="d-flex align-items-center">
            <li className="nav-item d-block d-lg-none">
              <a className="nav-link nav-icon search-bar-toggle " href="#">
                <i className="bi bi-search"></i>
              </a>
            </li>
            <div className="me-3">
              <span className="fw-bold text-primary">Welcome!! {userName}</span>
              <span className="text-muted"> - {userRole}</span>
            </div>
            {/* <!-- End Search Icon--> */}

            {/* <li className="nav-item dropdown">
              <a
                className="nav-link nav-icon"
                href="#"
                data-bs-toggle="dropdown"
              >
                <i className="bi bi-bell"></i>
                <span className="badge bg-primary badge-number">4</span>
              </a>
         

              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
                <li className="dropdown-header">
                  You have 4 new notifications
                  <a href="#">
                    <span className="badge rounded-pill bg-primary p-2 ms-2">
                      View all
                    </span>
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="notification-item">
                  <i className="bi bi-exclamation-circle text-warning"></i>
                  <div>
                    <h4>Lorem Ipsum</h4>
                    <p>Quae dolorem earum veritatis oditseno</p>
                    <p>30 min. ago</p>
                  </div>
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="notification-item">
                  <i className="bi bi-x-circle text-danger"></i>
                  <div>
                    <h4>Atque rerum nesciunt</h4>
                    <p>Quae dolorem earum veritatis oditseno</p>
                    <p>1 hr. ago</p>
                  </div>
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="notification-item">
                  <i className="bi bi-check-circle text-success"></i>
                  <div>
                    <h4>Sit rerum fuga</h4>
                    <p>Quae dolorem earum veritatis oditseno</p>
                    <p>2 hrs. ago</p>
                  </div>
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="notification-item">
                  <i className="bi bi-info-circle text-primary"></i>
                  <div>
                    <h4>Dicta reprehenderit</h4>
                    <p>Quae dolorem earum veritatis oditseno</p>
                    <p>4 hrs. ago</p>
                  </div>
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li className="dropdown-footer">
                  <a href="#">Show all notifications</a>
                </li>
              </ul>
              
            </li> */}
         

            {/* <li className="nav-item dropdown">
              <a
                className="nav-link nav-icon"
                href="#"
                data-bs-toggle="dropdown"
              >
                <i className="bi bi-chat-left-text"></i>
                <span className="badge bg-success badge-number">3</span>
              </a>
          

              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow messages">
                <li className="dropdown-header">
                  You have 3 new messages
                  <a href="#">
                    <span className="badge rounded-pill bg-primary p-2 ms-2">
                      View all
                    </span>
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="message-item">
                  <a href="#">
                    <img
                      src="/assets/img/messages-1.jpg"
                      alt=""
                      className="rounded-circle"
                    />
                    <div>
                      <h4>Maria Hudson</h4>
                      <p>
                        Velit asperiores et ducimus soluta repudiandae labore
                        officia est ut...
                      </p>
                      <p>4 hrs. ago</p>
                    </div>
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="message-item">
                  <a href="#">
                    <img
                      src="assets/img/messages-2.jpg"
                      alt=""
                      className="rounded-circle"
                    />
                    <div>
                      <h4>Anna Nelson</h4>
                      <p>
                        Velit asperiores et ducimus soluta repudiandae labore
                        officia est ut...
                      </p>
                      <p>6 hrs. ago</p>
                    </div>
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="message-item">
                  <a href="#">
                    <img
                      src="assets/img/messages-3.jpg"
                      alt=""
                      className="rounded-circle"
                    />
                    <div>
                      <h4>David Muldon</h4>
                      <p>
                        Velit asperiores et ducimus soluta repudiandae labore
                        officia est ut...
                      </p>
                      <p>8 hrs. ago</p>
                    </div>
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="dropdown-footer">
                  <a href="#">Show all messages</a>
                </li>
              </ul>
           
            </li> */}
            {/* <!-- End Messages Nav --> */}

            <li className="nav-item dropdown pe-3">
              <a
                className="nav-link nav-profile d-flex align-items-center pe-0"
                href="#"
                data-bs-toggle="dropdown"
              >
                <img
                  src="../assets/img/profile2.png"
                  alt="image"
                  className="rounded-circle"
                />
                <span className="d-none d-md-block dropdown-toggle ps-2">
                  {userName}
                </span>
              </a>
              {/* <!-- End Profile Iamge Icon --> */}

              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                <li className="dropdown-header">
                  <h6>{userName}</h6>
                  <span>{userRole}</span>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                  >
                    <i className="bi bi-person"></i>
                    <span>My Profile</span>
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li>
                  <Link
                  
                    className="dropdown-item d-flex align-items-center"
                  >
                    <i className="bi bi-gear"></i>
                    <span>Account Settings</span>
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                  >
                    <i className="bi bi-question-circle"></i>
                    <span>Need Help?</span>
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li onClick={signout}>
                      <Link className="dropdown-item d-flex align-items-center"
                  >
                    <i className="bi bi-box-arrow-right"></i>
          
                    <span>Sign Out</span>
                    </Link>
                </li>
              </ul>

              {/* <!-- End Profile Dropdown Items --> */}
            </li>
            {/* <!-- End Profile Nav --> */}
          </ul>
        </nav>
        {/* <!-- End Icons Navigation --> */}
      </header>
      {/* <!-- End Header --> */}
    </>
  );
}

export default Header;
