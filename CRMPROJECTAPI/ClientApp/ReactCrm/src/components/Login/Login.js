import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import { postRequest } from "../utils/Api"
import { saveAuthData } from "../utils/AuthUtils"

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const roleMapping = {
    "e3592de2-23f6-4752-950d-bae6d6791798": "admin",
    "3a91f9d0-563c-4960-a237-11b5c7434876": "crm",
    "ad851efd-cd73-43ff-aca5-9f3bc12127b2": "cre",
    "341fe51d-b3bb-4ce0-901f-06443bb61830": "dsm",
    "5c13fc2f-6c3a-412d-86cf-e83ba26bdb42": "dse",
    "52b46093-6e80-4842-b08e-d0a75ab920c2": "sales",
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await postRequest("api/Auth/login", {
        emailId: email,
        password: password,
      })

      console.log("API Response:", response.data)

      const token = response.data.token

      if (!token) {
        setError("No token received.")
        return
      }

      let decodedToken
      try {
        decodedToken = jwtDecode(token)
      } catch (decodeError) {
        console.error("Token decode error:", decodeError)
        setError("Invalid token received.")
        return
      }

      const roleId = decodedToken?.roleId
      if (!roleId) {
        setError("Role ID is missing from the token.")
        return
      }

      const roleName = roleMapping[roleId]

      if (!roleName) {
        setError("Role not found for the given Role ID.")
        return
      }

      await saveAuthData({
        token,
        userDetails: { ...decodedToken, role: roleName },
        roleDetails: { roleId, roleName },
      })

      const roleRoutes = {
        admin: "/admin/dashboard",
        crm: "/crm/dashboard",
        cre: "/cre/dashboard",
        dsm: "/dsm/dashboard",
        dse: "/dse/dashboard",
        sales: "/sales/dashboard",
      }

      navigate(roleRoutes[roleName] || "/")
    } catch (err) {
      console.error("Login Error:", err)
      if (err.response && err.response.status === 401) {
        setError("Invalid email or password. Please try again.")
      } else {
        setError("An error occurred. Please try again later.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ background: "linear-gradient(to bottom, pink, skyblue)" }}>
      <div className="container-fluid d-flex justify-content-center align-items-center vh-100">
        <div
          className="card p-4"
          style={{
            width: "400px",
            background: "linear-gradient(to bottom, lavender, skyblue)",
          }}
        >
          <h3 className="text-center mb-4">CRM</h3>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            {error && <p className="text-danger">{error}</p>}
            <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginForm

