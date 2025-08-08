import React, { useState } from "react";
import TaskCard from "@/components/molecules/TaskCard";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";

const KanbanBoard = ({ 
  tasks, 
  onTaskUpdate, 
  onTaskEdit, 
  onTaskDelete, 
  onNewTask 
}) => {
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const columns = [
    { id: "todo", title: "To Do", color: "from-gray-500 to-gray-600" },
    { id: "progress", title: "In Progress", color: "from-primary-500 to-primary-600" },
    { id: "done", title: "Done", color: "from-success-500 to-success-600" }
  ];

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (columnId) => {
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData("text/plain"));
    
    if (draggedTask && draggedTask.Id === taskId && draggedTask.status !== targetStatus) {
      const updatedTask = { ...draggedTask, status: targetStatus };
      await onTaskUpdate(draggedTask.Id, updatedTask);
      toast.success(`Task moved to ${columns.find(c => c.id === targetStatus)?.title}`);
    }
    
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.id);
        const isDragOver = dragOverColumn === column.id;
        
        return (
          <div
            key={column.id}
            className={cn(
              "bg-gray-50 rounded-xl p-4 transition-all duration-200 min-h-[600px]",
              isDragOver && "bg-primary-50 ring-2 ring-primary-500 ring-opacity-50"
            )}
            onDragOver={handleDragOver}
            onDragEnter={() => handleDragEnter(column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-3 h-3 rounded-full bg-gradient-to-r shadow-lg",
                  column.color
                )} />
                <h3 className="font-display font-semibold text-gray-900">
                  {column.title}
                </h3>
                <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">
                  {columnTasks.length}
                </span>
              </div>
              
              {column.id === "todo" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNewTask(column.id)}
                  className="hover:bg-white"
                >
                  <ApperIcon name="Plus" size={16} />
                </Button>
              )}
            </div>

            {/* Tasks */}
            <div className="space-y-3">
              {columnTasks.map((task) => (
                <TaskCard
                  key={task.Id}
                  task={task}
                  onEdit={onTaskEdit}
                  onDelete={onTaskDelete}
                  draggable={true}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    draggedTask?.Id === task.Id && "opacity-50 transform rotate-2"
                  )}
                />
              ))}

              {columnTasks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <ApperIcon name="Package" size={48} className="mb-3 opacity-50" />
                  <p className="text-sm">No tasks yet</p>
                  {column.id === "todo" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onNewTask(column.id)}
                      className="mt-2"
                    >
                      Add first task
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;