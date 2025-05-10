import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logout } from "../../utils/Logout";

export default function AdminSideBar() {
  const navigate = useNavigate();
  useEffect(() => {
    if (window.feather) {
      window.feather.replace();
    }
  }, []);

  const handleChangePage = (path) => {
    navigate(path);
  };

  return (
    <div className="h-screen bg-gray-100 flex">
      <div className="bg-white w-56 flex flex-col justify-between items-start p-6 shadow-md">
        {/* Menu Items */}
        <div className="space-y-8">
          <div onClick={() => handleChangePage("/admin/student-management")} className="flex items-center gap-3 cursor-pointer text-sm text-gray-700 hover:text-[#FE9C3B]">
            <i data-feather="user" className="w-4 h-4"></i>
            <span>Students</span>
          </div>
          <div onClick={() => handleChangePage("/admin/teacher-management")} className="flex items-center gap-3 cursor-pointer text-sm text-gray-700 hover:text-[#FE9C3B]">
            <i data-feather="users" className="w-4 h-4"></i>
            <span>Teachers</span>
          </div>
          <div onClick={() => handleChangePage("/admin/notification")} className="flex items-center gap-3 cursor-pointer text-sm text-gray-700 hover:text-[#FE9C3B]">
            <i data-feather="bell" className="w-4 h-4"></i>
            <span>Notifications</span>
          </div>
          <div onClick={() => handleChangePage("/admin/classroom-management")} className="flex items-center gap-3 cursor-pointer text-sm text-gray-700 hover:text-[#FE9C3B]">
            <i data-feather="folder" className="w-4 h-4"></i>
            <span>Classrooms</span>
          </div>
        </div>

        {/* Logout */}
        <div onClick={Logout} className="flex items-center gap-3 cursor-pointer text-sm text-gray-700 hover:text-red-500">
          <i data-feather="log-out" className="w-4 h-4"></i>
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
}
