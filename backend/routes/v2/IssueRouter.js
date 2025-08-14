const {
  test,
  createIssue,
  deleteIssue,
  getUserIssues,
  getIssues,
  getIssueById,
  updateIssueStatus,
  getAuthorityIssues
} = require("../../controllers/v2/IssueController");
const {clerkMiddleware} = require("@clerk/express");
const { addUserIdFromClerk,addRelatedUserFromDatabase } = require("../../middleware/processClerkToken");
const express = require("express");
const router = express.Router();


router.get("/", getIssues);
router.get("/authority-issues", verifyOfficialToken, getAuthorityIssues);
router.get("/:issue_id", getIssueById);
router.get("/test", test);
router.post("/create", clerkMiddleware(),addUserIdFromClerk,addRelatedUserFromDatabase, createIssue);
router.put("/update-status/:issue_id", verifyOfficialToken, updateIssueStatus);
router.delete("/delete-issue/:issue_id", clerkMiddleware(),addUserIdFromClerk,addRelatedUserFromDatabase, deleteIssue);
router.get("/user-issues", clerkMiddleware(),addUserIdFromClerk,addRelatedUserFromDatabase, getUserIssues);
module.exports = router;
