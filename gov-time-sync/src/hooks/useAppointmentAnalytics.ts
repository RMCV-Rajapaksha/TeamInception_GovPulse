import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient, Appointment } from '@/lib/api';

export interface AppointmentMetrics {
  totalAppointments: number;
  todayAppointments: number;
  weekAppointments: number;
  monthAppointments: number;
  completedAppointments: number;
  pendingAppointments: number;
  noShowRate: number;
  avgProcessingTime: number;
  peakHours: { hour: string; count: number }[];
  dailyDistribution: { date: string; count: number }[];
  weeklyPattern: { day: string; count: number }[];
  issueTypeDistribution: { type: string; count: number; percentage: number }[];
}

export interface DepartmentMetrics {
  departmentName: string;
  appointmentLoad: number;
  issuesHandled: number;
  avgResponseTime: number;
  completionRate: number;
}

export const useAppointmentAnalytics = (dateRange: 'week' | 'month' | 'quarter') => {
  // Fetch appointments data
  const { data: appointments, isLoading: appointmentsLoading, error: appointmentsError, refetch: refetchAppointments } = useQuery({
    queryKey: ['authority-appointments'],
    queryFn: () => apiClient.getAuthorityAppointments(),
    refetchInterval: 60000, // Refetch every minute
    retry: 3,
  });

  // Fetch issues data for departmental metrics
  const { data: issuesData, isLoading: issuesLoading, error: issuesError, refetch: refetchIssues } = useQuery({
    queryKey: ['authority-issues'],
    queryFn: () => apiClient.getAuthorityIssues(),
    refetchInterval: 60000,
    retry: 3,
  });

  const processedData = useMemo(() => {
    if (!appointments) {
      return {
        appointmentMetrics: {
          totalAppointments: 0,
          todayAppointments: 0,
          weekAppointments: 0,
          monthAppointments: 0,
          completedAppointments: 0,
          pendingAppointments: 0,
          noShowRate: 0,
          avgProcessingTime: 0,
          peakHours: [],
          dailyDistribution: [],
          weeklyPattern: [],
          issueTypeDistribution: [],
        },
        departmentMetrics: null,
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
    
    // Filter appointments based on date range
    const filteredAppointments = appointments.filter((appointment: Appointment) => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate >= cutoffDate;
    });

    // Calculate basic metrics
    const totalAppointments = filteredAppointments.length;
    
    // Today's appointments
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = filteredAppointments.filter(
      (apt: Appointment) => apt.date.split('T')[0] === today
    ).length;

    // Week appointments
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weekAppointments = filteredAppointments.filter(
      (apt: Appointment) => new Date(apt.date) >= weekAgo
    ).length;

    // Month appointments
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const monthAppointments = filteredAppointments.filter(
      (apt: Appointment) => new Date(apt.date) >= monthAgo
    ).length;

    // Calculate completed/pending appointments based on comments
    const completedAppointments = filteredAppointments.filter(
      (apt: Appointment) => apt.official_comment && apt.official_comment.trim() !== ''
    ).length;
    const pendingAppointments = totalAppointments - completedAppointments;

    // Calculate no-show rate (approximation: appointments without comments and past date)
    const pastAppointments = filteredAppointments.filter(
      (apt: Appointment) => new Date(apt.date) < now
    );
    const noShowCount = pastAppointments.filter(
      (apt: Appointment) => !apt.official_comment || apt.official_comment.trim() === ''
    ).length;
    const noShowRate = pastAppointments.length > 0 ? (noShowCount / pastAppointments.length) * 100 : 0;

    // Calculate average processing time (days between appointment and comment)
    const processedAppointments = filteredAppointments.filter(
      (apt: Appointment) => apt.official_comment && apt.official_comment.trim() !== ''
    );
    const avgProcessingTime = processedAppointments.length > 0 
      ? processedAppointments.reduce((sum, apt) => {
          const appointmentDate = new Date(apt.date);
          const processingDate = now; // Assuming processed today (could be enhanced with comment timestamp)
          const daysDiff = Math.abs(processingDate.getTime() - appointmentDate.getTime()) / (1000 * 60 * 60 * 24);
          return sum + daysDiff;
        }, 0) / processedAppointments.length
      : 0;

    // Calculate peak hours distribution
    const hourlyMap = new Map<number, number>();
    filteredAppointments.forEach((appointment: Appointment) => {
      try {
        const timeSlot = appointment.time_slot;
        const startTime = timeSlot.split(' - ')[0];
        const hour = parseInt(startTime.split(':')[0]);
        hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + 1);
      } catch {
        // Skip invalid time slots
      }
    });

    const peakHours = Array.from(hourlyMap.entries())
      .map(([hour, count]) => ({
        hour: `${hour}:00`,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Daily distribution for the selected period
    const dailyMap = new Map<string, number>();
    filteredAppointments.forEach((appointment: Appointment) => {
      const date = new Date(appointment.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      dailyMap.set(date, (dailyMap.get(date) || 0) + 1);
    });

    const dailyDistribution = Array.from(dailyMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-14); // Last 14 days

    // Weekly pattern
    const weeklyMap = new Map<string, number>();
    filteredAppointments.forEach((appointment: Appointment) => {
      const day = new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'short' });
      weeklyMap.set(day, (weeklyMap.get(day) || 0) + 1);
    });

    const dayOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyPattern = dayOrder.map(day => ({
      day,
      count: weeklyMap.get(day) || 0,
    }));

    // Issue type distribution (from appointments with issues)
    const issueTypeMap = new Map<string, number>();
    filteredAppointments.forEach((appointment: Appointment) => {
      if (appointment.Issue?.title) {
        // Categorize by issue title keywords
        const title = appointment.Issue.title.toLowerCase();
        let category = 'Other';
        
        if (title.includes('health') || title.includes('medical')) category = 'Health';
        else if (title.includes('transport') || title.includes('road')) category = 'Transportation';
        else if (title.includes('education') || title.includes('school')) category = 'Education';
        else if (title.includes('tax') || title.includes('revenue')) category = 'Tax/Revenue';
        else if (title.includes('water') || title.includes('sanitation')) category = 'Water/Sanitation';
        else if (title.includes('security') || title.includes('police')) category = 'Security';
        
        issueTypeMap.set(category, (issueTypeMap.get(category) || 0) + 1);
      }
    });

    const totalIssues = Array.from(issueTypeMap.values()).reduce((a, b) => a + b, 0);
    const issueTypeDistribution = Array.from(issueTypeMap.entries())
      .map(([type, count]) => ({
        type,
        count,
        percentage: totalIssues > 0 ? Math.round((count / totalIssues) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    // Department metrics (from issues data)
    let departmentMetrics: DepartmentMetrics | null = null;
    if (issuesData) {
      const authority = filteredAppointments[0]?.Authority;
      if (authority) {
        departmentMetrics = {
          departmentName: authority.name,
          appointmentLoad: totalAppointments,
          issuesHandled: issuesData.total_issues || 0,
          avgResponseTime: avgProcessingTime,
          completionRate: totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0,
        };
      }
    }

    const appointmentMetrics: AppointmentMetrics = {
      totalAppointments,
      todayAppointments,
      weekAppointments,
      monthAppointments,
      completedAppointments,
      pendingAppointments,
      noShowRate: Math.round(noShowRate * 10) / 10,
      avgProcessingTime: Math.round(avgProcessingTime * 10) / 10,
      peakHours,
      dailyDistribution,
      weeklyPattern,
      issueTypeDistribution,
    };

    return { appointmentMetrics, departmentMetrics };
  }, [appointments, issuesData, dateRange]);

  return {
    ...processedData,
    isLoading: appointmentsLoading || issuesLoading,
    error: appointmentsError || issuesError,
    refetch: () => {
      refetchAppointments();
      refetchIssues();
    },
    hasData: (appointments && appointments.length > 0) || false,
  };
};
