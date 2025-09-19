import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ className, variant = "default", size = "default", children, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg hover:from-primary-600 hover:to-primary-700 hover:shadow-xl active:scale-95",
    secondary: "bg-gradient-to-r from-secondary-500 to-secondary-600 text-white shadow-lg hover:from-secondary-600 hover:to-secondary-700 hover:shadow-xl active:scale-95",
    accent: "bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg hover:from-accent-600 hover:to-accent-700 hover:shadow-xl active:scale-95",
    outline: "border-2 border-primary-200 bg-white text-primary-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:border-primary-300 active:scale-95",
    ghost: "text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 active:scale-95",
    link: "text-primary-600 underline-offset-4 hover:underline hover:text-primary-700 active:scale-95"
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 text-sm",
    lg: "h-12 px-6 text-lg",
    icon: "h-10 w-10"
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;