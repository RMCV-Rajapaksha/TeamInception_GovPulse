const express = require("express");
const router = express.Router();
const liveNotificationController = require("../../controllers/v2/LiveNotificationController");

// POST /api/v2/live-notifications/submit-notification
router.post(
  "/submit-notification",
  liveNotificationController.submitNotification
);

module.exports = router;
