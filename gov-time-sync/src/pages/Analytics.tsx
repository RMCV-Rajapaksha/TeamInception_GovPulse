import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, BarChart3, AlertCircle, RefreshCw, TrendingUp, Users2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useTimeSlotAnalytics } from "@/hooks/useTimeSlotAnalytics";
import { useAppointmentAnalytics } from "@/hooks/useAppointmentAnalytics";
import { QuickStats, TimeSlotInsights } from "@/components/AnalyticsComponents";
import { 
  AppointmentStats, 
  ProcessingMetrics, 
  IssueInsights 
} from "@/components/AppointmentAnalyticsComponents";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const COLORS = ['#2563eb', '#16a34a', '#ea580c', '#7c3aed', '#dc2626'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold">{`Date: ${label}`}</p>
        <p className="text-blue-600">{`Total Slots: ${payload[0]?.value || 0}`}</p>
        {payload[1] && (
          <p className="text-green-600">{`Total Hours: ${payload[1].value}`}</p>
        )}
        {payload[2] && (
          <p className="text-orange-600">{`Morning Slots: ${payload[2].value}`}</p>
        )}
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const [viewType, setViewType] = useState<'line' | 'bar'>('line');
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter'>('month');
  const [activeTab, setActiveTab] = useState<'availability' | 'appointments'>('appointments');

  // Use hooks for both time slot and appointment analytics
  const { 
    timeSlotData, 
    hourlyDistribution, 
    dayOfWeekData, 
    metrics,
    isLoading: timeSlotLoading, 
    error: timeSlotError, 
    refetch: refetchTimeSlots,
    hasData: hasTimeSlotData 
  } = useTimeSlotAnalytics(dateRange);

  const {
    appointmentMetrics,
    departmentMetrics,
    isLoading: appointmentLoading,
    error: appointmentError,
    refetch: refetchAppointments,
    hasData: hasAppointmentData
  } = useAppointmentAnalytics(dateRange);

  const { totalTimeSlots, totalHours, avgSlotsPerDay, busiestDay } = metrics;
  const isLoading = timeSlotLoading || appointmentLoading;
  const error = timeSlotError || appointmentError;

  const refetchAll = () => {
    refetchTimeSlots();
    refetchAppointments();
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading analytics data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 font-semibold mb-2">Error loading analytics data</p>
            <p className="text-muted-foreground mb-4">Please check your connection and try again.</p>
            <Button onClick={() => refetchAll()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!hasTimeSlotData && !hasAppointmentData && !isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">No data available</p>
            <p className="text-muted-foreground mb-4">
              Add time slots and appointments to see analytics and insights here.
            </p>
            <Button onClick={() => refetchAll()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex items-center">
              <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-primary-foreground mr-2 sm:mr-3" />
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-primary-foreground">Government Analytics Dashboard</h1>
                <p className="text-sm sm:text-base text-primary-foreground/80 hidden sm:block">Comprehensive insights for appointment management and resource optimization</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                onClick={() => refetchAll()}
                size="sm"
                disabled={isLoading}
                className="text-xs sm:text-sm"
              >
                <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
                <span className="sm:hidden">↻</span>
              </Button>
              <Button
                variant={dateRange === 'week' ? 'accent' : 'secondary'}
                onClick={() => setDateRange('week')}
                size="sm"
                className="text-xs sm:text-sm"
              >
                Week
              </Button>
              <Button
                variant={dateRange === 'month' ? 'accent' : 'secondary'}
                onClick={() => setDateRange('month')}
                size="sm"
                className="text-xs sm:text-sm"
              >
                Month
              </Button>
              <Button
                variant={dateRange === 'quarter' ? 'accent' : 'secondary'}
                onClick={() => setDateRange('quarter')}
                size="sm"
                className="text-xs sm:text-sm"
              >
                Quarter
              </Button>
            </div>
          </div>
        </div>
      </div>

    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6 sm:mb-8">
        <Button
          variant={activeTab === 'appointments' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('appointments')}
          className="flex items-center space-x-2"
        >
          <Users2 className="h-4 w-4" />
          <span>Appointment Analytics</span>
        </Button>
        <Button
          variant={activeTab === 'availability' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('availability')}
          className="flex items-center space-x-2"
        >
          <TrendingUp className="h-4 w-4" />
          <span>Availability Analytics</span>
        </Button>
      </div>

      {activeTab === 'appointments' ? (
        <>
          {/* Appointment Statistics */}
          <div className="mb-6 sm:mb-8">
            <AppointmentStats
              metrics={appointmentMetrics}
              departmentMetrics={departmentMetrics}
              isLoading={isLoading}
            />
          </div>

          {/* Processing Metrics */}
          <div className="mb-6 sm:mb-8">
            <ProcessingMetrics
              metrics={appointmentMetrics}
              departmentMetrics={departmentMetrics}
            />
          </div>

          {/* Peak Hours Chart */}
          <Card className="mb-6 sm:mb-8">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl">Peak Booking Hours</CardTitle>
              <CardDescription className="text-sm">
                Most popular appointment booking times - optimize staff allocation
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              <div className="h-[250px] sm:h-[300px] lg:h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={appointmentMetrics.peakHours}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="hour" 
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={50}
                    />
                    <YAxis 
                      tick={{ fontSize: 10 }}
                      label={{ value: 'Appointments', angle: -90, position: 'insideLeft', style: { fontSize: '10px' } }}
                    />
                    <Tooltip 
                      formatter={(value: any) => [`${value} appointments`, 'Count']}
                      labelFormatter={(label) => `Time: ${label}`}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="#3b82f6" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Pattern and Issue Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Weekly Pattern */}
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-base sm:text-lg">Weekly Booking Pattern</CardTitle>
                <CardDescription className="text-sm">
                  Appointments by day of week
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2 sm:px-6">
                <div className="h-[200px] sm:h-[250px] lg:h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={appointmentMetrics.weeklyPattern}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="day" 
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip 
                        formatter={(value: any) => [`${value} appointments`, 'Count']}
                      />
                      <Bar dataKey="count" fill="#16a34a" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Issue Distribution */}
            <IssueInsights metrics={appointmentMetrics} />
          </div>

          {/* Daily Trend */}
          <Card className="mb-6 sm:mb-8">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl">Daily Appointment Trends</CardTitle>
              <CardDescription className="text-sm">
                Track appointment volume over time to identify patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              <div className="h-[250px] sm:h-[300px] lg:h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={appointmentMetrics.dailyDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={50}
                    />
                    <YAxis 
                      tick={{ fontSize: 10 }}
                      label={{ value: 'Appointments', angle: -90, position: 'insideLeft', style: { fontSize: '10px' } }}
                    />
                    <Tooltip 
                      formatter={(value: any) => [`${value} appointments`, 'Daily Count']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#2563eb" 
                      strokeWidth={2}
                      dot={{ fill: '#2563eb', strokeWidth: 1, r: 3 }}
                      activeDot={{ r: 5, stroke: '#2563eb', strokeWidth: 1 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          {/* Time Slot Statistics */}
          <div className="mb-6 sm:mb-8">
            <QuickStats
              totalSlots={totalTimeSlots}
              totalHours={totalHours}
              avgSlotsPerDay={avgSlotsPerDay}
              busiestDay={busiestDay?.date || 'N/A'}
              isLoading={isLoading}
            />
          </div>        {/* Chart Controls */}
        <div className="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:items-center sm:space-y-0 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">Time Slot Trends</h2>
          <div className="flex space-x-2">
            <Button
              variant={viewType === 'line' ? 'default' : 'outline'}
              onClick={() => setViewType('line')}
              size="sm"
              className="text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Line Chart</span>
              <span className="sm:hidden">Line</span>
            </Button>
            <Button
              variant={viewType === 'bar' ? 'default' : 'outline'}
              onClick={() => setViewType('bar')}
              size="sm"
              className="text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Bar Chart</span>
              <span className="sm:hidden">Bar</span>
            </Button>
          </div>
        </div>

        {/* Main Chart */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl">Time Slot Availability Over Time</CardTitle>
            <CardDescription className="text-sm">
              Track your available time slots and identify availability patterns
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            <div className="h-[250px] sm:h-[300px] lg:h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {viewType === 'line' ? (
                  <LineChart data={timeSlotData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={50}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      tick={{ fontSize: 10 }}
                      label={{ value: 'Slots', angle: -90, position: 'insideLeft', style: { fontSize: '10px' } }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Line 
                      type="monotone" 
                      dataKey="totalSlots" 
                      stroke="#2563eb" 
                      strokeWidth={2}
                      name="Total"
                      dot={{ fill: '#2563eb', strokeWidth: 1, r: 2 }}
                      activeDot={{ r: 4, stroke: '#2563eb', strokeWidth: 1 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="morningSlots" 
                      stroke="#16a34a" 
                      strokeWidth={1.5}
                      name="Morning"
                      dot={{ fill: '#16a34a', strokeWidth: 1, r: 1.5 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="afternoonSlots" 
                      stroke="#ea580c" 
                      strokeWidth={1.5}
                      name="Afternoon"
                      dot={{ fill: '#ea580c', strokeWidth: 1, r: 1.5 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="eveningSlots" 
                      stroke="#7c3aed" 
                      strokeWidth={1.5}
                      name="Evening"
                      dot={{ fill: '#7c3aed', strokeWidth: 1, r: 1.5 }}
                    />
                  </LineChart>
                ) : (
                  <BarChart data={timeSlotData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={50}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      tick={{ fontSize: 10 }}
                      label={{ value: 'Slots', angle: -90, position: 'insideLeft', style: { fontSize: '10px' } }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="totalSlots" fill="#2563eb" name="Total" />
                    <Bar dataKey="morningSlots" fill="#16a34a" name="Morning" />
                    <Bar dataKey="afternoonSlots" fill="#ea580c" name="Afternoon" />
                    <Bar dataKey="eveningSlots" fill="#7c3aed" name="Evening" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Additional Insights and Time Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Time Slot Insights - Takes 2 columns on large screens, full width on mobile */}
          <div className="lg:col-span-2">
            <TimeSlotInsights
              timeSlotData={timeSlotData}
              hourlyDistribution={hourlyDistribution}
              totalHours={totalHours}
              totalSlots={totalTimeSlots}
            />
          </div>

          {/* Hourly Distribution Chart */}
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-base sm:text-lg">Hourly Distribution</CardTitle>
              <CardDescription className="text-sm">
                Most popular time slots by hour
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              <div className="h-[200px] sm:h-[250px] lg:h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyDistribution.slice(0, 8)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="hour" 
                      tick={{ fontSize: 9 }}
                      angle={-45}
                      textAnchor="end"
                      height={35}
                    />
                    <YAxis tick={{ fontSize: 9 }} />
                    <Tooltip 
                      formatter={(value: any, name: string) => [
                        name === 'count' ? `${value} slots` : `${value}%`, 
                        name === 'count' ? 'Slots' : 'Percentage'
                      ]}
                    />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Day of Week Analysis */}
        {dayOfWeekData.length > 0 && (
          <Card className="mb-6 sm:mb-8">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl">Weekly Pattern Analysis</CardTitle>
              <CardDescription className="text-sm">
                Your availability patterns by day of the week
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              <div className="h-[200px] sm:h-[250px] lg:h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dayOfWeekData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="day" 
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={40}
                    />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip 
                      formatter={(value: any, name: string) => [
                        name === 'slots' ? `${value} slots` : `${value} hours`, 
                        name === 'slots' ? 'Time Slots' : 'Total Hours'
                      ]}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="slots" fill="#2563eb" name="Slots" />
                    <Bar dataKey="hours" fill="#16a34a" name="Hours" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
        </>
      )}
      </div>
    </Layout>
  );
};

export default Analytics;
