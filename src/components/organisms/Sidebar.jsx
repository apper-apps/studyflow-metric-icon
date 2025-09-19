import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Courses", href: "/courses", icon: "BookOpen" },
    { name: "Assignments", href: "/assignments", icon: "CheckSquare" },
    { name: "Calendar", href: "/calendar", icon: "Calendar" },
    { name: "Grades", href: "/grades", icon: "TrendingUp" }
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center px-6 py-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
            <ApperIcon name="BookOpen" className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">StudyFlow</h1>
            <p className="text-xs text-gray-500">Academic Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900"
              )}
            >
              <ApperIcon 
                name={item.icon} 
                className={cn(
                  "mr-3 h-5 w-5 transition-colors",
                  isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700"
                )} 
              />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-6 border-t border-gray-200">
        <div className="bg-gradient-to-br from-accent-50 to-accent-100 rounded-lg p-4 space-y-2">
          <h3 className="text-sm font-semibold text-accent-900">Study Tip</h3>
          <p className="text-xs text-accent-700">
            Use the calendar view to visualize your deadlines and plan study sessions effectively.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white border-r border-gray-200 h-screen">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className={cn(
        "fixed inset-0 z-40 lg:hidden transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className={cn(
          "relative flex flex-col w-64 h-full bg-white shadow-xl transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="absolute top-4 right-4 lg:hidden">
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="X" className="h-5 w-5" />
            </button>
          </div>
          <SidebarContent />
        </div>
      </div>
    </>
  );
};

export default Sidebar;