const {
    bookAppointment,
    getAppointmentById,
    getUsersAppointments,
    getAuthorityAppointments,
    cancelAppointment,
    addAttendeeToAppointment,
    getAttendeesOfAppointment,
    removeAttendeeFromAppointment,
    addAttachmentFile,
    getAttachmentByAppointmentId,
    removefileFromAttachment
} = require('../../controllers/v2/AppointmentController');
const { verifyOfficialToken } = require("../../middleware/verifyToken");
const {clerkMiddleware} = require("@clerk/express");
const { addUserIdFromClerk,addRelatedUserFromDatabase } = require("../../middleware/processClerkToken");
const express = require("express");
const router = express.Router();
router.post("/book-appointment", clerkMiddleware(),addUserIdFromClerk,addRelatedUserFromDatabase, bookAppointment);
router.get("/appointment-by-id/:appointment_id", getAppointmentById);
router.get("/user-appointments", clerkMiddleware(),addUserIdFromClerk,addRelatedUserFromDatabase, getUsersAppointments);
router.get("/authority-appointments/", verifyOfficialToken, getAuthorityAppointments);
router.post("/cancel-appointment-by-user", clerkMiddleware(),addUserIdFromClerk,addRelatedUserFromDatabase, cancelAppointment);
router.post("/cancel-appointment-by-official", verifyOfficialToken, cancelAppointment);
router.post("/add-attendee-by-user", clerkMiddleware(),addUserIdFromClerk,addRelatedUserFromDatabase, addAttendeeToAppointment);
router.post("/add-attendee-by-official", verifyOfficialToken, addAttendeeToAppointment);
router.get("/attendees-of-appointment/:appointment_id", getAttendeesOfAppointment);
router.delete("/remove-attendee-from-appointment-by-user/:attendee_id", clerkMiddleware(),addUserIdFromClerk,addRelatedUserFromDatabase, removeAttendeeFromAppointment);
router.delete("/remove-attendee-from-appointment-by-official/:attendee_id", verifyOfficialToken, removeAttendeeFromAppointment);
router.post("/add-attachment-file", clerkMiddleware(),addUserIdFromClerk,addRelatedUserFromDatabase, addAttachmentFile);
router.get("/get-attachment-for-appointment/:appointment_id", getAttachmentByAppointmentId);
router.post("/remove-file-from-attachment/", clerkMiddleware(),addUserIdFromClerk,addRelatedUserFromDatabase, removefileFromAttachment);
module.exports = router;