import React, { useRef } from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const FileUpload = ({ 
  onFileSelect = () => {}, 
  acceptedTypes = ".pdf,.jpg,.jpeg,.png",
  maxSize = 5 * 1024 * 1024, // 5MB 
  disabled = false,
  multiple = false
}) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files || []);
    
    for (const file of files) {
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is ${Math.round(maxSize / (1024 * 1024))}MB`);
        continue;
      }
      onFileSelect(file);
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
      
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-400 transition-colors duration-200">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <ApperIcon name="Upload" className="w-6 h-6 text-primary-600" />
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Upload Medical Report
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Choose a PDF or image file to upload
            </p>
            
            <Button 
              onClick={handleButtonClick}
              disabled={disabled}
              variant="primary"
            >
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              Choose File
            </Button>
          </div>
          
          <div className="text-xs text-gray-500">
            Supported formats: PDF, JPG, PNG (Max {Math.round(maxSize / (1024 * 1024))}MB)
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;