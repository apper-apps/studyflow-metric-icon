import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Layout Components
import Sidebar from "@/components/organisms/Sidebar";

// Pages
import DashboardPage from "@/components/pages/DashboardPage";
import CoursesPage from "@/components/pages/CoursesPage";
import AssignmentsPage from "@/components/pages/AssignmentsPage";
import CalendarPage from "@/components/pages/CalendarPage";
import GradesPage from "@/components/pages/GradesPage";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);
  const openSidebar = () => setSidebarOpen(true);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background font-body">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <main className="flex-1 overflow-y-auto">
              <div className="container mx-auto px-6 py-8 max-w-7xl">
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/courses" element={<CoursesPage />} />
                  <Route path="/assignments" element={<AssignmentsPage />} />
                  <Route path="/calendar" element={<CalendarPage />} />
                  <Route path="/grades" element={<GradesPage />} />
                </Routes>
              </div>
            </main>
          </div>
        </div>

        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="z-50"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;