const {
  clerkSupportedSignup
} = require("../../controllers/v2/UserController");
const {clerkMiddleware} = require("@clerk/express");
const {addUserIdFromClerk} = require("../../middleware/processClerkToken");
const express = require("express");
const router = express.Router();

router.get("/signup-via-clerk-token", clerkMiddleware(), addUserIdFromClerk, clerkSupportedSignup);
module.exports = router;
