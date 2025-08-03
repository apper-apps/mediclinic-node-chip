import React from "react";
import ApperIcon from "@/components/ApperIcon";
import userService from "@/services/api/userService";

const Header = ({ title = "MediClinic Pro", showBack = false, onBack = null }) => {
  const currentUser = userService.getCurrentUser();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            {showBack && onBack && (
              <button
                onClick={onBack}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <ApperIcon name="ArrowLeft" className="w-5 h-5 text-gray-600" />
              </button>
            )}
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                <ApperIcon name="Heart" className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold gradient-text">{title}</h1>
            </div>
          </div>

          {currentUser && (
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                <p className="text-xs text-gray-600 capitalize">{currentUser.role}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                <ApperIcon 
                  name={currentUser.role === "doctor" ? "UserCheck" : "User"} 
                  className="w-5 h-5 text-primary-600" 
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;