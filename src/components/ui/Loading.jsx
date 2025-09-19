import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ className, type = "skeleton" }) => {
  if (type === "spinner") {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4 p-6", className)}>
      {/* Dashboard skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg shimmer"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer w-2/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Course cards skeleton */}
      <div className="space-y-4">
        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer w-32"></div>
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full shimmer"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer w-24"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer w-40"></div>
                </div>
                <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assignment list skeleton */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer w-48"></div>
        </div>
        <div className="divide-y divide-gray-200">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="p-6 flex items-center space-x-4">
              <div className="w-4 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer w-64"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer w-32"></div>
              </div>
              <div className="flex space-x-2">
                <div className="w-16 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer"></div>
                <div className="w-20 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;