import React, { useState } from "react";
import Header from "@/components/organisms/Header";
import AssignmentList from "@/components/organisms/AssignmentList";
import AssignmentModal from "@/components/organisms/AssignmentModal";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const AssignmentsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddAssignment = () => {
    setSelectedAssignment(null);
    setIsModalOpen(true);
  };

  const handleEditAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  const headerActions = (
    <Button onClick={handleAddAssignment} className="inline-flex items-center gap-2">
      <ApperIcon name="Plus" className="h-4 w-4" />
      Add Assignment
    </Button>
  );

  return (
    <div className="space-y-8">
      <Header
        title="Assignments"
        subtitle="Track your assignments, deadlines, and progress"
        actions={headerActions}
      />
      
      <div key={refreshKey}>
        <AssignmentList 
          onAddAssignment={handleAddAssignment}
          onEditAssignment={handleEditAssignment}
        />
      </div>

      <AssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        assignment={selectedAssignment}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default AssignmentsPage;