import React from "react";
import { cn } from "@/utils/cn";

const Badge = ({ 
  className, 
  variant = "default",
  size = "md",
  children,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200";
  
  const variants = {
    default: "bg-gray-100 text-gray-700",
    high: "bg-gradient-to-r from-error-500 to-error-600 text-white shadow-lg",
    medium: "bg-gradient-to-r from-warning-500 to-warning-600 text-white shadow-lg",
    low: "bg-gradient-to-r from-success-500 to-success-600 text-white shadow-lg",
    todo: "bg-gradient-to-r from-gray-400 to-gray-500 text-white",
    progress: "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg",
    done: "bg-gradient-to-r from-success-500 to-success-600 text-white shadow-lg"
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm"
  };

  return (
    <span
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;