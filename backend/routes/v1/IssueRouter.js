const {
  test,
  createIssue,
  deleteIssue,
  getUserIssues,
  getIssues,
  getIssueById,
  updateIssueStatus,
  getAuthorityIssues,
  getAvailableIssueStatuses,
} = require("../../controllers/v1/IssueController");
const {
  verifyToken,
  verifyOfficialToken,
} = require("../../middleware/verifyToken");

const express = require("express");
const router = express.Router();

router.get("/", getIssues);
router.get("/available-statuses", getAvailableIssueStatuses);
router.get("/authority-issues", verifyOfficialToken, getAuthorityIssues);
router.get("/:issue_id", getIssueById);
router.get("/test", test);
router.post("/create", verifyToken, createIssue);
router.put("/update-status/:issue_id", verifyOfficialToken, updateIssueStatus);
router.delete("/delete-issue/:issue_id", verifyToken, deleteIssue);
router.get("/user-issues", verifyToken, getUserIssues);
module.exports = router;
