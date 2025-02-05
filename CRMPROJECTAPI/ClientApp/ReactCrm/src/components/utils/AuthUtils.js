import { setAuthToken } from "./Api"

export const saveAuthData = async (data) => {
  try {
    localStorage.setItem("userDetails", JSON.stringify(data.userDetails))
    localStorage.setItem("roleDetails", JSON.stringify(data.roleDetails))
    await setAuthToken(data.token)
  } catch (error) {
    console.error("Error saving auth data:", error)
  }
}

export const getAuthData = async () => {
  try {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"))
    const roleDetails = JSON.parse(localStorage.getItem("roleDetails"))
    const token = localStorage.getItem("token")
    return { userDetails, roleDetails, token }
  } catch (error) {
    console.error("Error getting auth data:", error)
    return { userDetails: null, roleDetails: null, token: null }
  }
}

export const clearAuthData = async () => {
  try {
    localStorage.removeItem("userDetails")
    localStorage.removeItem("roleDetails")
    localStorage.removeItem("token")
    await setAuthToken(null)
  } catch (error) {
    console.error("Error clearing auth data:", error)
  }
}

  