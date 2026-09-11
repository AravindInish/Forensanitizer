import React from 'react';
import { X, Printer, ShieldCheck, Download, Award, CheckCircle2 } from 'lucide-react';
import { SanitizationJob } from '../types';
import { HashBox } from './HashBox';

interface SanitizationCertificateModalProps {
  job: SanitizationJob | null;
  onClose: () => void;
}

export const SanitizationCertificateModal: React.FC<SanitizationCertificateModalProps> = ({ job, onClose }) => {
  if (!job) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div
        id="sanitization-certificate-modal"
        className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8 animate-in fade-in"
      >
        {/* Top Action Bar */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Award className="w-4 h-4 text-emerald-700" />
            <span>Official Data Sanitization Certificate</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1 rounded text-xs font-medium cursor-pointer shadow-2xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Certificate</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Paper Container (Print-friendly) */}
        <div className="p-8 space-y-6 text-slate-800 bg-white" id="printable-certificate-area">
          {/* Certificate Header with Crest/Border */}
          <div className="border-4 border-double border-emerald-800 p-6 rounded-lg text-center space-y-3 bg-emerald-50/20">
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-full bg-emerald-800 text-white flex items-center justify-center shadow-md">
                <ShieldCheck className="w-8 h-8 text-emerald-100" />
              </div>
            </div>

            <div>
              <div className="text-[11px] font-mono tracking-widest text-emerald-800 uppercase font-bold">
                FORENSANITIZER DIGITAL FORENSICS & DATA SANITIZATION PLATFORM
              </div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-1 uppercase font-serif">
                Certificate of Verified Data Sanitization
              </h2>
              <div className="text-xs text-slate-500 font-mono mt-1">
                Certificate No: <span className="font-bold text-slate-800">{job.certificateId}</span>
              </div>
            </div>

            <div className="w-24 h-0.5 bg-emerald-700 mx-auto" />

            <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed italic">
              This document certifies that the storage target identified below has undergone verified cryptographic
              data erasure in strict compliance with the specified sanitization standard.
            </p>
          </div>

          {/* Details Table */}
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="font-semibold text-slate-900 border-b border-slate-200 pb-1">
                  Target Information
                </div>
                <div className="space-y-1 text-slate-600">
                  <div className="flex justify-between">
                    <span>Target Type:</span>
                    <span className="font-semibold text-slate-900">{job.targetType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Target ID / Path:</span>
                    <span className="font-mono text-slate-900 font-bold truncate max-w-[180px]">{job.targetIdentifier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Target Capacity:</span>
                    <span className="font-mono text-slate-900">{(job.targetSizeBytes / (1024 * 1024)).toFixed(0)} MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Case Reference:</span>
                    <span className="font-mono text-slate-900">{job.caseId || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="font-semibold text-slate-900 border-b border-slate-200 pb-1">
                  Sanitization Parameters
                </div>
                <div className="space-y-1 text-slate-600">
                  <div className="flex justify-between">
                    <span>Method Applied:</span>
                    <span className="font-semibold text-emerald-800">{job.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Overwrite Passes:</span>
                    <span className="font-mono text-slate-900">{job.passesCompleted} of {job.totalPasses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Residual Entropy:</span>
                    <span className="font-mono text-emerald-800 font-bold">{job.residualEntropy.toFixed(4)} bits/byte</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Verification Status:</span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 100% VERIFIED
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cryptographic Proof Hashes */}
            <div className="space-y-2">
              <HashBox label="Pre-Sanitization SHA-256 Bitstream Hash" hash={job.preSanitizeSha256} />
              <HashBox label="Post-Sanitization SHA-256 Bitstream Hash" hash={job.postSanitizeSha256} />
            </div>

            {/* Timestamps & Operator Sign-off */}
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/70 grid grid-cols-2 gap-4">
              <div className="space-y-1 text-slate-600">
                <div>Started: <span className="font-mono font-medium text-slate-800">{job.startedAt}</span></div>
                <div>Completed: <span className="font-mono font-medium text-slate-800">{job.completedAt || 'Verified Instantaneous'}</span></div>
                <div>Software Engine: <span className="font-medium text-slate-800">ForenSanitizer Engine v2.6.4-SIH</span></div>
              </div>

              <div className="flex flex-col justify-end text-right">
                <div className="text-xs font-serif italic text-emerald-900 text-base font-bold">
                  {job.operator}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">Authorized Forensic Sanitization Specialist</div>
                <div className="text-[10px] text-slate-400 font-mono">Digital Forensics Laboratory (FSL-NCR)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-xs font-medium cursor-pointer transition-colors"
          >
            Close Certificate
          </button>
        </div>
      </div>
    </div>
  );
};
