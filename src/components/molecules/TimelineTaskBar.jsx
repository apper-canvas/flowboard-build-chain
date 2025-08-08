import React, { useState } from "react";
import Badge from "@/components/atoms/Badge";
import PriorityIndicator from "@/components/molecules/PriorityIndicator";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";
import { cn } from "@/utils/cn";

function TimelineTaskBar({ 
  task, 
  position, 
  dayWidth, 
  onDragStart, 
  onEdit, 
  onDelete, 
  isDragging 
}) {
  const [isHovered, setIsHovered] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-500 hover:bg-red-600";
      case "medium": return "bg-yellow-500 hover:bg-yellow-600";
      case "low": return "bg-green-500 hover:bg-green-600";
      default: return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "done": return "border-green-500";
      case "progress": return "border-blue-500";
      case "todo": return "border-gray-400";
      default: return "border-gray-400";
    }
  };

  return (
    <div
      className={cn(
        "absolute top-1 rounded-md cursor-grab active:cursor-grabbing transition-all duration-200",
        "shadow-sm border-2 text-white text-xs font-medium",
        getPriorityColor(task.priority),
        getStatusColor(task.status),
        isDragging && "opacity-70 z-50 rotate-1",
        isHovered && "shadow-lg scale-105"
      )}
      style={{
        left: position.left,
        width: Math.max(position.width, 100),
        height: "32px"
      }}
      draggable
      onDragStart={(e) => onDragStart(task, e)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center h-full px-2 relative">
{/* Priority Indicator */}
        <div className="flex-shrink-0 mr-2">
          <PriorityIndicator priority={task.priority} size="sm" />
        </div>

        {/* Task Title */}
        <div className="flex-1 truncate">
          {task.title}
        </div>

        {/* Task Actions (shown on hover) */}
        {isHovered && (
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="w-5 h-5 rounded bg-black/20 hover:bg-black/30 flex items-center justify-center transition-colors"
            >
              <ApperIcon name="Edit2" size={10} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="w-5 h-5 rounded bg-black/20 hover:bg-red-500 flex items-center justify-center transition-colors"
            >
              <ApperIcon name="Trash2" size={10} />
            </button>
          </div>
        )}
      </div>

      {/* Tooltip */}
      {isHovered && (
<div className="absolute bottom-full left-0 mb-2 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10 whitespace-nowrap">
          <div className="font-medium">{task.title}</div>
          <div className="text-gray-300">
            {task.startDate && format(new Date(task.startDate), "MMM d")} - {" "}
            {task.dueDate && format(new Date(task.dueDate), "MMM d, yyyy")}
          </div>
          {task.description && (
            <div className="text-gray-400 max-w-48 truncate">
              {task.description}
            </div>
          )}
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={task.status} size="sm">{task.status}</Badge>
            <Badge variant={task.priority} size="sm">{task.priority}</Badge>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimelineTaskBar;