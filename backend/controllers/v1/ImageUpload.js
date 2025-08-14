const cloudinary = require("cloudinary").v2;

// Configure Cloudinary (do this once in your app)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Controller function to handle multiple image uploads via HTTP
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
async function uploadMultipleImagesController(req, res) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No images provided",
      });
    }

    // Convert file buffers to base64 for Cloudinary upload
    const imageBuffers = req.files.map(
      (file) => `data:${file.mimetype};base64,${file.buffer.toString("base64")}`
    );

    // Upload options (you can customize these)
    const uploadOptions = {
      folder: "govpulse/uploads",
      resource_type: "image",
    };

    // Upload all images
    const uploadResults = await uploadMultipleImages(
      imageBuffers,
      uploadOptions
    );

    // Check if any uploads failed
    const failedUploads = uploadResults.filter((result) => !result.success);

    if (failedUploads.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Some images failed to upload",
        results: uploadResults,
      });
    }

    // All uploads successful
    res.status(200).json({
      success: true,
      message: `Successfully uploaded ${uploadResults.length} images`,
      images: uploadResults,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error during upload",
    });
  }
}
/**
 * Upload image to Cloudinary
 * @param {string|Buffer} imagePath - File path, URL, or Buffer
 * @param {object} options - Upload options
 * @returns {Promise<object>} - Upload result with URL
 */
async function uploadImageToCloudinary(imagePath, options = {}) {
  try {
    const defaultOptions = {
      folder: "uploads",
      resource_type: "image",
      public_id: `image_${Date.now()}_${Math.round(Math.random() * 1e9)}`,
      ...options,
    };

    const result = await cloudinary.uploader.upload(imagePath, defaultOptions);

    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      created_at: result.created_at,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Upload multiple images to Cloudinary
 * @param {Array} imagePaths - Array of file paths, URLs, or Buffers
 * @param {object} options - Upload options
 * @returns {Promise<Array>} - Array of upload results
 */
async function uploadMultipleImages(imagePaths, options = {}) {
  const uploadPromises = imagePaths.map((imagePath) =>
    uploadImageToCloudinary(imagePath, options)
  );

  return Promise.all(uploadPromises);
}

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Public ID of the image to delete
 * @returns {Promise<object>} - Deletion result
 */
async function deleteImageFromCloudinary(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: result.result === "ok",
      result: result.result,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

module.exports = {
  uploadImageToCloudinary,
  uploadMultipleImages,
  deleteImageFromCloudinary,
  uploadMultipleImagesController,
};
