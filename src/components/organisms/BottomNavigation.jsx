import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import userService from "@/services/api/userService";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = userService.getCurrentUser();

  const getNavItems = () => {
    if (currentUser?.role === "doctor") {
      return [
        { path: "/doctor-dashboard", label: "Dashboard", icon: "LayoutDashboard" },
        { path: "/reports", label: "Reports", icon: "FileText" },
        { path: "/profile", label: "Profile", icon: "User" }
      ];
    }

    return [
      { path: "/home", label: "Home", icon: "Home" },
      { path: "/book", label: "Book", icon: "Calendar" },
      { path: "/reports", label: "Reports", icon: "FileText" },
      { path: "/profile", label: "Profile", icon: "User" }
    ];
  };

  const navItems = getNavItems();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="mobile-nav fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 ${
              isActive(item.path)
                ? "bg-primary-50 text-primary-600"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <ApperIcon 
              name={item.icon} 
              className={`w-5 h-5 ${
                isActive(item.path) ? "text-primary-600" : "text-gray-500"
              }`} 
            />
            <span 
              className={`text-xs font-medium ${
                isActive(item.path) ? "text-primary-600" : "text-gray-500"
              }`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;