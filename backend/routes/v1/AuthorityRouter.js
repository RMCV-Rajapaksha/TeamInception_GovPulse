const {
  getAuthorities,
  getAvailableIssueStatusOfAuthority,
} = require("../../controllers/v1/AuthorityController");
const {
  verifyToken,
  verifyOfficialToken,
} = require("../../middleware/verifyToken");
const express = require("express");
const router = express.Router();

router.get("/get-authorities-by-user", verifyToken, getAuthorities);
router.get("/get-authorities-by-official", verifyOfficialToken, getAuthorities);
router.get(
  "/get-available-issue-status-of-authority",
  verifyOfficialToken,
  getAvailableIssueStatusOfAuthority
);

module.exports = router;
