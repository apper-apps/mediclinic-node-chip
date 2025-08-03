import React from "react";
import Button from "@/components/atoms/Button";

const TimeSlotPicker = ({ 
  availableSlots = [], 
  selectedSlot = "", 
  onSlotSelect = () => {},
  disabled = false 
}) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700">Available Time Slots</h3>
      
      {availableSlots.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No available time slots for this date</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {availableSlots.map((slot) => (
            <Button
              key={slot}
              variant={selectedSlot === slot ? "primary" : "outline"}
              size="sm"
              onClick={() => onSlotSelect(slot)}
              disabled={disabled}
              className="text-sm"
            >
              {slot}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimeSlotPicker;