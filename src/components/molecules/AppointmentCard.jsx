import React from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/atoms/Card";
import StatusBadge from "@/components/molecules/StatusBadge";
import ApperIcon from "@/components/ApperIcon";

const AppointmentCard = ({ appointment, userRole = "patient", onAction = null }) => {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <Card className="medical-card hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary-500">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
              <ApperIcon name="Calendar" className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {userRole === "patient" ? appointment.doctorName : appointment.patientName}
              </h3>
              <p className="text-sm text-gray-600">{appointment.service}</p>
            </div>
          </div>
          <StatusBadge status={appointment.status} />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Calendar" className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{formatDate(appointment.date)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <ApperIcon name="Clock" className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{appointment.timeSlot}</span>
          </div>
        </div>

        {appointment.notes && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">{appointment.notes}</p>
          </div>
        )}

        {onAction && (
          <div className="flex justify-end">
            {onAction}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;