import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import FileUpload from "@/components/molecules/FileUpload";
import ReportCard from "@/components/molecules/ReportCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import userService from "@/services/api/userService";
import appointmentService from "@/services/api/appointmentService";
import medicalReportService from "@/services/api/medicalReportService";

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState("");
  const currentUser = userService.getCurrentUser();

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [reportsData, appointmentsData] = await Promise.all([
        medicalReportService.getByPatientId(currentUser.Id),
        appointmentService.getByPatientId(currentUser.Id)
      ]);
      
      setReports(reportsData);
      setAppointments(appointmentsData);
    } catch (err) {
      setError(err.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  const handleFileSelect = async (file) => {
    setUploading(true);
    
    try {
      const appointmentId = selectedAppointment || null;
      await medicalReportService.uploadFile(file, currentUser.Id, appointmentId);
      
      toast.success("Report uploaded successfully!");
      setShowUpload(false);
      setSelectedAppointment("");
      loadData(); // Reload reports
    } catch (err) {
      toast.error(err.message || "Failed to upload report");
    } finally {
      setUploading(false);
    }
  };

  const handleViewReport = (report) => {
    // In a real app, this would open a file viewer or download the file
    toast.info(`Viewing ${report.fileName}`);
  };

  const handleDownloadReport = (report) => {
    // In a real app, this would download the file
    toast.success(`Downloading ${report.fileName}`);
  };

  if (loading) {
    return <Loading type="reports" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medical Reports</h1>
          <p className="text-gray-600">Upload and manage your medical documents</p>
        </div>
        <Button
          onClick={() => setShowUpload(!showUpload)}
          variant="primary"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Upload Report
        </Button>
      </div>

      {/* Upload Section */}
      {showUpload && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upload New Report</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUpload(false)}
            >
              <ApperIcon name="X" className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <FormField
              label="Associate with Appointment (Optional)"
              type="select"
              value={selectedAppointment}
              onChange={(e) => setSelectedAppointment(e.target.value)}
            >
              <option value="">No specific appointment</option>
              {appointments.map((appointment) => (
                <option key={appointment.Id} value={appointment.Id}>
                  {appointment.doctorName} - {appointment.date} at {appointment.timeSlot}
                </option>
              ))}
            </FormField>

            <FileUpload
              onFileSelect={handleFileSelect}
              disabled={uploading}
            />

            {uploading && (
              <div className="text-center py-4">
                <ApperIcon name="Loader2" className="w-6 h-6 animate-spin text-primary-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Uploading report...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reports List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Your Reports</h2>
        
        {reports.length === 0 ? (
          <Empty
            title="No reports uploaded"
            description="Upload your medical reports to keep them organized and easily accessible."
            icon="FileText"
            action={
              <Button onClick={() => setShowUpload(true)} variant="primary">
                <ApperIcon name="Upload" className="w-4 h-4 mr-2" />
                Upload First Report
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <ReportCard
                key={report.Id}
                report={report}
                onView={handleViewReport}
                onDownload={handleDownloadReport}
              />
            ))}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0">
            <ApperIcon name="Lightbulb" className="w-5 h-5 text-green-700" />
          </div>
          <div>
            <h3 className="font-semibold text-green-900 mb-2">Tips for Better Health Records</h3>
            <ul className="text-green-800 text-sm space-y-1">
              <li>• Upload reports immediately after visits</li>
              <li>• Include lab results, X-rays, and prescriptions</li>
              <li>• Keep files organized by date and type</li>
              <li>• Share relevant reports with your doctors</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;