const {
    viewFreeTimeSlots,
    addFreeTimeSlot,
    removeFreeTimeSlot,
    removeFreeTimeSlotV2, // Renamed to avoid confusion with the original removeFreeTimeSlot
} = require("../controllers/TimeSlotController");
const { verifyOfficialToken } = require("../middleware/verifyToken");
const express = require("express");
const router = express.Router();

router.get("/view-free-time-slots", verifyOfficialToken, viewFreeTimeSlots);
router.post("/add-free-time-slot", verifyOfficialToken, addFreeTimeSlot);
router.post("/remove-free-time-slot", verifyOfficialToken, removeFreeTimeSlot);
module.exports = router;