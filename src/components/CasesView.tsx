import React, { useState } from 'react';
import {
  FolderLock,
  Plus,
  Search,
  HardDrive,
  Binary,
  ScrollText,
  FileText,
  Clock,
  User,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Calendar,
  Tag,
  AlertCircle,
  Hash,
  ExternalLink,
} from 'lucide-react';
import { ForensicCase, EvidenceItem, RecoveredFile, SanitizationJob, AuditLogEntry, ForensicReport } from '../types';
import { StatusBadge } from './StatusBadge';
import { HashBox } from './HashBox';

interface CasesViewProps {
  cases: ForensicCase[];
  selectedCaseId: string;
  onSelectCase: (caseId: string) => void;
  evidence: EvidenceItem[];
  recoveredFiles: RecoveredFile[];
  sanitizations: SanitizationJob[];
  auditLogs: AuditLogEntry[];
  reports: ForensicReport[];
  onOpenNewCaseModal: () => void;
}

export const CasesView: React.FC<CasesViewProps> = ({
  cases,
  selectedCaseId,
  onSelectCase,
  evidence,
  recoveredFiles,
  sanitizations,
  auditLogs,
  reports,
  onOpenNewCaseModal,
}) => {
  const [activeCaseDetailId, setActiveCaseDetailId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'evidence' | 'recovered' | 'audit' | 'reports'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const currentCase = cases.find((c) => c.id === (activeCaseDetailId || selectedCaseId)) || cases[0];

  const filteredCases = cases.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.investigator.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const caseEvidence = evidence.filter((e) => e.caseId === currentCase.id);
  const caseRecovered = recoveredFiles.filter((f) => f.caseId === currentCase.id);
  const caseAudits = auditLogs.filter(
    (a) => a.caseId === currentCase.caseNumber || a.caseId === currentCase.id
  );
  const caseReports = reports.filter((r) => r.caseId === currentCase.id);

  return (
    <div id="cases-view-container" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <FolderLock className="w-5 h-5 text-emerald-800" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Case Management Registry</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Forensic investigation dossier tracking with chain of custody verification and evidence encapsulation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter cases..."
              className="bg-slate-50 border border-slate-200 rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>
          <button
            id="btn-create-case-action"
            onClick={onOpenNewCaseModal}
            className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-md text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Case</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Cases List & Selected Case Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Cases List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
            <span>REGISTERED CASES ({filteredCases.length})</span>
            <span>STATUS</span>
          </div>

          <div className="space-y-2">
            {filteredCases.map((c) => {
              const isSelected = c.id === currentCase.id;
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    setActiveCaseDetailId(c.id);
                    onSelectCase(c.id);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-emerald-50/40 border-emerald-600 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-emerald-900 bg-emerald-100/70 px-2 py-0.5 rounded">
                      {c.caseNumber}
                    </span>
                    <StatusBadge status={c.status} size="sm" />
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{c.title}</h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{c.description}</p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      <span className="truncate max-w-[120px]">{c.investigator.split(' ')[0]} {c.investigator.split(' ')[1]}</span>
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <HardDrive className="w-3 h-3 text-slate-400" />
                      <span>{c.evidenceCount} items</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Case Details & Dossier (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden flex flex-col">
          {/* Dossier Header */}
          <div className="p-6 border-b border-slate-200 bg-slate-50/50 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-emerald-800 text-white px-2.5 py-1 rounded">
                  {currentCase.caseNumber}
                </span>
                <span className="text-xs text-slate-500 font-mono">Priority: {currentCase.priority}</span>
              </div>
              <StatusBadge status={currentCase.status} />
            </div>

            <h2 className="text-lg font-bold text-slate-900">{currentCase.title}</h2>

            <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">{currentCase.description}</p>

            {/* Investigator & Agency Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                <div className="text-slate-400 text-[10px] uppercase font-semibold">Lead Examiner</div>
                <div className="font-semibold text-slate-900 mt-0.5">{currentCase.investigator}</div>
              </div>
              <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                <div className="text-slate-400 text-[10px] uppercase font-semibold">Agency / Division</div>
                <div className="font-semibold text-slate-900 mt-0.5">{currentCase.agency}</div>
              </div>
              <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                <div className="text-slate-400 text-[10px] uppercase font-semibold">Case Opened</div>
                <div className="font-mono text-slate-900 mt-0.5">{currentCase.createdAt.slice(0, 10)}</div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {currentCase.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-slate-100 text-slate-600 text-[11px] px-2 py-0.5 rounded-full font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Dossier Tabs */}
          <div className="border-b border-slate-200 px-6 flex items-center gap-4 text-xs font-medium bg-white">
            {[
              { id: 'overview', label: 'Chain of Custody Timeline' },
              { id: 'evidence', label: `Evidence Images (${caseEvidence.length})` },
              { id: 'recovered', label: `Recovered Files (${caseRecovered.length})` },
              { id: 'audit', label: `Audit Trail (${caseAudits.length})` },
              { id: 'reports', label: `Reports (${caseReports.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 border-b-2 font-semibold transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-emerald-700 text-emerald-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Area */}
          <div className="p-6 flex-1 overflow-y-auto">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Chain of Custody & Analytical Lifecycle:
                </div>

                {/* Vertical Timeline */}
                <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-200">
                  <div className="relative">
                    <span className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-emerald-700 border-2 border-white shadow-xs" />
                    <div className="text-xs font-bold text-slate-900">Case Registered in Legal Ledger</div>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">{currentCase.createdAt}</p>
                    <p className="text-xs text-slate-600 mt-1">
                      Assigned to {currentCase.investigator}. Evidentiary custody initiated with court order endorsement.
                    </p>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-emerald-700 border-2 border-white shadow-xs" />
                    <div className="text-xs font-bold text-slate-900">Hardware Write-Blocked Image Ingestion</div>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">2026-09-08 10:00:00</p>
                    <p className="text-xs text-slate-600 mt-1">
                      Bitstream raw image mounted via read-only bridge. Initial SHA-256 acquisition hash generated and locked.
                    </p>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-emerald-700 border-2 border-white shadow-xs" />
                    <div className="text-xs font-bold text-slate-900">Deep Signature Carving Executed</div>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">2026-09-08 15:40:00</p>
                    <p className="text-xs text-slate-600 mt-1">
                      Multi-signature extraction completed on unallocated clusters. Identified {caseRecovered.length} candidate artifacts.
                    </p>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-emerald-700 border-2 border-white shadow-xs" />
                    <div className="text-xs font-bold text-slate-900">Audit Trail Chaining & Report Sealed</div>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">2026-09-10 16:30:00</p>
                    <p className="text-xs text-slate-600 mt-1">
                      Tamper-evident SHA-256 cryptographic chain validated. Forensic Report RPT-2026-001 sealed.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'evidence' && (
              <div className="space-y-4">
                {caseEvidence.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    No evidence images assigned to this case yet.
                  </div>
                ) : (
                  caseEvidence.map((ev) => (
                    <div key={ev.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <HardDrive className="w-4 h-4 text-emerald-700" />
                          <span className="font-mono font-bold text-xs text-slate-900">{ev.filename}</span>
                          <span className="text-[11px] font-mono text-slate-500">
                            ({(ev.sizeBytes / (1024 * 1024 * 1024)).toFixed(2)} GB)
                          </span>
                        </div>
                        <StatusBadge status={ev.status} size="sm" />
                      </div>

                      <HashBox label="Acquisition Hash (SHA-256)" hash={ev.sha256} />

                      <div className="grid grid-cols-3 gap-2 text-slate-600 text-[11px]">
                        <div>Sectors: <span className="font-mono text-slate-900">{ev.totalSectors.toLocaleString()}</span></div>
                        <div>Filesystem: <span className="font-semibold text-slate-900">{ev.partitions[0]?.filesystem || 'FAT32'}</span></div>
                        <div>Protection: <span className="text-emerald-700 font-semibold">Hardware Locked</span></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'recovered' && (
              <div className="space-y-2">
                <div className="text-xs text-slate-500 mb-2">
                  Showing {caseRecovered.length} carved artifacts belonging to {currentCase.caseNumber}:
                </div>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                  {caseRecovered.slice(0, 8).map((f) => (
                    <div key={f.id} className="p-3 bg-white flex items-center justify-between text-xs hover:bg-slate-50">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-semibold text-slate-900">{f.filename}</span>
                        <span className="text-slate-400 font-mono text-[11px]">{f.fileType}</span>
                        <span className="text-slate-400 font-mono text-[11px]">{(f.sizeBytes / 1024).toFixed(0)} KB</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-emerald-800 text-[11px]">{f.confidenceScore}% conf</span>
                        <StatusBadge status={f.integrity} size="sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'audit' && (
              <div className="space-y-2">
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden text-xs">
                  {caseAudits.map((a) => (
                    <div key={a.id} className="p-3 bg-white space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-900 font-mono">{a.action}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{a.timestamp}</span>
                      </div>
                      <p className="text-slate-600 text-xs">{a.details}</p>
                      <div className="text-[10px] font-mono text-slate-400">
                        Record Hash: {a.recordHash.slice(0, 32)}...
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="space-y-3">
                {caseReports.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">No reports compiled yet.</div>
                ) : (
                  caseReports.map((r) => (
                    <div key={r.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50/60 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-emerald-700" />
                          <span className="font-bold text-slate-900 font-mono">{r.reportNumber}</span>
                        </div>
                        <StatusBadge status={r.status} size="sm" />
                      </div>
                      <p className="text-slate-600">{r.findingsSummary}</p>
                      <HashBox label="Cryptographic Report Seal" hash={r.sha256} />
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
