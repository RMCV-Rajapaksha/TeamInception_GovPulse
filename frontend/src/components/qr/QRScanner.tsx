import  { useState, useRef, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { ScanQrCode } from "lucide-react";
import jsQR from "jsqr";

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan?: (result: string) => void;
}

export default function QRScanner({ isOpen, onClose, onScan }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [scannedResult, setScannedResult] = useState<string>("");
  const [debugInfo, setDebugInfo] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start camera automatically when component opens
  useEffect(() => {
    if (isOpen && !isScanning && !scannedResult && !isLoading) {
      startCamera();
    }
  }, [isOpen]);

  // Start camera
  const startCamera = async () => {
    try {
      setError("");
      setIsLoading(true);
      setIsScanning(false);
      setDebugInfo("Requesting camera access...");

      console.log("Requesting camera access...");

      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not supported by this browser");
      }

      // Try with less restrictive constraints first
      const constraints = {
        video: {
          facingMode: "environment",
          width: { ideal: 640, max: 1280 },
          height: { ideal: 480, max: 720 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      console.log("Camera access granted, setting up video...");
      console.log("Stream tracks:", stream.getVideoTracks());
      setDebugInfo("Camera access granted, setting up video...");

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;

        // Wait for metadata to load
        await new Promise((resolve, reject) => {
          if (!videoRef.current) {
            reject(new Error("Video element not available"));
            return;
          }

          videoRef.current.onloadedmetadata = () => {
            console.log("Video metadata loaded");
            console.log(
              "Video dimensions:",
              videoRef.current?.videoWidth,
              "x",
              videoRef.current?.videoHeight
            );
            setDebugInfo(
              `Video loaded: ${videoRef.current?.videoWidth}x${videoRef.current?.videoHeight}`
            );
            resolve(true);
          };

          videoRef.current.onerror = (e) => {
            console.error("Video error:", e);
            reject(new Error("Video loading failed"));
          };

          // Timeout after 10 seconds
          setTimeout(() => reject(new Error("Video loading timeout")), 10000);
        });

        // Now try to play the video
        try {
          await videoRef.current.play();
          console.log("Video is playing");
          setDebugInfo("Video is playing successfully");
          setIsLoading(false);
          setIsScanning(true);

          // Start scanning after video is confirmed playing
          setTimeout(() => {
            startScanning();
          }, 1000);
        } catch (playError: any) {
          console.error("Video play error:", playError);

          // Try to handle autoplay restrictions
          if (playError.name === "NotAllowedError") {
            setError("Click the video to start camera (autoplay restriction)");
            setIsLoading(false);
            setIsScanning(true);
          } else {
            setError(`Unable to start video playback: ${playError.message}`);
            setIsLoading(false);
          }
        }
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      setIsLoading(false);

      let errorMessage = "Unable to access camera. ";
      if (err.name === "NotAllowedError") {
        errorMessage +=
          "Camera permission denied. Please allow camera access and try again.";
      } else if (err.name === "NotFoundError") {
        errorMessage += "No camera found on this device.";
      } else if (err.name === "NotSupportedError") {
        errorMessage += "Camera not supported by this browser.";
      } else if (err.name === "OverconstrainedError") {
        errorMessage +=
          "Camera constraints not supported. Trying with basic settings...";
        // Retry with basic constraints
        setTimeout(() => {
          retryWithBasicConstraints();
        }, 1000);
        return;
      } else {
        errorMessage += `Error: ${err.message}`;
      }

      setError(errorMessage);
      setDebugInfo(`Error: ${err.name} - ${err.message}`);
    }
  };

  // Retry with more basic constraints
  const retryWithBasicConstraints = async () => {
    try {
      setDebugInfo("Retrying with basic camera settings...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true, // Use basic video constraint
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        await videoRef.current.play();
        setError("");
        setIsLoading(false);
        setIsScanning(true);
        startScanning();
      }
    } catch (retryError: any) {
      setError(`Camera access failed: ${retryError.message}`);
      setIsLoading(false);
    }
  };

  // Handle manual video play (for autoplay restrictions)
  const handleVideoClick = async () => {
    if (videoRef.current && videoRef.current.paused) {
      try {
        await videoRef.current.play();
        setError("");
        if (!scanIntervalRef.current) {
          startScanning();
        }
      } catch (playError: any) {
        setError(`Unable to start video: ${playError.message}`);
      }
    }
  };

  // Start QR scanning loop
  const startScanning = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }

    console.log("Starting QR scanning loop...");
    setDebugInfo("QR scanning started");

    scanIntervalRef.current = setInterval(() => {
      scanQRCode();
    }, 300);
  };

  // Scan QR code from video
  const scanQRCode = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
      const context = canvas.getContext("2d");
      if (context) {
        try {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);

          const imageData = context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          );
          const code = jsQR(imageData.data, imageData.width, imageData.height);

          if (code) {
            console.log("QR Code detected:", code.data);
            handleScanResult(code.data);
          }
        } catch (scanError) {
          console.error("Scan error:", scanError);
        }
      }
    } else if (video) {
      console.log(
        "Video readyState:",
        video.readyState,
        "HAVE_ENOUGH_DATA:",
        video.HAVE_ENOUGH_DATA
      );
    }
  };

  // Stop camera
  const stopCamera = () => {
    console.log("Stopping camera...");
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        console.log("Stopping track:", track);
        track.stop();
      });
      streamRef.current = null;
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    setIsScanning(false);
    setIsLoading(false);
    setDebugInfo("");
  };

  // Handle scan result
  const handleScanResult = (result: string) => {
    setScannedResult(result);
    stopCamera();
    onScan?.(result);
  };

  // Cleanup on close
  const handleClose = () => {
    stopCamera();
    setScannedResult("");
    setError("");
    setDebugInfo("");
    onClose();
  };

  // Scan again
  const scanAgain = () => {
    setScannedResult("");
    setError("");
    setDebugInfo("");
    startCamera();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-lg lg:max-w-xl shadow-2xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            QR Scanner
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>


        {/* Debug Button - Remove in production */}
        {isScanning && (
          <button
            onClick={() => {
              console.log("Video ref:", videoRef.current);
              console.log("Video src object:", videoRef.current?.srcObject);
              console.log("Video ready state:", videoRef.current?.readyState);
              console.log("Video paused:", videoRef.current?.paused);
              console.log("Stream active:", streamRef.current?.active);
              console.log(
                "Video dimensions:",
                videoRef.current?.videoWidth,
                videoRef.current?.videoHeight
              );
            }}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded text-xs"
          >
            Debug Camera
          </button>
        )}

        {/* Scanner Area */}
        <div className="bg-gray-100 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 text-center">
          {/* Error State */}
          {error && (
            <div className="w-56 h-56 sm:w-80 sm:h-80 lg:w-96 lg:h-96 mx-auto bg-white rounded-lg border-2 border-red-300 flex flex-col items-center justify-center">
              <ScanQrCode className="w-16 h-16 sm:w-20 sm:h-20 text-red-400 mb-4" />
              <p className="text-red-600 mb-4 text-sm sm:text-base px-4 text-center">
                {error}
              </p>
              <button
                onClick={startCamera}
                className="px-4 py-2 sm:px-6 sm:py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm sm:text-base"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && !error && (
            <div className="w-56 h-56 sm:w-80 sm:h-80 lg:w-96 lg:h-96 mx-auto bg-white rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
              <ScanQrCode className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mb-4 animate-pulse" />
              <p className="text-gray-600 text-sm sm:text-base">
                Starting camera...
              </p>
              {debugInfo && (
                <p className="text-xs text-gray-500 mt-2 px-4 text-center">
                  {debugInfo}
                </p>
              )}
            </div>
          )}

          {/* Camera Feed */}
          {isScanning && !error && !isLoading && (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-56 h-56 sm:w-80 sm:h-80 lg:w-96 lg:h-96 mx-auto bg-black rounded-lg object-cover border-2 border-blue-500 cursor-pointer"
                style={{
                  display: "block",
                  minHeight: "224px",
                  minWidth: "224px",
                }}
                onClick={handleVideoClick}
                onLoadedMetadata={() => {
                  console.log("Video loaded metadata event");
                  setDebugInfo("Video metadata loaded");
                }}
                onCanPlay={() => {
                  console.log("Video can play event");
                  setDebugInfo("Video can play");
                }}
                onPlay={() => {
                  console.log("Video play event");
                  setDebugInfo("Video playing");
                  if (!scanIntervalRef.current) {
                    startScanning();
                  }
                }}
                onPlaying={() => {
                  console.log("Video playing event");
                  setDebugInfo("Video is actively playing");
                }}
                onError={(e) => {
                  console.error("Video element error:", e);
                  setError("Video playback error");
                }}
                onPause={() => {
                  console.log("Video paused");
                  setDebugInfo("Video paused - click to resume");
                }}
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Scanning Frame */}
              <div className="absolute inset-0 border-2 border-yellow-400 rounded-lg pointer-events-none">
                <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-yellow-400"></div>
                <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-yellow-400"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-yellow-400"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-yellow-400"></div>
              </div>

              {/* Scanning indicator */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-3 py-1 rounded text-sm font-medium">
                {videoRef.current?.paused ? "Click to start" : "Scanning..."}
              </div>
            </div>
          )}

          {/* Success State */}
          {scannedResult && (
            <div className="w-56 h-56 sm:w-80 sm:h-80 lg:w-96 lg:h-96 mx-auto bg-green-50 rounded-lg border-2 border-green-300 flex flex-col items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500 rounded-full flex items-center justify-center mb-4">
                <ScanQrCode className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <p className="text-green-700 font-medium mb-4 text-sm sm:text-base">
                Scan Successful!
              </p>
              <div className="text-xs sm:text-sm text-gray-600 break-all px-4 max-h-24 overflow-y-auto">
                {scannedResult}
              </div>
            </div>
          )}

          {/* Fallback state */}
          {!isScanning && !error && !scannedResult && !isLoading && (
            <div className="w-56 h-56 sm:w-80 sm:h-80 lg:w-96 lg:h-96 mx-auto bg-white rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
              <ScanQrCode className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mb-4" />
              <p className="text-gray-600 text-sm sm:text-base mb-4">
                Ready to scan QR code
              </p>
              <button
                onClick={startCamera}
                className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
              >
                Start Camera
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons - Only show when needed */}
        {(scannedResult || error) && (
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 text-sm sm:text-base font-medium hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={scanAgain}
              className="flex-1 py-3 px-4 bg-gradient-to-b from-gray-900 to-black text-white text-sm sm:text-base font-medium rounded-lg hover:from-black hover:to-gray-800 transition-all"
            >
              Scan Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
