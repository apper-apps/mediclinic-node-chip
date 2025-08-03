import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import AppointmentCard from "@/components/molecules/AppointmentCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import userService from "@/services/api/userService";
import appointmentService from "@/services/api/appointmentService";
import medicalReportService from "@/services/api/medicalReportService";

const DoctorDashboardPage = () => {
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientReports, setPatientReports] = useState([]);
  const [visitNotes, setVisitNotes] = useState("");
  const [updatingAppointment, setUpdatingAppointment] = useState(false);
  const currentUser = userService.getCurrentUser();

  const loadAppointments = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [todaysData, allData] = await Promise.all([
        appointmentService.getTodaysAppointments(currentUser.Id),
        appointmentService.getByDoctorId(currentUser.Id)
      ]);
      
      setTodaysAppointments(todaysData);
      setAllAppointments(allData);
    } catch (err) {
      setError(err.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const loadPatientReports = async (patientId) => {
    try {
      const reports = await medicalReportService.getByPatientId(patientId);
      setPatientReports(reports);
    } catch (err) {
      console.error("Failed to load patient reports:", err);
      setPatientReports([]);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadAppointments();
    }
  }, [currentUser]);

  const handleViewPatient = (appointment) => {
    setSelectedPatient(appointment);
    setVisitNotes(appointment.notes || "");
    loadPatientReports(appointment.patientId);
  };

  const handleCompleteAppointment = async (appointmentId) => {
    setUpdatingAppointment(true);
    
    try {
      await appointmentService.update(appointmentId, {
        status: "completed",
        notes: visitNotes
      });
      
      toast.success("Appointment completed successfully!");
      setSelectedPatient(null);
      setVisitNotes("");
      loadAppointments();
    } catch (err) {
      toast.error(err.message || "Failed to complete appointment");
    } finally {
      setUpdatingAppointment(false);
    }
  };

  const handleSaveNotes = async (appointmentId) => {
    try {
      await appointmentService.update(appointmentId, { notes: visitNotes });
      toast.success("Notes saved successfully!");
    } catch (err) {
      toast.error("Failed to save notes");
    }
  };

  if (loading) {
    return <Loading type="dashboard" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadAppointments} />;
  }

  if (selectedPatient) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedPatient(null)}
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{selectedPatient.patientName}</h1>
            <p className="text-gray-600">
              {selectedPatient.service} - {format(new Date(selectedPatient.date), "MMM dd, yyyy")} at {selectedPatient.timeSlot}
            </p>
          </div>
        </div>

        {/* Visit Notes */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Visit Notes</h2>
          <textarea
            value={visitNotes}
            onChange={(e) => setVisitNotes(e.target.value)}
            placeholder="Add notes about the patient's visit, diagnosis, treatment plan, etc."
            rows={6}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
          />
          <div className="flex justify-end space-x-3 mt-4">
            <Button
              variant="outline"
              onClick={() => handleSaveNotes(selectedPatient.Id)}
            >
              <ApperIcon name="Save" className="w-4 h-4 mr-2" />
              Save Notes
            </Button>
            {selectedPatient.status === "upcoming" && (
              <Button
                variant="success"
                onClick={() => handleCompleteAppointment(selectedPatient.Id)}
                disabled={updatingAppointment}
              >
                {updatingAppointment ? (
                  <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ApperIcon name="Check" className="w-4 h-4 mr-2" />
                )}
                Complete Visit
              </Button>
            )}
          </div>
        </div>

        {/* Patient Reports */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Medical Reports</h2>
          {patientReports.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No reports uploaded for this patient</p>
          ) : (
            <div className="space-y-3">
              {patientReports.map((report) => (
                <div key={report.Id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <ApperIcon name="FileText" className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{report.fileName}</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(report.uploadDate), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ApperIcon name="Eye" className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Good morning, Dr. {currentUser?.name?.split(" ").slice(-1)[0]}! 👨‍⚕️
            </h1>
            <p className="text-primary-100">
              {todaysAppointments.length > 0
                ? `You have ${todaysAppointments.length} appointment${todaysAppointments.length !== 1 ? "s" : ""} today`
                : "No appointments scheduled for today"
              }
            </p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <ApperIcon name="Stethoscope" className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Today's Schedule</h2>
        
        {todaysAppointments.length === 0 ? (
          <Empty
            title="No appointments today"
            description="Enjoy your free day! Your next appointments will appear here."
            icon="Calendar"
          />
        ) : (
          <div className="space-y-4">
            {todaysAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.Id}
                appointment={appointment}
                userRole="doctor"
                onAction={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewPatient(appointment)}
                  >
                    <ApperIcon name="Eye" className="w-4 h-4 mr-2" />
                    View Patient
                  </Button>
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Calendar" className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{todaysAppointments.length}</p>
              <p className="text-sm text-gray-600">Today</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {allAppointments.filter(a => a.status === "completed").length}
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 sm:col-span-1 col-span-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(allAppointments.map(a => a.patientId)).size}
              </p>
              <p className="text-sm text-gray-600">Total Patients</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Appointments */}
      {allAppointments.length > todaysAppointments.length && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Appointments</h2>
          <div className="space-y-4">
            {allAppointments
              .filter(apt => !todaysAppointments.some(today => today.Id === apt.Id))
              .slice(0, 3)
              .map((appointment) => (
                <AppointmentCard
                  key={appointment.Id}
                  appointment={appointment}
                  userRole="doctor"
                  onAction={
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewPatient(appointment)}
                    >
                      <ApperIcon name="Eye" className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  }
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboardPage;