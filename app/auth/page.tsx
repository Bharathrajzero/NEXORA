"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Camera, Download, FileArchive, KeyRound, QrCode, X } from "lucide-react";

type FileItem = {
  name: string;
  size: string;
};

type DropData = {
  code: string;
  title: string;
  files: FileItem[];
};

function DownloadPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const codeParam = searchParams.get("code");
  
  const [drop, setDrop] = useState<DropData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [scanMode, setScanMode] = useState<"code" | "camera">("code");
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (codeParam) {
      setCodeInput(codeParam);
      loadDropData(codeParam);
    }
  }, [codeParam]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  function formatFileSize(size: number) {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / 1024 / 1024).toFixed(1)} MB`;
  }

  async function loadDropData(code: string) {
    setLoading(true);
    setError("");

    const stored = localStorage.getItem("nexora-drops");
    if (stored) {
      try {
        const drops = JSON.parse(stored);
        const found = drops.find((d: any) => d.code === code.toUpperCase() && d.expiresAt > Date.now());
        
        if (found) {
          setDrop({
            code: found.code,
            title: found.title,
            files: found.files.map((f: File) => ({
              name: f.name,
              size: formatFileSize(f.size)
            }))
          });
        } else {
          setError("Code not found or expired");
        }
      } catch {
        setError("Invalid code");
      }
    } else {
      setError("No drops available");
    }
    setLoading(false);
  }

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setScanning(true);
        setError("");
        
        // Start QR scanning
        scanQRCode();
      }
    } catch (err) {
      setError("Camera access denied. Please allow camera access or use code entry.");
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setScanning(false);
  }

  function scanQRCode() {
    if (!videoRef.current || !scanning) return;

    const canvas = document.createElement("canvas");
    const video = videoRef.current;
    
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Simple QR detection (in production, use jsQR or similar library)
        // For now, this is a placeholder that checks URL params
        const urlMatch = window.location.href.match(/code=([A-Z0-9]{6})/);
        if (urlMatch) {
          const detectedCode = urlMatch[1];
          stopCamera();
          loadDropData(detectedCode);
          return;
        }
      }
    }

    setTimeout(() => scanQRCode(), 300);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = codeInput.trim().toUpperCase();
    if (code.length >= 6) {
      loadDropData(code);
    } else {
      setError("Enter a valid 6-character code");
    }
  }

  function handleScanModeChange(mode: "code" | "camera") {
    setScanMode(mode);
    if (mode === "camera") {
      startCamera();
    } else {
      stopCamera();
    }
  }

  if (drop) {
    return (
      <main className="min-h-screen bg-[linear-gradient(135deg,#e0f2fe_0%,#f8fafc_45%,#cffafe_100%)] flex items-center justify-center p-4">
        <div className="w-full max-w-2xl rounded-lg border border-sky-200 bg-white p-6 shadow-soft lg:p-8">
          <div className="flex items-center gap-3 border-b border-sky-100 pb-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon.svg" alt="Nexora" className="h-12 w-12" />
            <div>
              <h1 className="text-2xl font-black text-slate-950">{drop.title}</h1>
              <p className="mt-1 text-sm font-medium text-slate-500">
                {drop.files.length} file{drop.files.length !== 1 ? "s" : ""} ready to download
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {drop.files.map((file, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-sky-200 bg-sky-50 p-4"
              >
                <div className="flex items-center gap-3">
                  <FileArchive className="text-sky-500" size={24} />
                  <div>
                    <p className="font-bold text-slate-950">{file.name}</p>
                    <p className="text-sm text-slate-500">{file.size}</p>
                  </div>
                </div>
                <button
                  className="flex h-10 items-center gap-2 rounded-lg bg-sky-500 px-4 text-sm font-bold text-white hover:bg-sky-600"
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex-1 h-11 rounded-lg border border-sky-200 text-sm font-bold text-sky-700 hover:bg-sky-50"
            >
              Go to dashboard
            </button>
            <button
              onClick={() => {
                setDrop(null);
                setCodeInput("");
              }}
              className="flex-1 h-11 rounded-lg bg-slate-950 text-sm font-bold text-white hover:bg-sky-700"
            >
              Enter another code
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#e0f2fe_0%,#f8fafc_45%,#cffafe_100%)] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border border-sky-200 bg-white p-6 shadow-soft">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.svg" alt="Nexora" className="h-12 w-12" />
          <div>
            <h1 className="text-2xl font-black text-slate-950">Download Files</h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Scan QR or enter 6-digit code
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 rounded-lg bg-sky-50 p-1">
          <button
            type="button"
            onClick={() => handleScanModeChange("code")}
            className={`flex h-11 items-center justify-center gap-2 rounded-md text-sm font-bold transition ${
              scanMode === "code" ? "bg-sky-500 text-white shadow-card" : "text-sky-700 hover:bg-white"
            }`}
          >
            <KeyRound size={18} />
            Enter Code
          </button>
          <button
            type="button"
            onClick={() => handleScanModeChange("camera")}
            className={`flex h-11 items-center justify-center gap-2 rounded-md text-sm font-bold transition ${
              scanMode === "camera" ? "bg-sky-500 text-white shadow-card" : "text-sky-700 hover:bg-white"
            }`}
          >
            <Camera size={18} />
            Scan QR
          </button>
        </div>

        {scanMode === "code" ? (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-900">Pickup Code</label>
              <input
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                placeholder="ABC123"
                maxLength={6}
                className="h-16 w-full rounded-lg border border-sky-200 bg-white px-4 text-center font-mono text-2xl font-black uppercase tracking-[0.25em] text-slate-950 outline-none placeholder:text-sky-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-sky-500 text-sm font-black text-white hover:bg-sky-600 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Access Files"}
              <ArrowRight size={18} />
            </button>
          </form>
        ) : (
          <div className="mt-6 space-y-4">
            <div className="relative overflow-hidden rounded-lg border border-sky-200 bg-slate-950">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full aspect-square object-cover"
              />
              {!scanning && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80">
                  <button
                    onClick={startCamera}
                    className="flex items-center gap-2 rounded-lg bg-sky-500 px-6 py-3 text-sm font-bold text-white hover:bg-sky-600"
                  >
                    <Camera size={18} />
                    Start Camera
                  </button>
                </div>
              )}
              {scanning && (
                <div className="absolute inset-0 border-4 border-sky-500 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-white rounded-lg" />
                </div>
              )}
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                {error}
              </div>
            )}

            <p className="text-center text-sm font-medium text-slate-500">
              Point your camera at the QR code
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="mt-4 h-11 w-full rounded-lg border border-sky-200 text-sm font-bold text-sky-700 hover:bg-sky-50"
        >
          Back to Dashboard
        </button>
      </div>
    </main>
  );
}

export default function DownloadPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[linear-gradient(135deg,#e0f2fe_0%,#f8fafc_45%,#cffafe_100%)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-bold text-slate-950">Loading...</p>
        </div>
      </main>
    }>
      <DownloadPageContent />
    </Suspense>
  );
}
