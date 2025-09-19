import React, { useState } from "react";
import Header from "@/components/organisms/Header";
import CourseGrid from "@/components/organisms/CourseGrid";
import CourseModal from "@/components/organisms/CourseModal";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const CoursesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddCourse = () => {
    setSelectedCourse(null);
    setIsModalOpen(true);
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  const headerActions = (
    <Button onClick={handleAddCourse} className="inline-flex items-center gap-2">
      <ApperIcon name="Plus" className="h-4 w-4" />
      Add Course
    </Button>
  );

  return (
    <div className="space-y-8">
      <Header
        title="My Courses"
        subtitle="Manage your academic schedule and course information"
        actions={headerActions}
      />
      
      <div key={refreshKey}>
        <CourseGrid 
          onAddCourse={handleAddCourse}
          onEditCourse={handleEditCourse}
        />
      </div>

      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        course={selectedCourse}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default CoursesPage;