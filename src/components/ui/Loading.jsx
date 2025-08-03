import React from "react";

const Loading = ({ className = "", type = "default" }) => {
  if (type === "appointments") {
    return (
      <div className={`space-y-4 ${className}`}>
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full skeleton"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded skeleton w-32"></div>
                  <div className="h-3 bg-gray-200 rounded skeleton w-24"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-200 rounded-full skeleton w-20"></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="h-3 bg-gray-200 rounded skeleton w-28"></div>
              <div className="h-3 bg-gray-200 rounded skeleton w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "reports") {
    return (
      <div className={`space-y-4 ${className}`}>
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded-lg skeleton"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded skeleton w-48"></div>
                <div className="h-3 bg-gray-200 rounded skeleton w-32"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded skeleton w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "dashboard") {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="h-6 bg-gray-200 rounded skeleton w-48 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full skeleton"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded skeleton w-32"></div>
                    <div className="h-3 bg-gray-200 rounded skeleton w-24"></div>
                  </div>
                </div>
                <div className="h-8 bg-gray-200 rounded skeleton w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;