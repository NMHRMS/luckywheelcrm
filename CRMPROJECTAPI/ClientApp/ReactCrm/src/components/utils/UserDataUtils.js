
export const fetchStoredData = async () => {
  try {
    const userDetails = await localStorage.getItem("userDetails")
    const parsedData = JSON.parse(userDetails)
    const token = await localStorage.getItem("token")

    console.log("Stored User Data:", parsedData)
    console.log("Auth Token:", token)

    if (parsedData) {
      return {
        branchId: parsedData.branchId || "",
        companyId: parsedData.companyId || "",
        userId: parsedData["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || "",
      }
    } else {
      console.log("No user data found")
      return null
    }
  } catch (error) {
    console.error("Error retrieving data from localStorage:", error)
    return null
  }
}

