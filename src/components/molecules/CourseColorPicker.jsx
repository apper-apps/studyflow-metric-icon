import React from "react";
import { cn } from "@/utils/cn";

const CourseColorPicker = ({ selectedColor, onColorChange, className }) => {
  const colors = [
    { name: "Blue", value: "#0ea5e9", gradient: "from-blue-400 to-blue-600" },
    { name: "Green", value: "#10b981", gradient: "from-green-400 to-green-600" },
    { name: "Purple", value: "#8b5cf6", gradient: "from-purple-400 to-purple-600" },
    { name: "Pink", value: "#ec4899", gradient: "from-pink-400 to-pink-600" },
    { name: "Orange", value: "#f97316", gradient: "from-orange-400 to-orange-600" },
    { name: "Red", value: "#ef4444", gradient: "from-red-400 to-red-600" },
    { name: "Indigo", value: "#6366f1", gradient: "from-indigo-400 to-indigo-600" },
    { name: "Teal", value: "#14b8a6", gradient: "from-teal-400 to-teal-600" }
  ];

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium text-gray-700">Course Color</label>
      <div className="grid grid-cols-4 gap-2">
        {colors.map((color) => (
          <button
            key={color.value}
            type="button"
            onClick={() => onColorChange(color.value)}
            className={cn(
              "w-10 h-10 rounded-lg bg-gradient-to-br transition-all duration-200 hover:scale-110 focus:ring-2 focus:ring-offset-2 focus:ring-primary-400",
              color.gradient,
              selectedColor === color.value && "ring-2 ring-offset-2 ring-gray-400 scale-110"
            )}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseColorPicker;