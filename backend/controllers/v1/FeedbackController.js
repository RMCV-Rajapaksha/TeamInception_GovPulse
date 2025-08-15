const { PrismaClient } = require("../../generated/prisma");

const prisma = new PrismaClient();

const createFeedback = async (req, res) => {
  try {
    const { appointment_id, rating, comment } = req.body;

    // Validate required fields
    if (!appointment_id) {
      return res.status(400).json({ error: "Appointment ID is required" });
    }

    if (!rating) {
      return res.status(400).json({ error: "Rating is required" });
    }

    // Validate rating range (assuming 1-5 scale)
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    // Check if appointment exists
    const appointment = await prisma.Appointment.findUnique({
      where: {
        appointment_id: parseInt(appointment_id),
      },
    });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Check if feedback already exists for this appointment
    const existingFeedback = await prisma.Feedback.findUnique({
      where: {
        appointment_id: parseInt(appointment_id),
      },
    });

    if (existingFeedback) {
      return res.status(409).json({
        error: "Feedback already exists for this appointment",
        existing_feedback: existingFeedback,
      });
    }

    // Create new feedback
    const newFeedback = await prisma.Feedback.create({
      data: {
        rating: parseInt(rating),
        comment: comment || null,
        Appointment: {
          connect: { appointment_id: parseInt(appointment_id) },
        },
      },
    });

    res.status(201).json({
      message: "Feedback created successfully",
      feedback: newFeedback,
    });
  } catch (error) {
    console.error("Error creating feedback:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getFeedbackByAppointmentId = async (req, res) => {
  try {
    const { appointment_id } = req.params;

    // Fetch feedback by appointment ID
    const feedback = await prisma.Feedback.findUnique({
      where: {
        appointment_id: parseInt(appointment_id),
      },
      include: {
        Appointment: {
          include: {
            User: {
              select: {
                user_id: true,
                first_name: true,
                last_name: true,
                name: true,
                email: true,
              },
            },
            Authority: {
              select: {
                authority_id: true,
                name: true,
                ministry: true,
              },
            },
          },
        },
      },
    });

    if (!feedback) {
      return res
        .status(404)
        .json({ error: "Feedback not found for this appointment" });
    }

    res.status(200).json({ feedback });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateFeedback = async (req, res) => {
  try {
    const { appointment_id } = req.params;
    const { rating, comment } = req.body;

    // Check if feedback exists
    const existingFeedback = await prisma.Feedback.findUnique({
      where: {
        appointment_id: parseInt(appointment_id),
      },
    });

    if (!existingFeedback) {
      return res
        .status(404)
        .json({ error: "Feedback not found for this appointment" });
    }

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    // Update feedback
    const updatedFeedback = await prisma.Feedback.update({
      where: {
        appointment_id: parseInt(appointment_id),
      },
      data: {
        ...(rating && { rating: parseInt(rating) }),
        ...(comment !== undefined && { comment }),
      },
    });

    res.status(200).json({
      message: "Feedback updated successfully",
      feedback: updatedFeedback,
    });
  } catch (error) {
    console.error("Error updating feedback:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteFeedback = async (req, res) => {
  try {
    const { appointment_id } = req.params;

    // Check if feedback exists
    const existingFeedback = await prisma.Feedback.findUnique({
      where: {
        appointment_id: parseInt(appointment_id),
      },
    });

    if (!existingFeedback) {
      return res
        .status(404)
        .json({ error: "Feedback not found for this appointment" });
    }

    // Delete feedback
    await prisma.Feedback.delete({
      where: {
        appointment_id: parseInt(appointment_id),
      },
    });

    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllFeedback = async (req, res) => {
  try {
    const { authority_id, limit, offset } = req.query;

    let whereClause = {};
    if (authority_id) {
      whereClause = {
        Appointment: {
          authority_id: parseInt(authority_id),
        },
      };
    }

    const feedbacks = await prisma.Feedback.findMany({
      where: whereClause,
      include: {
        Appointment: {
          include: {
            User: {
              select: {
                user_id: true,
                first_name: true,
                last_name: true,
                name: true,
              },
            },
            Authority: {
              select: {
                authority_id: true,
                name: true,
                ministry: true,
              },
            },
          },
        },
      },
      orderBy: {
        feedback_id: "desc",
      },
      ...(limit && { take: parseInt(limit) }),
      ...(offset && { skip: parseInt(offset) }),
    });

    res.status(200).json({
      feedbacks,
      count: feedbacks.length,
    });
  } catch (error) {
    console.error("Error fetching all feedback:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createFeedback,
  getFeedbackByAppointmentId,
  updateFeedback,
  deleteFeedback,
  getAllFeedback,
};
