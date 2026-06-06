"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Copy,
  Download,
  FileArchive,
  MonitorSmartphone,
  Plus,
  QrCode,
  RefreshCw,
  ScanLine,
  Trash2,
  Upload,
  X
} from "lucide-react";
import type { User } from "@/lib/auth";

type Drop = {
  id: string;
  title: string;
  files: File[];
  code: string;
  qrUrl: string;
  createdAt: number;
  expiresAt: number;
};

function generateCode() {
  return Array.from({ length: 6 }, () => 
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]
  ).join("");
}

function formatTimeLeft(expiresAt: number) {
  const ms = Math.max(0, expiresAt - Date.now());
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  if (minutes >= 60) return "60m 0s";
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

export function DashboardClient({ user }: { user: User }) {
  const router = useRouter();
  const [drops, setDrops] = useState<Drop[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [toast, setToast] = useState("");
  const [now, setNow] = useState(Date.now());
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("nexora-drops");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const active = parsed.filter((d: Drop) => d.expiresAt > Date.now());
        setDrops(active);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("nexora-drops", JSON.stringify(drops));
  }, [drops]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
      setDrops(prev => prev.filter(d => d.expiresAt > Date.now()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  function handleCreateDrop() {
    if (!title.trim() || files.length === 0) {
      notify("Add a title and at least one file");
      return;
    }

    const code = generateCode();
    const expiresAt = Date.now() + 60 * 60 * 1000;
    const newDrop: Drop = {
      id: crypto.randomUUID(),
      title: title.trim(),
      files,
      code,
      qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${window.location.origin}/auth?code=${code}`)}`,
      createdAt: Date.now(),
      expiresAt
    };

    setDrops([newDrop, ...drops]);
    setShowCreateModal(false);
    setTitle("");
    setFiles([]);
    notify(`Drop created with code ${code}`);

    const formData = new FormData();
    files.forEach(f => formData.append("file", f));
    formData.append("title", title);
    formData.append("type", "file");
    fetch("/api/upload", { method: "POST", body: formData }).catch(() => {});
  }

  function deleteDrop(id: string) {
    setDrops(drops.filter(d => d.id !== id));
    notify("Drop deleted");
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    notify("Code copied");
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#e0f2fe_0%,#f8fafc_45%,#cffafe_100%)] text-slate-950">
      <header className="sticky top-0 z-40 border-b border-sky-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon.svg" alt="Nexora" className="h-10 w-10" />
            <div>
              <h1 className="text-lg font-black leading-none text-slate-950">Nexora</h1>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-600">File Relay</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex h-10 items-center gap-2 rounded-lg bg-sky-500 px-4 text-sm font-bold text-white shadow-card transition hover:bg-sky-600"
            >
              <Plus size={18} />
              New drop
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-8 overflow-hidden rounded-lg border border-sky-200 bg-white/70 p-6 shadow-soft backdrop-blur lg:p-8">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-sky-500 text-white shadow-glow">
              <Upload size={24} />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-black text-slate-950 lg:text-4xl">
                Drop files here, scan QR on another device
              </h2>
              <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-slate-600">
                Upload files, get a QR code and 6-character code. Scan on your phone or new PC to download. Files auto-delete after 1 hour.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex h-11 items-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-black text-white shadow-card transition hover:bg-sky-700"
                >
                  <Upload size={18} />
                  Create new file drop
                </button>
                <button
                  onClick={() => router.push("/auth")}
                  className="flex h-11 items-center gap-2 rounded-lg border border-sky-200 bg-white px-5 text-sm font-bold text-sky-700 shadow-card transition hover:bg-sky-50"
                >
                  <Download size={18} />
                  Enter code to download
                </button>
              </div>
            </div>
          </div>
        </div>

        {drops.length === 0 ? (
          <div className="rounded-lg border border-sky-200 bg-white p-12 text-center shadow-soft">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-lg bg-sky-50 text-sky-500">
              <FileArchive size={32} />
            </div>
            <h3 className="mt-4 text-xl font-black text-slate-950">No drops yet</h3>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Create a drop to generate QR and pickup codes
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {drops.map((drop) => (
              <article
                key={drop.id}
                className="overflow-hidden rounded-lg border border-sky-200 bg-white shadow-soft"
              >
                <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto]">
                  <div>
                    <div className="flex items-start gap-4">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-sky-500 text-white shadow-card">
                        <FileArchive size={22} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xl font-black text-slate-950">{drop.title}</h3>
                        <p className="mt-2 text-sm font-medium text-slate-500">
                          {drop.files.length} file{drop.files.length !== 1 ? "s" : ""}
                        </p>
                        <ul className="mt-3 space-y-2">
                          {drop.files.map((file, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm font-medium text-slate-600">
                              <div className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                              {file.name}
                            </li>
                          ))}
                        </ul>

                        <div className="mt-5 flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-4 py-2">
                            <span className="text-xs font-bold uppercase tracking-[0.16em] text-sky-600">
                              Code
                            </span>
                            <span className="font-mono text-lg font-black tracking-[0.2em] text-slate-950">
                              {drop.code}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2">
                            <span className="text-xs font-bold text-orange-600">
                              ⏱ {formatTimeLeft(drop.expiresAt)}
                            </span>
                          </div>
                          <button
                            onClick={() => copyCode(drop.code)}
                            className="flex h-9 items-center gap-2 rounded-lg border border-sky-200 bg-white px-3 text-sm font-bold text-sky-700 transition hover:bg-sky-50"
                          >
                            <Copy size={16} />
                            Copy code
                          </button>
                          <button
                            onClick={() => deleteDrop(drop.id)}
                            className="flex h-9 items-center gap-2 rounded-lg border border-red-200 bg-white px-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-4 lg:min-w-[200px]">
                    <div className="rounded-lg border border-sky-200 bg-white p-3 shadow-card">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={drop.qrUrl} alt="QR code" width={200} height={200} className="block" />
                    </div>
                    <p className="text-center text-xs font-bold text-sky-600">
                      Scan to download
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4 backdrop-blur"
          onClick={(e) => e.target === e.currentTarget && setShowCreateModal(false)}
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-lg border border-sky-200 bg-white shadow-soft">
            <div className="flex items-center justify-between border-b border-sky-100 px-6 py-4">
              <div>
                <h2 className="text-xl font-black text-slate-950">Create file drop</h2>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  Upload files and get a shareable QR code (1 hour expiry)
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="grid h-9 w-9 place-items-center rounded-lg border border-sky-200 text-sky-700 hover:bg-sky-50"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-900">Drop title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Presentation for lab meeting"
                  className="h-12 w-full rounded-lg border border-sky-200 bg-white px-4 text-sm font-semibold text-slate-950 outline-none placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-900">Files</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => setFiles([...files, ...Array.from(e.target.files || [])])}
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-sky-300 bg-sky-50 py-10 transition hover:bg-sky-100"
                >
                  <Upload className="text-sky-500" size={32} />
                  <p className="mt-3 text-sm font-bold text-slate-950">
                    Click to select files
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    You can select multiple files at once
                  </p>
                </div>
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-bold text-slate-900">
                    {files.length} file{files.length !== 1 ? "s" : ""} selected
                  </p>
                  {files.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border border-sky-100 bg-sky-50 px-3 py-2"
                    >
                      <span className="truncate text-sm font-medium text-slate-700">{file.name}</span>
                      <button
                        onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                        className="ml-2 text-slate-400 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 h-11 rounded-lg border border-sky-200 text-sm font-bold text-sky-700 hover:bg-sky-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateDrop}
                  className="flex-1 h-11 flex items-center justify-center gap-2 rounded-lg bg-sky-500 text-sm font-black text-white hover:bg-sky-600 transition"
                >
                  Create drop
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-sky-200 bg-white px-4 py-3 shadow-soft">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-950">
            <Check size={18} className="text-sky-500" />
            {toast}
          </div>
        </div>
      )}
    </main>
  );
}
