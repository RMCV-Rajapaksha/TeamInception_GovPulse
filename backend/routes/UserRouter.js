const {
  signup,
  login,
  removeAccount,
} = require("../controllers/UserController");
const express = require("express");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.delete("/remove-account", removeAccount);
module.exports = router;
