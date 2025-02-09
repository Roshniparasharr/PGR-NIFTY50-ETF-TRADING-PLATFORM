import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components

import AdminNavbar from "../components/Admin/Navbars/AdminNavbar.js";
import Sidebar from "../components/Admin/Sidebar/Sidebar.js";
import FooterAdmin from "../components/Admin/Footers/FooterAdmin.js";

// views

import Dashboard from "../views/admin/Dashboard.js";
import Maps from "../views/admin/Maps.js";
import Settings from "../views/admin/Settings.js";
import Tables from "../views/admin/Tables.js";
import orgregister from "../views/admin/OrgRegister.js";
export default function Admin() {
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 ml-16 bg-blueGray-100">
        <AdminNavbar />
        {/* Header
        <HeaderStats /> */}
       <div className="mx-auto w-full -m-24">
          <Switch>
            <Route path="/admin/dashboard" exact component={Dashboard} />
            <Route path="/admin/maps" exact component={Maps} />
            <Route path="/admin/settings" exact component={Settings} />
            <Route path="/admin/tables" exact component={Tables} />
            <Route path="/admin/OrgRegister" exact component={orgregister} />
            <Redirect from="/admin" to="/admin/dashboard" />
          </Switch>
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}
