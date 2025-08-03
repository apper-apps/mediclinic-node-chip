import React from "react";
import Badge from "@/components/atoms/Badge";

const StatusBadge = ({ status, className = "" }) => {
  const getVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "upcoming":
        return "upcoming";
      case "completed":
        return "completed";
      case "cancelled":
        return "cancelled";
      default:
        return "default";
    }
  };

  const getLabel = (status) => {
    switch (status?.toLowerCase()) {
      case "upcoming":
        return "Upcoming";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return status || "Unknown";
    }
  };

  return (
    <Badge 
      variant={getVariant(status)} 
      className={className}
    >
      {getLabel(status)}
    </Badge>
  );
};

export default StatusBadge;