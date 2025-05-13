import AdminSideBar from "../Sidebar/AdminSideBar";

export function AdminLayout({ children }) {
    return (
        <div className="admin-layout d-flex vw-100 vh-100">
            <AdminSideBar/>
            {children}
        </div>
    )
}