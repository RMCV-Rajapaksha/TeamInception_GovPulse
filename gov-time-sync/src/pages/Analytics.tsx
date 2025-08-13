import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, BarChart3, AlertCircle, RefreshCw } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useTimeSlotAnalytics } from "@/hooks/useTimeSlotAnalytics";
import { QuickStats, TimeSlotInsights } from "@/components/AnalyticsComponents";
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
  if (active && payload && payload.length) {
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

  // Use the custom hook for analytics data
  const { 
    timeSlotData, 
    hourlyDistribution, 
    dayOfWeekData, 
    metrics,
    isLoading, 
    error, 
    refetch,
    hasData 
  } = useTimeSlotAnalytics(dateRange);

  const { totalTimeSlots, totalHours, avgSlotsPerDay, busiestDay } = metrics;

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
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!hasData && !isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">No time slot data available</p>
            <p className="text-muted-foreground mb-4">
              Add some time slots to see analytics and insights here.
            </p>
            <Button onClick={() => refetch()} variant="outline">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-primary-foreground mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-primary-foreground">Time Slot Analytics</h1>
                <p className="text-primary-foreground/80">Track and analyze your available time slots over time</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => refetch()}
                size="sm"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant={dateRange === 'week' ? 'accent' : 'secondary'}
                onClick={() => setDateRange('week')}
                size="sm"
              >
                Week
              </Button>
              <Button
                variant={dateRange === 'month' ? 'accent' : 'secondary'}
                onClick={() => setDateRange('month')}
                size="sm"
              >
                Month
              </Button>
              <Button
                variant={dateRange === 'quarter' ? 'accent' : 'secondary'}
                onClick={() => setDateRange('quarter')}
                size="sm"
              >
                Quarter
              </Button>
            </div>
          </div>
        </div>
      </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Statistics Cards */}
      <div className="mb-8">
        <QuickStats
          totalSlots={totalTimeSlots}
          totalHours={totalHours}
          avgSlotsPerDay={avgSlotsPerDay}
          busiestDay={busiestDay?.date || 'N/A'}
          isLoading={isLoading}
        />
      </div>        {/* Chart Controls */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-foreground">Time Slot Trends</h2>
          <div className="flex space-x-2">
            <Button
              variant={viewType === 'line' ? 'default' : 'outline'}
              onClick={() => setViewType('line')}
              size="sm"
            >
              Line Chart
            </Button>
            <Button
              variant={viewType === 'bar' ? 'default' : 'outline'}
              onClick={() => setViewType('bar')}
              size="sm"
            >
              Bar Chart
            </Button>
          </div>
        </div>

        {/* Main Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Time Slot Availability Over Time</CardTitle>
            <CardDescription>
              Track your available time slots and identify availability patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {viewType === 'line' ? (
                  <LineChart data={timeSlotData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      label={{ value: 'Time Slot Count', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="totalSlots" 
                      stroke="#2563eb" 
                      strokeWidth={3}
                      name="Total Slots"
                      dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="morningSlots" 
                      stroke="#16a34a" 
                      strokeWidth={2}
                      name="Morning Slots"
                      dot={{ fill: '#16a34a', strokeWidth: 2, r: 3 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="afternoonSlots" 
                      stroke="#ea580c" 
                      strokeWidth={2}
                      name="Afternoon Slots"
                      dot={{ fill: '#ea580c', strokeWidth: 2, r: 3 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="eveningSlots" 
                      stroke="#7c3aed" 
                      strokeWidth={2}
                      name="Evening Slots"
                      dot={{ fill: '#7c3aed', strokeWidth: 2, r: 3 }}
                    />
                  </LineChart>
                ) : (
                  <BarChart data={timeSlotData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      label={{ value: 'Time Slot Count', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="totalSlots" fill="#2563eb" name="Total Slots" />
                    <Bar dataKey="morningSlots" fill="#16a34a" name="Morning Slots" />
                    <Bar dataKey="afternoonSlots" fill="#ea580c" name="Afternoon Slots" />
                    <Bar dataKey="eveningSlots" fill="#7c3aed" name="Evening Slots" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Additional Insights and Time Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Time Slot Insights - Takes 2 columns */}
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
            <CardHeader>
              <CardTitle>Hourly Distribution</CardTitle>
              <CardDescription>
                Most popular time slots by hour
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyDistribution.slice(0, 8)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="hour" 
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={40}
                    />
                    <YAxis tick={{ fontSize: 10 }} />
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
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Weekly Pattern Analysis</CardTitle>
              <CardDescription>
                Your availability patterns by day of the week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dayOfWeekData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: any, name: string) => [
                        name === 'slots' ? `${value} slots` : `${value} hours`, 
                        name === 'slots' ? 'Time Slots' : 'Total Hours'
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="slots" fill="#2563eb" name="Time Slots" />
                    <Bar dataKey="hours" fill="#16a34a" name="Hours" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Analytics;
