const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

const addCommentToAppointment = async (req, res) => {
  try {
    const { official } = req; // Extract official info from the request object
    if (!official) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Official access required" });
    }

    const { appointment_id, comment } = req.body;

    if (!appointment_id || !comment) {
      return res
        .status(400)
        .json({ error: "Appointment ID and comment are required" });
    }

    // Verify the appointment exists and belongs to the official's authority
    const appointment = await prisma.Appointment.findUnique({
      where: {
        appointment_id: parseInt(appointment_id),
      },
      include: {
        Authority: true,
      },
    });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Check if the official has permission to comment on this appointment
    if (appointment.authority_id !== official.authority_id) {
      return res.status(403).json({
        error:
          "Forbidden: You can only comment on appointments for your authority",
      });
    }

    // Update the appointment with the official comment
    const updatedAppointment = await prisma.Appointment.update({
      where: {
        appointment_id: parseInt(appointment_id),
      },
      data: {
        official_comment: comment,
      },
      include: {
        Authority: true,
        User: true,
        Issue: true,
      },
    });

    res.status(200).json({
      message: "Comment added to appointment successfully",
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error("Error adding comment to appointment:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAppointmentComment = async (req, res) => {
  try {
    const { appointment_id } = req.params;

    if (!appointment_id) {
      return res.status(400).json({ error: "Appointment ID is required" });
    }

    // Fetch the appointment with its comment
    const appointment = await prisma.Appointment.findUnique({
      where: {
        appointment_id: parseInt(appointment_id),
      },
      select: {
        appointment_id: true,
        official_comment: true,
        Authority: {
          select: {
            name: true,
            ministry: true,
          },
        },
      },
    });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.status(200).json({
      appointment_id: appointment.appointment_id,
      official_comment: appointment.official_comment,
      authority: appointment.Authority,
    });
  } catch (error) {
    console.error("Error fetching appointment comment:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateAppointmentComment = async (req, res) => {
  try {
    const { official } = req; // Extract official info from the request object
    if (!official) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Official access required" });
    }

    const { appointment_id, comment } = req.body;

    if (!appointment_id || !comment) {
      return res
        .status(400)
        .json({ error: "Appointment ID and comment are required" });
    }

    // Verify the appointment exists and belongs to the official's authority
    const appointment = await prisma.Appointment.findUnique({
      where: {
        appointment_id: parseInt(appointment_id),
      },
    });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Check if the official has permission to update this appointment's comment
    if (appointment.authority_id !== official.authority_id) {
      return res.status(403).json({
        error:
          "Forbidden: You can only update comments for appointments of your authority",
      });
    }

    // Update the appointment comment
    const updatedAppointment = await prisma.Appointment.update({
      where: {
        appointment_id: parseInt(appointment_id),
      },
      data: {
        official_comment: comment,
      },
      include: {
        Authority: true,
        User: true,
        Issue: true,
      },
    });

    res.status(200).json({
      message: "Comment updated successfully",
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error("Error updating appointment comment:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteAppointmentComment = async (req, res) => {
  try {
    const { official } = req; // Extract official info from the request object
    if (!official) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Official access required" });
    }

    const { appointment_id } = req.params;

    if (!appointment_id) {
      return res.status(400).json({ error: "Appointment ID is required" });
    }

    // Verify the appointment exists and belongs to the official's authority
    const appointment = await prisma.Appointment.findUnique({
      where: {
        appointment_id: parseInt(appointment_id),
      },
    });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Check if the official has permission to delete this appointment's comment
    if (appointment.authority_id !== official.authority_id) {
      return res.status(403).json({
        error:
          "Forbidden: You can only delete comments for appointments of your authority",
      });
    }

    // Remove the comment by setting it to null
    const updatedAppointment = await prisma.Appointment.update({
      where: {
        appointment_id: parseInt(appointment_id),
      },
      data: {
        official_comment: null,
      },
      include: {
        Authority: true,
        User: true,
        Issue: true,
      },
    });

    res.status(200).json({
      message: "Comment deleted successfully",
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error("Error deleting appointment comment:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  addCommentToAppointment,
  getAppointmentComment,
  updateAppointmentComment,
  deleteAppointmentComment,
};
