import React from "react";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";

const FormField = ({ 
  label, 
  type = "text", 
  error, 
  children, 
  className = "",
  ...props 
}) => {
  const renderInput = () => {
    if (type === "select") {
      return (
        <Select error={!!error} {...props}>
          {children}
        </Select>
      );
    }
    return <Input type={type} error={!!error} {...props} />;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <Label>{label}</Label>}
      {renderInput()}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormField;