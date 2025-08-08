import React from "react";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const FilterBar = ({ 
  statusFilter, 
  priorityFilter, 
  onStatusChange, 
  onPriorityChange,
  onClearFilters,
  className 
}) => {
  return (
    <div className={cn("flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200", className)}>
      <div className="flex items-center gap-2">
        <ApperIcon name="Filter" size={16} className="text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Filters:</span>
      </div>
      
      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-600">Status:</label>
        <Select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-32"
        >
          <option value="">All Status</option>
          <option value="todo">To Do</option>
          <option value="progress">In Progress</option>
          <option value="done">Done</option>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-600">Priority:</label>
        <Select
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="w-32"
        >
          <option value="">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </Select>
      </div>

      {(statusFilter || priorityFilter) && (
        <button
          onClick={onClearFilters}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ApperIcon name="X" size={12} />
          Clear
        </button>
      )}
    </div>
  );
};

export default FilterBar;