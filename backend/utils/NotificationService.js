const cron = require("node-cron");
const { PrismaClient } = require("../generated/prisma");
const {
  sendAppointmentConfirmationEmail,
  sendAppointmentReminderEmail,
  sendStatusUpdateEmail,
} = require("./EmailFunctions");

const prisma = new PrismaClient();

class NotificationService {
  constructor() {
    this.reminderJob = null;
    this.init();
  }

  // Initialize the notification service
  init() {
    console.log("🔔 Notification Service initialized");
    this.startReminderScheduler();
  }

  // Start the cron job for 24-hour reminders
  startReminderScheduler() {
    // Run every hour to check for appointments that need reminders
    this.reminderJob = cron.schedule(
      "0 * * * *",
      async () => {
        await this.checkAndSendReminders();
      },
      {
        scheduled: true,
        timezone: "Asia/Colombo", // Set to Sri Lankan timezone
      }
    );

    console.log(
      "📅 Reminder scheduler started - checking hourly for appointments needing reminders"
    );
  }

  // Check for appointments that need 24-hour reminders
  async checkAndSendReminders() {
    try {
      console.log("🔍 Checking for appointments needing reminders...");

      // Calculate the date range for appointments happening in 24 hours
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const dayAfterTomorrow = new Date(tomorrow);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

      // Find appointments scheduled for tomorrow
      const appointmentsToRemind = await prisma.Appointment.findMany({
        where: {
          date: {
            gte: tomorrow,
            lt: dayAfterTomorrow,
          },
        },
        include: {
          User: true,
          Authority: {
            include: {
              Category: true,
            },
          },
          Issue: true,
        },
      });

      console.log(
        `📧 Found ${appointmentsToRemind.length} appointments needing reminders`
      );

      // Send reminder emails
      for (const appointment of appointmentsToRemind) {
        await this.sendReminderEmail(appointment);
      }
    } catch (error) {
      console.error("❌ Error checking for appointment reminders:", error);
    }
  }

  // Send confirmation email immediately after appointment booking
  async sendConfirmationEmail(appointmentData) {
    try {
      const appointment = await prisma.Appointment.findUnique({
        where: { appointment_id: appointmentData.appointment_id },
        include: {
          User: true,
          Authority: true,
          Issue: true,
        },
      });

      if (!appointment) {
        console.error("❌ Appointment not found for confirmation email");
        return false;
      }

      const emailData = {
        userEmail: appointment.User.email,
        userName:
          appointment.User.name ||
          `${appointment.User.first_name} ${appointment.User.last_name}`.trim(),
        authorityName: appointment.Authority.name,
        date: appointment.date,
        timeSlot: appointment.time_slot,
        issueTitle: appointment.Issue?.title || null,
        appointmentId: appointment.appointment_id,
      };

      const success = await sendAppointmentConfirmationEmail(emailData);

      if (success) {
        console.log(
          `✅ Confirmation email sent for appointment ${appointment.appointment_id}`
        );
      }

      return success;
    } catch (error) {
      console.error("❌ Error sending confirmation email:", error);
      return false;
    }
  }

  // Send reminder email for appointment
  async sendReminderEmail(appointment) {
    try {
      const emailData = {
        userEmail: appointment.User.email,
        userName:
          appointment.User.name ||
          `${appointment.User.first_name} ${appointment.User.last_name}`.trim(),
        authorityName: appointment.Authority.name,
        date: appointment.date,
        timeSlot: appointment.time_slot,
        issueTitle: appointment.Issue?.title || null,
        appointmentId: appointment.appointment_id,
        authorityCategory:
          appointment.Authority.Category?.category_name || "General",
      };

      const success = await sendAppointmentReminderEmail(emailData);

      if (success) {
        console.log(
          `✅ Reminder email sent for appointment ${appointment.appointment_id}`
        );
      }

      return success;
    } catch (error) {
      console.error(
        `❌ Error sending reminder email for appointment ${appointment.appointment_id}:`,
        error
      );
      return false;
    }
  }

  // Send status update email from officials
  async sendStatusUpdate(appointmentId, updateData) {
    try {
      const appointment = await prisma.Appointment.findUnique({
        where: { appointment_id: appointmentId },
        include: {
          User: true,
          Authority: true,
          Issue: true,
        },
      });

      if (!appointment) {
        console.error("❌ Appointment not found for status update email");
        return false;
      }

      const emailData = {
        userEmail: appointment.User.email,
        userName:
          appointment.User.name ||
          `${appointment.User.first_name} ${appointment.User.last_name}`.trim(),
        authorityName: appointment.Authority.name,
        appointmentId: appointment.appointment_id,
        date: appointment.date,
        timeSlot: appointment.time_slot,
        ...updateData,
      };

      const success = await sendStatusUpdateEmail(emailData);

      if (success) {
        console.log(
          `✅ Status update email sent for appointment ${appointment.appointment_id}`
        );
      }

      return success;
    } catch (error) {
      console.error(
        `❌ Error sending status update email for appointment ${appointmentId}:`,
        error
      );
      return false;
    }
  }

  // Send cancellation notification
  async sendCancellationEmail(appointmentId, reason, cancelledBy = "system") {
    return await this.sendStatusUpdate(appointmentId, {
      updateType: "cancel",
      message: reason,
      officialName:
        cancelledBy === "official" ? "Government Official" : "System",
    });
  }

  // Send reschedule notification
  async sendRescheduleEmail(
    appointmentId,
    newDate,
    newTimeSlot,
    reason,
    officialName
  ) {
    return await this.sendStatusUpdate(appointmentId, {
      updateType: "reschedule",
      message: reason,
      officialName: officialName,
      newDate: newDate,
      newTimeSlot: newTimeSlot,
    });
  }

  // Send official comment notification
  async sendCommentEmail(appointmentId, comment, officialName) {
    return await this.sendStatusUpdate(appointmentId, {
      updateType: "comment",
      message: comment,
      officialName: officialName,
    });
  }

  // Send document request notification
  async sendDocumentRequestEmail(appointmentId, documentRequest, officialName) {
    return await this.sendStatusUpdate(appointmentId, {
      updateType: "request",
      message: documentRequest,
      officialName: officialName,
    });
  }

  // Send appointment completion notification
  async sendCompletionEmail(appointmentId, completionNote, officialName) {
    return await this.sendStatusUpdate(appointmentId, {
      updateType: "completion",
      message: completionNote,
      officialName: officialName,
    });
  }

  // Stop the notification service
  stop() {
    if (this.reminderJob) {
      this.reminderJob.stop();
      console.log("🛑 Notification Service stopped");
    }
  }
}

// Create a singleton instance
const notificationService = new NotificationService();

module.exports = notificationService;
