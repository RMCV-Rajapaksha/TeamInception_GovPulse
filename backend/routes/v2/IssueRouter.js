const {
  test,
  createIssue,
  deleteIssue,
  getUserIssues,
  getIssues,
  getIssueById,
} = require("../../controllers/v2/IssueController");
const {clerkMiddleware} = require("@clerk/express");
const { addUserIdFromClerk,addRelatedUserFromDatabase } = require("../../middleware/processClerkToken");
const express = require("express");
const router = express.Router();


router.get("/", getIssues);
router.get("/:issue_id", getIssueById);
router.get("/test", test);
router.post("/create", clerkMiddleware(),addUserIdFromClerk,addRelatedUserFromDatabase, createIssue);
router.post("/v2/create", clerkMiddleware(), addUserIdFromClerk, addRelatedUserFromDatabase, createIssue);
router.delete("/delete-issue/:issue_id", clerkMiddleware(),addUserIdFromClerk,addRelatedUserFromDatabase, deleteIssue);
router.get("/user-issues", clerkMiddleware(),addUserIdFromClerk,addRelatedUserFromDatabase, getUserIssues);
module.exports = router;
