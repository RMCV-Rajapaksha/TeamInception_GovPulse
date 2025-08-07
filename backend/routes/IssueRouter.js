const { test } = require("../controllers/issueController");
const express = require("express");
const router = express.Router();

router.get("/test", test);

module.exports = router;
