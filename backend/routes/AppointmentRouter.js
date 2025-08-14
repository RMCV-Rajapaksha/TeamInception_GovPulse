const express = require("express");
const router = express.Router();
const { confirmAppointment, verifyAppointment } = require("../controllers/AppointmentController");

// POST /api/appointments/confirm - Create appointment and generate QR code
router.post("/confirm", confirmAppointment);

// POST /api/appointments/verify - Verify QR code
router.post("/verify", verifyAppointment);

module.exports = router;
