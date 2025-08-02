import React from "react";

/**
 * Skeleton loading component for course cards
 * Provides a placeholder UI while course data is being loaded
 */
const CourseCardSkeleton = () => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-xl border border-gray-700 animate-pulse">
      {/* Header section with icon and progress */}
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-gray-700/50 rounded-lg">
          <div className="w-6 h-6 bg-gray-600 rounded"></div>
        </div>
        <div className="flex flex-col items-end">
          <div className="w-12 h-3 bg-gray-600 rounded mb-1"></div>
          <div className="w-8 h-5 bg-gray-600 rounded"></div>
        </div>
      </div>

      {/* Title and description */}
      <div className="mb-4">
        <div className="w-3/4 h-6 bg-gray-600 rounded mb-2"></div>
        <div className="space-y-2">
          <div className="w-full h-4 bg-gray-600 rounded"></div>
          <div className="w-5/6 h-4 bg-gray-600 rounded"></div>
        </div>
      </div>

      {/* Progress section */}
      <div className="mt-auto">
        <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
          <div className="w-1/2 bg-gray-600 h-2 rounded-full"></div>
        </div>
        <div className="flex justify-between">
          <div className="w-20 h-3 bg-gray-600 rounded"></div>
          <div className="w-16 h-3 bg-gray-600 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default CourseCardSkeleton;