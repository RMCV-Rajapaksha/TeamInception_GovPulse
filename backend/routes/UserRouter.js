const {
  signup,
  login,
  removeAccount,
  clerkSupportedSignup
} = require("../controllers/UserController");
const {verifyToken} = require("../middleware/verifyToken");
const {clerkMiddleware} = require("@clerk/express");
const {addUserIdFromClerk} = require("../middleware/processClerkToken");
const express = require("express");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.delete("/remove-account", verifyToken, removeAccount);
router.get("/v2/signup-via-clerk-token", clerkMiddleware(), addUserIdFromClerk, clerkSupportedSignup);
module.exports = router;
