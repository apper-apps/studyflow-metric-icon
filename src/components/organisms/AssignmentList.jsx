import React, { useState, useEffect } from "react";
import { format, isAfter, isBefore, addDays, parseISO } from "date-fns";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import PrioritySelect from "@/components/molecules/PrioritySelect";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { assignmentService } from "@/services/api/assignmentService";
import { courseService } from "@/services/api/courseService";
import { cn } from "@/utils/cn";

const AssignmentList = ({ onAddAssignment, onEditAssignment }) => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      const [assignmentData, courseData] = await Promise.all([
        assignmentService.getAll(),
        courseService.getAll()
      ]);
      setAssignments(assignmentData);
      setCourses(courseData);
    } catch (err) {
      setError("Failed to load assignments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (assignmentId, newStatus) => {
    try {
      const assignment = assignments.find(a => a.Id === assignmentId);
      await assignmentService.update(assignmentId, { ...assignment, status: newStatus });
      setAssignments(prev => prev.map(a => 
        a.Id === assignmentId ? { ...a, status: newStatus } : a
      ));
    } catch (err) {
      setError("Failed to update assignment status.");
    }
  };

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.Id === courseId);
    return course ? course.name : "Unknown Course";
  };

  const getCourseColor = (courseId) => {
    const course = courses.find(c => c.Id === courseId);
    return course ? course.color : "#6b7280";
  };

  const getDueDateBadge = (dueDate) => {
    const due = parseISO(dueDate);
    const today = new Date();
    const tomorrow = addDays(today, 1);
    const nextWeek = addDays(today, 7);

    if (isBefore(due, today)) {
      return { variant: "error", text: "Overdue", icon: "AlertTriangle" };
    } else if (isBefore(due, tomorrow)) {
      return { variant: "error", text: "Due Today", icon: "Clock" };
    } else if (isBefore(due, addDays(today, 3))) {
      return { variant: "warning", text: "Due Soon", icon: "Clock" };
    } else if (isBefore(due, nextWeek)) {
      return { variant: "primary", text: "This Week", icon: "Calendar" };
    }
    return { variant: "default", text: "Later", icon: "Calendar" };
  };

  // Filter and sort assignments
  const filteredAndSortedAssignments = assignments
    .filter(assignment => {
      const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           getCourseName(assignment.courseId).toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "all" || assignment.status === filterStatus;
      const matchesPriority = filterPriority === "all" || assignment.priority === filterPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          return new Date(a.dueDate) - new Date(b.dueDate);
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "course":
          return getCourseName(a.courseId).localeCompare(getCourseName(b.courseId));
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SearchBar
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-10 rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm focus:border-primary-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="h-10 rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm focus:border-primary-500"
          >
            <option value="all">All Priority</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm focus:border-primary-500"
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="course">Sort by Course</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>
      </div>

      {/* Assignment List */}
      {filteredAndSortedAssignments.length === 0 ? (
        <Empty
          icon="CheckSquare"
          title="No assignments found"
          description="Add your first assignment or adjust your filters to see results"
          buttonText="Add Assignment"
          onAction={onAddAssignment}
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredAndSortedAssignments.map((assignment) => {
              const dueBadge = getDueDateBadge(assignment.dueDate);
              const courseColor = getCourseColor(assignment.courseId);
              
              return (
                <div 
                  key={assignment.Id} 
                  className="p-6 hover:bg-gray-50 transition-colors border-l-4"
                  style={{ borderLeftColor: courseColor }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      {/* Status Checkbox */}
                      <div className="flex-shrink-0">
                        <button
                          onClick={() => handleStatusChange(assignment.Id, 
                            assignment.status === "completed" ? "pending" : "completed")}
                          className={cn(
                            "w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200",
                            assignment.status === "completed"
                              ? "bg-accent-500 border-accent-500 text-white"
                              : "border-gray-300 hover:border-accent-400"
                          )}
                        >
                          {assignment.status === "completed" && (
                            <ApperIcon name="Check" className="h-3 w-3" />
                          )}
                        </button>
                      </div>

                      {/* Assignment Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className={cn(
                            "text-lg font-medium truncate",
                            assignment.status === "completed" 
                              ? "text-gray-500 line-through" 
                              : "text-gray-900"
                          )}>
                            {assignment.title}
                          </h3>
                          <PrioritySelect value={assignment.priority} showBadge />
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span 
                            className="font-medium"
                            style={{ color: courseColor }}
                          >
                            {getCourseName(assignment.courseId)}
                          </span>
                          <span>•</span>
                          <span>{format(parseISO(assignment.dueDate), "MMM d, yyyy")}</span>
                          {assignment.estimatedTime && (
                            <>
                              <span>•</span>
                              <span>{assignment.estimatedTime}h estimated</span>
                            </>
                          )}
                        </div>

                        {assignment.notes && (
                          <p className="text-sm text-gray-600 mt-2 truncate">
                            {assignment.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Badges and Actions */}
                    <div className="flex items-center space-x-3 flex-shrink-0">
                      <Badge variant={dueBadge.variant} className="inline-flex items-center gap-1">
                        <ApperIcon name={dueBadge.icon} className="h-3 w-3" />
                        {dueBadge.text}
                      </Badge>

                      {assignment.grade && (
                        <Badge variant="accent" className="font-medium">
                          {assignment.grade}%
                        </Badge>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditAssignment(assignment)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <ApperIcon name="Edit2" className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentList;