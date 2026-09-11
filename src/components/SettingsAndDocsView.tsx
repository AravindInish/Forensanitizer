import React from 'react';
import {
  HelpCircle,
  Shield,
  FileCheck,
  Scale,
  Award,
  Layers,
  Binary,
  Trash2,
  Lock,
  Cpu,
  Download,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';

export const SettingsAndDocsView: React.FC = () => {
  return (
    <div id="settings-and-docs-view" className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-800" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Platform Architecture & SIH26149 Compliance Specifications
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official technical documentation, algorithmic specifications, and legal admissibility frameworks.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-950">
          <Award className="w-4 h-4 text-emerald-700" />
          <span>SMART INDIA HACKATHON 2026 PROTOTYPE</span>
        </div>
      </div>

      {/* SIH Problem Statement Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-800 text-white font-mono text-xs font-bold px-2.5 py-1 rounded">
              PROBLEM STATEMENT SIH26149
            </span>
            <span className="text-xs text-slate-500 font-medium">Cybersecurity / Digital Forensics</span>
          </div>
          <span className="text-xs text-emerald-800 font-mono font-bold">Category: Software</span>
        </div>

        <h2 className="text-base font-bold text-slate-900 leading-snug">
          Design and Development of an Integrated Secure Data Erasure and Advanced File Recovery Tool for Digital
          Forensics and Data Sanitization
        </h2>

        <p className="text-xs text-slate-600 leading-relaxed">
          Modern digital forensic investigators and enterprise security professionals require unified tooling capable of
          recovering critical evidentiary artifacts from unallocated and damaged sectors, while also providing certified
          cryptographic sanitization tools to safely decommission storage media without risking information leakage.
          ForenSanitizer unites both capabilities with tamper-evident audit logging and legal court admissibility.
        </p>
      </div>

      {/* Core Architectural Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Pillar 1: Secure Sanitization */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
            <Trash2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">1. Secure Data Sanitization</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Multi-standard overwrite engine conforming to <strong className="text-slate-900">NIST SP 800-88 Rev. 1 Clear</strong> and{' '}
            <strong className="text-slate-900">DoD 5220.22-M</strong>. Evaluates post-erase Shannon entropy (target: 0.0000 bits/byte)
            and generates cryptographic certificates.
          </p>
          <ul className="text-[11px] text-slate-500 space-y-1 list-disc pl-4">
            <li>Zero-fill & Random-fill schemes</li>
            <li>Wear-leveling aware SSD guidance</li>
            <li>Physical sector verification pass</li>
          </ul>
        </div>

        {/* Pillar 2: File Recovery */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
            <Binary className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">2. Advanced File Carving</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Bitstream carver scanning unallocated clusters and slack space for magic byte header/footer boundaries
            (JPEGs, PDFs, DOCX, ZIPs, SQLITE).
          </p>
          <ul className="text-[11px] text-slate-500 space-y-1 list-disc pl-4">
            <li>Pluggable signature matrix</li>
            <li>Bi-gram fragment continuity reconstruction</li>
            <li>Safe sandbox hex & ASCII inspection</li>
          </ul>
        </div>

        {/* Pillar 3: Chain of Custody */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">3. Tamper-Evident Ledger</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Recursive SHA-256 hash chaining guarantees that no audit entry can be altered without invalidating the entire
            subsequent ledger, meeting <strong className="text-slate-900">Section 65B Indian Evidence Act</strong> evidentiary standards.
          </p>
          <ul className="text-[11px] text-slate-500 space-y-1 list-disc pl-4">
            <li>ISO/IEC 27037:2012 compliance</li>
            <li>Automated cryptographic report seal</li>
            <li>Hardware write-block verification</li>
          </ul>
        </div>
      </div>

      {/* Standards & Certifications Reference */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
        <h2 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
          Regulatory Standards & Algorithmic Specifications
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900">NIST Special Publication 800-88 Revision 1</div>
            <p className="text-slate-600 leading-relaxed">
              Guidelines for Media Sanitization. Categorizes Clear (logical overwrite of all addressable locations), Purge
              (executing internal controller commands), and Destroy (physical degaussing/incineration).
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900">ISO/IEC 27037:2012</div>
            <p className="text-slate-600 leading-relaxed">
              Guidelines for identification, collection, acquisition, and preservation of digital evidence to maintain
              evidentiary integrity and court admissibility.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900">Section 65B, Indian Evidence Act (1872)</div>
            <p className="text-slate-600 leading-relaxed">
              Admissibility of electronic records. Requires certification identifying the electronic record and
              describing the manner in which it was produced by a properly functioning computer system.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900">DoD 5220.22-M (NISP Operating Manual)</div>
            <p className="text-slate-600 leading-relaxed">
              United States Department of Defense National Industrial Security Program clearing standard requiring 3-pass
              overwrite: 0x00, 0xFF, and pseudo-random characters followed by read-verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
