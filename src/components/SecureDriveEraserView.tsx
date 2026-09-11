import React, { useState, useEffect } from 'react';
import {
  Trash2,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  Play,
  RotateCcw,
  Award,
  Layers,
  Info,
  Check,
  Lock,
} from 'lucide-react';
import { SanitizationJob, SanitizationMethod } from '../types';
import { HashBox } from './HashBox';
import { StatusBadge } from './StatusBadge';
import { SanitizationCertificateModal } from './SanitizationCertificateModal';
import { forensicService } from '../services/forensicService';

interface SecureDriveEraserViewProps {
  sanitizationJobs: SanitizationJob[];
  onJobCreated: (job: SanitizationJob) => void;
}

export const SecureDriveEraserView: React.FC<SecureDriveEraserViewProps> = ({
  sanitizationJobs,
  onJobCreated,
}) => {
  const [targetIdentifier, setTargetIdentifier] = useState('sandbox_test_partition_sda4.raw');
  const [method, setMethod] = useState<SanitizationMethod>('NIST_800_88_CLEAR');
  const [operator, setOperator] = useState('Insp. Rajesh Sharma');
  const [isSSDWarningAcknowledged, setIsSSDWarningAcknowledged] = useState(false);

  // Dialog State
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [confirmationInput, setConfirmationInput] = useState('');

  // Execution & Progress State
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentPass, setCurrentPass] = useState(1);
  const [totalPasses, setTotalPasses] = useState(1);
  const [currentLBA, setCurrentLBA] = useState(0);
  const [currentPattern, setCurrentPattern] = useState('0x00 (Zeroes)');
  const [speedMBps, setSpeedMBps] = useState(185);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [completedJob, setCompletedJob] = useState<SanitizationJob | null>(null);
  const [certificateModalJob, setCertificateModalJob] = useState<SanitizationJob | null>(null);

  // Visual sector map state (64 blocks)
  const [sectorStates, setSectorStates] = useState<number[]>(Array(64).fill(1)); // 1 = allocated, 0 = sanitized

  const testTargets = [
    {
      id: 'sandbox_test_partition_sda4.raw',
      label: 'sandbox_test_partition_sda4.raw (4.0 GB Virtual Loop Partition)',
      size: 4294967296,
      type: 'Virtual Disk Image (Sandbox)',
    },
    {
      id: 'datacenter_sas_sanitized_sample.img',
      label: 'datacenter_sas_sanitized_sample.img (10.0 GB SAS LUN)',
      size: 10737418240,
      type: 'Virtual Disk Image (Server LUN)',
    },
    {
      id: 'nvme_test_namespace_ns0.raw',
      label: 'nvme_test_namespace_ns0.raw (2.0 GB Emulated NVMe Namespace)',
      size: 2147483648,
      type: 'Emulated NVMe Test Volume',
    },
  ];

  const methodDetails: Partial<
    Record<
      SanitizationMethod,
      { passes: number; description: string; compliance: string; patterns: string[] }
    >
  > = {
    ZERO_FILL: {
      passes: 1,
      description: 'Single-pass overwrite with zero bytes (0x00) across all logical blocks.',
      compliance: 'Basic Lab Sanitization & Baseline Reconditioning',
      patterns: ['0x00 (Zeroes)'],
    },
    RANDOM_FILL: {
      passes: 1,
      description: 'Single-pass overwrite with cryptographically secure pseudo-random bytes (CSPRNG).',
      compliance: 'Standard Commercial Sanitization',
      patterns: ['CSPRNG Pseudo-random bytes'],
    },
    NIST_800_88_CLEAR: {
      passes: 1,
      description:
        'Logical overwrite with verified read-back pass and entropy check conforming to NIST Special Publication 800-88 Rev. 1 Clear.',
      compliance: 'NIST SP 800-88 Rev. 1 Clear / ISO/IEC 27040',
      patterns: ['0x00 (Fixed Overwrite) + 100% Read Verification'],
    },
    DOD_5220_22_M: {
      passes: 3,
      description:
        'Pass 1: Zeroes (0x00), Pass 2: Ones (0xFF), Pass 3: Pseudo-random bytes with full sector verification.',
      compliance: 'DoD 5220.22-M National Industrial Security Program',
      patterns: ['Pass 1: 0x00 (Zeroes)', 'Pass 2: 0xFF (Ones)', 'Pass 3: Random CSPRNG + Verify'],
    },
    GUTMANN_35_PASS: {
      passes: 35,
      description:
        'Peter Gutmann 35-pass algorithm designed to neutralize magnetic force microscopy on legacy drives (simulated).',
      compliance: 'Gutmann (1996) Academic Magnetic Standard',
      patterns: ['Multi-pass alternating MFM / RLL flux transitions (35 passes)'],
    },
    ATA_SECURE_ERASE: {
      passes: 1,
      description:
        'Internal drive controller security erase unit command that clears all user and reallocated sectors.',
      compliance: 'ATA/ATAPI Command Set (NIST SP 800-88 Purge)',
      patterns: ['Hardware controller internal cryptographic / voltage zeroing'],
    },
    NVME_CRYPTOGRAPHIC_ERASE: {
      passes: 1,
      description:
        'NVMe Format Command with Crypto Erase (Sanitize Action 004h) instantly destroys the internal media encryption key (MEK).',
      compliance: 'NVM Express 1.4+ Cryptographic Purge (NIST SP 800-88 Purge)',
      patterns: ['MEK Cryptographic Key Invalidation + Namespace Initialization'],
    },
  };

  const handleStartErase = () => {
    if (!isSSDWarningAcknowledged) return;
    setIsConfirmDialogOpen(true);
  };

  const executeSanitization = async () => {
    setIsConfirmDialogOpen(false);
    setConfirmationInput('');
    setIsRunning(true);
    setProgress(0);
    setVerificationProgress(0);
    setIsVerifying(false);
    setCompletedJob(null);
    setSectorStates(Array(64).fill(1));

    const numPasses = methodDetails[method].passes;
    setTotalPasses(numPasses);

    // Fast simulated progress
    let p = 0;
    const interval = setInterval(() => {
      p += 4;
      if (p <= 100) {
        setProgress(p);
        setCurrentLBA(Math.floor((p / 100) * 8388608));
        const activePass = Math.min(numPasses, Math.floor((p / 100) * numPasses) + 1);
        setCurrentPass(activePass);

        const currentPats = methodDetails[method].patterns;
        setCurrentPattern(currentPats[activePass - 1] || currentPats[0]);

        // Turn sectors green/white
        const clearedIndex = Math.floor((p / 100) * 64);
        setSectorStates((prev) => prev.map((s, idx) => (idx < clearedIndex ? 0 : 1)));
      } else {
        clearInterval(interval);
        runVerificationPass();
      }
    }, 80);
  };

  const runVerificationPass = () => {
    setIsVerifying(true);
    let vp = 0;
    const vInterval = setInterval(() => {
      vp += 10;
      if (vp <= 100) {
        setVerificationProgress(vp);
      } else {
        clearInterval(vInterval);
        finishSanitization();
      }
    }, 60);
  };

  const finishSanitization = async () => {
    setIsRunning(false);
    setIsVerifying(false);

    try {
      const job = await forensicService.sanitizeDrive({
        targetIdentifier,
        method,
        operator,
        isSSDOrNVMeNoteAcknowledged: isSSDWarningAcknowledged,
      });
      setCompletedJob(job);
      onJobCreated(job);
    } catch {
      // fallback
    }
  };

  return (
    <div id="secure-drive-eraser-view" className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-emerald-800" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Secure Drive Eraser & Sanitization Engine
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Certified storage data erasure complying with NIST SP 800-88 Rev. 1 and DoD 5220.22-M with zero residual verification.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-950">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>ZERO-BIT RESIDUAL PROOF GUARANTEE</span>
        </div>
      </div>

      {/* Safety Sandbox Protection Banner */}
      <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start gap-3 shadow-2xs">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-950 space-y-1">
          <div className="font-bold text-amber-900 text-sm">
            SIH Safety Directive: Sandbox Test Environment Active
          </div>
          <p className="leading-relaxed">
            All destructive drive operations are restricted to verified virtual loop disk images and isolated sandbox
            containers. Real host drives and boot partitions are physically protected by the ForenSanitizer Safety
            Bridge.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Configuration Controls (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-5">
            <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>Sanitization Parameters Configuration</span>
            </h2>

            {/* Target Media Selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Select Target Storage Media (Sandbox Loopback):
              </label>
              <select
                id="select-target-drive"
                value={targetIdentifier}
                onChange={(e) => setTargetIdentifier(e.target.value)}
                disabled={isRunning}
                className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
              >
                {testTargets.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-slate-500">
                Target Capacity: 4,294,967,296 bytes (512-byte logical sectors)
              </span>
            </div>

            {/* Method Selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Sanitization Algorithm & Regulatory Standard:
              </label>
              <select
                id="select-sanitization-method"
                value={method}
                onChange={(e) => setMethod(e.target.value as SanitizationMethod)}
                disabled={isRunning}
                className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-xs font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
              >
                <option value="NIST_800_88_CLEAR">NIST SP 800-88 Rev. 1 Clear (1-Pass + Full Verify) [Recommended]</option>
                <option value="DOD_5220_22_M">DoD 5220.22-M (3-Pass: 0x00, 0xFF, Random + Verify)</option>
                <option value="ZERO_FILL">Zero-Fill / Single Pass Overwrite (0x00)</option>
                <option value="RANDOM_FILL">Random-Fill CSPRNG (1-Pass Cryptographic)</option>
                <option value="GUTMANN_35_PASS">Gutmann 35-Pass (Simulated Magnetic Transition)</option>
                <option value="ATA_SECURE_ERASE">ATA Secure Erase Command (Internal Controller Purge)</option>
                <option value="NVMe_CRYPTOGRAPHIC_ERASE">NVMe Cryptographic Erase (MEK Invalidation)</option>
              </select>
            </div>

            {/* Method Details Box */}
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs space-y-1.5">
              <div className="font-semibold text-emerald-900 flex items-center justify-between">
                <span>Standard: {methodDetails[method].compliance}</span>
                <span className="font-mono text-[11px] bg-emerald-200/70 text-emerald-900 px-1.5 py-0.2 rounded">
                  {methodDetails[method].passes} Pass(es)
                </span>
              </div>
              <p className="text-slate-700 text-xs leading-relaxed">{methodDetails[method].description}</p>
            </div>

            {/* Operator Identifier */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Authorized Forensic Operator:
              </label>
              <input
                type="text"
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                disabled={isRunning}
                className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            {/* SSD / NVMe Safety Warning Checkbox */}
            <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50 space-y-2">
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="chk-ssd-warning"
                  checked={isSSDWarningAcknowledged}
                  onChange={(e) => setIsSSDWarningAcknowledged(e.target.checked)}
                  disabled={isRunning}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600 cursor-pointer"
                />
                <label htmlFor="chk-ssd-warning" className="text-xs text-slate-700 leading-snug cursor-pointer select-none">
                  <span className="font-semibold text-slate-900">SSD / NVMe Architecture Awareness:</span> I acknowledge
                  that solid-state media utilize wear leveling, over-provisioning, and FTL flash translation layers. For
                  physical SSDs, ATA Secure Erase or NVMe Cryptographic Erase must be preferred over standard magnetic
                  track overwrites.
                </label>
              </div>
            </div>

            {/* Action Trigger */}
            <div className="pt-2">
              <button
                id="btn-trigger-sanitization"
                onClick={handleStartErase}
                disabled={isRunning || !isSSDWarningAcknowledged}
                className="w-full bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-md text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Trash2 className="w-4 h-4" />
                <span>Initiate Certified Sanitization Protocol</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Monitor & Progress (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <RotateCcw className={`w-4 h-4 text-emerald-700 ${isRunning ? 'animate-spin' : ''}`} />
                <span>Real-Time Overwrite Monitor</span>
              </h2>
              {isRunning && (
                <span className="bg-emerald-100 text-emerald-800 font-mono text-[11px] px-2 py-0.5 rounded font-semibold animate-pulse">
                  ACTIVE OVERWRITE
                </span>
              )}
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono font-semibold">
                <span className="text-slate-700">
                  {isRunning
                    ? `Pass ${currentPass} of ${totalPasses}: ${currentPattern}`
                    : completedJob
                    ? '100% OVERWRITE & VERIFICATION COMPLETE'
                    : 'System Ready for Sanitization'}
                </span>
                <span className="text-emerald-800 font-bold">{progress}%</span>
              </div>

              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-emerald-700 rounded-full transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Real-time telemetry */}
              <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                  <div className="text-[10px] text-slate-400 font-mono">Current LBA Sector</div>
                  <div className="font-mono font-bold text-slate-800 text-xs">
                    {currentLBA.toLocaleString()}
                  </div>
                </div>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                  <div className="text-[10px] text-slate-400 font-mono">Throughput</div>
                  <div className="font-mono font-bold text-emerald-800 text-xs">
                    {isRunning ? `${speedMBps} MB/s` : '0 MB/s'}
                  </div>
                </div>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                  <div className="text-[10px] text-slate-400 font-mono">Verification</div>
                  <div className="font-mono font-bold text-slate-800 text-xs">
                    {isVerifying ? `${verificationProgress}%` : completedJob ? '100% PASS' : 'Pending'}
                  </div>
                </div>
              </div>
            </div>

            {/* Sector Cluster Overwrite Visualization (Red -> Light Green -> White) */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Sector Allocation Matrix:</span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {sectorStates.filter((s) => s === 0).length} of 64 Sectors Zeroed
                </span>
              </div>

              <div className="grid grid-cols-16 gap-1 p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                {sectorStates.map((state, idx) => (
                  <div
                    key={idx}
                    className={`h-3 rounded-xs transition-colors duration-200 ${
                      state === 1
                        ? 'bg-rose-500/80' // Allocated / Pre-erase
                        : 'bg-emerald-400 shadow-2xs' // Cleared zeroed sector
                    }`}
                    title={`LBA Block #${idx * 131072} - ${state === 1 ? 'Allocated Sector' : 'Sanitized Sector (0x00)'}`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 px-1 font-mono">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-xs bg-rose-500 inline-block" /> Unsanitized Residual Data
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-xs bg-emerald-400 inline-block" /> Verified Zeroed (0x00)
                </span>
              </div>
            </div>

            {/* Completed Job Details & Certificate */}
            {completedJob && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                    <span className="font-bold text-emerald-950 text-sm">
                      Sanitization Successfully Verified
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-900 bg-emerald-200/70 px-2 py-0.5 rounded">
                    PASS
                  </span>
                </div>

                <p className="text-xs text-emerald-900 leading-relaxed">
                  Post-sanitization bitstream audit confirmed zero residual entropy across all {completedJob.targetSizeBytes.toLocaleString()} bytes.
                  Pre and post SHA-256 signatures logged into immutable audit ledger.
                </p>

                <HashBox label="Post-Sanitization SHA-256 Bitstream Hash" hash={completedJob.postSanitizeSha256} />

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500">
                    Cert: {completedJob.certificateId}
                  </span>
                  <button
                    id="btn-view-certificate"
                    onClick={() => setCertificateModalJob(completedJob)}
                    className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>View Official Certificate</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog Modal */}
      {isConfirmDialogOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-700">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Confirm Data Sanitization</h3>
                <p className="text-xs text-slate-500">Irreversible Storage Overwrite Action</p>
              </div>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-xs text-rose-950 space-y-1.5">
              <p className="font-semibold">You are about to permanently sanitize:</p>
              <div className="font-mono font-bold text-slate-900 bg-white p-1.5 rounded border border-rose-200 truncate">
                {targetIdentifier}
              </div>
              <p className="text-[11px] text-slate-600">
                Method: <span className="font-bold">{method}</span> ({methodDetails[method].passes} pass). All
                existing bitstreams will be irreversibly destroyed.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Type <span className="font-mono font-bold text-rose-700">CONFIRM ERASE</span> to proceed:
              </label>
              <input
                type="text"
                value={confirmationInput}
                onChange={(e) => setConfirmationInput(e.target.value)}
                placeholder="CONFIRM ERASE"
                className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:border-rose-600 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmDialogOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="btn-execute-confirmed-erase"
                type="button"
                disabled={confirmationInput !== 'CONFIRM ERASE'}
                onClick={executeSanitization}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-800 disabled:opacity-40 text-white rounded-md text-xs font-bold transition-colors cursor-pointer"
              >
                Execute Sanitization
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {certificateModalJob && (
        <SanitizationCertificateModal
          job={certificateModalJob}
          onClose={() => setCertificateModalJob(null)}
        />
      )}
    </div>
  );
};
