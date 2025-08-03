import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, isAfter, parseISO } from "date-fns";
import Button from "@/components/atoms/Button";
import AppointmentCard from "@/components/molecules/AppointmentCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import userService from "@/services/api/userService";
import appointmentService from "@/services/api/appointmentService";

const PatientHomePage = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const currentUser = userService.getCurrentUser();

  const loadAppointments = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    setError("");
    
    try {
      const data = await appointmentService.getByPatientId(currentUser.Id);
      setAppointments(data);
    } catch (err) {
      setError(err.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [currentUser]);

  const upcomingAppointments = appointments.filter(apt => 
    apt.status === "upcoming" && isAfter(parseISO(apt.date), new Date())
  );

  const recentAppointments = appointments
    .filter(apt => apt.status === "completed")
    .slice(0, 3);

  if (loading) {
    return <Loading type="appointments" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadAppointments} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {currentUser?.name?.split(" ")[0]}! 👋
            </h1>
            <p className="text-primary-100">
              {upcomingAppointments.length > 0
                ? `You have ${upcomingAppointments.length} upcoming appointment${upcomingAppointments.length !== 1 ? "s" : ""}`
                : "No upcoming appointments scheduled"
              }
            </p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <ApperIcon name="Calendar" className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={() => navigate("/book")}
          variant="primary"
          size="lg"
          className="h-20 flex-col space-y-2"
        >
          <ApperIcon name="CalendarPlus" className="w-6 h-6" />
          <span>Book Appointment</span>
        </Button>
        
        <Button
          onClick={() => navigate("/reports")}
          variant="secondary"
          size="lg"
          className="h-20 flex-col space-y-2"
        >
          <ApperIcon name="Upload" className="w-6 h-6" />
          <span>Upload Report</span>
        </Button>
      </div>

      {/* Upcoming Appointments */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Upcoming Appointments</h2>
          {upcomingAppointments.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/book")}
            >
              View All
            </Button>
          )}
        </div>

        {upcomingAppointments.length === 0 ? (
          <Empty
            title="No upcoming appointments"
            description="Schedule your next appointment to keep track of your health."
            icon="Calendar"
            action={
              <Button onClick={() => navigate("/book")} variant="primary">
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                Book Appointment
              </Button>
            }
          />
        ) : (
          <div className="space-y-4">
            {upcomingAppointments.slice(0, 2).map((appointment) => (
              <AppointmentCard
                key={appointment.Id}
                appointment={appointment}
                userRole="patient"
              />
            ))}
          </div>
        )}
      </div>

      {/* Recent Appointments */}
      {recentAppointments.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Visits</h2>
          <div className="space-y-4">
            {recentAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.Id}
                appointment={appointment}
                userRole="patient"
              />
            ))}
          </div>
        </div>
      )}

      {/* Health Tips */}
      <div className="bg-gradient-to-r from-accent-50 to-accent-100 rounded-xl p-6 border border-accent-200">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-accent-200 rounded-full flex items-center justify-center flex-shrink-0">
            <ApperIcon name="Heart" className="w-6 h-6 text-accent-700" />
          </div>
          <div>
            <h3 className="font-semibold text-accent-900 mb-2">Health Tip of the Day</h3>
            <p className="text-accent-800 text-sm">
              Stay hydrated! Drink at least 8 glasses of water daily to maintain optimal health and support your body's natural functions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientHomePage;