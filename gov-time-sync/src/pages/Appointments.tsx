import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient, Appointment } from "@/lib/api";
import { AuthenticatedNavigation } from "@/components/AuthenticatedNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, User, FileText, MessageSquare, Edit3, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

const Appointments = () => {
  const { logout } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [commentText, setCommentText] = useState("");
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [editingComment, setEditingComment] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getAuthorityAppointments();
      setAppointments(data);
    } catch (error) {
      toast.error("Failed to fetch appointments");
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

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
      fetchAppointments(); // Refresh the list
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
      fetchAppointments(); // Refresh the list
    } catch (error) {
      toast.error("Failed to update comment");
      console.error("Error updating comment:", error);
    }
  };

  const handleDeleteComment = async (appointmentId: number) => {
    try {
      await apiClient.deleteAppointmentComment(appointmentId);
      toast.success("Comment deleted successfully");
      fetchAppointments(); // Refresh the list
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Appointments Management</h1>
          <p className="text-muted-foreground">
            Manage and comment on appointments for your authority
          </p>
        </div>

        {appointments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No appointments found</h3>
              <p className="text-muted-foreground text-center">
                There are currently no appointments scheduled for your authority.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {appointments.map((appointment) => (
              <Card key={appointment.appointment_id} className="shadow-lg">
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
                    <Badge variant="outline">
                      ID: {appointment.appointment_id}
                    </Badge>
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
                      <div className="pl-6">
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
