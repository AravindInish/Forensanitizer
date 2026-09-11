import React, { useState } from 'react';
import { X, Download, ShieldCheck, Tag, FileText, Check, Copy } from 'lucide-react';
import { RecoveredFile } from '../types';
import { HashBox } from './HashBox';
import { StatusBadge } from './StatusBadge';

interface HexViewerModalProps {
  file: RecoveredFile | null;
  onClose: () => void;
  onToggleEvidence?: (fileId: string, notes?: string) => void;
}

export const HexViewerModal: React.FC<HexViewerModalProps> = ({ file, onClose, onToggleEvidence }) => {
  if (!file) return null;

  const [notes, setNotes] = useState(file.notes || '');
  const [activeTab, setActiveTab] = useState<'hex' | 'preview' | 'metadata'>('hex');
  const [isCopied, setIsCopied] = useState(false);

  // Generate realistic formatted hex lines from the sample
  const renderHexDump = () => {
    const rawHex = file.hexPreviewSample || 'FF D8 FF E0 00 10 4A 46 49 46 00 01 01 01 00 60';
    const bytes = rawHex.split(' ');
    const lines = [];
    const baseOffset = parseInt(file.startOffsetHex.replace('0x', ''), 16) || 0;

    for (let i = 0; i < bytes.length; i += 16) {
      const chunk = bytes.slice(i, i + 16);
      const lineOffset = (baseOffset + i).toString(16).toUpperCase().padStart(8, '0');
      const hexPart = chunk.map((b) => b.padStart(2, '0')).join(' ');
      const asciiPart = chunk
        .map((b) => {
          const code = parseInt(b, 16);
          return code >= 32 && code <= 126 ? String.fromCharCode(code) : '.';
        })
        .join('');

      lines.push({
        offset: lineOffset,
        hex: hexPart.padEnd(48, ' '),
        ascii: asciiPart,
      });
    }

    return lines;
  };

  const hexLines = renderHexDump();

  const handleExport = () => {
    const content = `=== FORENSANITIZER CARVED ARTIFACT ===\nFilename: ${file.filename}\nType: ${file.fileType}\nSHA-256: ${file.sha256}\nStart Offset: ${file.startOffsetHex}\nEnd Offset: ${file.endOffsetHex}\nIntegrity: ${file.integrity}\nConfidence: ${file.confidenceScore}%\nNotes: ${file.notes || 'N/A'}\n\n[HEX STREAM]\n${file.hexPreviewSample || ''}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.filename}.forensic_artifact.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveNotes = () => {
    if (onToggleEvidence) {
      onToggleEvidence(file.id, notes);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div
        id="hex-viewer-modal-container"
        className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-emerald-800 flex items-center justify-center text-emerald-100 font-mono text-xs font-bold">
              HEX
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight font-mono">{file.filename}</span>
                <StatusBadge status={file.integrity} size="sm" />
              </div>
              <div className="text-slate-400 text-xs mt-0.5 flex items-center gap-3">
                <span>Start: {file.startOffsetHex}</span>
                <span>•</span>
                <span>Size: {(file.sizeBytes / 1024).toFixed(1)} KB</span>
                <span>•</span>
                <span>Confidence: {file.confidenceScore}%</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setActiveTab('hex')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                activeTab === 'hex'
                  ? 'bg-white text-emerald-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Raw Sector Hex Dump
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-white text-emerald-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Safe Preview
            </button>
            <button
              onClick={() => setActiveTab('metadata')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                activeTab === 'metadata'
                  ? 'bg-white text-emerald-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Forensic Metadata
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-2.5 py-1 rounded text-xs font-medium cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Artifact</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <HashBox label="Cryptographic Signature" hash={file.sha256} algorithm="SHA-256" />

          {activeTab === 'hex' && (
            <div className="space-y-3">
              <div className="bg-slate-950 text-slate-100 rounded-lg p-4 font-mono text-xs overflow-x-auto shadow-inner border border-slate-800">
                <div className="text-slate-500 border-b border-slate-800 pb-2 mb-2 grid grid-cols-12 gap-2 text-[11px] select-none">
                  <span className="col-span-2 text-emerald-400">OFFSET (HEX)</span>
                  <span className="col-span-7">00 01 02 03 04 05 06 07  08 09 0A 0B 0C 0D 0E 0F</span>
                  <span className="col-span-3 text-right">ASCII DECODED</span>
                </div>
                <div className="space-y-1">
                  {hexLines.map((line, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 hover:bg-slate-900/60 py-0.5 rounded px-1">
                      <span className="col-span-2 text-emerald-400 font-semibold">{line.offset}</span>
                      <span className="col-span-7 tracking-wider text-slate-300">{line.hex}</span>
                      <span className="col-span-3 text-right text-emerald-300/90 font-mono tracking-tight">
                        {line.ascii}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-[11px] text-slate-500 flex items-center justify-between">
                <span>Sector offset: {file.startSector} ({file.startOffsetHex})</span>
                <span>Displaying first 64 carved bytes (Safe Memory Buffer)</span>
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900">
                <span className="font-semibold">Sandboxed Preview:</span> Execution of untrusted binaries and scripts is strictly disabled in compliance with ISO/IEC 27037 digital evidence handling rules.
              </div>

              {file.thumbnailUrl ? (
                <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-200 rounded-lg">
                  <img
                    src={file.thumbnailUrl}
                    alt="Recovered Artifact"
                    className="max-h-64 rounded-md shadow-md object-contain border border-slate-300"
                  />
                  <span className="text-xs text-slate-500 mt-2">Rendered JPEG/PNG bitstream reconstruction</span>
                </div>
              ) : file.textPreviewSample ? (
                <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-xs whitespace-pre-wrap">
                  {file.textPreviewSample}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <FileText className="w-10 h-10 text-slate-400 mx-auto" />
                  <div className="text-sm font-semibold text-slate-700">Safe Binary Stream Container</div>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Binary data streams of type <span className="font-mono font-bold text-slate-800">{file.fileType}</span> are inspected via raw sector bytes to prevent malicious code execution.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'metadata' && (
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="font-semibold text-slate-800">Carving Provenance</div>
                <div className="space-y-1 text-slate-600">
                  <div className="flex justify-between">
                    <span>Carving Algorithm:</span>
                    <span className="font-mono text-slate-900 font-semibold">{file.carvingMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Source Evidence:</span>
                    <span className="font-mono text-slate-900">{file.evidenceFilename}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sector Boundary:</span>
                    <span className="font-mono text-slate-900">Sector {file.startSector}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Carved Timestamp:</span>
                    <span className="font-mono text-slate-900">{file.recoveredAt}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="font-semibold text-slate-800">Integrity Classification</div>
                <div className="space-y-1 text-slate-600">
                  <div className="flex justify-between items-center">
                    <span>Integrity Status:</span>
                    <StatusBadge status={file.integrity} size="sm" />
                  </div>
                  <div className="flex justify-between">
                    <span>ML/Heuristic Confidence:</span>
                    <span className="font-mono font-bold text-emerald-800">{file.confidenceScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Court Evidence Flag:</span>
                    <span className="font-semibold text-slate-900">
                      {file.isMarkedAsEvidence ? 'MARKED FOR ADMISSION' : 'UNMARKED'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Investigator Notes */}
          <div className="border-t border-slate-200 pt-4 space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Investigator Notes / Chain of Custody Remarks:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add forensic notes (e.g. Header verified against court warrant)..."
                className="flex-1 bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
              <button
                onClick={handleSaveNotes}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer shrink-0"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="text-slate-500 font-mono text-[11px]">
            MD5: {file.md5}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-md text-xs font-medium cursor-pointer transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
