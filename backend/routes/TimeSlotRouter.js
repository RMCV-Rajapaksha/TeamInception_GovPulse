const {
    viewFreeTimeSlots,
    addFreeTimeSlot
} = require("../controllers/TimeSlotController");
const { verifyOfficialToken } = require("../middleware/verifyToken");
const express = require("express");
const router = express.Router();

router.get("/view-free-time-slots", verifyOfficialToken, viewFreeTimeSlots);
router.post("/add-free-time-slot", verifyOfficialToken, addFreeTimeSlot);
module.exports = router;