import React from "react";
import { cn } from "@/utils/cn";

const GradeRing = ({ percentage, size = 80, strokeWidth = 6, className }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getGradeColor = (grade) => {
    if (grade >= 90) return "#10b981"; // Green
    if (grade >= 80) return "#06b6d4"; // Cyan  
    if (grade >= 70) return "#f59e0b"; // Yellow
    return "#ef4444"; // Red
  };

  return (
    <div className={cn("relative", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getGradeColor(percentage)}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="grade-progress transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-gray-900">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
};

export default GradeRing;