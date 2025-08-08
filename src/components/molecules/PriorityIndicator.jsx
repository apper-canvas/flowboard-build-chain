import React from "react";
import { cn } from "@/utils/cn";

const PriorityIndicator = ({ priority, size = "md", className }) => {
  const priorityConfig = {
    high: {
      color: "bg-error-500",
      label: "High Priority",
      glow: "shadow-error-500/30"
    },
    medium: {
      color: "bg-warning-500", 
      label: "Medium Priority",
      glow: "shadow-warning-500/30"
    },
    low: {
      color: "bg-success-500",
      label: "Low Priority", 
      glow: "shadow-success-500/30"
    }
  };

  const sizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4"
  };

  const config = priorityConfig[priority] || priorityConfig.low;

  return (
    <div
      className={cn(
        "rounded-full shadow-lg",
        config.color,
        config.glow,
        sizes[size],
        className
      )}
      title={config.label}
    />
  );
};

export default PriorityIndicator;