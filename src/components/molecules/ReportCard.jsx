import React from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const ReportCard = ({ report, onView = null, onDownload = null }) => {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy 'at' h:mm a");
    } catch {
      return dateString;
    }
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case "pdf":
        return "FileText";
      case "image":
        return "Image";
      default:
        return "File";
    }
  };

  const getFileTypeColor = (fileType) => {
    switch (fileType) {
      case "pdf":
        return "text-red-600 bg-red-100";
      case "image":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <Card className="medical-card hover:shadow-lg transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getFileTypeColor(report.fileType)}`}>
            <ApperIcon name={getFileIcon(report.fileType)} className="w-6 h-6" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">
              {report.fileName}
            </h3>
            <p className="text-sm text-gray-600">
              Uploaded {formatDate(report.uploadDate)}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {onView && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(report)}
                className="text-primary-600 hover:text-primary-700"
              >
                <ApperIcon name="Eye" className="w-4 h-4" />
              </Button>
            )}
            {onDownload && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDownload(report)}
                className="text-secondary-600 hover:text-secondary-700"
              >
                <ApperIcon name="Download" className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportCard;