const {
  signup,
  login,
  removeAccount,
} = require("../controllers/UserController");
const {verifyToken} = require("../middleware/verifyToken");
const express = require("express");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.delete("/remove-account", verifyToken, removeAccount);
module.exports = router;
