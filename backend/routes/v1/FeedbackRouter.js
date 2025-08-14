const {
  createFeedback,
  getFeedbackByAppointmentId,
  updateFeedback,
  deleteFeedback,
  getAllFeedback,
} = require("../../controllers/v1/FeedbackController");

const express = require("express");
const router = express.Router();

// Create feedback without token verification (as requested)
router.post("/create-feedback", createFeedback);

// Get feedback by appointment ID (no token required)
router.get("/appointment/:appointment_id", getFeedbackByAppointmentId);

// Update feedback by appointment ID (no token required)
router.put("/appointment/:appointment_id", updateFeedback);

// Delete feedback by appointment ID (no token required)
router.delete("/appointment/:appointment_id", deleteFeedback);

// Get all feedback (optionally filtered by authority_id)
router.get("/all", getAllFeedback);

module.exports = router;
