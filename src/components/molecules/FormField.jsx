import React from "react";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import { cn } from "@/utils/cn";

const FormField = ({ label, type = "text", error, className, children, ...props }) => {
  const renderInput = () => {
    if (children) return children;
    
    switch (type) {
      case "select":
        return <Select {...props} />;
      case "textarea":
        return <Textarea {...props} />;
      default:
        return <Input type={type} {...props} />;
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </Label>
      )}
      {renderInput()}
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField;