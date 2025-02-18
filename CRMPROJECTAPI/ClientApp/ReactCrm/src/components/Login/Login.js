import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { postRequest } from "../utils/Api";
import { saveAuthData } from "../utils/AuthUtils";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await postRequest("api/Auth/login", {
        emailId: email,
        password: password,
      });

      const token = response.data.token;
      if (!token) {
        setError("No token received.");
        return;
      }

      let decodedToken;
      try {
        decodedToken = jwtDecode(token);
      } catch (decodeError) {
        setError("Invalid token received.");
        return;
      }

      const roleName = decodedToken?.roleName?.trim().toLowerCase(); // Extract and normalize role name
      if (!roleName) {
        setError("Role name is missing from the token.");
        return;
      }

      await saveAuthData({
        token,
        userDetails: decodedToken,
        roleDetails: { roleName },
      });

      const roleRoutes = {
        admin: "/admin/dashboard",
        crm: "/crm/dashboard",
        cre: "/cre/dashboard",
        dsm: "/dsm/dashboard",
        dse: "/dse/dashboard",
        sales: "/sales/dashboard",
      };

      navigate(roleRoutes[roleName] || "/");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Invalid email or password. Please try again.");
      } else {
        setError("An error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 "
      style={{ backgroundColor: "#eff5fb" }}
    >
      <div className="row w-100">
        {/* Left side: Image */}
        <div className="col-lg-6 d-flex justify-content-center align-items-center">
          <img
            src="/assets/img/crmlogin4.png" // Replace with your image path
            alt="Login Image"
            className="img-fluid "
            style={{ height: "500px", width: "750px", marginLeft: "25%" }}
          />
        </div>

        {/* Right side: Form */}
        <div className="col-lg-6 d-flex justify-content-center align-items-center">
          <div
            className="card p-4 shadow-lg"
            style={{ width: "400px", borderRadius: "10px" }}
          >
            <h3 className="text-center mb-3 fw-bold">LOGIN</h3>
            {/* <p className="text-center text-muted mb-4">You must become a member to login and access the entire site.</p> */}

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold">
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label fw-semibold">
                  Password
                </label>
                <div className="input-group">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password"
                    required
                  />
                  <span className="input-group-text">
                    <i className="bi bi-eye-slash"></i>
                  </span>
                </div>
              </div>

              {error && <p className="text-danger text-center">{error}</p>}

              <div className="d-flex justify-content-between">
                <div></div>
                <a href="#" className="text-primary text-decoration-none">
                  Forgot Password
                </a>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 mt-3"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "LOGIN"}
              </button>
            </form>

            <p className="text-center mt-3">
              Not a member yet?{" "}
              <a href="#" className="text-primary text-decoration-none fw-bold">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
