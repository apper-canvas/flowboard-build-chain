import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ className }) => {
  return (
    <div className={cn("animate-pulse space-y-6", className)}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
        <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
      </div>

      {/* Kanban columns skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((column) => (
          <div key={column} className="bg-gray-50 rounded-xl p-4 min-h-[600px]">
            {/* Column header */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div className="h-5 w-24 bg-gray-300 rounded"></div>
              <div className="h-6 w-8 bg-gray-200 rounded-full"></div>
            </div>

            {/* Task cards */}
            <div className="space-y-3">
              {[1, 2, 3].map((task) => (
                <div key={task} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                      <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
                    </div>
                    <div className="h-3 w-full bg-gray-200 rounded"></div>
                    <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
                    <div className="flex items-center justify-between">
                      <div className="h-5 w-16 bg-gray-300 rounded-full"></div>
                      <div className="h-4 w-12 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;