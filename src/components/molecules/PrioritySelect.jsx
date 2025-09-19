import React from "react";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const PrioritySelect = ({ value, onChange, showBadge = false, className }) => {
  const priorities = [
    { value: "low", label: "Low Priority", color: "low", icon: "ArrowDown" },
    { value: "medium", label: "Medium Priority", color: "medium", icon: "Minus" },
    { value: "high", label: "High Priority", color: "high", icon: "ArrowUp" }
  ];

  if (showBadge) {
    const priority = priorities.find(p => p.value === value);
    if (!priority) return null;
    
    return (
      <Badge variant={priority.color} className="inline-flex items-center gap-1">
        <ApperIcon name={priority.icon} className="h-3 w-3" />
        {priority.label.replace(" Priority", "")}
      </Badge>
    );
  }

  return (
    <Select value={value} onChange={onChange} className={className}>
      <option value="">Select Priority</option>
      {priorities.map((priority) => (
        <option key={priority.value} value={priority.value}>
          {priority.label}
        </option>
      ))}
    </Select>
  );
};

export default PrioritySelect;