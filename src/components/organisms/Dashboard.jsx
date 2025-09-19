import React, { useState, useEffect } from "react";
import { format, parseISO, isAfter, isBefore, addDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import GradeRing from "@/components/molecules/GradeRing";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { assignmentService } from "@/services/api/assignmentService";
import { courseService } from "@/services/api/courseService";

const Dashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  // Calculate statistics
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(a => a.status === "completed").length;
  const pendingAssignments = totalAssignments - completedAssignments;
  const completionRate = totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0;

  // Calculate overall GPA
  const totalGPA = courses.length > 0 
    ? courses.reduce((sum, course) => sum + (course.currentGrade || 0), 0) / courses.length
    : 0;

  // Get upcoming assignments (next 7 days)
  const today = new Date();
  const nextWeek = addDays(today, 7);
  const upcomingAssignments = assignments
    .filter(assignment => {
      const dueDate = parseISO(assignment.dueDate);
      return isAfter(dueDate, today) && isBefore(dueDate, nextWeek) && assignment.status !== "completed";
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  // Get overdue assignments
  const overdueAssignments = assignments.filter(assignment => {
    const dueDate = parseISO(assignment.dueDate);
    return isBefore(dueDate, today) && assignment.status !== "completed";
  });

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
    const tomorrow = addDays(today, 1);

    if (isBefore(due, today)) {
      return { variant: "error", text: "Overdue" };
    } else if (isBefore(due, tomorrow)) {
      return { variant: "error", text: "Due Today" };
    } else if (isBefore(due, addDays(today, 3))) {
      return { variant: "warning", text: "Due Soon" };
    }
    return { variant: "primary", text: "Upcoming" };
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
            <p className="text-primary-100 text-lg">
              You have {pendingAssignments} pending assignments and {overdueAssignments.length} overdue items.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <ApperIcon name="BookOpen" className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Current GPA</p>
                <p className="text-2xl font-bold text-blue-900">{totalGPA.toFixed(1)}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="TrendingUp" className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Active Courses</p>
                <p className="text-2xl font-bold text-green-900">{courses.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="BookOpen" className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Total Assignments</p>
                <p className="text-2xl font-bold text-orange-900">{totalAssignments}</p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckSquare" className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Completion Rate</p>
                <p className="text-2xl font-bold text-purple-900">{completionRate.toFixed(0)}%</p>
              </div>
              <GradeRing percentage={completionRate} size={48} strokeWidth={4} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Assignments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ApperIcon name="Clock" className="h-5 w-5 text-primary-500" />
                Upcoming Assignments
              </CardTitle>
              <Badge variant="primary">{upcomingAssignments.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingAssignments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ApperIcon name="CheckCircle" className="h-12 w-12 mx-auto mb-3 text-green-500" />
                <p>No upcoming assignments! You're all caught up.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingAssignments.map((assignment) => {
                  const dueBadge = getDueDateBadge(assignment.dueDate);
                  const courseColor = getCourseColor(assignment.courseId);
                  
                  return (
                    <div key={assignment.Id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div 
                        className="w-1 h-12 rounded-full"
                        style={{ backgroundColor: courseColor }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{assignment.title}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-gray-600">{getCourseName(assignment.courseId)}</span>
                          <span className="text-sm text-gray-400">•</span>
                          <span className="text-sm text-gray-600">
                            {format(parseISO(assignment.dueDate), "MMM d")}
                          </span>
                        </div>
                      </div>
                      <Badge variant={dueBadge.variant} className="text-xs">
                        {dueBadge.text}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Course Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="BarChart3" className="h-5 w-5 text-primary-500" />
              Course Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {courses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ApperIcon name="BookOpen" className="h-12 w-12 mx-auto mb-3 text-primary-500" />
                <p>No courses added yet.</p>
                <Button className="mt-4" size="sm">Add Course</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {courses.slice(0, 4).map((course) => (
                  <div key={course.Id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: course.color }}
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">{course.name}</h4>
                        <p className="text-sm text-gray-600">{course.credits} credits</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-semibold text-gray-900">
                        {course.currentGrade || 0}%
                      </span>
                      <GradeRing percentage={course.currentGrade || 0} size={40} strokeWidth={3} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-br from-gray-50 to-white">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col space-y-2">
              <ApperIcon name="Plus" className="h-6 w-6" />
              <span className="text-sm">Add Course</span>
            </Button>
            <Button variant="secondary" className="h-20 flex-col space-y-2">
              <ApperIcon name="CheckSquare" className="h-6 w-6" />
              <span className="text-sm">Add Assignment</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <ApperIcon name="Calendar" className="h-6 w-6" />
              <span className="text-sm">View Calendar</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <ApperIcon name="TrendingUp" className="h-6 w-6" />
              <span className="text-sm">View Grades</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;