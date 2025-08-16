import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { RefreshCw, Search, FileText, Calendar, User, MapPin, Tag, BarChart3, TrendingUp, AlertTriangle, CheckCircle, Clock, Eye } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { apiClient, type Issue, type AuthorityIssuesResponse, type IssueStatus } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from "recharts";

const getUrgencyColor = (urgency: number): "default" | "destructive" | "secondary" | "outline" => {
  if (urgency >= 8) return "destructive";
  if (urgency >= 6) return "secondary"; // Changed from "warning" to "secondary"
  if (urgency >= 4) return "secondary";
  return "outline";
};

const getUrgencyLabel = (urgency: number) => {
  if (urgency >= 8) return "Critical";
  if (urgency >= 6) return "High";
  if (urgency >= 4) return "Medium";
  return "Low";
};

const getStatusLabel = (statusId: number, availableStatuses: IssueStatus[]) => {
  const status = availableStatuses.find(s => s.status_id === statusId);
  return status ? status.status_name : "Unknown";
};

const AuthorityIssues = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authorityInfo, setAuthorityInfo] = useState<{ authority_id: number; total_issues: number } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [availableStatuses, setAvailableStatuses] = useState<IssueStatus[]>([]);
  const [showApprovalDialog, setShowApprovalDialog] = useState<boolean>(false);
  const [issueToApprove, setIssueToApprove] = useState<Issue | null>(null);
  const { toast } = useToast();

  // Data processing functions for charts
  const getUrgencyDistribution = () => {
    const critical = issues.filter(issue => issue.urgency_score >= 8).length;
    const high = issues.filter(issue => issue.urgency_score >= 6 && issue.urgency_score < 8).length;
    const medium = issues.filter(issue => issue.urgency_score >= 4 && issue.urgency_score < 6).length;
    const low = issues.filter(issue => issue.urgency_score < 4).length;

    return [
      { name: 'Critical', value: critical, color: '#dc2626' },
      { name: 'High', value: high, color: '#ea580c' },
      { name: 'Medium', value: medium, color: '#ca8a04' },
      { name: 'Low', value: low, color: '#65a30d' }
    ];
  };

  const getStatusDistribution = () => {
    const statusCounts = issues.reduce((acc, issue) => {
      const statusId = issue.Issue_Status?.status_id;
      const statusName = statusId ? getStatusLabel(statusId, availableStatuses) : "Unknown Status";
      acc[statusName] = (acc[statusName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([name, value]) => {
      let color = '#10b981'; // default green
      if (name.toLowerCase().includes('pending')) color = '#f59e0b';
      else if (name.toLowerCase().includes('assigned') || name.toLowerCase().includes('progress')) color = '#3b82f6';
      
      return { name, value, color };
    });
  };

  const getCategoryDistribution = () => {
    const categoryCounts = issues.reduce((acc, issue) => {
      // Check if Category exists and has category_name
      const categoryName = issue.Category?.category_name || "Uncategorized";
      acc[categoryName] = (acc[categoryName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));
  };

  const getIssuesTrend = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const count = issues.filter(issue => 
        new Date(issue.created_at).toISOString().split('T')[0] === date
      ).length;
      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        issues: count
      };
    });
  };

  const getPerformanceMetrics = () => {
    const total = issues.length;
    const completedStatuses = availableStatuses.filter(s => 
      s.status_name.toLowerCase().includes('completed') || 
      s.status_name.toLowerCase().includes('resolved') ||
      s.status_name.toLowerCase().includes('closed')
    );
    const assignedStatuses = availableStatuses.filter(s => 
      s.status_name.toLowerCase().includes('assigned') || 
      s.status_name.toLowerCase().includes('progress') ||
      s.status_name.toLowerCase().includes('working')
    );
    
    const completed = issues.filter(issue => 
      issue.Issue_Status && completedStatuses.some(s => s.status_id === issue.Issue_Status.status_id)
    ).length;
    const assigned = issues.filter(issue => 
      issue.Issue_Status && assignedStatuses.some(s => s.status_id === issue.Issue_Status.status_id)
    ).length;
    const critical = issues.filter(issue => issue.urgency_score >= 8).length;
    
    return {
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      responseRate: total > 0 ? Math.round(((assigned + completed) / total) * 100) : 0,
      criticalIssues: critical,
      avgResponseTime: '2.3 days' // This would typically come from backend calculation
    };
  };

  const fetchAvailableStatuses = async () => {
    try {
      const statuses = await apiClient.getAvailableIssueStatuses();
      setAvailableStatuses(statuses);
    } catch (error) {
      console.error("Failed to fetch available statuses:", error);
      toast({
        title: "Warning",
        description: "Failed to load available statuses. Using default statuses.",
        variant: "destructive",
      });
      // Fallback to default statuses if API fails
      setAvailableStatuses([
        { status_id: 1, status_name: "Pending Review" },
        { status_id: 2, status_name: "Assigned to Team" },
        { status_id: 3, status_name: "Completed" }
      ]);
    }
  };

  const fetchAuthorityIssues = async () => {
    try {
      setIsLoading(true);
      const response: AuthorityIssuesResponse = await apiClient.getAuthorityIssues();
      setIssues(response.issues);
      setFilteredIssues(response.issues);
      setAuthorityInfo({
        authority_id: response.authority_id,
        total_issues: response.total_issues,
      });
      toast({
        title: "Success",
        description: `Loaded ${response.total_issues} issues for your authority`,
      });
    } catch (error) {
      console.error("Failed to fetch authority issues:", error);
      toast({
        title: "Error",
        description: "Failed to load issues. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateIssueStatus = async (issueId: number, statusId: string) => {
    try {
      await apiClient.updateIssueStatus(issueId, parseInt(statusId));
      toast({
        title: "Success",
        description: "Issue status updated successfully",
      });
      fetchAuthorityIssues(); // Refresh the list
      setSelectedIssue(null);
      setNewStatus("");
    } catch (error) {
      console.error("Failed to update issue status:", error);
      toast({
        title: "Error",
        description: "Failed to update issue status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleApproveForAppointment = (issue: Issue) => {
    setIssueToApprove(issue);
    setShowApprovalDialog(true);
  };

  const confirmApproveForAppointment = async () => {
    if (!issueToApprove) return;

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
      
      const notificationData = {
        user_id: issueToApprove.User?.user_id,
        notification_type: "approved_for_appointment_scheduling",
        notification_content: `Your issue with the title "${issueToApprove.title}" has been approved for the placing of an appointment. If you would like to book an appointment press the book now button.`,
        issue_id: issueToApprove.issue_id,
        authority_id: issueToApprove.authority_id,
        appointment_id: null
      };

      const response = await fetch(`${backendUrl}/api/v2/live-notifications/submit-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Appointment approval notification sent successfully",
        });
      } else {
        throw new Error('Failed to send notification');
      }
    } catch (error) {
      console.error("Failed to send approval notification:", error);
      toast({
        title: "Error",
        description: "Failed to send approval notification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setShowApprovalDialog(false);
      setIssueToApprove(null);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await fetchAvailableStatuses();
      await fetchAuthorityIssues();
    };
    initializeData();
  }, []);

  useEffect(() => {
    let filtered = issues;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (issue) =>
          issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (issue.User?.email && issue.User.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (issue) => issue.Issue_Status?.status_id.toString() === statusFilter
      );
    }

    // Urgency filter
    if (urgencyFilter !== "all") {
      if (urgencyFilter === "critical") {
        filtered = filtered.filter((issue) => issue.urgency_score >= 8);
      } else if (urgencyFilter === "high") {
        filtered = filtered.filter((issue) => issue.urgency_score >= 6 && issue.urgency_score < 8);
      } else if (urgencyFilter === "medium") {
        filtered = filtered.filter((issue) => issue.urgency_score >= 4 && issue.urgency_score < 6);
      } else if (urgencyFilter === "low") {
        filtered = filtered.filter((issue) => issue.urgency_score < 4);
      }
    }

    setFilteredIssues(filtered);
  }, [issues, searchTerm, statusFilter, urgencyFilter]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading authority issues...</p>
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
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-primary-foreground mr-2 sm:mr-3" />
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-primary-foreground">Authority Dashboard</h1>
                <p className="text-sm sm:text-base text-primary-foreground/80">
                  Comprehensive overview and management of authority issues
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={fetchAuthorityIssues}
                size="sm"
                disabled={isLoading}
                className="text-xs sm:text-sm"
              >
                <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="management">Issue Management</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Enhanced Statistics Cards */}
            {authorityInfo && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Total Issues
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{authorityInfo.total_issues}</div>
                    <p className="text-xs text-muted-foreground mt-1">All time</p>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-red-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Critical Issues
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-destructive">
                      {issues.filter(issue => issue.urgency_score >= 8).length}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Urgency ≥ 8.0</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Completion Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {getPerformanceMetrics().completionRate}%
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Issues resolved</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-yellow-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Avg Response Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">
                      {getPerformanceMetrics().avgResponseTime}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Average response</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Quick Insights Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Issues Trend Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Issues Trend (Last 7 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      issues: {
                        label: "Issues",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[200px]"
                  >
                    <BarChart data={getIssuesTrend()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="issues" fill="var(--color-issues)" radius={4} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Urgency Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Urgency Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      critical: { label: "Critical", color: "#dc2626" },
                      high: { label: "High", color: "#ea580c" },
                      medium: { label: "Medium", color: "#ca8a04" },
                      low: { label: "Low", color: "#65a30d" },
                    }}
                    className="h-[200px]"
                  >
                    <PieChart>
                      <Pie
                        data={getUrgencyDistribution()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getUrgencyDistribution().map((entry) => (
                          <Cell key={`cell-${entry.name}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Status Distribution</CardTitle>
                  <CardDescription>Current status of all issues</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      pending: { label: "Pending Review", color: "#f59e0b" },
                      assigned: { label: "Assigned to Team", color: "#3b82f6" },
                      completed: { label: "Completed", color: "#10b981" },
                    }}
                    className="h-[250px]"
                  >
                    <BarChart data={getStatusDistribution()} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" fill="var(--color-pending)" radius={4} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Issues by Category</CardTitle>
                  <CardDescription>Distribution across different categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      value: { label: "Issues", color: "hsl(var(--chart-2))" },
                    }}
                    className="h-[250px]"
                  >
                    <BarChart data={getCategoryDistribution()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" fill="var(--color-value)" radius={4} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators for your authority</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg border">
                    <div className="text-2xl font-bold text-green-600">
                      {getPerformanceMetrics().completionRate}%
                    </div>
                    <div className="text-sm text-muted-foreground">Completion Rate</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg border">
                    <div className="text-2xl font-bold text-blue-600">
                      {getPerformanceMetrics().responseRate}%
                    </div>
                    <div className="text-sm text-muted-foreground">Response Rate</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg border">
                    <div className="text-2xl font-bold text-red-600">
                      {getPerformanceMetrics().criticalIssues}
                    </div>
                    <div className="text-sm text-muted-foreground">Critical Issues</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="management" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filter Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search issues..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {availableStatuses.map((status) => (
                        <SelectItem key={status.status_id} value={status.status_id.toString()}>
                          {status.status_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Urgency Levels</SelectItem>
                      <SelectItem value="critical">Critical (8+)</SelectItem>
                      <SelectItem value="high">High (6-7.9)</SelectItem>
                      <SelectItem value="medium">Medium (4-5.9)</SelectItem>
                      <SelectItem value="low">Low (0-3.9)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                      setUrgencyFilter("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Issues List with Enhanced Cards */}
            <div className="grid grid-cols-1 gap-4">
              {filteredIssues.length === 0 ? (
                <Card>
                  <CardContent className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-semibold mb-2">No issues found</p>
                      <p className="text-muted-foreground">
                        {issues.length === 0 
                          ? "No issues are currently assigned to your authority."
                          : "Try adjusting your filters to see more results."
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                filteredIssues.map((issue) => (
                  <Card key={issue.issue_id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2 flex items-center">
                            {issue.title}
                            {(() => {
                              // Check if there are any images to show the eye icon
                              if (issue.image_urls) {
                                if (Array.isArray(issue.image_urls) && issue.image_urls.length > 0) {
                                  return <Eye className="h-4 w-4 ml-2 text-muted-foreground" />;
                                } else if (typeof issue.image_urls === 'string' && issue.image_urls.trim()) {
                                  return <Eye className="h-4 w-4 ml-2 text-muted-foreground" />;
                                }
                              }
                              return null;
                            })()}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {issue.description.length > 150 
                              ? `${issue.description.substring(0, 150)}...` 
                              : issue.description
                            }
                          </CardDescription>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          <Badge variant={getUrgencyColor(issue.urgency_score)}>
                            {getUrgencyLabel(issue.urgency_score)} ({issue.urgency_score.toFixed(1)})
                          </Badge>
                          <Badge variant="outline">
                            {issue.Issue_Status ? getStatusLabel(issue.Issue_Status.status_id, availableStatuses) : "Unknown Status"}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <User className="h-4 w-4 mr-2" />
                            <span>
                              {issue.User?.first_name && issue.User?.last_name 
                                ? `${issue.User.first_name} ${issue.User.last_name}` 
                                : issue.User?.email || "Unknown User"
                              }
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Tag className="h-4 w-4 mr-2" />
                            <span>{issue.Category?.category_name || "Uncategorized"}</span>
                          </div>
                          {(issue.gs_division || issue.ds_division) && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span>
                                {issue.gs_division && `GS: ${issue.gs_division}`}
                                {issue.gs_division && issue.ds_division && " | "}
                                {issue.ds_division && `DS: ${issue.ds_division}`}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>Created: {new Date(issue.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>Updated: {new Date(issue.updated_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Display Images */}
                      {(() => {
                        // Safely handle image_urls - it might be null, undefined, string, or array
                        let imageUrls: string[] = [];
                        
                        if (issue.image_urls) {
                          if (Array.isArray(issue.image_urls)) {
                            imageUrls = issue.image_urls;
                          } else if (typeof issue.image_urls === 'string') {
                            try {
                              // Try to parse as JSON if it's a string
                              const parsed = JSON.parse(issue.image_urls);
                              imageUrls = Array.isArray(parsed) ? parsed : [issue.image_urls];
                            } catch {
                              // If parsing fails, treat as single URL
                              imageUrls = [issue.image_urls];
                            }
                          }
                        }
                        
                        return imageUrls.length > 0 ? (
                          <div className="mt-4">
                            <div className="text-sm font-medium mb-2 flex items-center">
                              <Eye className="h-4 w-4 mr-2" />
                              Attached Images ({imageUrls.length})
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                              {imageUrls.map((imageUrl, index) => (
                                <div key={index} className="relative group">
                                  <img
                                    src={imageUrl}
                                    alt={`Issue attachment ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => window.open(imageUrl, '_blank')}
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = '/placeholder.svg';
                                      target.alt = 'Failed to load image';
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all duration-200 flex items-center justify-center">
                                    <Eye className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null;
                      })()}
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex gap-2">
                          {(() => {
                            // Safely calculate image count for badge
                            let imageCount = 0;
                            
                            if (issue.image_urls) {
                              if (Array.isArray(issue.image_urls)) {
                                imageCount = issue.image_urls.length;
                              } else if (typeof issue.image_urls === 'string') {
                                try {
                                  const parsed = JSON.parse(issue.image_urls);
                                  imageCount = Array.isArray(parsed) ? parsed.length : 1;
                                } catch {
                                  imageCount = 1;
                                }
                              }
                            }
                            
                            return imageCount > 0 ? (
                              <Badge variant="secondary">{imageCount} Image{imageCount > 1 ? 's' : ''}</Badge>
                            ) : null;
                          })()}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              setSelectedIssue(issue);
                              setNewStatus(issue.Issue_Status?.status_id.toString() || "");
                            }}
                            size="sm"
                            variant="outline"
                            className="hover:bg-primary/90"
                          >
                            Update Status
                          </Button>
                          <Button
                            onClick={() => handleApproveForAppointment(issue)}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Approve for Appointment
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Update Status Modal */}
        {selectedIssue && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Update Issue Status</CardTitle>
                <CardDescription>
                  Update the status for: {selectedIssue.title}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium">Current Status</div>
                    <p className="text-sm text-muted-foreground">
                      {selectedIssue.Issue_Status ? getStatusLabel(selectedIssue.Issue_Status.status_id, availableStatuses) : "Unknown Status"}
                    </p>
                  </div>
                  <div>
                    <label htmlFor="new-status" className="text-sm font-medium">New Status</label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger id="new-status">
                        <SelectValue placeholder="Select new status" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableStatuses.map((status) => (
                          <SelectItem key={status.status_id} value={status.status_id.toString()}>
                            {status.status_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <div className="flex justify-end gap-2 p-6 pt-0">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedIssue(null);
                    setNewStatus("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => updateIssueStatus(selectedIssue.issue_id, newStatus)}
                  disabled={!newStatus || newStatus === selectedIssue.Issue_Status?.status_id.toString()}
                >
                  Update Status
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Approve for Appointment Confirmation Dialog */}
        {showApprovalDialog && issueToApprove && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Approve for Appointment</CardTitle>
                <CardDescription>
                  {issueToApprove.title}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Continuing this action will allow the issue submitter to book an appointment with your government authority. 
                    They will receive a notification with instructions to book their appointment.
                  </p>
                  <div className="p-3 bg-blue-50 rounded-lg border">
                    <p className="text-sm">
                      <strong>Issue:</strong> {issueToApprove.title}
                    </p>
                    <p className="text-sm mt-1">
                      <strong>Submitted by:</strong> {issueToApprove.User?.first_name && issueToApprove.User?.last_name 
                        ? `${issueToApprove.User.first_name} ${issueToApprove.User.last_name}` 
                        : issueToApprove.User?.email || "Unknown User"}
                    </p>
                  </div>
                </div>
              </CardContent>
              <div className="flex justify-end gap-2 p-6 pt-0">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowApprovalDialog(false);
                    setIssueToApprove(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmApproveForAppointment}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Confirm Approval
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AuthorityIssues;
