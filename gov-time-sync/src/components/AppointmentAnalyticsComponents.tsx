import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  UserX, 
  Timer,
  BarChart3,
  Building2
} from "lucide-react";
import { AppointmentMetrics, DepartmentMetrics } from "@/hooks/useAppointmentAnalytics";

interface AppointmentStatsProps {
  metrics: AppointmentMetrics;
  departmentMetrics: DepartmentMetrics | null;
  isLoading: boolean;
}

export const AppointmentStats = ({ metrics, departmentMetrics, isLoading }: AppointmentStatsProps) => {
  const stats = [
    {
      title: "Total Appointments",
      value: metrics.totalAppointments,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: `+${metrics.weekAppointments} this week`,
    },
    {
      title: "Today's Appointments",
      value: metrics.todayAppointments,
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-50",
      trend: `${metrics.pendingAppointments} pending`,
    },
    {
      title: "Completion Rate",
      value: `${((metrics.completedAppointments / (metrics.totalAppointments || 1)) * 100).toFixed(1)}%`,
      icon: CheckCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      trend: `${metrics.completedAppointments}/${metrics.totalAppointments}`,
    },
    {
      title: "No-Show Rate",
      value: `${metrics.noShowRate}%`,
      icon: UserX,
      color: "text-red-600",
      bgColor: "bg-red-50",
      trend: "Quality metric",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4 sm:p-6">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="transition-all duration-200 hover:shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 sm:p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 sm:h-6 sm:w-6 ${stat.color}`} />
                </div>
                <Badge variant="secondary" className="text-xs">
                  {stat.trend}
                </Badge>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-xl sm:text-2xl font-bold mt-1">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

interface ProcessingMetricsProps {
  metrics: AppointmentMetrics;
  departmentMetrics: DepartmentMetrics | null;
}

export const ProcessingMetrics = ({ metrics, departmentMetrics }: ProcessingMetricsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Processing Performance */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg flex items-center">
            <Timer className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
            Processing Performance
          </CardTitle>
          <CardDescription className="text-sm">
            Key performance indicators for appointment processing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Average Processing Time</span>
              <Badge variant="outline">{metrics.avgProcessingTime.toFixed(1)} days</Badge>
            </div>
            <Progress 
              value={Math.min((7 - metrics.avgProcessingTime) / 7 * 100, 100)} 
              className="h-2" 
            />
            <p className="text-xs text-muted-foreground">
              Target: ≤ 3 days • Current: {
                metrics.avgProcessingTime <= 3 ? '✓ On target' : '⚠ Needs improvement'
              }
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Response Rate</span>
              <Badge variant={
                (metrics.completedAppointments / (metrics.totalAppointments || 1)) * 100 >= 85 
                  ? "default" : "secondary"
              }>
                {((metrics.completedAppointments / (metrics.totalAppointments || 1)) * 100).toFixed(1)}%
              </Badge>
            </div>
            <Progress 
              value={(metrics.completedAppointments / (metrics.totalAppointments || 1)) * 100} 
              className="h-2" 
            />
            <p className="text-xs text-muted-foreground">
              {metrics.completedAppointments} of {metrics.totalAppointments} appointments processed
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Attendance Rate</span>
              <Badge variant={
                (100 - metrics.noShowRate) >= 80 ? "default" : "destructive"
              }>
                {(100 - metrics.noShowRate).toFixed(1)}%
              </Badge>
            </div>
            <Progress 
              value={100 - metrics.noShowRate} 
              className="h-2" 
            />
            <p className="text-xs text-muted-foreground">
              No-show rate: {metrics.noShowRate}% • Target: ≤ 20%
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Department Load */}
      {departmentMetrics && (
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg flex items-center">
              <Building2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-600" />
              Department Overview
            </CardTitle>
            <CardDescription className="text-sm">
              {departmentMetrics.departmentName} performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-lg sm:text-xl font-bold text-blue-600">
                  {departmentMetrics.appointmentLoad}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">Appointments</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-lg sm:text-xl font-bold text-green-600">
                  {departmentMetrics.issuesHandled}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">Issues Handled</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Completion Rate</span>
                <Badge variant="default">
                  {departmentMetrics.completionRate.toFixed(1)}%
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Avg Response Time</span>
                <Badge variant="outline">
                  {departmentMetrics.avgResponseTime.toFixed(1)} days
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Department Load</span>
                <Badge variant={(() => {
                  if (departmentMetrics.appointmentLoad > 50) return "destructive";
                  if (departmentMetrics.appointmentLoad > 25) return "secondary";
                  return "default";
                })()}>
                  {(() => {
                    if (departmentMetrics.appointmentLoad > 50) return 'High';
                    if (departmentMetrics.appointmentLoad > 25) return 'Medium';
                    return 'Light';
                  })()}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

interface IssueInsightsProps {
  metrics: AppointmentMetrics;
}

export const IssueInsights = ({ metrics }: IssueInsightsProps) => {
  const topIssueTypes = metrics.issueTypeDistribution.slice(0, 5);

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg flex items-center">
          <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-purple-600" />
          Issue Type Distribution
        </CardTitle>
        <CardDescription className="text-sm">
          Most common issue categories being handled
        </CardDescription>
      </CardHeader>
      <CardContent>
        {topIssueTypes.length > 0 ? (
          <div className="space-y-4">
            {topIssueTypes.map((issue, index) => (
              <div key={issue.type} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <span className="text-sm font-medium">{issue.type}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {issue.count} cases
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {issue.percentage}%
                    </Badge>
                  </div>
                </div>
                <Progress value={issue.percentage} className="h-2" />
              </div>
            ))}
            
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Insight:</strong> {
                  topIssueTypes[0] ? 
                    `${topIssueTypes[0].type} issues make up ${topIssueTypes[0].percentage}% of your workload. Consider allocating more resources to this area.` :
                    'No issue data available for analysis.'
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No issue type data available. Issues will appear here as appointments are processed.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
