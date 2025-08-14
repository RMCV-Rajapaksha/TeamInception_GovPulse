import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient, Feedback as FeedbackType } from "@/lib/api";
import { AuthenticatedNavigation } from "@/components/AuthenticatedNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Star, Calendar, Clock, User, MessageSquare, BarChart3, TrendingUp,
  Filter, Search, Download, Eye, Activity, RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Area, AreaChart
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const Feedback = () => {
  const { logout, isAuthenticated, login } = useAuth();
  const [feedbacks, setFeedbacks] = useState<FeedbackType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

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
      
      // Refresh feedback after login
      fetchFeedback();
    } catch (error: any) {
      console.error('Test login failed:', error);
      toast("Test Login Failed: " + (error.message || "Failed to login with test credentials"));
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      console.log("Fetching feedback...");
      
      // Get all feedback - you can filter by authority_id if needed
      const data = await apiClient.getAllFeedback();
      console.log("Feedback data received:", data);
      setFeedbacks(data.feedbacks || []);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      toast.error("Failed to fetch feedback data.");
    } finally {
      setLoading(false);
    }
  };

  // Statistics and analytics
  const feedbackStats = useMemo(() => {
    console.log("Calculating stats for feedback:", feedbacks);
    const total = feedbacks.length;
    
    // Rating distribution
    const ratingGroups = feedbacks.reduce((acc, feedback) => {
      const rating = feedback.rating;
      acc[rating] = (acc[rating] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    // Average rating
    const averageRating = total > 0 
      ? feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / total 
      : 0;

    // Rating categories
    const excellent = feedbacks.filter(f => f.rating === 5).length;
    const good = feedbacks.filter(f => f.rating === 4).length;
    const average = feedbacks.filter(f => f.rating === 3).length;
    const poor = feedbacks.filter(f => f.rating <= 2).length;

    // Comments analysis
    const withComments = feedbacks.filter(f => f.comment && f.comment.trim()).length;
    const withoutComments = total - withComments;

    // Monthly distribution (if appointment data is available)
    const monthlyData = feedbacks.reduce((acc, feedback) => {
      if (feedback.Appointment?.date) {
        const month = new Date(feedback.Appointment.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        acc[month] = (acc[month] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const stats = {
      total,
      averageRating,
      excellent,
      good,
      average,
      poor,
      withComments,
      withoutComments,
      commentRate: total > 0 ? (withComments / total) * 100 : 0,
      satisfactionRate: total > 0 ? ((excellent + good) / total) * 100 : 0,
      ratingDistribution: Object.entries(ratingGroups).map(([rating, count]) => ({ 
        rating: `${rating} Star${rating !== '1' ? 's' : ''}`, 
        count,
        value: parseInt(rating)
      })),
      categoryDistribution: [
        { name: 'Excellent (5★)', value: excellent, color: '#00C49F' },
        { name: 'Good (4★)', value: good, color: '#0088FE' },
        { name: 'Average (3★)', value: average, color: '#FFBB28' },
        { name: 'Poor (1-2★)', value: poor, color: '#FF8042' }
      ],
      monthlyDistribution: Object.entries(monthlyData).map(([month, count]) => ({ month, count }))
    };
    
    console.log("Calculated feedback stats:", stats);
    return stats;
  }, [feedbacks]);

  // Filtered feedback
  const filteredFeedback = useMemo(() => {
    let filtered = feedbacks.filter(feedback => {
      const matchesSearch = !searchTerm || 
        feedback.Appointment?.User?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.Appointment?.User?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.Appointment?.User?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.Appointment?.User?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.comment?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRating = ratingFilter === "all" || 
        (ratingFilter === '5' && feedback.rating === 5) ||
        (ratingFilter === '4' && feedback.rating === 4) ||
        (ratingFilter === '3' && feedback.rating === 3) ||
        (ratingFilter === 'poor' && feedback.rating <= 2);
      
      return matchesSearch && matchesRating;
    });

    // Sort feedback
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'rating-asc':
          return a.rating - b.rating;
        case 'date':
          if (!a.Appointment?.date || !b.Appointment?.date) return 0;
          return new Date(b.Appointment.date).getTime() - new Date(a.Appointment.date).getTime();
        case 'date-asc':
          if (!a.Appointment?.date || !b.Appointment?.date) return 0;
          return new Date(a.Appointment.date).getTime() - new Date(b.Appointment.date).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [feedbacks, searchTerm, ratingFilter, sortBy]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium">{rating}/5</span>
      </div>
    );
  };

  const exportData = () => {
    const csvContent = [
      ['Feedback ID', 'Appointment ID', 'User Name', 'Email', 'Rating', 'Comment', 'Date', 'Time'],
      ...feedbacks.map(feedback => [
        feedback.feedback_id,
        feedback.appointment_id,
        feedback.Appointment?.User?.name || `${feedback.Appointment?.User?.first_name} ${feedback.Appointment?.User?.last_name}`,
        feedback.Appointment?.User?.email || 'N/A',
        feedback.rating,
        feedback.comment || 'No comment',
        feedback.Appointment?.date || 'N/A',
        feedback.Appointment?.time_slot || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback_report_${new Date().toISOString().split('T')[0]}.csv`;
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
            <p className="text-muted-foreground">Loading feedback data...</p>
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
                  You need to be logged in as an official to access all features. Click below to use test credentials.
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
              <h1 className="text-3xl font-bold text-foreground mb-2">Feedback Dashboard</h1>
              <p className="text-muted-foreground">
                Citizen feedback and satisfaction analytics
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={fetchFeedback} variant="outline" className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button onClick={exportData} variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Data
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview & Analytics</TabsTrigger>
            <TabsTrigger value="feedback">Feedback List</TabsTrigger>
            <TabsTrigger value="insights">Insights & Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{feedbackStats.total}</div>
                  <p className="text-xs text-muted-foreground">All time feedback</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{feedbackStats.averageRating.toFixed(1)}/5</div>
                  <Progress value={(feedbackStats.averageRating / 5) * 100} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Overall satisfaction rating
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Satisfaction Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{feedbackStats.satisfactionRate.toFixed(1)}%</div>
                  <Progress value={feedbackStats.satisfactionRate} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    4-5 star ratings
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">With Comments</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{feedbackStats.withComments}</div>
                  <Progress value={feedbackStats.commentRate} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {feedbackStats.commentRate.toFixed(1)}% include comments
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Rating Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Rating Distribution
                  </CardTitle>
                  <CardDescription>Breakdown of feedback ratings</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={feedbackStats.ratingDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="rating" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Category Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Satisfaction Categories
                  </CardTitle>
                  <CardDescription>Feedback quality breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={feedbackStats.categoryDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {feedbackStats.categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${entry.name}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Overview
                </CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{feedbackStats.excellent}</div>
                    <div className="text-sm text-muted-foreground">Excellent (5★)</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{feedbackStats.good}</div>
                    <div className="text-sm text-muted-foreground">Good (4★)</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{feedbackStats.average}</div>
                    <div className="text-sm text-muted-foreground">Average (3★)</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{feedbackStats.poor}</div>
                    <div className="text-sm text-muted-foreground">Poor (1-2★)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            {/* Filters and Search */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filter & Search Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, email, or comment..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={ratingFilter} onValueChange={setRatingFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ratings</SelectItem>
                      <SelectItem value="5">5 Stars</SelectItem>
                      <SelectItem value="4">4 Stars</SelectItem>
                      <SelectItem value="3">3 Stars</SelectItem>
                      <SelectItem value="poor">1-2 Stars</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Rating (High to Low)</SelectItem>
                      <SelectItem value="rating-asc">Rating (Low to High)</SelectItem>
                      <SelectItem value="date">Date (Recent First)</SelectItem>
                      <SelectItem value="date-asc">Date (Oldest First)</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm("");
                      setRatingFilter("all");
                      setSortBy("rating");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Feedback Results */}
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Total feedback: {feedbacks.length}, Filtered: {filteredFeedback.length}
              </p>
            </div>
            
            {filteredFeedback.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No feedback found</h3>
                  <p className="text-muted-foreground text-center">
                    {feedbacks.length === 0 
                      ? "There is currently no feedback available."
                      : "No feedback matches your current filters."
                    }
                  </p>
                  {feedbacks.length === 0 && (
                    <Button 
                      onClick={fetchFeedback} 
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
                {filteredFeedback.map((feedback) => (
                  <Card key={feedback.feedback_id} className="shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            {feedback.Appointment?.User?.name || 
                             `${feedback.Appointment?.User?.first_name} ${feedback.Appointment?.User?.last_name}` || 
                             'Unknown User'}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {feedback.Appointment?.User?.email}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline">
                            ID: {feedback.feedback_id}
                          </Badge>
                          <Badge variant={(() => {
                            if (feedback.rating >= 4) return "default";
                            if (feedback.rating === 3) return "secondary";
                            return "destructive";
                          })()}>
                            {feedback.rating}★
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        {feedback.Appointment?.date && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Date:</span>
                            <span className="text-sm">{formatDate(feedback.Appointment.date)}</span>
                          </div>
                        )}
                        {feedback.Appointment?.time_slot && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Time:</span>
                            <span className="text-sm">{feedback.Appointment.time_slot}</span>
                          </div>
                        )}
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Rating:</span>
                          {renderStars(feedback.rating)}
                        </div>
                        
                        {feedback.comment && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <MessageSquare className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">Comment:</span>
                            </div>
                            <div className="bg-muted/50 p-3 rounded-lg">
                              <p className="text-sm">{feedback.comment}</p>
                            </div>
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
                <CardDescription>Deep dive into feedback patterns and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Monthly Trend */}
                  {feedbackStats.monthlyDistribution.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-4">Monthly Feedback Trends</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={feedbackStats.monthlyDistribution}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Performance Metrics */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Performance Metrics</h4>
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Satisfaction Rate</span>
                          <span className="text-lg font-bold text-green-600">
                            {feedbackStats.satisfactionRate.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={feedbackStats.satisfactionRate} className="bg-green-200" />
                        <p className="text-xs text-muted-foreground mt-1">4-5 star ratings</p>
                      </div>

                      <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Average Rating</span>
                          <span className="text-lg font-bold text-blue-600">
                            {feedbackStats.averageRating.toFixed(2)}/5.00
                          </span>
                        </div>
                        <Progress value={(feedbackStats.averageRating / 5) * 100} className="bg-blue-200" />
                      </div>

                      <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Comment Rate</span>
                          <span className="text-lg font-bold text-purple-600">
                            {feedbackStats.commentRate.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={feedbackStats.commentRate} className="bg-purple-200" />
                        <p className="text-xs text-muted-foreground mt-1">feedback with comments</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="mt-8 p-6 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-4">Recommendations</h4>
                  <div className="space-y-2 text-sm">
                    {feedbackStats.averageRating < 3 && (
                      <p className="text-red-600">⚠️ Average rating is below 3. Consider reviewing service quality and addressing common issues.</p>
                    )}
                    {feedbackStats.satisfactionRate < 70 && (
                      <p className="text-orange-600">📈 Satisfaction rate is below 70%. Focus on improving appointment experiences.</p>
                    )}
                    {feedbackStats.commentRate < 30 && (
                      <p className="text-blue-600">💬 Low comment rate. Consider encouraging more detailed feedback from citizens.</p>
                    )}
                    {feedbackStats.averageRating >= 4 && feedbackStats.satisfactionRate >= 80 && (
                      <p className="text-green-600">✅ Excellent performance! Continue maintaining high service standards.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Feedback;
