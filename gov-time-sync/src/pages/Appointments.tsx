import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient, Appointment } from "@/lib/api";
import { AuthenticatedNavigation } from "@/components/AuthenticatedNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, Clock, User, FileText, MessageSquare, Edit3, Trash2, Plus,
  BarChart3, TrendingUp, CalendarDays, CheckCircle, AlertCircle,
  Filter, Search, Download, Eye, Activity
} from "lucide-react";
import { toast } from "sonner";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const Appointments = () => {
  const { logout, user, isAuthenticated, login } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [commentText, setCommentText] = useState("");
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [editingComment, setEditingComment] = useState(false);

  // Quick test login function
  const handleTestLogin = async () => {
    try {
      const response = await apiClient.officialLogin({
        username: 'road_official_1',
        password: 'hashed_password_4'
      });
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('userType', 'official');
      
      await login(response.token, 'official');
      
      toast("Test Login Successful! Logged in as road_official_1");
      
      // Refresh appointments after login
      fetchAppointments();
    } catch (error: any) {
      console.error('Test login failed:', error);
      toast("Test Login Failed: " + (error.message || "Failed to login with test credentials"));
    }
  };
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Debug information
  console.log('🔍 Auth Status:', { 
    isAuthenticated, 
    user, 
    userType: localStorage.getItem('userType'),
    token: localStorage.getItem('token') ? 'Present' : 'Not found' 
  });

  useEffect(() => {
    console.log("Auth status:", { user, isAuthenticated });
    if (isAuthenticated) {
      fetchAppointments();
    } else {
      setLoading(false);
      toast.error("Please log in to view appointments");
    }
  }, [isAuthenticated]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      console.log("Fetching appointments...");
      const data = await apiClient.getAuthorityAppointments();
      console.log("Appointments data received:", data);
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to fetch appointments. Please check if you're logged in.");
    } finally {
      setLoading(false);
    }
  };

  // Statistics and analytics
  const appointmentStats = useMemo(() => {
    console.log("Calculating stats for appointments:", appointments);
    const total = appointments.length;
    const withComments = appointments.filter(apt => apt.official_comment).length;
    const withoutComments = total - withComments;
    const withIssues = appointments.filter(apt => apt.Issue).length;
    
    // Group by date for trend analysis
    const dateGroups = appointments.reduce((acc, apt) => {
      const date = new Date(apt.date).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Group by time slots
    const timeSlotGroups = appointments.reduce((acc, apt) => {
      const timeSlot = apt.time_slot;
      acc[timeSlot] = (acc[timeSlot] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Monthly distribution
    const monthlyData = appointments.reduce((acc, apt) => {
      const month = new Date(apt.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const stats = {
      total,
      withComments,
      withoutComments,
      withIssues,
      commentProgress: total > 0 ? (withComments / total) * 100 : 0,
      issueProgress: total > 0 ? (withIssues / total) * 100 : 0,
      dateDistribution: Object.entries(dateGroups).map(([date, count]) => ({ date, count })),
      timeSlotDistribution: Object.entries(timeSlotGroups).map(([slot, count]) => ({ slot, count })),
      monthlyDistribution: Object.entries(monthlyData).map(([month, count]) => ({ month, count }))
    };
    
    console.log("Calculated stats:", stats);
    return stats;
  }, [appointments]);

  // Filtered appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const matchesSearch = !searchTerm || 
        apt.User?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.User?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.User?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.User?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.Issue?.title?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDate = !dateFilter || apt.date.includes(dateFilter);
      
      const matchesStatus = !statusFilter || statusFilter === "all" || 
        (statusFilter === 'commented' && apt.official_comment) ||
        (statusFilter === 'pending' && !apt.official_comment) ||
        (statusFilter === 'with-issues' && apt.Issue);
      
      return matchesSearch && matchesDate && matchesStatus;
    });
  }, [appointments, searchTerm, dateFilter, statusFilter]);

  const handleAddComment = async () => {
    if (!selectedAppointment || !commentText.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    try {
      await apiClient.addCommentToAppointment({
        appointment_id: selectedAppointment.appointment_id,
        comment: commentText,
      });
      
      toast.success("Comment added successfully");
      setCommentText("");
      setIsCommentDialogOpen(false);
      fetchAppointments();
    } catch (error) {
      toast.error("Failed to add comment");
      console.error("Error adding comment:", error);
    }
  };

  const handleUpdateComment = async () => {
    if (!selectedAppointment || !commentText.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    try {
      await apiClient.updateAppointmentComment({
        appointment_id: selectedAppointment.appointment_id,
        comment: commentText,
      });
      
      toast.success("Comment updated successfully");
      setCommentText("");
      setIsCommentDialogOpen(false);
      setEditingComment(false);
      fetchAppointments();
    } catch (error) {
      toast.error("Failed to update comment");
      console.error("Error updating comment:", error);
    }
  };

  const handleDeleteComment = async (appointmentId: number) => {
    try {
      await apiClient.deleteAppointmentComment(appointmentId);
      toast.success("Comment deleted successfully");
      fetchAppointments();
    } catch (error) {
      toast.error("Failed to delete comment");
      console.error("Error deleting comment:", error);
    }
  };

  const openCommentDialog = (appointment: Appointment, isEdit: boolean = false) => {
    setSelectedAppointment(appointment);
    setEditingComment(isEdit);
    setCommentText(isEdit ? appointment.official_comment || "" : "");
    setIsCommentDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const exportData = () => {
    const csvContent = [
      ['ID', 'User Name', 'Email', 'Date', 'Time', 'Issue Title', 'Comment Status'],
      ...appointments.map(apt => [
        apt.appointment_id,
        apt.User?.name || `${apt.User?.first_name} ${apt.User?.last_name}`,
        apt.User?.email,
        apt.date,
        apt.time_slot,
        apt.Issue?.title || 'No Issue',
        apt.official_comment ? 'Commented' : 'Pending'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appointments_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AuthenticatedNavigation onLogout={logout} />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading appointments...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedNavigation onLogout={logout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Test Login Button - for debugging */}
        {!isAuthenticated && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Test Login Required
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  You need to be logged in as an official to view appointments. Click below to use test credentials.
                </p>
              </div>
              <Button onClick={handleTestLogin} variant="outline" size="sm">
                Login as Test Official
              </Button>
            </div>
          </div>
        )}
        
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Appointments Dashboard</h1>
              <p className="text-muted-foreground">
                Comprehensive appointment management and analytics
              </p>
            </div>
            <Button onClick={exportData} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview & Analytics</TabsTrigger>
            <TabsTrigger value="appointments">Appointments List</TabsTrigger>
            <TabsTrigger value="insights">Insights & Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{appointmentStats.total}</div>
                  <p className="text-xs text-muted-foreground">All time appointments</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">With Comments</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{appointmentStats.withComments}</div>
                  <Progress value={appointmentStats.commentProgress} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {appointmentStats.commentProgress.toFixed(1)}% completion rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Issue-Related</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{appointmentStats.withIssues}</div>
                  <Progress value={appointmentStats.issueProgress} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {appointmentStats.issueProgress.toFixed(1)}% have issues
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Comments</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{appointmentStats.withoutComments}</div>
                  <p className="text-xs text-muted-foreground">Awaiting official response</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Time Slot Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Time Slot Distribution
                  </CardTitle>
                  <CardDescription>Popular appointment time slots</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={appointmentStats.timeSlotDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="slot" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Monthly Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Monthly Trends
                  </CardTitle>
                  <CardDescription>Appointment volume over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={appointmentStats.monthlyDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Status Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Appointment Status Overview
                </CardTitle>
                <CardDescription>Breakdown of appointment statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'With Comments', value: appointmentStats.withComments },
                          { name: 'Pending Comments', value: appointmentStats.withoutComments }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[
                          { name: 'With Comments', value: appointmentStats.withComments },
                          { name: 'Pending Comments', value: appointmentStats.withoutComments }
                        ].map((entry, index) => (
                          <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Comment Completion</span>
                      <span className="text-sm text-muted-foreground">
                        {appointmentStats.withComments}/{appointmentStats.total}
                      </span>
                    </div>
                    <Progress value={appointmentStats.commentProgress} className="w-full" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Issue Coverage</span>
                      <span className="text-sm text-muted-foreground">
                        {appointmentStats.withIssues}/{appointmentStats.total}
                      </span>
                    </div>
                    <Progress value={appointmentStats.issueProgress} className="w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            {/* Filters and Search */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filter & Search Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, email, or issue..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    placeholder="Filter by date"
                  />
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="commented">With Comments</SelectItem>
                      <SelectItem value="pending">Pending Comments</SelectItem>
                      <SelectItem value="with-issues">With Issues</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm("");
                      setDateFilter("");
                      setStatusFilter("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Appointments Grid */}
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Total appointments: {appointments.length}, Filtered: {filteredAppointments.length}
              </p>
            </div>
            
            {filteredAppointments.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No appointments found</h3>
                  <p className="text-muted-foreground text-center">
                    {appointments.length === 0 
                      ? "There are currently no appointments scheduled for your authority. Make sure you are logged in as an official."
                      : "No appointments match your current filters."
                    }
                  </p>
                  {appointments.length === 0 && (
                    <Button 
                      onClick={fetchAppointments} 
                      variant="outline" 
                      className="mt-4"
                    >
                      Retry Loading
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {filteredAppointments.map((appointment) => (
                  <Card key={appointment.appointment_id} className="shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            {appointment.User?.name || appointment.User?.first_name + ' ' + appointment.User?.last_name || 'Unknown User'}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {appointment.User?.email}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline">
                            ID: {appointment.appointment_id}
                          </Badge>
                          {appointment.official_comment && (
                            <Badge variant="default">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Commented
                            </Badge>
                          )}
                          {appointment.Issue && (
                            <Badge variant="secondary">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Has Issue
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Date:</span>
                          <span className="text-sm">{formatDate(appointment.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Time:</span>
                          <span className="text-sm">{appointment.time_slot}</span>
                        </div>
                      </div>

                      {appointment.Issue && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Related Issue:</span>
                          </div>
                          <div className="pl-6 bg-muted/50 p-3 rounded-lg">
                            <p className="text-sm font-medium">{appointment.Issue.title}</p>
                            {appointment.Issue.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {appointment.Issue.description}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      <Separator />

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Official Comment:</span>
                          </div>
                          <div className="flex gap-2">
                            {appointment.official_comment ? (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openCommentDialog(appointment, true)}
                                >
                                  <Edit3 className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteComment(appointment.appointment_id)}
                                >
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Delete
                                </Button>
                              </>
                            ) : (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => openCommentDialog(appointment)}
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Comment
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        {appointment.official_comment ? (
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <p className="text-sm">{appointment.official_comment}</p>
                          </div>
                        ) : (
                          <div className="bg-muted/30 p-3 rounded-lg border-dashed border">
                            <p className="text-sm text-muted-foreground italic">
                              No comment added yet
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Detailed Analytics & Insights
                </CardTitle>
                <CardDescription>Deep dive into appointment patterns and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Daily Distribution */}
                  <div>
                    <h4 className="font-semibold mb-4">Daily Appointment Distribution</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={appointmentStats.dateDistribution}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Performance Metrics */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Performance Metrics</h4>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Response Rate</span>
                          <span className="text-lg font-bold text-blue-600">
                            {appointmentStats.commentProgress.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={appointmentStats.commentProgress} className="bg-blue-200" />
                      </div>

                      <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Issue Resolution</span>
                          <span className="text-lg font-bold text-green-600">
                            {appointmentStats.issueProgress.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={appointmentStats.issueProgress} className="bg-green-200" />
                      </div>

                      <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Average Daily Load</span>
                          <span className="text-lg font-bold text-orange-600">
                            {(appointmentStats.total / Math.max(appointmentStats.dateDistribution.length, 1)).toFixed(1)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">appointments per day</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary Statistics */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{appointmentStats.total}</div>
                    <div className="text-sm text-muted-foreground">Total Appointments</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{appointmentStats.withComments}</div>
                    <div className="text-sm text-muted-foreground">Successfully Commented</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{appointmentStats.withoutComments}</div>
                    <div className="text-sm text-muted-foreground">Pending Response</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Comment Dialog */}
      <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {editingComment ? "Edit Comment" : "Add Comment"}
            </DialogTitle>
            <DialogDescription>
              {editingComment 
                ? "Update the official comment for this appointment."
                : "Add an official comment for this appointment."
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedAppointment && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Appointment Details:</p>
                <div className="text-sm text-muted-foreground">
                  <p>User: {selectedAppointment.User?.name || selectedAppointment.User?.first_name + ' ' + selectedAppointment.User?.last_name}</p>
                  <p>Date: {formatDate(selectedAppointment.date)}</p>
                  <p>Time: {selectedAppointment.time_slot}</p>
                </div>
              </div>
            )}
            
            <Separator />
            
            <div className="space-y-2">
              <label htmlFor="comment" className="text-sm font-medium">
                Official Comment
              </label>
              <Textarea
                id="comment"
                placeholder="Enter your official comment here..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCommentDialogOpen(false);
                setCommentText("");
                setEditingComment(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={editingComment ? handleUpdateComment : handleAddComment}
              disabled={!commentText.trim()}
            >
              {editingComment ? "Update Comment" : "Add Comment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Appointments;
