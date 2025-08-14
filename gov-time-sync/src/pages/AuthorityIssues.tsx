import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RefreshCw, Search, FileText, Calendar, User, MapPin, Tag } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { apiClient, type Issue, type AuthorityIssuesResponse } from "@/lib/api";

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
  const { toast } = useToast();

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

  useEffect(() => {
    fetchAuthorityIssues();
  }, []);

  useEffect(() => {
    let filtered = issues;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (issue) =>
          issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.User.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (issue) => issue.Issue_Status.status_id.toString() === statusFilter
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
                <h1 className="text-lg sm:text-2xl font-bold text-primary-foreground">Authority Issues</h1>
                <p className="text-sm sm:text-base text-primary-foreground/80">
                  Manage and track issues assigned to your authority
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
        {/* Statistics */}
        {authorityInfo && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{authorityInfo.total_issues}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Critical Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">
                  {issues.filter(issue => issue.urgency_score >= 8).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Authority ID</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{authorityInfo.authority_id}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6">
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
                  <SelectItem value="1">Pending Review</SelectItem>
                  <SelectItem value="2">Assigned to Team</SelectItem>
                  <SelectItem value="3">Completed</SelectItem>
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

        {/* Issues List */}
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
              <Card key={issue.issue_id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{issue.title}</CardTitle>
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
                        {issue.Issue_Status.status_name}
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
                          {issue.User.first_name && issue.User.last_name 
                            ? `${issue.User.first_name} ${issue.User.last_name}` 
                            : issue.User.email
                          }
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Tag className="h-4 w-4 mr-2" />
                        <span>{issue.Category.category_name}</span>
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
                  
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      {issue.image_urls && (
                        <Badge variant="secondary">Has Images</Badge>
                      )}
                    </div>
                    <Button
                      onClick={() => {
                        setSelectedIssue(issue);
                        setNewStatus(issue.Issue_Status.status_id.toString());
                      }}
                      size="sm"
                    >
                      Update Status
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

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
                      {selectedIssue.Issue_Status.status_name}
                    </p>
                  </div>
                  <div>
                    <label htmlFor="new-status" className="text-sm font-medium">New Status</label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger id="new-status">
                        <SelectValue placeholder="Select new status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Pending Review</SelectItem>
                        <SelectItem value="2">Assigned to Team</SelectItem>
                        <SelectItem value="3">Completed</SelectItem>
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
                  disabled={!newStatus || newStatus === selectedIssue.Issue_Status.status_id.toString()}
                >
                  Update Status
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
