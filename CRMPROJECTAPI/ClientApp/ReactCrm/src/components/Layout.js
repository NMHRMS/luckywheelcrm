import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import SidebarAdmin from "./SidebarAdmin";
import SidebarDSM from "./SidebarDSM";
import SidebarCRE from "./SidebarCRE";
import SidebarDSE from "./SidebarDSE";
import SidebarSales from "./SidebarSales";
import SidebarCRM from "./SidebarCRM";
import Header from "./Header";
import { getAuthData } from "../components/utils/AuthUtils";

const roleSidebarMap = {
  admin: SidebarAdmin,
  crm: SidebarCRM,
  cre: SidebarCRE,
  dsm: SidebarDSM,
  dse: SidebarDSE,
  sales: SidebarSales,
};

const Layout = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const authData = await getAuthData();
      const roleName = authData?.userDetails?.roleName?.toLowerCase(); // Extract roleName directly
      setUser(roleName ? { ...authData.userDetails, role: roleName } : null);
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!user || !user.role) {
    return <Navigate to="/" />;
  }

  const SidebarComponent = roleSidebarMap[user.role];

  return (
    <>
      <Header />
      {SidebarComponent ? (
        <SidebarComponent />
      ) : (
        <div>No Sidebar Available</div>
      )}
      <main id="main" className="main">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
