import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Empty = ({ 
  title = "Nothing here yet", 
  description = "Get started by adding your first item", 
  icon = "Plus",
  buttonText = "Add Item",
  onAction,
  className 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center min-h-[300px] p-8", className)}>
      <div className="text-center space-y-6">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-50 to-primary-100 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} className="h-10 w-10 text-primary-600" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600 max-w-md">{description}</p>
        </div>

        {onAction && (
          <Button onClick={onAction} className="inline-flex items-center gap-2">
            <ApperIcon name={icon} className="h-4 w-4" />
            {buttonText}
          </Button>
        )}

        <div className="text-xs text-gray-500 mt-8">
          Start organizing your academic life with StudyFlow
        </div>
      </div>
    </div>
  );
};

export default Empty;