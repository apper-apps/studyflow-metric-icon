import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Error = ({ message = "Something went wrong", onRetry, className }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center min-h-[400px] p-8", className)}>
      <div className="text-center space-y-6">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertTriangle" className="h-8 w-8 text-red-600" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">Oops! Something went wrong</h3>
          <p className="text-gray-600 max-w-md">{message}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <Button onClick={onRetry} className="inline-flex items-center gap-2">
              <ApperIcon name="RefreshCw" className="h-4 w-4" />
              Try Again
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2"
          >
            <ApperIcon name="Home" className="h-4 w-4" />
            Go Home
          </Button>
        </div>

        <div className="text-xs text-gray-500 mt-8">
          If this problem persists, please check your internet connection or try refreshing the page.
        </div>
      </div>
    </div>
  );
};

export default Error;