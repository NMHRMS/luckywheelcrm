import { useEffect, useState } from "react"
import { Outlet, Navigate } from "react-router-dom"
import SidebarAdmin from "./SidebarAdmin"
import SidebarDSM from "./SidebarDSM"
import SidebarCRE from "./SidebarCRE"
import SidebarDSE from "./SidebarDSE"
import SidebarSales from "./SidebarSales"
import SidebarCRM from "./SidebarCRM"
import Header from "./Header"
import { getAuthData } from "../components/utils/AuthUtils"

const roleSidebarMap = {
  admin: SidebarAdmin,
  crm: SidebarCRM,
  cre: SidebarCRE,
  dsm: SidebarDSM,
  dse: SidebarDSE,
  sales: SidebarSales,
}

const Layout = () => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const authData = await getAuthData()
      setUser(authData?.userDetails || null)
      setIsLoading(false)
    }
    fetchUser()
  }, [])

  if (isLoading) {
    return <div>Loading...</div> // Or a loading spinner
  }

  if (!user || !user.role) {
    return <Navigate to="/" />
  }

  const SidebarComponent = roleSidebarMap[user.role.toLowerCase()]

  return (
    <>
      <Header />
      {SidebarComponent && <SidebarComponent />}
      <main id="main" className="main">
        <Outlet />
      </main>
    </>
  )
}

export default Layout

