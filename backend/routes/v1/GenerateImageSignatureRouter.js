const {
  generateImagesignature,
} = require("../../controllers/v1/GenerateImageSignature");
const express = require("express");
const { verifyToken } = require("../../middleware/verifyToken");
const router = express.Router();

router.get("/", verifyToken, generateImagesignature);


module.exports = router;