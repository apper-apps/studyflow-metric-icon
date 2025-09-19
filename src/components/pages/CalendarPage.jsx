import React from "react";
import Header from "@/components/organisms/Header";
import Calendar from "@/components/organisms/Calendar";

const CalendarPage = () => {
  return (
    <div className="space-y-8">
      <Header
        title="Academic Calendar"
        subtitle="View your assignments and deadlines in calendar format"
      />
      
      <Calendar />
    </div>
  );
};

export default CalendarPage;