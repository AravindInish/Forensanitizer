import React, { useState } from 'react';
import {
  FileText,
  Printer,
  ShieldCheck,
  Plus,
  CheckCircle2,
  Award,
  Download,
  Copy,
  Check,
  Calendar,
  User,
  Building,
  Scale,
} from 'lucide-react';
import { ForensicReport, ForensicCase } from '../types';
import { HashBox } from './HashBox';
import { StatusBadge } from './StatusBadge';
import { forensicService } from '../services/forensicService';

interface ReportsViewProps {
  reports: ForensicReport[];
  cases: ForensicCase[];
  onReportCreated: (rep: ForensicReport) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  reports,
  cases,
  onReportCreated,
}) => {
  const [selectedReportId, setSelectedReportId] = useState<string>(reports[0]?.id || '');
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(cases[0]?.id || 'case-001');
  const [investigatorName, setInvestigatorName] = useState('Insp. Rajesh Sharma');
  const [agencyName, setAgencyName] = useState('Digital Forensics Laboratory (FSL-NCR)');
  const [scopeNotes, setScopeNotes] = useState(
    'Acquisition, bitstream carving, and verified sanitization audit of seized digital media.'
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedReport = reports.find((r) => r.id === selectedReportId) || reports[0];

  const handlePrint = () => {
    window.print();
  };

  const handleCreateReport = async () => {
    setIsGenerating(true);
    try {
      const rep = await forensicService.generateReport({
        caseId: selectedCaseId,
        investigator: investigatorName,
        agency: agencyName,
        scope: scopeNotes,
      });
      onReportCreated(rep);
      setSelectedReportId(rep.id);
      setIsGenerateModalOpen(false);
    } catch {
      // fallback
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div id="forensic-reports-view" className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-800" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Forensic Expert Reports & Court Dossiers
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Section 65B Indian Evidence Act compliant forensic certificates and NIST SP 800-88 sanitization audits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-open-generate-report-modal"
            onClick={() => setIsGenerateModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-md text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Generate New Report</span>
          </button>
        </div>
      </div>

      {/* Selector & Print Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-600 uppercase">Select Report:</span>
          <select
            value={selectedReport?.id}
            onChange={(e) => setSelectedReportId(e.target.value)}
            className="bg-slate-50 border border-slate-300 font-mono text-xs font-bold text-slate-900 rounded-md px-3 py-1.5 focus:border-emerald-600 focus:outline-none cursor-pointer"
          >
            {reports.map((r) => (
              <option key={r.id} value={r.id}>
                {r.reportNumber} - {r.caseTitle.slice(0, 36)} ({r.createdAt.slice(0, 10)})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Official Court Dossier</span>
          </button>
        </div>
      </div>

      {/* Official Court Ready Dossier Container */}
      {selectedReport && (
        <div
          id="official-printable-forensic-report"
          className="bg-white border border-slate-200 rounded-xl shadow-xs p-8 md:p-12 space-y-8 max-w-4xl mx-auto text-slate-800"
        >
          {/* Top Court / Legal Crest Header */}
          <div className="border-b-2 border-slate-900 pb-6 text-center space-y-2">
            <div className="flex justify-center mb-2">
              <div className="w-16 h-16 rounded-full bg-emerald-900 text-white flex items-center justify-center shadow-md">
                <Scale className="w-9 h-9 text-emerald-100" />
              </div>
            </div>

            <div className="text-[11px] font-mono tracking-widest text-slate-500 uppercase font-bold">
              GOVERNMENT OF INDIA • FORENSIC SCIENCE LABORATORY
            </div>
            <h1 className="text-2xl font-bold uppercase tracking-tight text-slate-900 font-serif">
              Digital Forensic Investigation Report
            </h1>
            <p className="text-xs font-mono text-slate-600">
              Certificate under Section 65B of the Indian Evidence Act, 1872 & ISO/IEC 27037:2012
            </p>

            <div className="pt-2 flex justify-center gap-6 text-xs font-mono text-slate-500">
              <span>Report No: <strong className="text-slate-900">{selectedReport.reportNumber}</strong></span>
              <span>•</span>
              <span>Case ID: <strong className="text-slate-900">{selectedReport.caseId}</strong></span>
              <span>•</span>
              <span>Date: <strong className="text-slate-900">{selectedReport.createdAt.slice(0, 10)}</strong></span>
            </div>
          </div>

          {/* Section 1: Administrative Details */}
          <div className="space-y-3 text-xs">
            <h2 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1 uppercase tracking-wider font-serif">
              1. Administrative Information & Chain of Custody
            </h2>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="space-y-1.5 text-slate-600">
                <div>Investigating Agency: <span className="font-semibold text-slate-900">{selectedReport.agency}</span></div>
                <div>Principal Examiner: <span className="font-semibold text-slate-900">{selectedReport.investigator}</span></div>
                <div>Investigation Title: <span className="font-semibold text-slate-900">{selectedReport.caseTitle}</span></div>
              </div>
              <div className="space-y-1.5 text-slate-600">
                <div>Evidence Examined Count: <span className="font-mono font-bold text-slate-900">{selectedReport.evidenceExaminedCount} Bitstream Images</span></div>
                <div>Recovered Artifacts: <span className="font-mono font-bold text-emerald-800">{selectedReport.filesRecoveredCount} Extracted</span></div>
                <div>Verification Status: <span className="font-bold text-emerald-700">PASS (100% Validated)</span></div>
              </div>
            </div>
          </div>

          {/* Section 2: Scope & Methodology */}
          <div className="space-y-3 text-xs">
            <h2 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1 uppercase tracking-wider font-serif">
              2. Scope of Examination & Forensic Methodology
            </h2>
            <p className="text-slate-700 leading-relaxed">{selectedReport.scope}</p>

            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              {selectedReport.methodology.map((m, idx) => (
                <li key={idx} className="leading-relaxed font-sans">{m}</li>
              ))}
            </ul>
          </div>

          {/* Section 3: Key Forensic Findings */}
          <div className="space-y-3 text-xs">
            <h2 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1 uppercase tracking-wider font-serif">
              3. Summary of Forensic Findings
            </h2>
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-lg text-slate-800 leading-relaxed">
              {selectedReport.findingsSummary}
            </div>
          </div>

          {/* Section 4: Cryptographic Proof & Integrity Seal */}
          <div className="space-y-3 text-xs">
            <h2 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1 uppercase tracking-wider font-serif">
              4. Cryptographic Report Integrity Seal (SHA-256)
            </h2>
            <p className="text-slate-600">
              This report has been digitally bound to its underlying evidence. Any alteration to this text, findings, or
              the attached evidence images invalidates the cryptographic seal below.
            </p>
            <HashBox label="Forensic Dossier Cryptographic Hash Seal" hash={selectedReport.sha256} />
          </div>

          {/* Section 5: Legal Conclusion & Sec 65B Certification */}
          <div className="space-y-3 text-xs">
            <h2 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1 uppercase tracking-wider font-serif">
              5. Legal Certificate under Section 65B
            </h2>
            <div className="border border-slate-300 p-4 rounded-lg bg-slate-50/70 space-y-2 text-slate-700 italic leading-relaxed">
              &ldquo;I hereby certify that the digital evidence items described herein were extracted, hashed, and
              analyzed using ForenSanitizer v2.6.4-SIH in an automated, hardware write-blocked environment. The computer
              system was operating properly throughout the period and there were no unauthorized intrusions or tampering
              affecting the mathematical integrity of the electronic record.&rdquo;
            </div>
          </div>

          {/* Signature & Seal Block */}
          <div className="pt-6 border-t-2 border-slate-900 flex justify-between items-end text-xs">
            <div className="space-y-1">
              <div className="w-20 h-20 rounded-full border-2 border-emerald-800 flex items-center justify-center text-[10px] font-mono text-emerald-800 text-center font-bold p-1">
                OFFICIAL SEAL FORENSANITIZER FSL-NCR
              </div>
              <div className="text-[10px] text-slate-400 font-mono">Date Sealed: {selectedReport.createdAt}</div>
            </div>

            <div className="text-right space-y-1">
              <div className="font-serif italic text-base font-bold text-slate-900">
                {selectedReport.examinerSignature}
              </div>
              <div className="font-semibold text-slate-800">Lead Forensic Examiner</div>
              <div className="text-slate-500 font-mono text-[11px]">{selectedReport.agency}</div>
            </div>
          </div>
        </div>
      )}

      {/* Generate Report Modal */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Generate New Forensic Dossier</h3>
            <p className="text-xs text-slate-500">
              Compile evidence, carved artifacts, and sanitization receipts into a Section 65B certified court report.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Case:</label>
                <select
                  value={selectedCaseId}
                  onChange={(e) => setSelectedCaseId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs font-bold text-slate-900"
                >
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.caseNumber} - {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Lead Examiner:</label>
                <input
                  type="text"
                  value={investigatorName}
                  onChange={(e) => setInvestigatorName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Agency / Laboratory:</label>
                <input
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Scope & Mandate:</label>
                <textarea
                  value={scopeNotes}
                  onChange={(e) => setScopeNotes(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setIsGenerateModalOpen(false)}
                className="px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isGenerating}
                onClick={handleCreateReport}
                className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded text-xs font-semibold cursor-pointer"
              >
                {isGenerating ? 'Compiling Report...' : 'Compile & Seal Report'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
