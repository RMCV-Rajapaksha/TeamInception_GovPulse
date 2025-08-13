import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, TrendingUp, Users } from "lucide-react";

interface QuickStatsProps {
  totalSlots: number;
  totalHours: number;
  avgSlotsPerDay: number;
  busiestDay: string;
  isLoading: boolean;
}

export const QuickStats = ({ 
  totalSlots, 
  totalHours, 
  avgSlotsPerDay, 
  busiestDay, 
  isLoading 
}: QuickStatsProps) => {
  const stats = [
    {
      title: "Total Time Slots",
      value: totalSlots,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Hours",
      value: `${totalHours}h`,
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Daily Average",
      value: avgSlotsPerDay.toFixed(1),
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Busiest Day",
      value: busiestDay || "N/A",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="transition-all duration-200 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

interface TimeSlotInsightsProps {
  timeSlotData: any[];
  hourlyDistribution: any[];
  totalHours: number;
  totalSlots: number;
}

export const TimeSlotInsights = ({ 
  timeSlotData, 
  hourlyDistribution, 
  totalHours, 
  totalSlots 
}: TimeSlotInsightsProps) => {
  // Calculate insights
  const morningSlots = timeSlotData.reduce((sum, day) => sum + day.morningSlots, 0);
  const afternoonSlots = timeSlotData.reduce((sum, day) => sum + day.afternoonSlots, 0);
  const eveningSlots = timeSlotData.reduce((sum, day) => sum + day.eveningSlots, 0);

  const morningPercentage = totalSlots > 0 ? (morningSlots / totalSlots) * 100 : 0;
  const afternoonPercentage = totalSlots > 0 ? (afternoonSlots / totalSlots) * 100 : 0;
  const eveningPercentage = totalSlots > 0 ? (eveningSlots / totalSlots) * 100 : 0;

  const avgHoursPerSlot = totalSlots > 0 ? totalHours / totalSlots : 0;

  const mostPopularHour = hourlyDistribution.length > 0 
    ? hourlyDistribution.reduce((prev, current) => (prev.count > current.count) ? prev : current)
    : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Time Distribution Analysis</CardTitle>
          <CardDescription>
            How your time slots are distributed throughout the day
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Morning (6AM - 12PM)</span>
                <span className="font-medium">{morningSlots} slots ({morningPercentage.toFixed(1)}%)</span>
              </div>
              <Progress value={morningPercentage} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Afternoon (12PM - 5PM)</span>
                <span className="font-medium">{afternoonSlots} slots ({afternoonPercentage.toFixed(1)}%)</span>
              </div>
              <Progress value={afternoonPercentage} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Evening (5PM - 12AM)</span>
                <span className="font-medium">{eveningSlots} slots ({eveningPercentage.toFixed(1)}%)</span>
              </div>
              <Progress value={eveningPercentage} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Average hours per slot</span>
                <Badge variant="secondary">{avgHoursPerSlot.toFixed(1)}h</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Most popular time</span>
                <Badge variant="outline">
                  {mostPopularHour ? mostPopularHour.hour : 'N/A'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Preferred period</span>
                <Badge variant="default">
                  {(() => {
                    if (morningSlots >= afternoonSlots && morningSlots >= eveningSlots) return 'Morning';
                    if (afternoonSlots >= eveningSlots) return 'Afternoon';
                    return 'Evening';
                  })()}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total availability</span>
                <Badge variant="secondary">{totalHours}h total</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Slot efficiency</span>
                <Badge variant={avgHoursPerSlot > 1.5 ? "default" : "secondary"}>
                  {avgHoursPerSlot > 1.5 ? 'High' : 'Standard'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Activity level</span>
                <Badge variant={(() => {
                  if (totalSlots > 20) return "default";
                  if (totalSlots > 10) return "secondary";
                  return "outline";
                })()}>
                  {(() => {
                    if (totalSlots > 20) return 'Very Active';
                    if (totalSlots > 10) return 'Active';
                    return 'Light';
                  })()}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
