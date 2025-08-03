import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import LoginPage from "@/components/pages/LoginPage";
import PatientHomePage from "@/components/pages/PatientHomePage";
import BookAppointmentPage from "@/components/pages/BookAppointmentPage";
import ReportsPage from "@/components/pages/ReportsPage";
import ProfilePage from "@/components/pages/ProfilePage";
import DoctorDashboardPage from "@/components/pages/DoctorDashboardPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="home" element={<PatientHomePage />} />
            <Route path="book" element={<BookAppointmentPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="doctor-dashboard" element={<DoctorDashboardPage />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="z-[9999]"
          toastClassName="rounded-lg shadow-lg"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;