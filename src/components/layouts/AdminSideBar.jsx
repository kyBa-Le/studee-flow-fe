import React, { useEffect } from "react";

export default function AdminSideBar() {
  useEffect(() => {
    if (window.feather) {
      window.feather.replace();
    }
  }, []);

  return (
    <div className="h-screen bg-gray-100 flex">
      <div className="bg-white w-56 flex flex-col justify-between items-start p-6 shadow-md">
        {/* Menu Items */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 cursor-pointer text-sm text-gray-700 hover:text-[#FE9C3B]">
            <i data-feather="user" className="w-4 h-4"></i>
            <span>Students</span>
          </div>
          <div className="flex items-center gap-3 cursor-pointer text-sm text-gray-700 hover:text-[#FE9C3B]">
            <i data-feather="users" className="w-4 h-4"></i>
            <span>Teachers</span>
          </div>
          <div className="flex items-center gap-3 cursor-pointer text-sm text-gray-700 hover:text-[#FE9C3B]">
            <i data-feather="bell" className="w-4 h-4"></i>
            <span>Notifications</span>
          </div>
          <div className="flex items-center gap-3 cursor-pointer text-sm text-gray-700 hover:text-[#FE9C3B]">
            <i data-feather="folder" className="w-4 h-4"></i>
            <span>Classrooms</span>
          </div>
        </div>

        {/* Logout */}
        <div className="flex items-center gap-3 cursor-pointer text-sm text-gray-700 hover:text-red-500">
          <i data-feather="log-out" className="w-4 h-4"></i>
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
}
