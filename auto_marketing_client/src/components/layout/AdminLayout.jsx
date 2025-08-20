import React from "react";
import PropTypes from "prop-types";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import {Outlet} from "react-router-dom";

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 ml-64 pt-7">
          <div className="p-6">{children}</div>
            <Outlet/>
        </main>
      </div>
    </div>
  );

};

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminLayout;
