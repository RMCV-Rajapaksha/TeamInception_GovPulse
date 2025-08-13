const express = require("express");
const multer = require("multer");
const {
  uploadMultipleImagesController,
} = require("../controllers/ImageUpload");
const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// Handle multiple image uploads (max 10 files)
router.post("/", upload.array("images", 10), uploadMultipleImagesController);

module.exports = router;
