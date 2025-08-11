const { test, createIssue} = require("../controllers/IssueController");
const {verifyToken} = require("../middleware/verifyToken");
const express = require("express");
const router = express.Router();

router.get("/test", test);
router.post("/create", verifyToken, createIssue);

module.exports = router;
