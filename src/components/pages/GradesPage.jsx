import React from "react";
import Header from "@/components/organisms/Header";
import GradeCalculator from "@/components/organisms/GradeCalculator";

const GradesPage = () => {
  return (
    <div className="space-y-8">
      <Header
        title="Grades & GPA"
        subtitle="Monitor your academic performance and calculate grades"
      />
      
      <GradeCalculator />
    </div>
  );
};

export default GradesPage;