const {
  test,
  createIssue,
  deleteIssue,
  getUserIssues,
  getIssues,
  getIssueById,
} = require("../controllers/IssueController");
const { verifyToken } = require("../middleware/verifyToken");
const express = require("express");
const router = express.Router();

router.get("/", getIssues);
router.get("/:issue_id", getIssueById);
router.get("/test", test);
router.post("/create", verifyToken, createIssue);
router.delete("/delete-issue/:issue_id", verifyToken, deleteIssue);
router.get("/user-issues", verifyToken, getUserIssues);
module.exports = router;
