import React, { useState, useEffect } from "react";
import KanbanBoard from "@/components/organisms/KanbanBoard";
import TimelineView from "@/components/organisms/TimelineView";
import TaskModal from "@/components/organisms/TaskModal";
import FilterBar from "@/components/molecules/FilterBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { taskService } from "@/services/api/taskService";
import { toast } from "react-toastify";
const Board = () => {
const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("kanban"); // "kanban" or "timeline"
  
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const loadTasks = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await taskService.getActive();
      setTasks(data);
    } catch (err) {
      setError(err.message || "Failed to load tasks");
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    let filtered = [...tasks];

    if (statusFilter) {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    if (priorityFilter) {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    setFilteredTasks(filtered);
  }, [tasks, statusFilter, priorityFilter]);

  const handleNewTask = (status = "todo") => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (selectedTask) {
        await taskService.update(selectedTask.Id, taskData);
        toast.success("Task updated successfully");
      } else {
        await taskService.create({ ...taskData, projectId: "1" });
        toast.success("Task created successfully");
      }
      await loadTasks();
    } catch (err) {
      toast.error(err.message || "Failed to save task");
      throw err;
    }
  };

  const handleDeleteTask = async (taskOrId) => {
    try {
      const id = typeof taskOrId === "object" ? taskOrId.Id : taskOrId;
      await taskService.delete(id);
      toast.success("Task deleted successfully");
      await loadTasks();
    } catch (err) {
      toast.error(err.message || "Failed to delete task");
    }
  };

  const handleTaskUpdate = async (id, taskData) => {
    try {
      await taskService.update(id, taskData);
      await loadTasks();
    } catch (err) {
      toast.error(err.message || "Failed to update task");
    }
  };

  const handleClearFilters = () => {
    setStatusFilter("");
    setPriorityFilter("");
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadTasks} />;
  }

  return (
<div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Project Board
          </h1>
          <p className="text-gray-600">
            {viewMode === "kanban" 
              ? "Manage your tasks with drag-and-drop simplicity" 
              : "Visualize project timelines and task schedules"
            }
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === "kanban" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("kanban")}
              className="px-3 py-1.5 text-sm"
            >
              <ApperIcon name="Columns" size={14} />
              Kanban
            </Button>
            <Button
              variant={viewMode === "timeline" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("timeline")}
              className="px-3 py-1.5 text-sm"
            >
              <ApperIcon name="Calendar" size={14} />
              Timeline
            </Button>
          </div>
          
          <Button onClick={() => handleNewTask()} variant="primary">
            <ApperIcon name="Plus" size={16} />
            New Task
          </Button>
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        onStatusChange={setStatusFilter}
        onPriorityChange={setPriorityFilter}
        onClearFilters={handleClearFilters}
      />
{/* Board Content */}
      {filteredTasks.length === 0 ? (
        <Empty
          title="No tasks found"
          description="Start organizing your work by creating your first task."
          icon={viewMode === "kanban" ? "Kanban" : "Calendar"}
          actionLabel="Create First Task"
          onAction={() => handleNewTask()}
        />
      ) : viewMode === "kanban" ? (
        <KanbanBoard
          tasks={filteredTasks}
          onTaskUpdate={handleTaskUpdate}
          onTaskEdit={handleEditTask}
          onTaskDelete={handleDeleteTask}
          onNewTask={handleNewTask}
        />
      ) : (
        <TimelineView
          tasks={filteredTasks}
          onTaskUpdate={handleTaskUpdate}
          onTaskEdit={handleEditTask}
          onTaskDelete={handleDeleteTask}
          onNewTask={handleNewTask}
        />
      )}

      {/* Task Modal */}
      <TaskModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
};

export default Board;