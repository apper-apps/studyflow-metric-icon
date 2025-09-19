import React, { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, parseISO, isToday } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { assignmentService } from "@/services/api/assignmentService";
import { courseService } from "@/services/api/courseService";
import { cn } from "@/utils/cn";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState("month");

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
      setError("Failed to load calendar data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.Id === courseId);
    return course ? course.name : "Unknown Course";
  };

  const getCourseColor = (courseId) => {
    const course = courses.find(c => c.Id === courseId);
    return course ? course.color : "#6b7280";
  };

  const getAssignmentsForDate = (date) => {
    return assignments.filter(assignment => 
      isSameDay(parseISO(assignment.dueDate), date)
    );
  };

  const getSelectedDateAssignments = () => {
    return getAssignmentsForDate(selectedDate);
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const dayAssignments = getAssignmentsForDate(day);
        
        days.push(
          <div
            className={cn(
              "min-h-[120px] border border-gray-200 p-2 cursor-pointer transition-all duration-200",
              !isSameMonth(day, monthStart) && "text-gray-400 bg-gray-50",
              isSameDay(day, selectedDate) && "bg-primary-50 border-primary-300",
              isToday(day) && "bg-accent-50 border-accent-300 font-semibold",
              "hover:bg-gray-50"
            )}
            key={day}
            onClick={() => setSelectedDate(cloneDay)}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={cn(
                "text-sm font-medium",
                !isSameMonth(day, monthStart) && "text-gray-400",
                isToday(day) && "text-accent-700"
              )}>
                {formattedDate}
              </span>
              {dayAssignments.length > 0 && (
                <Badge variant="primary" className="text-xs h-5">
                  {dayAssignments.length}
                </Badge>
              )}
            </div>
            
            <div className="space-y-1">
              {dayAssignments.slice(0, 2).map((assignment) => (
                <div
                  key={assignment.Id}
                  className="text-xs p-1 rounded text-white truncate"
                  style={{ backgroundColor: getCourseColor(assignment.courseId) }}
                  title={`${assignment.title} - ${getCourseName(assignment.courseId)}`}
                >
                  {assignment.title}
                </div>
              ))}
              {dayAssignments.length > 2 && (
                <div className="text-xs text-gray-500">
                  +{dayAssignments.length - 2} more
                </div>
              )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="space-y-0">{rows}</div>;
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate);
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      const day = addDays(weekStart, i);
      const dayAssignments = getAssignmentsForDate(day);
      
      days.push(
        <div key={day} className="border border-gray-200 min-h-[300px] p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className={cn(
              "font-medium",
              isToday(day) && "text-accent-700 font-semibold"
            )}>
              {format(day, "EEE d")}
            </h3>
            {dayAssignments.length > 0 && (
              <Badge variant="primary" className="text-xs">
                {dayAssignments.length}
              </Badge>
            )}
          </div>
          
          <div className="space-y-2">
            {dayAssignments.map((assignment) => (
              <div
                key={assignment.Id}
                className="p-2 rounded-lg border-l-4 bg-gray-50"
                style={{ borderLeftColor: getCourseColor(assignment.courseId) }}
              >
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {assignment.title}
                </h4>
                <p className="text-xs text-gray-600 mt-1">
                  {getCourseName(assignment.courseId)}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return <div className="grid grid-cols-7 gap-0">{days}</div>;
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <CardTitle className="text-2xl">
                {format(currentDate, "MMMM yyyy")}
              </CardTitle>
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(addDays(currentDate, view === "month" ? -30 : -7))}
                >
                  <ApperIcon name="ChevronLeft" className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(addDays(currentDate, view === "month" ? 30 : 7))}
                >
                  <ApperIcon name="ChevronRight" className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <Button
                  variant={view === "month" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("month")}
                >
                  Month
                </Button>
                <Button
                  variant={view === "week" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("week")}
                >
                  Week
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Calendar Header Days */}
          <div className="grid grid-cols-7 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="p-3 text-center font-medium text-gray-700 bg-gray-50 border border-gray-200">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Body */}
          {view === "month" ? renderMonthView() : renderWeekView()}
        </CardContent>
      </Card>

      {/* Selected Date Assignments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="Calendar" className="h-5 w-5 text-primary-500" />
            Assignments for {format(selectedDate, "MMMM d, yyyy")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {getSelectedDateAssignments().length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ApperIcon name="Calendar" className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>No assignments due on this date</p>
            </div>
          ) : (
            <div className="space-y-3">
              {getSelectedDateAssignments().map((assignment) => (
                <div
                  key={assignment.Id}
                  className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div
                    className="w-1 h-16 rounded-full"
                    style={{ backgroundColor: getCourseColor(assignment.courseId) }}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {getCourseName(assignment.courseId)}
                    </p>
                    {assignment.notes && (
                      <p className="text-sm text-gray-500 mt-1">{assignment.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {assignment.priority && (
                      <Badge variant={assignment.priority} className="text-xs">
                        {assignment.priority}
                      </Badge>
                    )}
                    <Badge 
                      variant={assignment.status === "completed" ? "accent" : "default"}
                      className="text-xs"
                    >
                      {assignment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Calendar;