const {
  addCommentToAppointment,
  getAppointmentComment,
  updateAppointmentComment,
  deleteAppointmentComment,
} = require("../../controllers/CommentController");
const { verifyOfficialToken } = require("../../middleware/verifyToken");
const express = require("express");
const router = express.Router();

// Route for authorities to add comment to appointment
router.post("/add-comment", verifyOfficialToken, addCommentToAppointment);

// Route to get appointment comment (can be accessed by anyone with appointment ID)
router.get("/appointment/:appointment_id", getAppointmentComment);

// Route for authorities to update comment on appointment
router.put("/update-comment", verifyOfficialToken, updateAppointmentComment);

// Route for authorities to delete comment from appointment
router.delete(
  "/delete-comment/:appointment_id",
  verifyOfficialToken,
  deleteAppointmentComment
);

module.exports = router;
