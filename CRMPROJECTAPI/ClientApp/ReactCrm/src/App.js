import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Admindashboard from "./components/Admin/Admindashboard";

// import Calendar from './components/Admin/Calendar';
import User from "./components/Admin/User";
import Sales from "./components/Admin/Sales";
import DSM from "./components/Admin/DSM";
import DSE from "./components/Admin/DSE";
import Login from "./components/Login/Login";
import CREDashboard from "./components/CRE/CREDashboard";
import DSEDashboard from "./components/DSE/DSEDashboard";
import SalesDashboard from "./components/SalesManager/SalesDashboard";
import DashboardCRM from "./components/CRM/DashboardCRM";
import DSMDashboard from "./components/DSM/DSMDashboard"
import Excelform from "./components/CRM/Excelform";
import Leads from "./components/CRM/Leads";
import AddRole from "./components/Admin/AddRole";
import AddUsers from "./components/Admin/AddUsers";
import AddBranch from "./components/Admin/AddBranch";
import ListLeads from "./components/CRM/ListLeads";
import AssignWorks from "./components/CRE/AssignWorks";
import CRM from "./components/CRM/CRM";
import CRE from "./components/CRM/CRE";
import AssignManagement from "./components/Admin/AssignManagement";
import LeadsDisplayExcelRecords from "./components/CRM/LeadsDisplayExcelRecords";
import LeadsRecord from "./components/DSM/LeadsRecord";
import DseLeads from "./components/DSE/DseLeads";
import UserPerformance from "./components/Admin/UserPerformance";
import VehicleCheckIn from "./components/CRM/VehicleCheckIn";
import VehicleCheck from "./components/VehicleCheck/VehicleCheck";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Route */}
        <Route path="/" element={<Login />} />
        <Route path="/vehiclecheck" element={<VehicleCheck />} />
        {/* Admin Routes */}
        <Route path="/crm" element={<Layout />}>
          <Route path="dashboard" element={<DashboardCRM/>} />
          <Route path="cre" element={<CRE/>} />
          <Route path="sales" element={<Sales />} />
          <Route path="excelform" element={<Excelform/>} />
          <Route path="listleads" element={<ListLeads/>} />
          <Route path="dse" element={<DSE />} />
          <Route path="dsm" element={<DSM />} />
          <Route path="user" element={<User />} />
          <Route path="leads" element={<Leads/>} />
          <Route path="crm" element={<CRM />} />
          <Route path="vehiclecheck" element={<VehicleCheckIn/>} />
          <Route path="leadsdisplayexcelrecords/:excelName" element={<LeadsDisplayExcelRecords/>} />


        </Route>
        <Route path="/dsm" element={<Layout />}>
          <Route path="dashboard" element={<DSMDashboard/>} />
          <Route path="assignlead" element={<LeadsRecord/>} />

        </Route>
        <Route path="/cre" element={<Layout />}>
          <Route path="dashboard" element={<CREDashboard />} />
          <Route path="assignworks" element={<AssignWorks />} />

        </Route>
        <Route path="/dse" element={<Layout />}>
          <Route path="dashboard" element={<DSEDashboard />} />
          <Route path="assign" element={<DseLeads />} />

        </Route>
        <Route path="/sales" element={<Layout />}>
          <Route path="dashboard" element={<SalesDashboard />} />

        </Route>
        <Route path="/admin" element={<Layout />}>
          <Route path="dashboard" element={<Admindashboard />} />
          <Route path="addrole" element={<AddRole/>} />
          <Route path="addusers" element={<AddUsers/>} />
          <Route path="addbranch" element={<AddBranch/>} />
          <Route path="assignmanagement" element={<AssignManagement/>} />
          <Route path="userperformance" element={<UserPerformance/>} />





        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
