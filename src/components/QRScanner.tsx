import React, { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, CameraOff, AlertCircle, Sparkles, Check, RefreshCw, Smartphone } from "lucide-react";

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (errorMessage: string) => void;
}

export default function QRScanner({ onScanSuccess, onScanError }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>("");
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  
  const qrCodeInstanceRef = useRef<Html5Qrcode | null>(null);
  const scannerId = "gcc-qr-reader-viewport";

  // Scan sound simulator
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(1046.50, audioCtx.currentTime); // C6 highest note
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.12);
    } catch (e) {
      console.warn("Audio Context beep simulation blocked by browser auto-play policy");
    }
  };

  // Enumerate cameras
  const loadCameras = async () => {
    try {
      setScannerError(null);
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length > 0) {
        setCameras(devices);
        setSelectedCameraId(devices[0].id);
      } else {
        setScannerError("No video input devices found. Verify webcam connectivity.");
      }
    } catch (err: any) {
      console.error("Camera detection error:", err);
      setScannerError("Hardware permission denied or browser restricts webcam access in unsecured context.");
    }
  };

  useEffect(() => {
    loadCameras();
    return () => {
      stopScanning();
    };
  }, []);

  const startScanning = async () => {
    if (!selectedCameraId) {
      await loadCameras();
    }
    if (!selectedCameraId) return;

    setScannerError(null);
    setFeedbackMsg(null);
    setIsScanning(true);

    // Give browser a frame to render the container
    setTimeout(async () => {
      try {
        if (qrCodeInstanceRef.current) {
          await qrCodeInstanceRef.current.clear();
        }

        const html5QrCode = new Html5Qrcode(scannerId);
        qrCodeInstanceRef.current = html5QrCode;

        await html5QrCode.start(
          selectedCameraId,
          {
            fps: 10,
            qrbox: { width: 220, height: 220 },
            aspectRatio: 1.0
          },
          (decodedText) => {
            playBeep();
            setFeedbackMsg("QR Verified Successfully!");
            onScanSuccess(decodedText);
            stopScanning();
          },
          (errorMessage) => {
            // Optional telemetry
            if (onScanError) onScanError(errorMessage);
          }
        );
      } catch (err: any) {
        console.error("Failed to start scanner instance", err);
        setScannerError(err.message || "Failed initializing canvas hardware context.");
        setIsScanning(false);
      }
    }, 150);
  };

  const stopScanning = async () => {
    setIsScanning(false);
    if (qrCodeInstanceRef.current) {
      try {
        if (qrCodeInstanceRef.current.isScanning) {
          await qrCodeInstanceRef.current.stop();
        }
      } catch (err) {
        console.warn("Clean stop of camera scanner failed gracefully:", err);
      }
      qrCodeInstanceRef.current = null;
    }
  };

  // Helper trigger to instantly fill student workspace form with mock QR
  const injectMockQR = (type: "upi" | "raw") => {
    playBeep();
    setFeedbackMsg("Digital UPI Voucher Parsed!");
    setTimeout(() => {
      if (type === "upi") {
        onScanSuccess("upi://pay?pa=gccbijnor@okaxis&pn=GlobalComputerCenter&am=1500&tr=GCCBHAR579201Z9&cu=INR&tn=CourseAdmissionFee");
      } else {
        onScanSuccess("GCC-VERIFIED-TXN:GCC/912803/UPI");
      }
      stopScanning();
    }, 100);
  };

  return (
    <div className="bg-gray-950 border border-indigo-500/15 rounded-2xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-indigo-500 animate-ping"></div>
          <span className="text-[11px] font-bold text-indigo-400 tracking-wider font-mono">LIVE QR ENGINE v2.0</span>
        </div>
        
        {cameras.length > 1 && !isScanning && (
          <select
            value={selectedCameraId}
            onChange={(e) => setSelectedCameraId(e.target.value)}
            className="text-[10px] bg-gray-900 border border-gray-800 text-gray-300 rounded px-2 py-1 focus:outline-none"
          >
            {cameras.map((cam, idx) => (
              <option key={cam.id} value={cam.id}>
                Cam {idx + 1}: {cam.label ? cam.label.slice(0, 15) : "Webcam Device"}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Main scanner viewport */}
      <div className="relative aspect-square sm:aspect-[4/3] w-full bg-gray-900 border border-gray-850 rounded-xl overflow-hidden flex flex-col items-center justify-center transition-all">
        {isScanning ? (
          <>
            {/* Viewport Div target for html5-qrcode */}
            <div id={scannerId} className="w-full h-full object-cover"></div>
            
            {/* Laser Scanning Line Overlay */}
            <div className="absolute inset-x-0 top-0 h-0.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-[scan_2.5s_infinite] pointer-events-none z-10"></div>
            
            {/* Neon Corner Guides */}
            <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
              <div className="w-[180px] h-[180px] relative border border-white/10 rounded-lg">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-400 rounded-tl"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-400 rounded-tr"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-400 rounded-bl"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-400 rounded-br"></div>
              </div>
            </div>

            <div className="absolute bottom-4 inset-x-0 text-center z-10">
              <button
                type="button"
                onClick={stopScanning}
                className="mx-auto px-3 py-1.5 bg-rose-500/90 text-white rounded-full text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 shadow-lg active:scale-95 transition"
              >
                <CameraOff className="h-3.5 w-3.5" /> Stop Camera
              </button>
            </div>
          </>
        ) : (
          <div className="text-center p-6 space-y-4">
            <div className="h-14 w-14 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
              <Camera className="h-7 w-7" />
            </div>
            
            <div className="space-y-1">
              <p className="text-xs font-bold text-white">Interactive QR Code Verification</p>
              <p className="text-[10px] text-gray-500 max-w-[240px] mx-auto">
                Scan GCC admission QR code from payment flyer or mobile screen to instantly fill parameters.
              </p>
            </div>

            {scannerError && (
              <div className="p-2.5 bg-amber-950/20 border border-amber-500/30 text-amber-300 rounded-lg text-[10px] max-w-[280px] mx-auto flex items-start gap-1 text-left">
                <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <span>{scannerError}</span>
              </div>
            )}

            <button
              type="button"
              onClick={startScanning}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition shadow-md flex items-center gap-2 mx-auto active:scale-95"
            >
              <Camera className="h-4 w-4" /> Start QR Camera Scanner
            </button>
          </div>
        )}

        {feedbackMsg && (
          <div className="absolute inset-0 bg-emerald-950/95 flex flex-col items-center justify-center space-y-2 z-20 transition">
            <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg animate-bounce">
              <Check className="h-5 w-5" />
            </div>
            <p className="text-xs font-bold text-white font-mono">{feedbackMsg}</p>
          </div>
        )}
      </div>

      {/* Bypass / Dev Test utility options */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-3 space-y-2">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-amber-400" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">No camera? Use Test QR simulation:</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => injectMockQR("upi")}
            className="px-2.5 py-1.5 bg-indigo-950/40 hover:bg-indigo-950/80 border border-indigo-500/20 hover:border-indigo-500/40 text-[10px] font-semibold text-indigo-300 rounded-lg text-center transition flex items-center justify-center gap-1 font-mono uppercase"
          >
            <Smartphone className="h-3 w-3" /> UPI QR (₹1,500)
          </button>
          <button
            type="button"
            onClick={() => injectMockQR("raw")}
            className="px-2.5 py-1.5 bg-gray-900 border border-gray-800 hover:bg-gray-850 hover:border-gray-700 text-[10px] font-semibold text-gray-300 rounded-lg text-center transition flex items-center justify-center gap-1 font-mono uppercase"
          >
            <Smartphone className="h-3 w-3" /> Raw Check Code
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
      `}</style>
    </div>
  );
}
