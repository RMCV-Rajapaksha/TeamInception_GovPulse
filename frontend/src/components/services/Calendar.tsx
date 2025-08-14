import { CaretLeft, CaretRight } from '@phosphor-icons/react';

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface CalendarProps {
  selectedDate?: number | null;
  onDateSelect?: (date: number) => void;
  selectedTab?: 'Month' | 'Week' | 'Day';
  onTabChange?: (tab: 'Month' | 'Week' | 'Day') => void;
  className?: string;
  getTimeSlotsForDate?: (date: number) => TimeSlot[];
  currentMonth?: number;
  currentYear?: number;
  onMonthChange?: (month: number, year: number) => void;
}

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  isToday: boolean;
  availableSlots: number;
  totalSlots: number;
}

export default function Calendar({
  selectedDate = null,
  onDateSelect,
  selectedTab = 'Month',
  onTabChange,
  className = '',
  currentMonth = 8, // August
  currentYear = 2025,
  onMonthChange
}: CalendarProps) {
  // Mock calendar data - in a real app this would be computed based on current date
  const mockCalendarData: CalendarDay[][] = [
    [
      { date: 31, isCurrentMonth: false, isSelected: false, isDisabled: false, isToday: false, availableSlots: 0, totalSlots: 6 },
      { date: 1, isCurrentMonth: true, isSelected: false, isDisabled: true, isToday: false, availableSlots: 0, totalSlots: 6 },
      { date: 2, isCurrentMonth: true, isSelected: false, isDisabled: true, isToday: false, availableSlots: 0, totalSlots: 6 },
      { date: 3, isCurrentMonth: true, isSelected: false, isDisabled: true, isToday: false, availableSlots: 0, totalSlots: 6 },
      { date: 4, isCurrentMonth: true, isSelected: false, isDisabled: true, isToday: false, availableSlots: 0, totalSlots: 6 },
      { date: 5, isCurrentMonth: true, isSelected: false, isDisabled: true, isToday: false, availableSlots: 0, totalSlots: 6 },
      { date: 6, isCurrentMonth: true, isSelected: false, isDisabled: true, isToday: false, availableSlots: 0, totalSlots: 6 },
    ],
    [
      { date: 7, isCurrentMonth: true, isSelected: false, isDisabled: true, isToday: false, availableSlots: 0, totalSlots: 6 },
      { date: 8, isCurrentMonth: true, isSelected: false, isDisabled: true, isToday: false, availableSlots: 0, totalSlots: 6 },
      { date: 9, isCurrentMonth: true, isSelected: false, isDisabled: true, isToday: false, availableSlots: 0, totalSlots: 6 },
      { date: 10, isCurrentMonth: true, isSelected: false, isDisabled: true, isToday: false, availableSlots: 0, totalSlots: 6 },
      { date: 11, isCurrentMonth: true, isSelected: false, isDisabled: true, isToday: false, availableSlots: 0, totalSlots: 6 },
      { date: 12, isCurrentMonth: true, isSelected: false, isDisabled: false, isToday: false, availableSlots: 3, totalSlots: 6 },
      { date: 13, isCurrentMonth: true, isSelected: false, isDisabled: true, isToday: false, availableSlots: 0, totalSlots: 6 },
    ],
    [
      { date: 14, isCurrentMonth: true, isSelected: false, isDisabled: true, isToday: true, availableSlots: 0, totalSlots: 6 },
      { date: 15, isCurrentMonth: true, isSelected: false, isDisabled: true, isToday: false, availableSlots: 0, totalSlots: 6 },
      { date: 16, isCurrentMonth: true, isSelected: selectedDate === 16, isDisabled: false, isToday: false, availableSlots: 4, totalSlots: 6 },
      { date: 17, isCurrentMonth: true, isSelected: false, isDisabled: true, isToday: false, availableSlots: 0, totalSlots: 6 },
      { date: 18, isCurrentMonth: true, isSelected: false, isDisabled: true, isToday: false, availableSlots: 0, totalSlots: 6 },
      { date: 19, isCurrentMonth: true, isSelected: false, isDisabled: false, isToday: false, availableSlots: 2, totalSlots: 6 },
      { date: 20, isCurrentMonth: true, isSelected: false, isDisabled: true, isToday: false, availableSlots: 0, totalSlots: 6 },
    ],
    [
      { date: 21, isCurrentMonth: true, isSelected: false, isDisabled: true, isToday: false, availableSlots: 0, totalSlots: 6 },
      { date: 22, isCurrentMonth: true, isSelected: false, isDisabled: false, isToday: false, availableSlots: 5, totalSlots: 6 },
      { date: 23, isCurrentMonth: true, isSelected: false, isDisabled: false, isToday: false, availableSlots: 6, totalSlots: 6 },
      { date: 24, isCurrentMonth: true, isSelected: false, isDisabled: false, isToday: false, availableSlots: 3, totalSlots: 6 },
      { date: 25, isCurrentMonth: true, isSelected: false, isDisabled: false, isToday: false, availableSlots: 1, totalSlots: 6 },
      { date: 26, isCurrentMonth: true, isSelected: false, isDisabled: false, isToday: false, availableSlots: 4, totalSlots: 6 },
      { date: 27, isCurrentMonth: true, isSelected: false, isDisabled: true, isToday: false, availableSlots: 0, totalSlots: 6 },
    ],
    [
      { date: 28, isCurrentMonth: true, isSelected: false, isDisabled: true, isToday: false, availableSlots: 0, totalSlots: 6 },
      { date: 29, isCurrentMonth: true, isSelected: false, isDisabled: false, isToday: false, availableSlots: 2, totalSlots: 6 },
      { date: 30, isCurrentMonth: true, isSelected: false, isDisabled: false, isToday: false, availableSlots: 3, totalSlots: 6 },
      { date: 1, isCurrentMonth: false, isSelected: false, isDisabled: false, isToday: false, availableSlots: 0, totalSlots: 6 },
      { date: 2, isCurrentMonth: false, isSelected: false, isDisabled: false, isToday: false, availableSlots: 0, totalSlots: 6 },
      { date: 3, isCurrentMonth: false, isSelected: false, isDisabled: false, isToday: false, availableSlots: 0, totalSlots: 6 },
      { date: 4, isCurrentMonth: false, isSelected: false, isDisabled: false, isToday: false, availableSlots: 0, totalSlots: 6 },
    ],
  ];

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                     'July', 'August', 'September', 'October', 'November', 'December'];

  // Navigation functions
  const navigateMonth = (direction: 'prev' | 'next') => {
    let newMonth = currentMonth;
    let newYear = currentYear;
    
    if (direction === 'next') {
      newMonth++;
      if (newMonth > 12) {
        newMonth = 1;
        newYear++;
      }
    } else {
      newMonth--;
      if (newMonth < 1) {
        newMonth = 12;
        newYear--;
      }
    }
    
    if (onMonthChange) {
      onMonthChange(newMonth, newYear);
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    // For week navigation, we'll move by 7 days
    const currentWeekData = getCurrentWeekData();
    const targetDate = selectedDate || 14;
    const newDate = direction === 'next' ? targetDate + 7 : targetDate - 7;
    
    // Simple implementation - in a real app, this would be more sophisticated
    if (onDateSelect && newDate > 0 && newDate <= 31) {
      onDateSelect(newDate);
    }
  };

  const navigateDay = (direction: 'prev' | 'next') => {
    const targetDate = selectedDate || 14;
    const newDate = direction === 'next' ? targetDate + 1 : targetDate - 1;
    
    if (onDateSelect && newDate > 0 && newDate <= 31) {
      onDateSelect(newDate);
    }
  };

  const handleDateClick = (day: CalendarDay) => {
    if (!day.isCurrentMonth || day.availableSlots === 0) return;
    if (onDateSelect) {
      onDateSelect(day.date);
    }
  };

  const handleTabClick = (tab: 'Month' | 'Week' | 'Day') => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const getDayClasses = (day: CalendarDay) => {
    const baseClasses = "flex flex-col items-center justify-center pb-[6.5px] pt-[4.5px] px-[11px] relative shrink-0 size-11 rounded-[14px] transition-colors group";
    
    if (!day.isCurrentMonth) {
      return `${baseClasses} text-[#bbbbbb] cursor-not-allowed`;
    }
    
    if (day.availableSlots === 0) {
      return `${baseClasses} bg-[#f5f5f5] text-[#bbbbbb] cursor-not-allowed`;
    }
    
    if (day.isToday) {
      return `${baseClasses} bg-[#FFF9C4] text-[#000000] cursor-pointer`;
    }
    
    if (day.isSelected) {
      return `${baseClasses} bg-[#FFF9C4] border-2 border-[#141414] text-[#000000] cursor-pointer`;
    }
    
    return `${baseClasses} bg-[#FFF9C4] text-[#000000] hover:bg-[#FFF176] cursor-pointer`;
  };

  const renderDayContent = (day: CalendarDay) => {
    if (day.isToday) {
      // Today's date with special styling
      return (
        <>
          <div className="w-8 h-8 bg-[#9a9a9a] rounded-[360px] flex flex-col justify-center items-center gap-2.5">
            <div 
              className={`text-center text-[#4b4b4b] text-[16px] leading-[20px] tracking-[0.16px] ${
                day.availableSlots === 0 ? 'line-through' : ''
              }`}
              style={{ 
                fontFamily: 'var(--font-family-body, Satoshi)',
                textDecoration: day.availableSlots === 0 ? 'line-through' : 'none'
              }}
            >
              {day.date}
            </div>
          </div>
          <div className="w-11 h-11 left-0 top-0 absolute rounded-[14px]" />
        </>
      );
    }
    
    // Regular date
    return (
      <div 
        className={`leading-[0] mb-[-1px] text-[16px] text-center tracking-[0.16px] ${
          !day.isCurrentMonth ? 'text-[#bbbbbb]' :
          day.availableSlots === 0 ? 'text-[#4b4b4b]' : 'text-[#000000]'
        }`}
        style={{ 
          fontFamily: 'var(--font-family-body, Satoshi)',
          textDecoration: day.availableSlots === 0 && day.isCurrentMonth ? 'line-through' : 'none'
        }}
      >
        {day.date}
      </div>
    );
  };

  const getTooltipText = (day: CalendarDay) => {
    if (!day.isCurrentMonth) return '';
    if (day.availableSlots === 0) return 'No time slots available';
    return `${day.availableSlots} of ${day.totalSlots} slots available`;
  };

  // Get current week data (week containing today or selected date)
  const getCurrentWeekData = () => {
    const targetDate = selectedDate || 14; // Use selected date or today (14th)
    
    // Find the week containing the target date
    for (const week of mockCalendarData) {
      for (const day of week) {
        if (day.date === targetDate && day.isCurrentMonth) {
          return week;
        }
      }
    }
    return mockCalendarData[2]; // Default to week containing today
  };

  // Get single day data
  const getCurrentDayData = () => {
    const targetDate = selectedDate || 14; // Use selected date or today (14th)
    
    for (const week of mockCalendarData) {
      for (const day of week) {
        if (day.date === targetDate && day.isCurrentMonth) {
          return day;
        }
      }
    }
    return mockCalendarData[2][0]; // Default to today
  };

  // Render Week View
  const renderWeekView = () => {
    const weekData = getCurrentWeekData();
    
    return (
      <div className="flex flex-col gap-4 items-start justify-start px-0 py-4 rounded-[20px] w-full">
        {/* Week Header with Date Range and Navigation */}
        <div className="flex flex-row items-center justify-between w-full px-4">
          <button 
            onClick={() => navigateWeek('prev')}
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[#f5f5f5] transition-colors"
          >
            <CaretLeft size={20} className="text-[#4b4b4b]" />
          </button>
          
          <div className="text-[#000000] text-[18px] font-bold" style={{ fontFamily: 'var(--font-family-body, Satoshi)' }}>
            {monthNames[currentMonth - 1]} {weekData[0].date} - {weekData[6].date}, {currentYear}
          </div>
          
          <button 
            onClick={() => navigateWeek('next')}
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[#f5f5f5] transition-colors"
          >
            <CaretRight size={20} className="text-[#4b4b4b]" />
          </button>
        </div>
        
        {/* Weekdays Header */}
        <div className="flex flex-row gap-2 items-center justify-center px-0 py-2 w-full">
          {weekdays.map((day, index) => (
            <div key={day} className="flex-1 flex flex-col gap-2 items-center justify-center p-2">
              <div className="text-[#4b4b4b] text-[12px] text-center leading-normal" style={{ fontFamily: 'var(--font-family-body, Satoshi)' }}>
                {day}
              </div>
              <div className="text-[#000000] text-[14px] font-medium" style={{ fontFamily: 'var(--font-family-body, Satoshi)' }}>
                {weekData[index].date}
              </div>
            </div>
          ))}
        </div>

        {/* Week Days with Slots */}
        <div className="flex flex-row gap-2 items-start justify-center p-0 w-full">
          {weekData.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className={`flex-1 flex flex-col gap-2 items-center justify-start p-3 rounded-[14px] min-h-[120px] transition-colors cursor-pointer ${
                day.isCurrentMonth && day.availableSlots > 0 
                  ? 'bg-[#FFF9C4] hover:bg-[#FFF176]' 
                  : 'bg-[#f9f9f9] cursor-not-allowed'
              } ${
                day.isSelected ? 'border-2 border-[#141414]' : ''
              } ${
                day.isToday ? 'bg-[#FFF9C4]' : ''
              }`}
              onClick={() => handleDateClick(day)}
            >
              <div className={`text-[20px] font-bold text-center ${
                !day.isCurrentMonth ? 'text-[#bbbbbb]' :
                day.availableSlots === 0 ? 'text-[#bbbbbb]' : 'text-[#000000]'
              } ${day.availableSlots === 0 && day.isCurrentMonth ? 'line-through' : ''}`} 
              style={{ fontFamily: 'var(--font-family-body, Satoshi)' }}>
                {day.date}
              </div>
              
              {day.isCurrentMonth && (
                <div className="flex flex-col gap-1 items-center">
                  <div className={`text-[12px] text-center ${
                    day.availableSlots === 0 ? 'text-[#bbbbbb]' : 'text-[#4b4b4b]'
                  }`} style={{ fontFamily: 'var(--font-family-body, Satoshi)' }}>
                    {day.availableSlots === 0 ? 'No slots' : `${day.availableSlots}/${day.totalSlots} slots`}
                  </div>
                  
                  {day.availableSlots > 0 && (
                    <div className="w-full bg-[#ebebeb] rounded-full h-2">
                      <div 
                        className="bg-[#FFC107] h-2 rounded-full transition-all"
                        style={{ width: `${(day.availableSlots / day.totalSlots) * 100}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render Day View
  const renderDayView = () => {
    const dayData = getCurrentDayData();
    const dayName = weekdays[mockCalendarData.findIndex(week => 
      week.some(d => d.date === dayData.date && d.isCurrentMonth)
    )];
    
    return (
      <div className="flex flex-col gap-6 items-start justify-start px-0 py-4 rounded-[20px] w-full">
        {/* Day Navigation Header */}
        <div className="flex flex-row items-center justify-between w-full px-4">
          <button 
            onClick={() => navigateDay('prev')}
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[#f5f5f5] transition-colors"
          >
            <CaretLeft size={20} className="text-[#4b4b4b]" />
          </button>
          
          <div className="text-[#000000] text-[18px] font-bold" style={{ fontFamily: 'var(--font-family-body, Satoshi)' }}>
            {dayName}, {monthNames[currentMonth - 1]} {dayData.date}, {currentYear}
          </div>
          
          <button 
            onClick={() => navigateDay('next')}
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[#f5f5f5] transition-colors"
          >
            <CaretRight size={20} className="text-[#4b4b4b]" />
          </button>
        </div>
        
        {/* Day Header */}
        <div className="flex flex-col gap-2 items-center justify-center w-full">
          <div className={`text-[48px] font-bold ${
            dayData.availableSlots === 0 ? 'text-[#bbbbbb] line-through' : 'text-[#000000]'
          }`} style={{ fontFamily: 'var(--font-family-body, Satoshi)' }}>
            {dayData.date}
          </div>
          {dayData.isToday && (
            <div className="px-3 py-1 bg-[#9a9a9a] rounded-full">
              <div className="text-[#ffffff] text-[12px] font-medium" style={{ fontFamily: 'var(--font-family-body, Satoshi)' }}>
                Today
              </div>
            </div>
          )}
        </div>

        {/* Day Details */}
        <div className="flex flex-col gap-4 items-center justify-start w-full px-8">
          <div className={`text-[24px] font-bold text-center ${
            dayData.availableSlots === 0 ? 'text-[#bbbbbb]' : 'text-[#FFC107]'
          }`} style={{ fontFamily: 'var(--font-family-body, Satoshi)' }}>
            {dayData.availableSlots === 0 ? 'No Available Slots' : `${dayData.availableSlots} Available Slots`}
          </div>
          
          {dayData.availableSlots > 0 && (
            <>
              <div className="w-full max-w-xs bg-[#ebebeb] rounded-full h-4">
                <div 
                  className="bg-[#FFC107] h-4 rounded-full transition-all"
                  style={{ width: `${(dayData.availableSlots / dayData.totalSlots) * 100}%` }}
                ></div>
              </div>
              
              <div className="text-[#4b4b4b] text-[16px] text-center" style={{ fontFamily: 'var(--font-family-body, Satoshi)' }}>
                {dayData.availableSlots} out of {dayData.totalSlots} time slots available
              </div>
              
              <button
                onClick={() => handleDateClick(dayData)}
                className="px-6 py-3 bg-[#FFC107] text-white rounded-[12px] hover:bg-[#FFB300] transition-colors"
                style={{ fontFamily: 'var(--font-family-body, Satoshi)' }}
              >
                Select This Day
              </button>
            </>
          )}
          
          {dayData.availableSlots === 0 && (
            <div className="text-[#bbbbbb] text-[16px] text-center" style={{ fontFamily: 'var(--font-family-body, Satoshi)' }}>
              No appointments available for this date. Please choose another day.
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`flex flex-col items-start justify-start w-full ${className}`}>
      {/* Tabs */}
      <div className="flex flex-col items-start justify-start px-0 py-3 w-full">
        <div className="relative w-full">
          <div className="flex flex-row items-start justify-start overflow-hidden p-0 w-full">
            {['Month', 'Week', 'Day'].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab as 'Month' | 'Week' | 'Day')}
                className={`flex-1 h-10 flex flex-col gap-5 items-center justify-center overflow-hidden p-0 relative ${
                  selectedTab === tab 
                    ? 'border-b-2 border-[#000000]' 
                    : 'border-b border-[#9a9a9a]'
                }`}
              >
                <div 
                  className={`text-[16px] text-center leading-[20px] tracking-[0.16px] ${
                    selectedTab === tab ? 'text-[#000000]' : 'text-[#4b4b4b]'
                  }`}
                  style={{ fontFamily: 'var(--font-family-body, Satoshi)' }}
                >
                  {tab}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="flex flex-col gap-2 items-start justify-start w-full">
        {selectedTab === 'Month' && (
          <div className="flex flex-col gap-4 items-start justify-start px-0 py-4 rounded-[20px] w-full">
            
            {/* Month Navigation Header */}
            <div className="flex flex-row items-center justify-between w-full px-4">
              <button 
                onClick={() => navigateMonth('prev')}
                className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[#f5f5f5] transition-colors"
              >
                <CaretLeft size={20} className="text-[#4b4b4b]" />
              </button>
              
              <div className="text-[#000000] text-[18px] font-bold" style={{ fontFamily: 'var(--font-family-body, Satoshi)' }}>
                {monthNames[currentMonth - 1]} {currentYear}
              </div>
              
              <button 
                onClick={() => navigateMonth('next')}
                className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[#f5f5f5] transition-colors"
              >
                <CaretRight size={20} className="text-[#4b4b4b]" />
              </button>
            </div>

            {/* Weekdays Header */}
            <div className="flex flex-row gap-4 items-center justify-center px-0 py-2 w-full">
              {weekdays.map((day) => (
                <div key={day} className="flex flex-row gap-2 items-center justify-center p-0 w-11">
                  <div 
                    className="flex-1 text-[#4b4b4b] text-[12px] text-center leading-normal"
                    style={{ fontFamily: 'var(--font-family-body, Satoshi)' }}
                  >
                    {day}
                  </div>
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            {mockCalendarData.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-row gap-4 items-center justify-center p-0 w-full">
                {week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={getDayClasses(day)}
                    onClick={() => handleDateClick(day)}
                  >
                    {renderDayContent(day)}
                    {/* Tooltip */}
                    {day.isCurrentMonth && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                        {getTooltipText(day)}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {selectedTab === 'Week' && renderWeekView()}
        
        {selectedTab === 'Day' && renderDayView()}
      </div>
    </div>
  );
}
