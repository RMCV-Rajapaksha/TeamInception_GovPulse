const express = require("express");
const router = express.Router();
const upvoteController = require("../../controllers/v2/UpvoteController");
const {clerkMiddleware} = require("@clerk/express");
const { addUserIdFromClerk,addRelatedUserFromDatabase } = require("../../middleware/processClerkToken");
// Add an upvote
router.post("/add", clerkMiddleware(),addUserIdFromClerk,addRelatedUserFromDatabase,upvoteController.addUpvote);

// Remove an upvote
router.delete("/remove/:issue_id",clerkMiddleware(),addUserIdFromClerk,addRelatedUserFromDatabase, upvoteController.removeUpvote);

// Get upvote count for an issue
router.get("/count/:issue_id",clerkMiddleware(),addUserIdFromClerk,addRelatedUserFromDatabase, upvoteController.getUpvoteCount);

// Check if a user has already upvoted an issue
router.get("/has-upvoted/:issue_id", clerkMiddleware(),addUserIdFromClerk,addRelatedUserFromDatabase, upvoteController.hasUserUpvoted);

module.exports = router;
