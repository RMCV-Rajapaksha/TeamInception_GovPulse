import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient, FreeTimeSlot } from '@/lib/api';

export interface TimeSlotData {
  date: string;
  day: string;
  datetime: string;
  totalSlots: number;
  totalHours: number;
  morningSlots: number;
  afternoonSlots: number;
  eveningSlots: number;
  timeSlots: string[];
}

export interface HourlyDistribution {
  hour: string;
  count: number;
  percentage: number;
}

export interface DayOfWeekData {
  day: string;
  slots: number;
  hours: number;
}

export interface AnalyticsMetrics {
  totalTimeSlots: number;
  totalHours: number;
  avgSlotsPerDay: number;
  maxSlotsInDay: number;
  busiestDay: TimeSlotData | undefined;
}

export const useTimeSlotAnalytics = (dateRange: 'week' | 'month' | 'quarter') => {
  // Fetch time slots data from API
  const { data: freeTimeSlots, isLoading, error, refetch } = useQuery({
    queryKey: ['freeTimeSlots'],
    queryFn: () => apiClient.viewFreeTimeSlots(),
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const processedData = useMemo(() => {
    if (!freeTimeSlots) {
      return { 
        timeSlotData: [], 
        hourlyDistribution: [], 
        dayOfWeekData: [],
        metrics: {
          totalTimeSlots: 0,
          totalHours: 0,
          avgSlotsPerDay: 0,
          maxSlotsInDay: 0,
          busiestDay: undefined,
        }
      };
    }

    const now = new Date();
    const getDateFilter = () => {
      if (dateRange === 'week') return 7;
      if (dateRange === 'month') return 30;
      return 90;
    };

    const daysToFilter = getDateFilter();
    const cutoffDate = new Date(now.getTime() - daysToFilter * 24 * 60 * 60 * 1000);

    // Filter data based on date range
    const filteredSlots = freeTimeSlots.filter((slot: FreeTimeSlot) => {
      const slotDate = new Date(slot.date);
      return slotDate >= cutoffDate;
    });

    // Process time slot data
    const timeSlotData: TimeSlotData[] = filteredSlots.map((slot: FreeTimeSlot) => {
      const date = new Date(slot.date);
      const timeSlots = slot.time_slots || [];
      
      // Calculate total hours from time slots
      const totalHours = timeSlots.reduce((total, timeSlot) => {
        try {
          const [start, end] = timeSlot.split(' - ');
          const startHour = parseInt(start.split(':')[0]);
          const endHour = parseInt(end.split(':')[0]);
          const startMinute = parseInt(start.split(':')[1] || '0');
          const endMinute = parseInt(end.split(':')[1] || '0');
          
          const startTime = startHour + startMinute / 60;
          const endTime = endHour + endMinute / 60;
          return total + (endTime - startTime);
        } catch {
          return total + 1; // Default to 1 hour if parsing fails
        }
      }, 0);

      // Categorize slots by time of day
      let morningSlots = 0, afternoonSlots = 0, eveningSlots = 0;
      timeSlots.forEach(timeSlot => {
        try {
          const startHour = parseInt(timeSlot.split(' - ')[0].split(':')[0]);
          if (startHour < 12) morningSlots++;
          else if (startHour < 17) afternoonSlots++;
          else eveningSlots++;
        } catch {
          // If parsing fails, count as afternoon
          afternoonSlots++;
        }
      });

      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        datetime: date.toISOString(),
        totalSlots: timeSlots.length,
        totalHours: Math.round(totalHours * 10) / 10, // Round to 1 decimal place
        morningSlots,
        afternoonSlots,
        eveningSlots,
        timeSlots,
      };
    });

    // Sort by date
    timeSlotData.sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());

    // Calculate hourly distribution
    const hourlyMap = new Map<number, number>();
    filteredSlots.forEach((slot: FreeTimeSlot) => {
      slot.time_slots?.forEach(timeSlot => {
        try {
          const startHour = parseInt(timeSlot.split(' - ')[0].split(':')[0]);
          hourlyMap.set(startHour, (hourlyMap.get(startHour) || 0) + 1);
        } catch {
          // Skip invalid time slots
        }
      });
    });

    const totalTimeSlots = Array.from(hourlyMap.values()).reduce((a, b) => a + b, 0);
    const hourlyDistribution: HourlyDistribution[] = Array.from(hourlyMap.entries())
      .map(([hour, count]) => ({
        hour: `${hour}:00`,
        count,
        percentage: totalTimeSlots > 0 ? Math.round((count / totalTimeSlots) * 100) : 0,
      }))
      .sort((a, b) => parseInt(a.hour) - parseInt(b.hour));

    // Calculate day of week distribution
    const dayOfWeekMap = new Map<string, { slots: number; hours: number }>();
    timeSlotData.forEach(data => {
      const existing = dayOfWeekMap.get(data.day) || { slots: 0, hours: 0 };
      dayOfWeekMap.set(data.day, {
        slots: existing.slots + data.totalSlots,
        hours: existing.hours + data.totalHours,
      });
    });

    const dayOfWeekData: DayOfWeekData[] = Array.from(dayOfWeekMap.entries()).map(([day, data]) => ({
      day,
      ...data,
    }));

    // Sort days of week
    const dayOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayOfWeekData.sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));

    // Calculate metrics
    const totalSlots = timeSlotData.reduce((sum, item) => sum + item.totalSlots, 0);
    const totalHours = timeSlotData.reduce((sum, item) => sum + item.totalHours, 0);
    const avgSlotsPerDay = timeSlotData.length > 0 ? totalSlots / timeSlotData.length : 0;
    const maxSlotsInDay = timeSlotData.length > 0 ? Math.max(...timeSlotData.map(item => item.totalSlots)) : 0;
    const busiestDay = timeSlotData.find(item => item.totalSlots === maxSlotsInDay);

    const metrics: AnalyticsMetrics = {
      totalTimeSlots: totalSlots,
      totalHours: Math.round(totalHours * 10) / 10,
      avgSlotsPerDay: Math.round(avgSlotsPerDay * 10) / 10,
      maxSlotsInDay,
      busiestDay,
    };

    return { timeSlotData, hourlyDistribution, dayOfWeekData, metrics };
  }, [freeTimeSlots, dateRange]);

  return {
    ...processedData,
    isLoading,
    error,
    refetch,
    hasData: processedData.timeSlotData.length > 0,
  };
};
