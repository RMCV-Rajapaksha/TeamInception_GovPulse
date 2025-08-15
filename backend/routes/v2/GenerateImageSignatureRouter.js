const {
  generateImagesignature,
} = require("../../controllers/v2/GenerateImageSignature");
const {clerkMiddleware} = require("@clerk/express");
const {addUserIdFromClerk} = require("../../middleware/processClerkToken");
const express = require("express");

const router = express.Router();

router.get("/", clerkMiddleware(), addUserIdFromClerk, generateImagesignature);


module.exports = router;