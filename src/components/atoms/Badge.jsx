import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ className, variant = "default", children, ...props }, ref) => {
  const variants = {
    default: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300",
    primary: "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-sm",
    secondary: "bg-gradient-to-r from-secondary-500 to-secondary-600 text-white shadow-sm",
    accent: "bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-sm",
    success: "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm",
    warning: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-sm",
    error: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm",
    high: "priority-high",
    medium: "priority-medium",
    low: "priority-low"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Badge.displayName = "Badge";

export default Badge;