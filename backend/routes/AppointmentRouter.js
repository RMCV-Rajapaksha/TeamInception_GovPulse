const {
    bookAppointment,
    getAppointmentById,
    getUsersAppointments,
    getAuthorityAppointments,
    cancelAppointment,
    addAttendeeToAppointment,
    getAttendeesOfAppointment,
    removeAttendeeFromAppointment
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
router.post("/add-attendee-by-user", verifyToken, addAttendeeToAppointment);
router.post("/add-attendee-by-official", verifyOfficialToken, addAttendeeToAppointment);
router.get("/attendees-of-appointment/:appointment_id", getAttendeesOfAppointment);
router.delete("/remove-attendee-from-appointment-by-user/:attendee_id", verifyToken, removeAttendeeFromAppointment);
router.delete("/remove-attendee-from-appointment-by-official/:attendee_id", verifyOfficialToken, removeAttendeeFromAppointment);
module.exports = router;