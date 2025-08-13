const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const generateImagesignature = async (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Generate the signature using Cloudinary's API
    const signature = cloudinary.utils.api_sign_request(
      { timestamp },
      process.env.CLOUDINARY_API_SECRET
    );

    // Return the signature and timestamp
    res.status(200).json({ signature, timestamp });
  } catch (error) {
    console.error("Error generating image signature:", error);
    res.status(500).json({ error: "Failed to generate image signature" });
  }
};

module.exports = {
  generateImagesignature,
};
