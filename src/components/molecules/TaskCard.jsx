import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import PriorityIndicator from "@/components/molecules/PriorityIndicator";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";
import { cn } from "@/utils/cn";

const TaskCard = ({ 
  task, 
  onEdit, 
  onDelete,
  draggable = false,
  onDragStart,
  onDragEnd,
  className 
}) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done";

  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", task.Id.toString());
    if (onDragStart) onDragStart(task);
  };

  return (
    <Card
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      className={cn(
        "p-4 cursor-pointer hover:scale-[1.02] transition-all duration-200 group",
        draggable && "hover:shadow-xl",
        className
      )}
      onClick={() => onEdit && onEdit(task)}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
<div className="flex items-center gap-2">
            <PriorityIndicator priority={task.priority} />
            <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
              {task.title}
            </h3>
          </div>
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task);
              }}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-error-500 transition-all p-1 rounded"
            >
              <ApperIcon name="Trash2" size={14} />
            </button>
          )}
        </div>

        {/* Description */}
{task.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
<Badge variant={task.status} size="sm">
            {task.status === "todo" ? "To Do" : 
             task.status === "progress" ? "In Progress" : 
             "Done"}
          </Badge>
          
          {task.dueDate && (
            <div className={cn(
              "flex items-center gap-1 text-xs",
              isOverdue ? "text-error-600" : "text-gray-500"
            )}>
              <ApperIcon name="Calendar" size={12} />
              {format(new Date(task.dueDate), "MMM d")}
              {isOverdue && <ApperIcon name="AlertCircle" size={12} />}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;