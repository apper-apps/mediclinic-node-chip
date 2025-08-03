import React, { useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday, isBefore } from "date-fns";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const CalendarPicker = ({ 
  selectedDate = new Date(), 
  onDateSelect = () => {},
  minDate = new Date(),
  disabled = false 
}) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={prevMonth}
          disabled={disabled}
        >
          <ApperIcon name="ChevronLeft" className="w-4 h-4" />
        </Button>
        
        <h2 className="text-lg font-semibold text-gray-900">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={nextMonth}
          disabled={disabled}
        >
          <ApperIcon name="ChevronRight" className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  const renderDaysOfWeek = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    return (
      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map((day) => (
          <div
            key={day}
            className="h-10 flex items-center justify-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = new Date(day);
        const isDisabled = disabled || isBefore(cloneDay, minDate);
        const isSelected = isSameDay(cloneDay, selectedDate);
        const isCurrentMonth = isSameMonth(cloneDay, monthStart);
        const isTodayDate = isToday(cloneDay);

        days.push(
          <button
            key={day.toISOString()}
            className={`
              h-10 w-10 rounded-lg text-sm font-medium transition-all duration-200 
              ${!isCurrentMonth ? "text-gray-300" : "text-gray-700"}
              ${isSelected ? "bg-primary-600 text-white shadow-lg" : "hover:bg-primary-50"}
              ${isTodayDate && !isSelected ? "bg-blue-100 text-blue-600" : ""}
              ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
            onClick={() => !isDisabled && onDateSelect(cloneDay)}
            disabled={isDisabled}
          >
            {format(cloneDay, "d")}
          </button>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toISOString()} className="grid grid-cols-7 gap-1">
          {days}
        </div>
      );
      days = [];
    }

    return <div className="space-y-1">{rows}</div>;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      {renderHeader()}
      {renderDaysOfWeek()}
      {renderCells()}
    </div>
  );
};

export default CalendarPicker;