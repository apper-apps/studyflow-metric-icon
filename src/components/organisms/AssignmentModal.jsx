import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import PrioritySelect from "@/components/molecules/PrioritySelect";
import ApperIcon from "@/components/ApperIcon";
import { assignmentService } from "@/services/api/assignmentService";
import { courseService } from "@/services/api/courseService";
import { toast } from "react-toastify";

const AssignmentModal = ({ isOpen, onClose, assignment, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    courseId: "",
    dueDate: "",
    priority: "medium",
    status: "pending",
    grade: null,
    category: "",
    estimatedTime: "",
    notes: ""
  });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (assignment) {
      setFormData({
        ...assignment,
        dueDate: assignment.dueDate ? format(new Date(assignment.dueDate), "yyyy-MM-dd") : ""
      });
    } else {
      setFormData({
        title: "",
        courseId: "",
        dueDate: "",
        priority: "medium",
        status: "pending",
        grade: null,
        category: "",
        estimatedTime: "",
        notes: ""
      });
    }
  }, [assignment, isOpen]);

  const loadCourses = async () => {
    try {
      setLoadingCourses(true);
      const data = await courseService.getAll();
      setCourses(data);
    } catch (error) {
      toast.error("Failed to load courses");
    } finally {
      setLoadingCourses(false);
    }
  };

  const getSelectedCourse = () => {
    return courses.find(c => c.Id.toString() === formData.courseId);
  };

  const getGradeCategories = () => {
    const course = getSelectedCourse();
    return course?.gradeCategories || [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        courseId: parseInt(formData.courseId),
        grade: formData.grade ? parseFloat(formData.grade) : null,
        estimatedTime: formData.estimatedTime ? parseFloat(formData.estimatedTime) : null,
        dueDate: new Date(formData.dueDate).toISOString()
      };

      if (assignment) {
        await assignmentService.update(assignment.Id, submitData);
        toast.success("Assignment updated successfully!");
      } else {
        await assignmentService.create(submitData);
        toast.success("Assignment added successfully!");
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to save assignment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {assignment ? "Edit Assignment" : "Add New Assignment"}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" className="h-6 w-6" />
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <FormField
                label="Assignment Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Homework 1, Midterm Exam"
                required
              />

              <FormField
                label="Course"
                type="select"
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                required
                disabled={loadingCourses}
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.Id} value={course.Id.toString()}>
                    {course.name} - {course.semester}
                  </option>
                ))}
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Due Date"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <PrioritySelect
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Assignment Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Grade Category"
                  type="select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">Select category</option>
                  {getGradeCategories().map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.name} ({category.weight}%)
                    </option>
                  ))}
                </FormField>

                <FormField
                  label="Status"
                  type="select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Estimated Time (hours)"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                  placeholder="e.g., 3.5"
                />

                <FormField
                  label="Grade (%)"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.grade || ""}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  placeholder="Enter if graded"
                />
              </div>

              <FormField
                label="Notes"
                type="textarea"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes, requirements, or reminders..."
                className="min-h-[100px]"
              />
            </div>

            {/* Course Info Preview */}
            {formData.courseId && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Course Information</h4>
                {(() => {
                  const course = getSelectedCourse();
                  if (!course) return null;
                  return (
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: course.color }}
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900">{course.name}</span>
                        <span className="text-sm text-gray-600 ml-2">- {course.professor}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="min-w-[120px]"
              >
                {loading ? (
                  <ApperIcon name="Loader2" className="h-4 w-4 animate-spin" />
                ) : (
                  assignment ? "Update Assignment" : "Add Assignment"
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AssignmentModal;