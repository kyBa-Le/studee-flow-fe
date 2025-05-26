import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Logout } from "../../../services/AuthService";
import "./AdminSideBar.css";

const menuItems = [
  { path: "/admin/student-management", icon: "user", label: "Students" },
  { path: "/admin/teacher-management", icon: "users", label: "Teachers" },
  { path: "/admin/notification", icon: "bell", label: "Notifications" },
  { path: "/admin/classroom-management", icon: "folder", label: "Classrooms" },
];

const SidebarItem = ({ path, icon, label, currentPath, onClick }) => {
  const isActive = currentPath === path;
  return (
    <div
      onClick={() => onClick(path)}
      className={`flex items-center gap-3 cursor-pointer text-gray-700 hover:text-[#FE9C3B] ${isActive ? "is-active" : ""}`}
      style={{ fontSize: "16px" }}
    >
      <i data-feather={icon} className="w-4 h-4"></i>
      <span>{label}</span>
    </div>
  );
};

export function AdminSideBar() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (window.feather) {
      window.feather.replace();
    }
  }, []);

  const handleChangePage = (path) => {
    navigate(path);
  };

  return (
    <div className="bg-gray-100 flex">
      <div className="bg-white w-56 flex flex-col justify-between items-start p-6 shadow-md">
        {/* Menu Items */}
        <div className="space-y-8">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.path}
              {...item}
              currentPath={location.pathname}
              onClick={handleChangePage}
            />
          ))}
        </div>

        {/* Logout */}
        <div
          onClick={Logout}
          className="flex items-center gap-3 cursor-pointer text-gray-700 hover:text-red-500"
          style={{ fontSize: "16px" }}
        >
          <i data-feather="log-out" className="w-4 h-4"></i>
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
}
