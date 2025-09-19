import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import GradeRing from "@/components/molecules/GradeRing";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { courseService } from "@/services/api/courseService";

const CourseGrid = ({ onAddCourse, onEditCourse }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCourses = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await courseService.getAll();
      setCourses(data);
    } catch (err) {
      setError("Failed to load courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCourses} />;
  if (courses.length === 0) {
    return (
      <Empty
        icon="BookOpen"
        title="No courses yet"
        description="Start by adding your first course to begin organizing your academic schedule"
        buttonText="Add Course"
        onAction={onAddCourse}
      />
    );
  }

  const getScheduleText = (schedule) => {
    if (!schedule || schedule.length === 0) return "No schedule";
    return schedule.map(s => `${s.days.join("")} ${s.time}`).join(", ");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <Card
          key={course.Id}
          className="course-card group hover:shadow-lg transition-all duration-200 border-l-4 overflow-hidden"
          style={{ borderLeftColor: course.color }}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                  {course.name}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">{course.professor}</p>
                <div className="flex items-center mt-2 space-x-2">
                  <Badge variant="default" className="text-xs">
                    {course.credits} credits
                  </Badge>
                  <Badge 
                    className="text-xs text-white"
                    style={{ background: course.color }}
                  >
                    {course.semester}
                  </Badge>
                </div>
              </div>
              <GradeRing percentage={course.currentGrade || 0} size={60} strokeWidth={4} />
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="space-y-3">
              <div>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <ApperIcon name="Clock" className="h-4 w-4 mr-1" />
                  Schedule
                </div>
                <p className="text-sm text-gray-900 font-medium">
                  {getScheduleText(course.schedule)}
                </p>
              </div>

              <div>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <ApperIcon name="BarChart3" className="h-4 w-4 mr-1" />
                  Grade Breakdown
                </div>
                <div className="space-y-1">
                  {course.gradeCategories && course.gradeCategories.length > 0 ? (
                    course.gradeCategories.slice(0, 2).map((category, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">{category.name}</span>
                        <span className="text-gray-900 font-medium">{category.weight}%</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No categories set</p>
                  )}
                  {course.gradeCategories && course.gradeCategories.length > 2 && (
                    <p className="text-xs text-gray-500">+{course.gradeCategories.length - 2} more</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditCourse(course)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ApperIcon name="Edit2" className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ApperIcon name="MoreHorizontal" className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CourseGrid;