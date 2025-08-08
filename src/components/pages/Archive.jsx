import React, { useState, useEffect } from "react";
import TaskCard from "@/components/molecules/TaskCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { taskService } from "@/services/api/taskService";
import { toast } from "react-toastify";
import { format } from "date-fns";

const Archive = () => {
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadArchivedTasks = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await taskService.getArchived();
      setArchivedTasks(data);
    } catch (err) {
      setError(err.message || "Failed to load archived tasks");
      toast.error("Failed to load archived tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArchivedTasks();
  }, []);

  const handleRestoreTask = async (task) => {
    try {
      await taskService.restore(task.Id);
      toast.success("Task restored successfully");
      await loadArchivedTasks();
    } catch (err) {
      toast.error(err.message || "Failed to restore task");
    }
  };

  const handleDeletePermanently = async (task) => {
    if (!window.confirm("Are you sure you want to permanently delete this task? This action cannot be undone.")) {
      return;
    }

    try {
      await taskService.delete(task.Id);
      toast.success("Task permanently deleted");
      await loadArchivedTasks();
    } catch (err) {
      toast.error(err.message || "Failed to delete task");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded-lg mb-2"></div>
          <div className="h-4 w-96 bg-gray-200 rounded"></div>
        </div>

        {/* Task list skeleton */}
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                  <div className="h-5 w-64 bg-gray-200 rounded"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-20 bg-gray-200 rounded"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="h-4 w-full bg-gray-100 rounded mb-2"></div>
              <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <Error message={error} onRetry={loadArchivedTasks} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center shadow-lg">
          <ApperIcon name="Archive" size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Task Archive
          </h1>
          <p className="text-gray-600">
            View and manage your completed and archived tasks
          </p>
        </div>
      </div>

      {/* Stats */}
      {archivedTasks.length > 0 && (
        <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2">
            <ApperIcon name="Archive" size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600">
              {archivedTasks.length} archived task{archivedTasks.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      )}

      {/* Archived Tasks */}
      {archivedTasks.length === 0 ? (
        <Empty
          title="No archived tasks"
          description="Completed and archived tasks will appear here. You can restore them or delete them permanently."
          icon="Archive"
        />
      ) : (
        <div className="space-y-4">
          {archivedTasks.map((task) => (
            <div
              key={task.Id}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Archived on {format(new Date(task.updatedAt), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRestoreTask(task)}
                  >
                    <ApperIcon name="RotateCcw" size={14} />
                    Restore
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeletePermanently(task)}
                  >
                    <ApperIcon name="Trash2" size={14} />
                    Delete
                  </Button>
                </div>
              </div>

              {task.description && (
                <p className="text-sm text-gray-600 mb-4 pl-6">
                  {task.description}
                </p>
              )}

              <div className="flex items-center gap-4 pl-6 text-xs text-gray-500">
                <span className="capitalize">Priority: {task.priority}</span>
                {task.dueDate && (
                  <span>Due: {format(new Date(task.dueDate), "MMM d, yyyy")}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Archive;