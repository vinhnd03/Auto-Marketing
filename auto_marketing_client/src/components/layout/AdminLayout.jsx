import React, {useState} from "react";
import PropTypes from "prop-types";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({children}) => {
    const [collapsed, setCollapsed] = useState(false); // <— trạng thái thu gọn
    return (
        <div className="min-h-screen bg-gray-50">
            <AdminHeader
                collapsed={collapsed}
                onToggleSidebar={() => setCollapsed((v) => !v)}/>
            {/* <div className="flex"> */}
                <AdminSidebar collapsed={collapsed}/>
                <main className={`flex-1 pt-16 transition-all duration-300 ${collapsed ? "ml-16" : "ml-64"}`}>
                    <div className="p-6">{children}</div>
                </main>
            {/* </div> */}
        </div>
    );
};

AdminLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AdminLayout;
