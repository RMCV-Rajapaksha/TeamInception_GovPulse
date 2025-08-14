import { CheckCircle } from "@phosphor-icons/react";

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface TimeSlotsProps {
  timeSlots: TimeSlot[];
  selectedTimeSlot?: string | null;
  onTimeSlotSelect?: (slotId: string) => void;
  selectedDate?: number | null;
  className?: string;
}

export default function TimeSlots({
  timeSlots,
  selectedTimeSlot = null,
  onTimeSlotSelect,
  selectedDate = null,
  className = ''
}: TimeSlotsProps) {
  
  const handleTimeSlotClick = (slot: TimeSlot) => {
    if (slot.available && onTimeSlotSelect) {
      onTimeSlotSelect(slot.id);
    }
  };

  const getSlotClasses = (slot: TimeSlot) => {
    const baseClasses = "flex-1 box-border flex flex-row gap-4 h-11 items-center justify-center min-h-11 min-w-px p-[16px] rounded-lg";
    
    if (!slot.available) {
      return `${baseClasses} bg-[#ffffff] border-[1px] border-solid border-[#bbbbbb] cursor-not-allowed`;
    }
    
    if (selectedTimeSlot === slot.id) {
      return `${baseClasses} bg-[#fffbeb] border-[2px] border-solid border-[#eab308] cursor-pointer`;
    }
    
    return `${baseClasses} bg-[#ffffff] border-[1px] border-solid border-[#A7A7A2] cursor-pointer hover:bg-[#f9f9f9] transition-colors`;
  };

  const getSlotTextClasses = (slot: TimeSlot) => {
    if (!slot.available) {
      return "text-[#bbbbbb] text-[14px] text-center leading-normal";
    }
    
    return "text-[#000000] text-[14px] text-center leading-normal";
  };

  // Group slots into rows of 3
  const groupedSlots = [];
  for (let i = 0; i < timeSlots.length; i += 3) {
    groupedSlots.push(timeSlots.slice(i, i + 3));
  }

  // Show message if no date is selected
  if (!selectedDate) {
    return (
      <div className={`flex flex-col gap-8 items-start justify-start w-full ${className}`}>
        <div className="flex flex-col gap-6 items-start justify-start w-full">
          <div 
            className="font-bold text-[#4b4b4b] text-[18px] text-left w-full leading-[22px]"
            style={{ fontFamily: 'var(--font-family-body, Satoshi)' }}
          >
            Available Slots:
          </div>
          <div 
            className="text-[#9a9a9a] text-[14px] text-center w-full py-8"
            style={{ fontFamily: 'var(--font-family-body, Satoshi)' }}
          >
            Please select a date to view available time slots
          </div>
        </div>
      </div>
    );
  }

  // Show message if no time slots available for selected date
  if (timeSlots.length === 0) {
    return (
      <div className={`flex flex-col gap-8 items-start justify-start w-full ${className}`}>
        <div className="flex flex-col gap-6 items-start justify-start w-full">
          <div 
            className="font-bold text-[#4b4b4b] text-[18px] text-left w-full leading-[22px]"
            style={{ fontFamily: 'var(--font-family-body, Satoshi)' }}
          >
            Available Slots for August {selectedDate}, 2025:
          </div>
          <div 
            className="text-[#9a9a9a] text-[14px] text-center w-full py-8"
            style={{ fontFamily: 'var(--font-family-body, Satoshi)' }}
          >
            No time slots available for this date
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-8 items-start justify-start w-full ${className}`}>
      <div className="flex flex-col gap-6 items-start justify-start w-full">
        <div 
          className="font-bold text-[#4b4b4b] text-[18px] text-left w-full leading-[22px]"
          style={{ fontFamily: 'var(--font-family-body, Satoshi)' }}
        >
          Available Slots for {selectedDate ? `August ${selectedDate}, 2025` : ''}:
        </div>
        
        <div className="flex flex-col gap-2 items-start justify-start w-full">
          {groupedSlots.map((row, rowIndex) => (
            <div key={rowIndex} className="flex flex-row gap-2 h-11 items-start justify-start w-full">
              {row.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => handleTimeSlotClick(slot)}
                  disabled={!slot.available}
                  className={getSlotClasses(slot)}
                >
                  {selectedTimeSlot === slot.id ? (
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle size={32} className="text-[#eab308]" weight="fill" />
                      <div 
                        className={getSlotTextClasses(slot)}
                        style={{ fontFamily: 'var(--font-family-body, Satoshi)' }}
                      >
                        {slot.time}
                      </div>
                    </div>
                  ) : (
                    <div 
                      className={getSlotTextClasses(slot)}
                      style={{ fontFamily: 'var(--font-family-body, Satoshi)' }}
                    >
                      {slot.time}
                    </div>
                  )}
                </button>
              ))}
              {/* Fill empty slots in the row */}
              {row.length < 3 && Array.from({ length: 3 - row.length }).map((_, index) => (
                <div key={`empty-${index}`} className="flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
