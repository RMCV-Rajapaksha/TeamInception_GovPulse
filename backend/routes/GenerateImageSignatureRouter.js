const {
  generateImagesignature,
} = require("../controllers/GenerateImageSignature");
const express = require("express");
const { verifyToken } = require("../middleware/verifyToken");
const router = express.Router();

router.get("/", verifyToken, generateImagesignature);


module.exports = router;