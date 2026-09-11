import React, { useState } from 'react';
import { Sparkles, CheckCircle2, Loader2, Database, Shield, X, ArrowRight } from 'lucide-react';
import { forensicService } from '../services/forensicService';

interface DemoDatasetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerated: () => void;
}

export const DemoDatasetModal: React.FC<DemoDatasetModalProps> = ({ isOpen, onClose, onGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [datasetLabel, setDatasetLabel] = useState('SIH26149_USB_Evidence_Synthetic_01.raw');

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const data = await forensicService.generateDemoDataset('Insp. Rajesh Sharma');
      setResult(data);
      onGenerated();
    } catch {
      // fallback
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div
        id="demo-dataset-generator-modal"
        className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95"
      >
        {/* Modal Header */}
        <div className="bg-emerald-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-700/80 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight">SIH26149 Forensic Demo Dataset Generator</h3>
              <p className="text-emerald-100 text-xs mt-0.5">
                Generate safe synthetic disk images for live jury presentation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-3.5 text-xs space-y-2 text-emerald-950">
            <div className="font-semibold flex items-center gap-1.5 text-emerald-900">
              <Shield className="w-4 h-4 text-emerald-700" />
              <span>Forensic Safety Architecture Guarantee:</span>
            </div>
            <p className="leading-relaxed text-slate-700">
              In accordance with SIH Problem Statement safety specifications, ForenSanitizer executes all destructive
              and deep-carve operations within virtualized disk containers. Real physical drives are never modified
              automatically.
            </p>
          </div>

          {!result ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Synthetic Dataset Identifier:
                </label>
                <input
                  type="text"
                  value={datasetLabel}
                  onChange={(e) => setDatasetLabel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-2">
                <div className="text-xs font-semibold text-slate-700">Dataset Composition Elements:</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    <span>Deleted JPEG / EXIF Photos</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    <span>Deleted PDF Court Filings</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    <span>OpenXML Word / Excel Archives</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Fragmented Multi-Cluster Streams</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>Corrupted Headers & Slack Noise</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>FAT32 Directory Entry Residues</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-emerald-950 text-sm">Synthetic Dataset Ready for Carving</div>
                  <p className="text-xs text-emerald-900 leading-relaxed">
                    Virtual bitstream mounted into read-only forensic repository. Hashes calculated and audit log
                    updated.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-lg font-bold text-slate-900 font-mono">10,000</div>
                  <div className="text-[11px] text-slate-500 font-medium">Sectors Scanned</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-lg font-bold text-emerald-700 font-mono">2,184</div>
                  <div className="text-[11px] text-slate-500 font-medium">Candidates Found</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-lg font-bold text-emerald-800 font-mono">1,624</div>
                  <div className="text-[11px] text-slate-500 font-medium">Valid Signatures</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {result ? 'Done' : 'Cancel'}
          </button>

          {!result ? (
            <button
              id="btn-confirm-generate-dataset"
              type="button"
              disabled={isGenerating}
              onClick={handleGenerate}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-md text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing Sectors...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Dataset</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View in Drive Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
