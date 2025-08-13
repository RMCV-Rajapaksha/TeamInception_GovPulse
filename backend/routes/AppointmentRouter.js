const {bookAppointment} = require('../controllers/AppointmentController');
const { verifyToken } = require("../middleware/verifyToken");
const express = require("express");
const router = express.Router();
router.post("/book-appointment", verifyToken, bookAppointment);
module.exports = router;