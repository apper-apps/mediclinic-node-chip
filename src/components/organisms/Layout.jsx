import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Header from "@/components/organisms/Header";
import BottomNavigation from "@/components/organisms/BottomNavigation";
import userService from "@/services/api/userService";

const Layout = () => {
  const currentUser = userService.getCurrentUser();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      
      <main className="pb-20 min-h-[calc(100vh-4rem)]">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <Outlet />
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Layout;