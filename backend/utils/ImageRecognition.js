const faceapi = require("face-api.js");
const canvas = require("canvas");
const { Canvas, Image, ImageData } = canvas;
const fs = require("fs");
const path = require("path");

// Patch face-api.js to work with node-canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const MODELS_PATH = path.join(__dirname, "models");

let modelsLoaded = false;

async function loadModels() {
  if (modelsLoaded) return;

  try {
    console.log("📦 Loading face-api.js models...");

    // Load all required models
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromDisk(MODELS_PATH),
      faceapi.nets.faceLandmark68Net.loadFromDisk(MODELS_PATH),
      faceapi.nets.faceRecognitionNet.loadFromDisk(MODELS_PATH),
      faceapi.nets.faceExpressionNet.loadFromDisk(MODELS_PATH),
      faceapi.nets.ageGenderNet.loadFromDisk(MODELS_PATH),
    ]);

    modelsLoaded = true;
    console.log("✅ Models loaded successfully");
  } catch (error) {
    console.error("❌ Error loading models:", error);
    throw error;
  }
}

async function loadImage(imagePath) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(imagePath)) {
      reject(new Error(`Image file not found: ${imagePath}`));
      return;
    }

    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = imagePath;
  });
}

async function compareFaces(imagePath1, imagePath2) {
  try {
    await loadModels();

    console.log("🖼️  Loading images...");
    const img1 = await loadImage(imagePath1);
    const img2 = await loadImage(imagePath2);

    console.log("🔍 Detecting faces...");

    // Detect faces and get descriptors
    const detections1 = await faceapi
      .detectAllFaces(img1)
      .withFaceLandmarks()
      .withFaceDescriptors();

    const detections2 = await faceapi
      .detectAllFaces(img2)
      .withFaceLandmarks()
      .withFaceDescriptors();

    if (detections1.length === 0) {
      throw new Error("No face detected in first image");
    }

    if (detections2.length === 0) {
      throw new Error("No face detected in second image");
    }

    // Get the first face descriptor from each image
    const descriptor1 = detections1[0].descriptor;
    const descriptor2 = detections2[0].descriptor;

    // Calculate the Euclidean distance between descriptors
    const distance = faceapi.euclideanDistance(descriptor1, descriptor2);

    // A distance < 0.6 typically indicates the same person
    const threshold = 0.6;
    const isSamePerson = distance < threshold;

    console.log(`📊 Face comparison result:`);
    console.log(`   Distance: ${distance.toFixed(4)}`);
    console.log(`   Threshold: ${threshold}`);
    console.log(`   Same person: ${isSamePerson ? "YES" : "NO"}`);

    return {
      distance,
      threshold,
      isSamePerson,
      confidence: Math.max(0, (1 - distance / threshold) * 100),
    };
  } catch (error) {
    console.error("❌ Error comparing faces:", error);
    throw error;
  }
}


module.exports = {
  compareFaces,
  loadModels,
};

// //
// 🎯 Final Result: { distance: 0, threshold: 0.6, isSamePerson: true, confidence: 100 }
