interface CalendarProps {
  selectedDate?: number | null;
  onDateSelect?: (date: number) => void;
  selectedTab?: 'Month' | 'Week' | 'Day';
  onTabChange?: (tab: 'Month' | 'Week' | 'Day') => void;
  className?: string;
}

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  isToday: boolean;
}

export default function Calendar({
  selectedDate = null,
  onDateSelect,
  selectedTab = 'Month',
  onTabChange,
  className = ''
}: CalendarProps) {
  // Mock calendar data - in a real app this would be computed based on current date
  const mockCalendarData: CalendarDay[][] = [
    [
      { date: 31, isCurrentMonth: false, isSelected: false, isDisabled: false, isToday: false },
      { date: 1, isCurrentMonth: true, isSelected: false, isDisabled: true, isToday: false },
      { date: 2, isCurrentMonth: true, isSelected: false, isDisabled: true, isToday: false },
      { date: 3, isCurrentMonth: true, isSelected: false, isDisabled: true, isToday: false },
      { date: 4, isCurrentMonth: true, isSelected: false, isDisabled: true, isToday: false },
      { date: 5, isCurrentMonth: true, isSelected: false, isDisabled: true, isToday: false },
      { date: 6, isCurrentMonth: true, isSelected: false, isDisabled: true, isToday: false },
    ],
    [
      { date: 7, isCurrentMonth: true, isSelected: false, isDisabled: true, isToday: false },
      { date: 8, isCurrentMonth: true, isSelected: false, isDisabled: true, isToday: false },
      { date: 9, isCurrentMonth: true, isSelected: false, isDisabled: true, isToday: false },
      { date: 10, isCurrentMonth: true, isSelected: false, isDisabled: true, isToday: false },
      { date: 11, isCurrentMonth: true, isSelected: false, isDisabled: true, isToday: false },
      { date: 12, isCurrentMonth: true, isSelected: false, isDisabled: false, isToday: false },
      { date: 13, isCurrentMonth: true, isSelected: false, isDisabled: true, isToday: false },
    ],
    [
      { date: 14, isCurrentMonth: true, isSelected: false, isDisabled: true, isToday: false },
      { date: 15, isCurrentMonth: true, isSelected: false, isDisabled: true, isToday: false },
      { date: 16, isCurrentMonth: true, isSelected: selectedDate === 16, isDisabled: false, isToday: false },
      { date: 17, isCurrentMonth: true, isSelected: false, isDisabled: true, isToday: false },
      { date: 18, isCurrentMonth: true, isSelected: false, isDisabled: true, isToday: false },
      { date: 19, isCurrentMonth: true, isSelected: false, isDisabled: false, isToday: false },
      { date: 20, isCurrentMonth: true, isSelected: false, isDisabled: true, isToday: false },
    ],
    [
      { date: 21, isCurrentMonth: true, isSelected: false, isDisabled: true, isToday: false },
      { date: 22, isCurrentMonth: true, isSelected: false, isDisabled: false, isToday: false },
      { date: 23, isCurrentMonth: true, isSelected: false, isDisabled: false, isToday: false },
      { date: 24, isCurrentMonth: true, isSelected: false, isDisabled: false, isToday: false },
      { date: 25, isCurrentMonth: true, isSelected: false, isDisabled: false, isToday: false },
      { date: 26, isCurrentMonth: true, isSelected: false, isDisabled: false, isToday: false },
      { date: 27, isCurrentMonth: true, isSelected: false, isDisabled: true, isToday: false },
    ],
    [
      { date: 28, isCurrentMonth: true, isSelected: false, isDisabled: true, isToday: false },
      { date: 29, isCurrentMonth: true, isSelected: false, isDisabled: false, isToday: false },
      { date: 30, isCurrentMonth: true, isSelected: false, isDisabled: false, isToday: false },
      { date: 1, isCurrentMonth: false, isSelected: false, isDisabled: false, isToday: false },
      { date: 2, isCurrentMonth: false, isSelected: false, isDisabled: false, isToday: false },
      { date: 3, isCurrentMonth: false, isSelected: false, isDisabled: false, isToday: false },
      { date: 4, isCurrentMonth: false, isSelected: false, isDisabled: false, isToday: false },
    ],
  ];

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleDateClick = (day: CalendarDay) => {
    if (!day.isDisabled && day.isCurrentMonth && onDateSelect) {
      onDateSelect(day.date);
    }
  };

  const handleTabClick = (tab: 'Month' | 'Week' | 'Day') => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const getDayClasses = (day: CalendarDay) => {
    const baseClasses = "flex flex-col items-center justify-center pb-[6.5px] pt-[4.5px] px-[11px] relative shrink-0 size-11 rounded-[14px] cursor-pointer transition-colors";
    
    if (!day.isCurrentMonth) {
      return `${baseClasses} text-[#bbbbbb]`;
    }
    
    if (day.isDisabled) {
      return `${baseClasses} bg-neutral-100 text-[#bbbbbb] cursor-not-allowed line-through`;
    }
    
    if (day.isSelected) {
      return `${baseClasses} bg-neutral-100 border-2 border-[#141414] text-[#000000]`;
    }
    
    return `${baseClasses} bg-neutral-100 text-[#000000] hover:bg-neutral-200`;
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
        <div className="flex flex-col gap-4 items-start justify-start px-0 py-4 rounded-[20px] w-full">
          
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
                  <div 
                    className="leading-[0] mb-[-1px] text-[16px] text-center tracking-[0.16px]"
                    style={{ 
                      fontFamily: 'var(--font-family-body, Satoshi)',
                      textDecoration: day.isDisabled ? 'line-through' : 'none'
                    }}
                  >
                    {day.date}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
