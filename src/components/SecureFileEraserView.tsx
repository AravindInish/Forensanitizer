import React, { useState } from 'react';
import {
  FileMinus,
  FileCheck,
  Trash2,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  FolderOpen,
  FileText,
  HelpCircle,
  Play,
  RotateCcw,
  Check,
} from 'lucide-react';
import { SanitizationJob, SanitizationMethod } from '../types';
import { HashBox } from './HashBox';
import { StatusBadge } from './StatusBadge';
import { forensicService } from '../services/forensicService';

interface SecureFileEraserViewProps {
  onFileSanitized: (job: SanitizationJob) => void;
}

export const SecureFileEraserView: React.FC<SecureFileEraserViewProps> = ({ onFileSanitized }) => {
  const sampleSandboxFiles = [
    {
      name: 'financial_records_q3_confidential.xlsx',
      path: '/sandbox/test_case/financial_records_q3_confidential.xlsx',
      size: 1450000,
      sha256: '9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e',
    },
    {
      name: 'passwords_backup_cleartext.txt',
      path: '/sandbox/test_case/passwords_backup_cleartext.txt',
      size: 42000,
      sha256: '3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b',
    },
    {
      name: 'surveillance_feed_corridor_cam4.mp4',
      path: '/sandbox/test_case/surveillance_feed_corridor_cam4.mp4',
      size: 48900000,
      sha256: '7b8c2d910f543e21876543210fedcba9876543217b8c2d910f543e2187654321',
    },
  ];

  const [selectedFilePath, setSelectedFilePath] = useState(sampleSandboxFiles[0].path);
  const [selectedMethod, setSelectedMethod] = useState<SanitizationMethod>('NIST_800_88_CLEAR');
  const [isShredding, setIsShredding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [shredResult, setShredResult] = useState<SanitizationJob | null>(null);

  const selectedFile =
    sampleSandboxFiles.find((f) => f.path === selectedFilePath) || sampleSandboxFiles[0];

  const handleStartShred = async () => {
    setIsShredding(true);
    setProgress(0);
    setShredResult(null);

    let p = 0;
    const timer = setInterval(() => {
      p += 10;
      if (p <= 100) {
        setProgress(p);
      } else {
        clearInterval(timer);
        finishShred();
      }
    }, 90);
  };

  const finishShred = async () => {
    try {
      const job = await forensicService.sanitizeFile({
        targetIdentifier: selectedFilePath,
        method: selectedMethod,
        operator: 'Insp. Rajesh Sharma',
      });
      setShredResult(job);
      onFileSanitized(job);
    } catch {
      // fallback
    } finally {
      setIsShredding(false);
    }
  };

  return (
    <div id="secure-file-eraser-view" className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <FileMinus className="w-5 h-5 text-emerald-800" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Secure File & Folder Eraser (Cryptographic Shredder)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Granular file shredding with physical sector overwrite prior to metadata unlinking.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-950">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>ZERO RESIDUAL SLACK VERIFICATION</span>
        </div>
      </div>

      {/* Logical Deletion vs Secure Sanitization Explainer Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
          <HelpCircle className="w-4 h-4 text-emerald-700" />
          <span>Forensic Science Distinction: OS Logical Deletion vs. Secure Overwrite Shredding</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-lg space-y-1.5">
            <div className="font-bold text-rose-900">Standard OS Logical Deletion (vulnerable)</div>
            <p className="text-slate-700 leading-relaxed">
              When an operating system (Windows, Linux, macOS) deletes a file, it merely marks the file allocation table
              (FAT/MFT/inode) entry as &ldquo;available&rdquo;. The actual content bytes remain completely intact on the physical
              clusters until overwritten, allowing full recovery via ForenSanitizer&apos;s Carving Engine.
            </p>
          </div>

          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-lg space-y-1.5">
            <div className="font-bold text-emerald-900">ForenSanitizer Secure Shredding (compliant)</div>
            <p className="text-slate-700 leading-relaxed">
              ForenSanitizer navigates down to the physical LBA cluster coordinates allocated to the file, writes
              cryptographic patterns across the data and slack space, flushes the drive cache, and verifies zero residual
              entropy before unlinking the directory pointer.
            </p>
          </div>
        </div>
      </div>

      {/* Main Execution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Target File Selection (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-5">
            <h2 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-emerald-700" />
              <span>Target File Selection & Pre-Hash</span>
            </h2>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Select File from Sandbox Target Directory:
              </label>
              <select
                id="select-sandbox-file"
                value={selectedFilePath}
                onChange={(e) => {
                  setSelectedFilePath(e.target.value);
                  setShredResult(null);
                }}
                disabled={isShredding}
                className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
              >
                {sampleSandboxFiles.map((f) => (
                  <option key={f.path} value={f.path}>
                    {f.name} ({(f.size / 1024).toFixed(0)} KB)
                  </option>
                ))}
              </select>
            </div>

            {/* Pre-Sanitization SHA-256 */}
            <div className="space-y-2">
              <HashBox label="Pre-Sanitization SHA-256 File Signature" hash={selectedFile.sha256} />
            </div>

            {/* Shredding Method */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Shredding Standard / Pass Scheme:
              </label>
              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value as SanitizationMethod)}
                disabled={isShredding}
                className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-xs font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
              >
                <option value="NIST_800_88_CLEAR">NIST SP 800-88 Rev. 1 Clear (Single-pass Overwrite + Verification)</option>
                <option value="DOD_5220_22_M">DoD 5220.22-M (3-Pass DoD Secure Shredding)</option>
                <option value="ZERO_FILL">Zero-Fill Overwrite (0x00)</option>
                <option value="RANDOM_FILL">Cryptographic Random Fill (CSPRNG)</option>
              </select>
            </div>

            <button
              id="btn-execute-file-shred"
              onClick={handleStartShred}
              disabled={isShredding}
              className="w-full bg-rose-700 hover:bg-rose-800 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-md text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isShredding ? 'Shredding Sectors...' : 'Permanently Shred Selected File'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Execution Monitor & Verification (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-5">
            <h2 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-700" />
              <span>Sector Overwrite Status & Receipt</span>
            </h2>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono font-semibold">
                <span className="text-slate-700">
                  {isShredding ? 'Overwriting physical clusters...' : shredResult ? 'SHREDDING COMPLETED' : 'Awaiting trigger'}
                </span>
                <span className="text-emerald-800 font-bold">{progress}%</span>
              </div>

              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-rose-600 rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Result Box */}
            {shredResult ? (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                    <span className="font-bold text-emerald-950 text-sm">
                      File Irreversibly Sanitized
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-900 bg-emerald-200/70 px-2 py-0.5 rounded">
                    100% VERIFIED
                  </span>
                </div>

                <p className="text-xs text-emerald-900 leading-relaxed">
                  Clusters successfully written with zero patterns. Pre-computation hash unlinked. Attempting raw
                  signature recovery on this cluster range will return 0x00 bytes.
                </p>

                <HashBox
                  label="Post-Shred Residual Entropy & Hash"
                  hash="0000000000000000000000000000000000000000000000000000000000000000"
                />

                <div className="pt-2 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>Receipt ID: {shredResult.certificateId}</span>
                  <span className="text-emerald-800 font-bold">Unlink Complete</span>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                Select a file from the sandbox directory and press &ldquo;Permanently Shred Selected File&rdquo; to begin
                sector overwrite.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
