const {
  signup,
  login,
  removeAccount,
} = require("../controllers/UserController");
const {authenticateToken} = require("../middleware/authenticateToken");
const express = require("express");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.delete("/remove-account", authenticateToken, removeAccount);
module.exports = router;
