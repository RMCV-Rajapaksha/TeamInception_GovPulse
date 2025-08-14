const {getAuthorities} = require("../../controllers/v2/AuthorityController");
const { verifyOfficialToken} = require("../../middleware/verifyToken");
const {clerkMiddleware} = require("@clerk/express");
const {addUserIdFromClerk} = require("../../middleware/processClerkToken");
const express = require("express");
const router = express.Router();


router.get("/get-authorities-by-user", clerkMiddleware(), addUserIdFromClerk, getAuthorities);
router.get("/get-authorities-by-official", verifyOfficialToken, getAuthorities);

module.exports = router;
