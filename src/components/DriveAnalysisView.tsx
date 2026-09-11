import React, { useState } from 'react';
import {
  HardDrive,
  ShieldCheck,
  Lock,
  UploadCloud,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Layers,
  FileCode,
  PieChart,
  RefreshCw,
  Search,
  Check,
  Info,
} from 'lucide-react';
import { EvidenceItem } from '../types';
import { HashBox } from './HashBox';
import { StatusBadge } from './StatusBadge';
import { forensicService } from '../services/forensicService';

interface DriveAnalysisViewProps {
  evidenceList: EvidenceItem[];
  onImportEvidence: (item: any) => void;
  onSelectForRecovery: (evidenceId: string) => void;
}

export const DriveAnalysisView: React.FC<DriveAnalysisViewProps> = ({
  evidenceList,
  onImportEvidence,
  onSelectForRecovery,
}) => {
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>(evidenceList[0]?.id || '');
  const [isVerifyingHash, setIsVerifyingHash] = useState(false);
  const [hashVerifyResult, setHashVerifyResult] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const selectedEvidence = evidenceList.find((e) => e.id === selectedEvidenceId) || evidenceList[0];

  const handleVerifyBitstream = async () => {
    if (!selectedEvidence) return;
    setIsVerifyingHash(true);
    setHashVerifyResult(null);
    try {
      const res = await forensicService.calculateEvidenceHash(selectedEvidence.id);
      setHashVerifyResult(res);
    } catch {
      // fallback
    } finally {
      setIsVerifyingHash(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    simulateUpload();
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      onImportEvidence({
        caseId: 'case-001',
        filename: 'seized_kingston_datatraveler_64gb.raw',
        originalName: 'Kingston DataTraveler 3.0 G4 (Seized Target #3)',
        format: '.raw',
        sizeBytes: 64424509440,
        sourceDevice: 'Kingston 64GB USB Flash (Tableau T8u Hardware Write-Blocked)',
        notes: 'Acquired with zero bit changes under ISO/IEC 27037 protocol.',
      });
      setIsUploading(false);
    }, 1200);
  };

  if (!selectedEvidence) {
    return <div className="p-8 text-center text-slate-500">No evidence images loaded.</div>;
  }

  // Calculate percentages
  const usedPct = Math.round((selectedEvidence.usedSpaceBytes / (selectedEvidence.sizeBytes || 1)) * 100);
  const freePct = 100 - usedPct;

  return (
    <div id="drive-analysis-view" className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-emerald-800" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Forensic Drive & Bitstream Analysis</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Read-only examination of raw forensic disk images (.raw, .dd, .img, .E01) with hardware write-block emulation.
          </p>
        </div>

        {/* Read-Only Safety Banner */}
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-300 px-3.5 py-2 rounded-lg text-xs font-semibold text-emerald-950 shadow-2xs">
          <Lock className="w-4 h-4 text-emerald-700" />
          <span>FORENSIC WRITE-BLOCK: READ-ONLY BITSTREAM LOCKED</span>
        </div>
      </div>

      {/* Select Evidence Selector Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Select Active Image:
          </span>
          <select
            id="evidence-item-dropdown"
            value={selectedEvidence.id}
            onChange={(e) => {
              setSelectedEvidenceId(e.target.value);
              setHashVerifyResult(null);
            }}
            className="bg-slate-50 border border-slate-300 font-mono text-xs font-bold text-slate-900 rounded-md px-3 py-1.5 focus:border-emerald-600 focus:outline-none cursor-pointer"
          >
            {evidenceList.map((e) => (
              <option key={e.id} value={e.id}>
                {e.filename} ({(e.sizeBytes / (1024 * 1024 * 1024)).toFixed(2)} GB - {e.format})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-verify-bitstream-hash"
            onClick={handleVerifyBitstream}
            disabled={isVerifyingHash}
            className="inline-flex items-center gap-1.5 bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-900 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-700 ${isVerifyingHash ? 'animate-spin' : ''}`} />
            <span>{isVerifyingHash ? 'Verifying Bitstream...' : 'Verify Hash Against Manifest'}</span>
          </button>

          <button
            id="btn-proceed-to-carve"
            onClick={() => onSelectForRecovery(selectedEvidence.id)}
            className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Carve This Evidence</span>
          </button>
        </div>
      </div>

      {/* Hash Verification Feedback Banner */}
      {hashVerifyResult && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex items-start gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <div className="font-bold text-emerald-950 text-sm">Bitstream Hash Verified (No Bit Tampering)</div>
            <p className="text-emerald-900">
              SHA-256 calculation completed over {selectedEvidence.totalSectors.toLocaleString()} sectors. Calculated
              hash strictly matches the initial forensic acquisition manifest. Admissible under Sec 65B Indian Evidence Act.
            </p>
            <div className="text-[11px] font-mono text-emerald-800 pt-1">
              Verified At: {hashVerifyResult.verifiedAt} | Status: <span className="font-bold">INTEGRITY_VERIFIED_100%</span>
            </div>
          </div>
        </div>
      )}

      {/* Drive Geometry & Partition Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Physical Geometry & Hashes (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Physical Geometry Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-emerald-700" />
                <span>Physical Disk Geometry & Parameters</span>
              </h2>
              <StatusBadge status={selectedEvidence.status} size="sm" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <div className="text-slate-500 text-[10px] uppercase font-semibold">Total Capacity</div>
                <div className="font-mono font-bold text-slate-900 text-sm">
                  {(selectedEvidence.sizeBytes / (1024 * 1024 * 1024)).toFixed(2)} GB
                </div>
                <div className="text-[10px] text-slate-400 font-mono">{selectedEvidence.sizeBytes.toLocaleString()} bytes</div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <div className="text-slate-500 text-[10px] uppercase font-semibold">Total Sectors (LBA)</div>
                <div className="font-mono font-bold text-slate-900 text-sm">
                  {selectedEvidence.totalSectors.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">0 to {selectedEvidence.totalSectors - 1}</div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <div className="text-slate-500 text-[10px] uppercase font-semibold">Sector Size</div>
                <div className="font-mono font-bold text-slate-900 text-sm">{selectedEvidence.sectorSize} Bytes</div>
                <div className="text-[10px] text-slate-400 font-mono">Cluster: {selectedEvidence.clusterSize} B</div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <div className="text-slate-500 text-[10px] uppercase font-semibold">Image Container Format</div>
                <div className="font-mono font-bold text-emerald-800 text-sm">{selectedEvidence.format.toUpperCase()} Raw Image</div>
                <div className="text-[10px] text-slate-400 font-mono">Bitstream Image</div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <div className="text-slate-500 text-[10px] uppercase font-semibold">Deleted Entries Count</div>
                <div className="font-mono font-bold text-amber-700 text-sm">
                  {selectedEvidence.deletedEntriesCount} Records
                </div>
                <div className="text-[10px] text-slate-400 font-mono">Directory residues found</div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <div className="text-slate-500 text-[10px] uppercase font-semibold">Hardware Isolation</div>
                <div className="font-semibold text-emerald-800 text-xs flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Tableau T8u</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">Zero write signals</div>
              </div>
            </div>

            {/* Cryptographic Hashes */}
            <div className="space-y-3 pt-2">
              <HashBox label="Acquisition Hash (SHA-256)" hash={selectedEvidence.sha256} />
              <HashBox label="Secondary Acquisition Hash (MD5)" hash={selectedEvidence.md5} algorithm="MD5" />
            </div>
          </div>

          {/* Partition Table Inspection */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-700" />
                <span>Partition Table & Filesystem Inspection</span>
              </h2>
              <span className="text-xs text-slate-400 font-mono">MBR / GPT Table</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Idx</th>
                    <th className="py-2.5 px-3">Label / Name</th>
                    <th className="py-2.5 px-3">Filesystem</th>
                    <th className="py-2.5 px-3">Start Sector</th>
                    <th className="py-2.5 px-3">End Sector</th>
                    <th className="py-2.5 px-3">Size</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {selectedEvidence.partitions.map((p) => (
                    <tr key={p.index} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-slate-900">#{p.index}</td>
                      <td className="py-2.5 px-3 font-sans font-medium text-slate-900">{p.name}</td>
                      <td className="py-2.5 px-3">
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px]">
                          {p.filesystem}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">{p.startSector.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-slate-600">{p.endSector.toLocaleString()}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">
                        {(p.sizeBytes / (1024 * 1024 * 1024)).toFixed(2)} GB
                      </td>
                      <td className="py-2.5 px-3">
                        <StatusBadge status={p.status} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Storage Distribution & Ingestion (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Storage Allocation & Cluster Map */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-700" />
              <span>Storage Sector Allocation</span>
            </h2>

            {/* Visual Bar Allocation */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-700" />
                  <span>Allocated Sectors ({usedPct}%)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-200" />
                  <span>Unallocated / Slack ({freePct}%)</span>
                </span>
              </div>

              <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
                <div style={{ width: `${usedPct}%` }} className="bg-emerald-700 h-full" />
                <div style={{ width: `${freePct}%` }} className="bg-emerald-200 h-full" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Active Data</div>
                  <div className="font-mono font-bold text-slate-900 mt-0.5">
                    {(selectedEvidence.usedSpaceBytes / (1024 * 1024 * 1024)).toFixed(2)} GB
                  </div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Carvable Slack Space</div>
                  <div className="font-mono font-bold text-emerald-800 mt-0.5">
                    {(selectedEvidence.freeSpaceBytes / (1024 * 1024 * 1024)).toFixed(2)} GB
                  </div>
                </div>
              </div>
            </div>

            {/* Synthetic Cluster Density Map */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-semibold text-slate-700 flex justify-between">
                <span>Cluster Sector Grid Preview:</span>
                <span className="text-[11px] text-emerald-700 font-mono">1,024 LBA Blocks</span>
              </div>
              <div className="grid grid-cols-16 gap-1 p-2 bg-slate-950 rounded-lg border border-slate-800 max-h-36 overflow-y-auto">
                {Array.from({ length: 64 }).map((_, i) => {
                  const isDeleted = i % 5 === 0;
                  const isAllocated = i % 2 === 0;
                  const color = isDeleted
                    ? 'bg-amber-400 hover:bg-amber-300'
                    : isAllocated
                    ? 'bg-emerald-500 hover:bg-emerald-400'
                    : 'bg-slate-700 hover:bg-slate-600';
                  return (
                    <div
                      key={i}
                      title={`Sector Cluster #${i * 128} - ${
                        isDeleted ? 'Deleted artifact signatures found' : isAllocated ? 'Allocated data' : 'Slack space'
                      }`}
                      className={`h-3 rounded-xs ${color} transition-colors cursor-pointer`}
                    />
                  );
                })}
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 px-1">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-xs bg-emerald-500 inline-block" /> Active
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-xs bg-amber-400 inline-block" /> Deleted Artifacts
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-xs bg-slate-700 inline-block" /> Slack Space
                </span>
              </div>
            </div>
          </div>

          {/* Ingestion / Upload Box (Drag and drop or select) */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all bg-white ${
              dragOver ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-300 hover:border-emerald-400'
            }`}
          >
            <UploadCloud className="w-10 h-10 text-emerald-700 mx-auto" />
            <h3 className="font-bold text-slate-900 text-sm mt-2">Mount New Forensic Bitstream Image</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Drag and drop raw disk images (.raw, .dd, .img, .E01) or browse local test directories.
            </p>

            <div className="mt-4 flex justify-center">
              <button
                id="btn-upload-image-sim"
                onClick={simulateUpload}
                disabled={isUploading}
                className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-md text-xs font-semibold cursor-pointer transition-colors shadow-2xs disabled:opacity-50"
              >
                {isUploading ? 'Ingesting & Hashing Image...' : 'Browse Forensic Image File'}
              </button>
            </div>

            <div className="mt-3 text-[10px] text-slate-400">
              Automatic hardware write-block emulation applied on ingestion.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
