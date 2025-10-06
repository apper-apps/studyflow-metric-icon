import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { courseService } from "@/services/api/courseService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import CourseColorPicker from "@/components/molecules/CourseColorPicker";
import FormField from "@/components/molecules/FormField";
import Textarea from "@/components/atoms/Textarea";
import Button from "@/components/atoms/Button";

const CourseModal = ({ isOpen, onClose, course, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
professor: "",
    description: "",
    credits: 3,
    color: "#0ea5e9",
    semester: "Fall 2024",
    schedule: [{ days: [], time: "" }],
    gradeCategories: [
      { name: "Homework", weight: 20 },
      { name: "Quizzes", weight: 15 },
      { name: "Midterm", weight: 25 },
      { name: "Final", weight: 40 }
    ]
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (course) {
      setFormData(course);
    } else {
      setFormData({
        name: "",
professor: "",
        description: course.description_c || "",
        credits: 3,
        color: "#0ea5e9",
        semester: "Fall 2024",
        schedule: [{ days: [], time: "" }],
        gradeCategories: [
          { name: "Homework", weight: 20 },
          { name: "Quizzes", weight: 15 },
          { name: "Midterm", weight: 25 },
          { name: "Final", weight: 40 }
        ]
      });
    }
  }, [course, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate that grade category weights add up to 100%
      const totalWeight = formData.gradeCategories.reduce((sum, cat) => sum + parseFloat(cat.weight || 0), 0);
      if (Math.abs(totalWeight - 100) > 0.01) {
        toast.error("Grade category weights must add up to 100%");
        setLoading(false);
        return;
      }

      if (course) {
        await courseService.update(course.Id, formData);
        toast.success("Course updated successfully!");
      } else {
        await courseService.create(formData);
        toast.success("Course added successfully!");
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to save course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateGradeCategory = (index, field, value) => {
    const newCategories = [...formData.gradeCategories];
    newCategories[index] = { ...newCategories[index], [field]: value };
    setFormData({ ...formData, gradeCategories: newCategories });
  };

  const addGradeCategory = () => {
    setFormData({
      ...formData,
      gradeCategories: [...formData.gradeCategories, { name: "", weight: 0 }]
    });
  };

  const removeGradeCategory = (index) => {
    const newCategories = formData.gradeCategories.filter((_, i) => i !== index);
    setFormData({ ...formData, gradeCategories: newCategories });
  };

  const updateSchedule = (index, field, value) => {
    const newSchedule = [...formData.schedule];
    if (field === "days") {
      newSchedule[index] = { ...newSchedule[index], days: value };
    } else {
      newSchedule[index] = { ...newSchedule[index], [field]: value };
    }
    setFormData({ ...formData, schedule: newSchedule });
  };

  const toggleDay = (scheduleIndex, day) => {
    const currentDays = formData.schedule[scheduleIndex].days;
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    updateSchedule(scheduleIndex, "days", newDays);
  };

  const getTotalWeight = () => {
    return formData.gradeCategories.reduce((sum, cat) => sum + parseFloat(cat.weight || 0), 0);
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
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {course ? "Edit Course" : "Add New Course"}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Course Information</h3>
                
                <FormField
                  label="Course Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Introduction to Computer Science"
                  required
                />

                <FormField
                  label="Professor"
                  value={formData.professor}
                  onChange={(e) => setFormData({ ...formData, professor: e.target.value })}
                  placeholder="e.g., Dr. Smith"
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Credits"
                    type="number"
                    min="1"
                    max="6"
                    value={formData.credits}
                    onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                    required
                  />

                  <FormField
                    label="Semester"
                    type="select"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    required
                  >
                    <option value="Fall 2024">Fall 2024</option>
                    <option value="Spring 2025">Spring 2025</option>
                    <option value="Summer 2025">Summer 2025</option>
                  </FormField>
                </div>

                <CourseColorPicker
                  selectedColor={formData.color}
                  onColorChange={(color) => setFormData({ ...formData, color })}
                />
</div>

              <FormField
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                component={Textarea}
                placeholder="Add course description..."
              />

              {/* Schedule */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Schedule</h3>
                
                {formData.schedule.map((scheduleItem, index) => (
                  <div key={index} className="space-y-3 p-4 border border-gray-200 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Days</label>
                      <div className="flex flex-wrap gap-2">
                        {["M", "T", "W", "Th", "F", "Sa", "Su"].map((day) => (
                          <button
                            key={day}
                            type="button"
                            onClick={() => toggleDay(index, day)}
                            className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                              scheduleItem.days.includes(day)
                                ? "bg-primary-500 text-white border-primary-500"
                                : "bg-white text-gray-700 border-gray-300 hover:border-primary-300"
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>

                    <FormField
                      label="Time"
                      value={scheduleItem.time}
                      onChange={(e) => updateSchedule(index, "time", e.target.value)}
                      placeholder="e.g., 10:00 AM - 11:30 AM"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Grade Categories */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Grade Categories</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Total:</span>
                  <span className={`text-sm font-medium ${getTotalWeight() === 100 ? "text-green-600" : "text-red-600"}`}>
                    {getTotalWeight()}%
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {formData.gradeCategories.map((category, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={category.name}
                        onChange={(e) => updateGradeCategory(index, "name", e.target.value)}
                        placeholder="Category name"
                        className="w-full h-8 px-2 border border-gray-300 rounded"
                        required
                      />
                    </div>
                    <div className="w-20">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={category.weight}
                        onChange={(e) => updateGradeCategory(index, "weight", parseFloat(e.target.value) || 0)}
                        placeholder="Weight"
                        className="w-full h-8 px-2 border border-gray-300 rounded text-center"
                        required
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-4">%</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeGradeCategory(index)}
                      className="text-red-600 hover:text-red-700 h-8 w-8"
                    >
                      <ApperIcon name="Trash2" className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={addGradeCategory}
                className="w-full"
              >
                <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>

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
                disabled={loading || getTotalWeight() !== 100}
                className="min-w-[120px]"
              >
                {loading ? (
                  <ApperIcon name="Loader2" className="h-4 w-4 animate-spin" />
                ) : (
                  course ? "Update Course" : "Add Course"
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CourseModal;