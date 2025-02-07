import axios from "axios"

const Api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL || "https://dotnetnm-001-site1.otempurl.com/",
  headers: {
    "Content-Type": "application/json",
  },
})

export const setAuthToken = async (token) => {
  if (token) {
    Api.defaults.headers.common["Authorization"] = `Bearer ${token}`
    await localStorage.setItem("token", token)
  } else {
    delete Api.defaults.headers.common["Authorization"]
    await localStorage.removeItem("token")
  }
}

// Initialize token from localStorage
;(async () => {
  const token = await localStorage.getItem("token")
  if (token) {
    setAuthToken(token)
  }
})()

// Add a request interceptor
Api.interceptors.request.use(
  async (config) => {
    const token = await localStorage.getItem("token")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export const getRequest = (url, config = {}) => Api.get(url, config)
export const postRequest = (url, data, config = {}) => Api.post(url, data, config)
export const putRequest = (url, data, config = {}) => Api.put(url, data, config)
export const deleteRequest = (url, config = {}) => Api.delete(url, config)

export default Api

