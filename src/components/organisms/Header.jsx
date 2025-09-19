import React from "react";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ title, subtitle, onMenuClick, searchValue, onSearchChange, showSearch = false, actions }) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name="Menu" className="h-6 w-6" />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {showSearch && (
            <div className="hidden md:block">
              <SearchBar
                placeholder="Search courses, assignments..."
                value={searchValue}
                onChange={onSearchChange}
                className="w-80"
              />
            </div>
          )}

          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <ApperIcon name="Bell" className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </Button>

          {/* Profile */}
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>

      {/* Mobile search */}
      {showSearch && (
        <div className="md:hidden mt-4">
          <SearchBar
            placeholder="Search courses, assignments..."
            value={searchValue}
            onChange={onSearchChange}
          />
        </div>
      )}
    </header>
  );
};

export default Header;