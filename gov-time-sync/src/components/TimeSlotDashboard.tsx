import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { apiClient, FreeTimeSlot } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Plus, Trash2, Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface TimeSlotDashboardProps {
  userType: string;
}

export const TimeSlotDashboard = ({ userType }: TimeSlotDashboardProps) => {
  const [timeSlots, setTimeSlots] = useState<FreeTimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newSlot, setNewSlot] = useState({
    date: '',
    time_slots: [''],
    authority_id: 1
  });
  const { toast } = useToast();

  useEffect(() => {
    if (userType === 'official') {
      loadTimeSlots();
    }
  }, [userType]);

  const loadTimeSlots = async () => {
    setIsLoading(true);
    try {
      const slots = await apiClient.viewFreeTimeSlots();
      setTimeSlots(slots);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load time slots",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addTimeSlot = async () => {
    try {
      const filteredTimeSlots = newSlot.time_slots.filter(slot => slot.trim() !== '');
      
      if (filteredTimeSlots.length === 0) {
        toast({
          title: "Error",
          description: "Please add at least one time slot",
          variant: "destructive",
        });
        return;
      }

      await apiClient.addFreeTimeSlot({
        ...newSlot,
        time_slots: filteredTimeSlots,
        date: new Date(newSlot.date).toISOString()
      });
      
      toast({
        title: "Success",
        description: "Time slot added successfully",
      });
      
      setNewSlot({ date: '', time_slots: [''], authority_id: 1 });
      loadTimeSlots();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add time slot",
        variant: "destructive",
      });
    }
  };

  const addTimeSlotField = () => {
    setNewSlot({
      ...newSlot,
      time_slots: [...newSlot.time_slots, '']
    });
  };

  const updateTimeSlot = (index: number, value: string) => {
    const updated = [...newSlot.time_slots];
    updated[index] = value;
    setNewSlot({ ...newSlot, time_slots: updated });
  };

  const removeTimeSlotField = (index: number) => {
    if (newSlot.time_slots.length > 1) {
      const updated = newSlot.time_slots.filter((_, i) => i !== index);
      setNewSlot({ ...newSlot, time_slots: updated });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-card">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {userType === 'official' ? 'Time Slot Management' : 'Available Appointments'}
          </h1>
          <p className="text-muted-foreground">
            {userType === 'official' 
              ? 'Manage your available appointment time slots' 
              : 'View and book available government service appointments'
            }
          </p>
        </div>

        {userType === 'official' && (
          <Card className="mb-8 shadow-card-government">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Time Slot
              </CardTitle>
              <CardDescription>
                Create new available time slots for citizen appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newSlot.date}
                    onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label>Time Slots</Label>
                  {newSlot.time_slots.map((slot, index) => (
                    <div key={index} className="flex items-center gap-2 mt-2">
                      <Input
                        placeholder="e.g., 10:00 - 11:00"
                        value={slot}
                        onChange={(e) => updateTimeSlot(index, e.target.value)}
                        className="flex-1"
                      />
                      {newSlot.time_slots.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeTimeSlotField(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTimeSlotField}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Time Slot
                  </Button>
                </div>

                <div>
                  <Label htmlFor="authority_id">Authority ID</Label>
                  <Input
                    id="authority_id"
                    type="number"
                    value={newSlot.authority_id}
                    onChange={(e) => setNewSlot({ ...newSlot, authority_id: parseInt(e.target.value) })}
                  />
                </div>

                <Button onClick={addTimeSlot} className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Create Time Slot
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : timeSlots.length > 0 ? (
            timeSlots.map((slot, index) => (
              <Card key={index} className="shadow-card-government hover:shadow-government transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Calendar className="h-5 w-5" />
                    {new Date(slot.date).toLocaleDateString('en-GB')}
                  </CardTitle>
                  <CardDescription>
                    Authority ID: {slot.authority_id}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Available Times:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {slot.time_slots.map((time, timeIndex) => (
                        <Badge key={timeIndex} variant="secondary">
                          {time}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {userType === 'citizen' && (
                    <Button className="w-full mt-4" variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      Book Appointment
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  No time slots available
                </h3>
                <p className="text-sm text-muted-foreground text-center">
                  {userType === 'official' 
                    ? 'Create your first time slot to start accepting appointments'
                    : 'No appointments are currently available. Please check back later.'
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};