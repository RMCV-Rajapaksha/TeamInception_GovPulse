const {
    viewFreeTimeSlots,
    addFreeTimeSlot,
    removeFreeTimeSlot,
    getFreeTimeSlotsOfAnAuthority,
} = require("../../controllers/v1/TimeSlotController");
const { verifyOfficialToken } = require("../../middleware/verifyToken");
const express = require("express");
const router = express.Router();

router.get("/view-free-time-slots", verifyOfficialToken, viewFreeTimeSlots);
router.post("/add-free-time-slot", verifyOfficialToken, addFreeTimeSlot);
router.post("/remove-free-time-slot", verifyOfficialToken, removeFreeTimeSlot);
router.get("/get-free-time-slots/:authority_id", getFreeTimeSlotsOfAnAuthority);
module.exports = router;