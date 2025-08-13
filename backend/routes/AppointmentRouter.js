const {
    bookAppointment,
    getAppointmentById,
    getUsersAppointments,
    getAuthorityAppointments,
    cancelAppointment
} = require('../controllers/AppointmentController');
const { verifyToken, verifyOfficialToken } = require("../middleware/verifyToken");
const express = require("express");
const router = express.Router();
router.post("/book-appointment", verifyToken, bookAppointment);
router.get("/appointment-by-id/:appointment_id", getAppointmentById);
router.get("/user-appointments", verifyToken, getUsersAppointments);
router.get("/authority-appointments/", verifyOfficialToken, getAuthorityAppointments);
router.post("/cancel-appointment-by-user", verifyToken, cancelAppointment);
router.post("/cancel-appointment-by-official", verifyOfficialToken, cancelAppointment);
module.exports = router;