import React, { useState, useEffect, useRef } from "react";
import TimelineTaskBar from "@/components/molecules/TimelineTaskBar";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, startOfDay, differenceInDays, addWeeks, subWeeks } from "date-fns";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";

function TimelineView({ tasks, onTaskUpdate, onTaskEdit, onTaskDelete, onNewTask }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewScale, setViewScale] = useState("week"); // "week" or "month"
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const timelineRef = useRef(null);

  // Calculate date range for current view
  const getDateRange = () => {
    if (viewScale === "week") {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      return eachDayOfInterval({
        start: weekStart,
        end: endOfWeek(weekStart, { weekStartsOn: 1 })
      });
    } else {
      // Month view - show 4 weeks
      const monthStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      return eachDayOfInterval({
        start: monthStart,
        end: addDays(monthStart, 27) // 4 weeks
      });
    }
  };

  const dateRange = getDateRange();
  const startDate = dateRange[0];
  const dayWidth = viewScale === "week" ? 120 : 40;

  // Navigate timeline
  const navigateTimeline = (direction) => {
    if (viewScale === "week") {
      setCurrentDate(prev => direction === "prev" ? subWeeks(prev, 1) : addWeeks(prev, 1));
    } else {
      setCurrentDate(prev => direction === "prev" ? subWeeks(prev, 4) : addWeeks(prev, 4));
    }
  };

  // Get task position and width
  const getTaskPosition = (task) => {
    const taskStart = task.startDate ? new Date(task.startDate) : new Date(task.createdAt);
    const taskEnd = task.dueDate ? new Date(task.dueDate) : addDays(taskStart, 1);
    
    const startDiff = differenceInDays(startOfDay(taskStart), startOfDay(startDate));
    const duration = differenceInDays(startOfDay(taskEnd), startOfDay(taskStart)) || 1;
    
    return {
      left: Math.max(0, startDiff * dayWidth),
      width: Math.max(dayWidth * 0.8, duration * dayWidth),
      visible: startDiff < dateRange.length && startDiff + duration > 0
    };
  };

  // Handle task drag
  const handleTaskDragStart = (task, e) => {
    setDraggedTask(task);
    const rect = e.target.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleTaskDrop = async (e) => {
    if (!draggedTask || !timelineRef.current) return;

    const timelineRect = timelineRef.current.getBoundingClientRect();
    const dropX = e.clientX - timelineRect.left - dragOffset.x;
    const dayIndex = Math.round(dropX / dayWidth);
    
    if (dayIndex >= 0 && dayIndex < dateRange.length) {
      const newStartDate = dateRange[dayIndex];
      const currentStart = draggedTask.startDate ? new Date(draggedTask.startDate) : new Date(draggedTask.createdAt);
      const currentEnd = draggedTask.dueDate ? new Date(draggedTask.dueDate) : addDays(currentStart, 1);
      const duration = differenceInDays(currentEnd, currentStart) || 1;
      
      const newEndDate = addDays(newStartDate, duration);

      try {
        await onTaskUpdate(draggedTask.Id, {
          startDate: newStartDate.toISOString(),
          dueDate: newEndDate.toISOString()
        });
        toast.success(`Task "${draggedTask.title}" rescheduled successfully`);
      } catch (error) {
        toast.error("Failed to reschedule task");
      }
    }

    setDraggedTask(null);
    setDragOffset({ x: 0, y: 0 });
  };

  // Get tasks by priority for layering
  const taskLayers = {
    high: tasks.filter(t => t.priority === "high"),
    medium: tasks.filter(t => t.priority === "medium"),
    low: tasks.filter(t => t.priority === "low")
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Timeline Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateTimeline("prev")}
            >
              <ApperIcon name="ChevronLeft" size={16} />
            </Button>
            <h3 className="text-lg font-semibold text-gray-900">
              {viewScale === "week" 
                ? `Week of ${format(startDate, "MMM d, yyyy")}`
                : `${format(startDate, "MMM d")} - ${format(dateRange[dateRange.length - 1], "MMM d, yyyy")}`
              }
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateTimeline("next")}
            >
              <ApperIcon name="ChevronRight" size={16} />
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={viewScale}
            onChange={(e) => setViewScale(e.target.value)}
            className="w-24"
          >
            <option value="week">Week</option>
            <option value="month">Month</option>
          </Select>
          
          <Button onClick={() => onNewTask()} variant="primary" size="sm">
            <ApperIcon name="Plus" size={14} />
            Add Task
          </Button>
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="relative">
        {/* Date Headers */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <div className="w-48 px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200">
            Task
          </div>
          <div className="flex flex-1">
            {dateRange.map((date, index) => (
              <div
                key={date.toISOString()}
                className="flex-none border-r border-gray-200 last:border-r-0 px-2 py-3 text-center"
                style={{ width: dayWidth }}
              >
                <div className="text-xs font-medium text-gray-700">
                  {format(date, viewScale === "week" ? "EEE" : "dd")}
                </div>
                <div className="text-xs text-gray-500">
                  {format(date, viewScale === "week" ? "MMM d" : "MMM")}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Content */}
        <div
          ref={timelineRef}
          className="relative"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleTaskDrop}
        >
          {/* Priority Layers */}
          {Object.entries(taskLayers).map(([priority, layerTasks], layerIndex) => (
            <div key={priority} className="relative">
              {layerTasks.map((task, taskIndex) => {
                const position = getTaskPosition(task);
                
                if (!position.visible) return null;

                return (
                  <div key={task.Id} className="relative">
                    {/* Task Row Background */}
                    <div className="flex border-b border-gray-100 hover:bg-gray-50">
                      <div className="w-48 px-4 py-3 border-r border-gray-200">
                        <div className="truncate text-sm font-medium text-gray-900">
                          {task.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {task.projectId ? `Project ${task.projectId}` : "No Project"}
                        </div>
                      </div>
                      
                      {/* Timeline Area */}
                      <div className="flex-1 relative py-3" style={{ height: "60px" }}>
                        <TimelineTaskBar
                          task={task}
                          position={position}
                          dayWidth={dayWidth}
                          onDragStart={handleTaskDragStart}
                          onEdit={() => onTaskEdit(task)}
                          onDelete={() => onTaskDelete(task)}
                          isDragging={draggedTask?.Id === task.Id}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Grid Lines */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="flex">
              <div className="w-48"></div>
              <div className="flex flex-1">
                {dateRange.map((date, index) => (
                  <div
                    key={date.toISOString()}
                    className="border-r border-gray-100 last:border-r-0"
                    style={{ width: dayWidth }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {tasks.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <ApperIcon name="Calendar" size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks scheduled</h3>
              <p className="text-gray-500 mb-4">Create your first task to see it on the timeline</p>
              <Button onClick={() => onNewTask()} variant="primary">
                <ApperIcon name="Plus" size={16} />
                Create Task
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TimelineView;