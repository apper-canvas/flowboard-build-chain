import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Chart from "react-apexcharts";
import { cn } from "@/utils/cn";

const ProjectStats = ({ tasks }) => {
  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === "todo").length,
    progress: tasks.filter(t => t.status === "progress").length,
    done: tasks.filter(t => t.status === "done").length,
    overdue: tasks.filter(t => 
      t.dueDate && 
      new Date(t.dueDate) < new Date() && 
      t.status !== "done"
    ).length
  };

  const completionRate = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  const priorityStats = {
    high: tasks.filter(t => t.priority === "high").length,
    medium: tasks.filter(t => t.priority === "medium").length,
    low: tasks.filter(t => t.priority === "low").length
  };

  const chartOptions = {
    chart: {
      type: "donut",
      toolbar: { show: false }
    },
    colors: ["#9CA3AF", "#4F46E5", "#10B981"],
    labels: ["To Do", "In Progress", "Done"],
    legend: {
      position: "bottom",
      horizontalAlign: "center"
    },
    dataLabels: {
      enabled: false
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%"
        }
      }
    }
  };

  const chartSeries = [stats.todo, stats.progress, stats.done];

  const statCards = [
    {
      label: "Total Tasks",
      value: stats.total,
      icon: "ClipboardList",
      color: "from-gray-500 to-gray-600",
      bgColor: "bg-gray-50"
    },
    {
      label: "In Progress", 
      value: stats.progress,
      icon: "Clock",
      color: "from-primary-500 to-primary-600",
      bgColor: "bg-primary-50"
    },
    {
      label: "Completed",
      value: stats.done,
      icon: "CheckCircle2",
      color: "from-success-500 to-success-600", 
      bgColor: "bg-success-50"
    },
    {
      label: "Overdue",
      value: stats.overdue,
      icon: "AlertTriangle",
      color: "from-error-500 to-error-600",
      bgColor: "bg-error-50"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className={cn("p-6 hover:shadow-lg transition-all duration-200", stat.bgColor)}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className={cn(
                  "text-3xl font-bold font-display bg-gradient-to-r bg-clip-text text-transparent",
                  stat.color
                )}>
                  {stat.value}
                </p>
              </div>
              <div className={cn(
                "w-12 h-12 rounded-lg bg-gradient-to-r flex items-center justify-center shadow-lg",
                stat.color
              )}>
                <ApperIcon name={stat.icon} size={24} className="text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-semibold text-gray-900">Task Distribution</h3>
            <div className={cn(
              "text-2xl font-bold bg-gradient-to-r from-success-500 to-success-600 bg-clip-text text-transparent"
            )}>
              {completionRate}% Complete
            </div>
          </div>
          
          {stats.total > 0 ? (
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="donut"
              height={280}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <ApperIcon name="PieChart" size={48} className="mb-3 opacity-50" />
              <p className="text-sm">No tasks to display</p>
            </div>
          )}
        </Card>

        {/* Priority Breakdown */}
        <Card className="p-6">
          <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">Priority Breakdown</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-error-500 to-error-600"></div>
                <span className="text-sm font-medium text-gray-700">High Priority</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{priorityStats.high}</span>
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-error-500 to-error-600 transition-all duration-300"
                    style={{ 
                      width: stats.total > 0 ? `${(priorityStats.high / stats.total) * 100}%` : "0%" 
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-warning-500 to-warning-600"></div>
                <span className="text-sm font-medium text-gray-700">Medium Priority</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{priorityStats.medium}</span>
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-warning-500 to-warning-600 transition-all duration-300"
                    style={{ 
                      width: stats.total > 0 ? `${(priorityStats.medium / stats.total) * 100}%` : "0%" 
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-success-500 to-success-600"></div>
                <span className="text-sm font-medium text-gray-700">Low Priority</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{priorityStats.low}</span>
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-success-500 to-success-600 transition-all duration-300"
                    style={{ 
                      width: stats.total > 0 ? `${(priorityStats.low / stats.total) * 100}%` : "0%" 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {stats.total === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <ApperIcon name="Target" size={32} className="mb-2 opacity-50" />
              <p className="text-sm">No priority data available</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ProjectStats;