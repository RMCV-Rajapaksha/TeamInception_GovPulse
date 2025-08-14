const express = require("express");
const router = express.Router();
const upvoteController = require("../../controllers/v1/UpvoteController");
const { verifyToken } = require("../../middleware/verifyToken");

// Add an upvote
router.post("/add", verifyToken,upvoteController.addUpvote);

// Remove an upvote
router.delete("/remove",verifyToken, upvoteController.removeUpvote);

// Get upvote count for an issue
router.get("/count/:issue_id",verifyToken, upvoteController.getUpvoteCount);

// Check if a user has already upvoted an issue
router.post("/has-upvoted/:issue_id", verifyToken, upvoteController.hasUserUpvoted);

module.exports = router;
