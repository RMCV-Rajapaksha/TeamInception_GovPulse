import React, { useState, useRef, useEffect } from "react";
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

      console.log("Requesting camera access...");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      console.log("Camera access granted, setting up video...");

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;

        // Wait for video to load and play
        videoRef.current.onloadedmetadata = async () => {
          console.log("Video metadata loaded");
          try {
            if (videoRef.current) {
              await videoRef.current.play();
              console.log("Video is playing");
              setIsLoading(false);
              setIsScanning(true);

              // Start scanning after a short delay
              setTimeout(() => {
                startScanning();
              }, 100);
            }
          } catch (playError) {
            console.error("Video play error:", playError);
            setError("Unable to start video playback");
            setIsLoading(false);
          }
        };

        // Handle video errors
        videoRef.current.onerror = (e) => {
          console.error("Video error:", e);
          setError("Video playback error");
          setIsLoading(false);
        };
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setIsLoading(false);
      setError(
        "Unable to access camera. Please check permissions and try again."
      );
    }
  };

  // Start QR scanning loop
  const startScanning = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }

    console.log("Starting QR scanning loop...");
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
    }
  };

  // Stop camera
  const stopCamera = () => {
    console.log("Stopping camera...");
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    setIsScanning(false);
    setIsLoading(false);
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
    onClose();
  };

  // Scan again
  const scanAgain = () => {
    setScannedResult("");
    setError("");
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

        {/* Scanner Area */}
        <div className="bg-gray-100 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 text-center">
          {/* Error State */}
          {error && (
            <div className="w-56 h-56 sm:w-80 sm:h-80 lg:w-96 lg:h-96 mx-auto bg-white rounded-lg border-2 border-red-300 flex flex-col items-center justify-center">
              <ScanQrCode className="w-16 h-16 sm:w-20 sm:h-20 text-red-400 mb-4" />
              <p className="text-red-600 mb-4 text-sm sm:text-base px-4">
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
                className="w-56 h-56 sm:w-80 sm:h-80 lg:w-96 lg:h-96 mx-auto bg-black rounded-lg object-cover"
                style={{
                  display: "block",
                  minHeight: "224px",
                  minWidth: "224px",
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
                Scanning...
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
                Camera not started
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
