import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, BarChart3, TrendingUp } from "lucide-react";
import { Layout } from "@/components/Layout";
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

interface MeetingData {
  date: string;
  time: string;
  datetime: string;
  meetingCount: number;
  completedMeetings: number;
  pendingMeetings: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold">{`Date: ${label}`}</p>
        <p className="text-blue-600">{`Total Meetings: ${payload[0].value}`}</p>
        {payload[1] && (
          <p className="text-green-600">{`Completed: ${payload[1].value}`}</p>
        )}
        {payload[2] && (
          <p className="text-orange-600">{`Pending: ${payload[2].value}`}</p>
        )}
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const [meetingData, setMeetingData] = useState<MeetingData[]>([]);
  const [viewType, setViewType] = useState<'line' | 'bar'>('line');
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter'>('week');

  // Sample data - replace with actual API call
  useEffect(() => {
    const generateSampleData = () => {
      const data: MeetingData[] = [];
      const today = new Date();
      
      let days: number;
      if (dateRange === 'week') {
        days = 7;
      } else if (dateRange === 'month') {
        days = 30;
      } else {
        days = 90;
      }

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        
        // Generate random meeting counts for demonstration
        const totalMeetings = Math.floor(Math.random() * 20) + 5;
        const completedMeetings = Math.floor(totalMeetings * 0.7);
        const pendingMeetings = totalMeetings - completedMeetings;

        data.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          datetime: date.toISOString(),
          meetingCount: totalMeetings,
          completedMeetings,
          pendingMeetings,
        });
      }
      return data;
    };

    setMeetingData(generateSampleData());
  }, [dateRange]);

  const totalMeetings = meetingData.reduce((sum, item) => sum + item.meetingCount, 0);
  const avgMeetingsPerDay = totalMeetings / meetingData.length;
  const maxMeetingsInDay = Math.max(...meetingData.map(item => item.meetingCount));

  const getPeriodText = () => {
    if (dateRange === 'week') return 'This Week';
    if (dateRange === 'month') return 'This Month';
    return 'This Quarter';
  };

  const getDateRangeText = () => {
    if (dateRange === 'week') return '7 days';
    if (dateRange === 'month') return '30 days';
    return '90 days';
  };

  return (
    <Layout>
      <div className="bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-primary-foreground mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-primary-foreground">Meeting Analytics</h1>
                <p className="text-primary-foreground/80">Track and analyze meeting trends over time</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Meetings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{totalMeetings}</div>
              <p className="text-xs text-muted-foreground">
                Last {getDateRangeText()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{avgMeetingsPerDay.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">
                Meetings per day
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Peak Day</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{maxMeetingsInDay}</div>
              <p className="text-xs text-muted-foreground">
                Maximum meetings in a day
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Chart Controls */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-foreground">Meeting Trends</h2>
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
            <CardTitle>Meeting Count Over Time</CardTitle>
            <CardDescription>
              Track meeting patterns and identify trends in your schedule
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {viewType === 'line' ? (
                  <LineChart data={meetingData}>
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
                      label={{ value: 'Meeting Count', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="meetingCount" 
                      stroke="#2563eb" 
                      strokeWidth={3}
                      name="Total Meetings"
                      dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="completedMeetings" 
                      stroke="#16a34a" 
                      strokeWidth={2}
                      name="Completed Meetings"
                      dot={{ fill: '#16a34a', strokeWidth: 2, r: 3 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="pendingMeetings" 
                      stroke="#ea580c" 
                      strokeWidth={2}
                      name="Pending Meetings"
                      dot={{ fill: '#ea580c', strokeWidth: 2, r: 3 }}
                    />
                  </LineChart>
                ) : (
                  <BarChart data={meetingData}>
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
                      label={{ value: 'Meeting Count', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="meetingCount" fill="#2563eb" name="Total Meetings" />
                    <Bar dataKey="completedMeetings" fill="#16a34a" name="Completed Meetings" />
                    <Bar dataKey="pendingMeetings" fill="#ea580c" name="Pending Meetings" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Meeting Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Completion Rate:</span>
                  <span className="font-semibold text-green-600">
                    {((meetingData.reduce((sum, item) => sum + item.completedMeetings, 0) / totalMeetings) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Busiest Day:</span>
                  <span className="font-semibold">
                    {meetingData.find(item => item.meetingCount === maxMeetingsInDay)?.date || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Days:</span>
                  <span className="font-semibold">{meetingData.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Trend Direction:</span>
                  <span className="font-semibold text-blue-600">
                    {meetingData.length > 1 && 
                     meetingData[meetingData.length - 1].meetingCount > meetingData[0].meetingCount 
                     ? '↗ Increasing' : '↘ Decreasing'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Most Active Period:</span>
                  <span className="font-semibold">
                    {getPeriodText()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Data Points:</span>
                  <span className="font-semibold">{meetingData.length} days</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
