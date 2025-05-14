import { AdminHeader } from "../Header/AdminHeader";
import {AdminSideBar} from "../Sidebar/AdminSideBar";
import "./AdminLayout.css";

export function AdminLayout({ children, title }) {
    return (
        <div className="admin-layout d-flex vw-100 vh-100 flex-column">
            <AdminHeader title={title}></AdminHeader>
            <div className="admin-content d-flex align-item-start">
                <AdminSideBar />
                {children}
            </div>
        </div>
    )
}