import React from 'react';
import {
  FolderLock,
  HardDrive,
  FileCheck,
  ShieldCheck,
  ArrowUpRight,
  Plus,
  Play,
  Trash2,
  FileText,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
  PieChart,
  Binary,
  CheckCircle2,
} from 'lucide-react';
import { DashboardStats } from '../types';
import { StatusBadge } from './StatusBadge';
import { NavigationPage } from './Sidebar';

interface DashboardViewProps {
  stats: DashboardStats;
  recentOperations: any[];
  onNavigate: (page: NavigationPage) => void;
  onOpenNewCaseModal: () => void;
  onOpenDemoModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  recentOperations,
  onNavigate,
  onOpenNewCaseModal,
  onOpenDemoModal,
}) => {
  // SVG Chart 1: Recovery Activity Over Time (Clean Green Line + Area Fill)
  const recoveryTrendPoints = [
    { day: 'Mon', count: 4 },
    { day: 'Tue', count: 12 },
    { day: 'Wed', count: 8 },
    { day: 'Thu', count: 24 },
    { day: 'Fri', count: 32 },
    { day: 'Sat', count: 28 },
    { day: 'Sun', count: 45 },
  ];

  // SVG Chart 2: File Types Discovered
  const fileTypeDistribution = [
    { type: 'JPEG/PNG', count: 18, pct: 40, color: '#047857' },
    { type: 'PDF Docs', count: 12, pct: 27, color: '#059669' },
    { type: 'Office XML', count: 8, pct: 18, color: '#10B981' },
    { type: 'Archives (ZIP)', count: 4, pct: 9, color: '#34D399' },
    { type: 'Media/Audio', count: 3, pct: 6, color: '#6EE7B7' },
  ];

  return (
    <div id="dashboard-view" className="space-y-6">
      {/* Top Banner / SIH Overview Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 text-[11px] font-mono font-bold px-2 py-0.5 rounded uppercase">
              SIH Problem Statement SIH26149
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-500 font-medium">Digital Forensics & Data Sanitization Lab</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1 font-sans">
            Forensic Operations Center
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Integrated platform combining hardware-isolated raw sector carving, verified cryptographic sanitization, and
            tamper-evident audit logging conforming to ISO/IEC 27037 and NIST SP 800-88.
          </p>
        </div>

        {/* Quick Actions Header */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            id="btn-quick-create-case"
            onClick={onOpenNewCaseModal}
            className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-md text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Create Case</span>
          </button>
          <button
            id="btn-quick-analyze-image"
            onClick={() => onNavigate('drive-analysis')}
            className="inline-flex items-center gap-1.5 bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-900 px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer shadow-2xs"
          >
            <HardDrive className="w-3.5 h-3.5 text-emerald-700" />
            <span>Analyze Image</span>
          </button>
          <button
            id="btn-quick-start-recovery"
            onClick={() => onNavigate('file-recovery')}
            className="inline-flex items-center gap-1.5 bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-900 px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer shadow-2xs"
          >
            <Binary className="w-3.5 h-3.5 text-emerald-700" />
            <span>Start Recovery</span>
          </button>
          <button
            id="btn-quick-secure-erase"
            onClick={() => onNavigate('drive-eraser')}
            className="inline-flex items-center gap-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer shadow-2xs"
          >
            <Trash2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Secure Erase</span>
          </button>
          <button
            id="btn-quick-generate-report"
            onClick={() => onNavigate('reports')}
            className="inline-flex items-center gap-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Cards (4 Cards requested by prompt) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Cases */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:border-emerald-200 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Cases
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <FolderLock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 font-mono">
              {stats.totalCases}
            </span>
            <span className="inline-flex items-center text-xs font-medium text-emerald-700">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              +12% this month
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Active forensic investigations in registry
          </div>
        </div>

        {/* KPI 2: Active Investigations */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:border-emerald-200 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Investigations
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-emerald-800 font-mono">
              {stats.activeCases}
            </span>
            <span className="text-xs text-slate-500">
              ({stats.totalCases - stats.activeCases} under review)
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Chain of custody actively monitored
          </div>
        </div>

        {/* KPI 3: Files Recovered */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:border-emerald-200 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Files Recovered
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <Binary className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 font-mono">
              {stats.filesRecovered}
            </span>
            <span className="inline-flex items-center text-xs font-medium text-emerald-700">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              +38 new carved
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            {stats.filesSuccessfullyValidated} valid signatures validated
          </div>
        </div>

        {/* KPI 4: Verified Operations */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:border-emerald-200 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Verified Operations
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-emerald-800 font-mono">
              {stats.verificationSuccessRate}%
            </span>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
              PASS
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Zero bit discrepancy across bitstream audits
          </div>
        </div>
      </div>

      {/* Operation Cards (4 major capabilities requested by prompt) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Secure Drive Eraser */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between hover:border-emerald-300 transition-all group">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-800 transition-colors">
                Secure Drive Eraser
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Securely sanitize test media using NIST SP 800-88 and DoD 5220.22-M with zero residual verification.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Ready
            </span>
            <button
              onClick={() => onNavigate('drive-eraser')}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold transition-colors cursor-pointer"
            >
              Start Operation
            </button>
          </div>
        </div>

        {/* Card 2: Advanced File Recovery */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between hover:border-emerald-300 transition-all group">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800">
              <Binary className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-800 transition-colors">
                Advanced File Recovery
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Signature carving engine across raw disk sectors with entropy analysis and automated confidence scoring.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              11 Signatures
            </span>
            <button
              onClick={() => onNavigate('file-recovery')}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold transition-colors cursor-pointer"
            >
              Start Recovery
            </button>
          </div>
        </div>

        {/* Card 3: File & Folder Eraser */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between hover:border-emerald-300 transition-all group">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-800 transition-colors">
                File & Folder Eraser
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Granular shredding of individual files with pre-computation of SHA-256 and physical sector overwrite.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Sandbox Active
            </span>
            <button
              onClick={() => onNavigate('file-eraser')}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold transition-colors cursor-pointer"
            >
              Shred Target
            </button>
          </div>
        </div>

        {/* Card 4: Forensic Drive Analysis */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between hover:border-emerald-300 transition-all group">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-800 transition-colors">
                Forensic Analysis
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Bitstream inspection of .dd, .raw, .img and .E01 forensic images with partition table parsing.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {stats.imagesAnalyzed} Images Loaded
            </span>
            <button
              onClick={() => onNavigate('drive-analysis')}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold transition-colors cursor-pointer"
            >
              Inspect Drive
            </button>
          </div>
        </div>
      </div>

      {/* Forensic Visualizations (Strict Green & White Theme) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Recovery Activity Over Time */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-bold text-slate-900 text-sm">Recovery Activity Over Time</h2>
              <p className="text-xs text-slate-500">Daily carved artifacts detected across active bitstream images</p>
            </div>
            <span className="bg-emerald-50 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded border border-emerald-200">
              Last 7 Days
            </span>
          </div>

          {/* Clean Green Area Chart (SVG) */}
          <div className="h-56 w-full pt-4">
            <svg viewBox="0 0 600 180" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="greenAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="40" y1="20" x2="580" y2="20" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="40" y1="60" x2="580" y2="60" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="40" y1="100" x2="580" y2="100" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="40" y1="140" x2="580" y2="140" stroke="#E2E8F0" strokeWidth="1" />

              {/* Area Path */}
              <path
                d="M 60 155 L 140 125 L 220 138 L 300 85 L 380 50 L 460 65 L 540 25 L 540 140 L 60 140 Z"
                fill="url(#greenAreaGrad)"
              />

              {/* Line */}
              <path
                d="M 60 155 L 140 125 L 220 138 L 300 85 L 380 50 L 460 65 L 540 25"
                fill="none"
                stroke="#047857"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data Points */}
              {[
                { x: 60, y: 155, val: 4, day: 'Mon' },
                { x: 140, y: 125, val: 12, day: 'Tue' },
                { x: 220, y: 138, val: 8, day: 'Wed' },
                { x: 300, y: 85, val: 24, day: 'Thu' },
                { x: 380, y: 50, val: 32, day: 'Fri' },
                { x: 460, y: 65, val: 28, day: 'Sat' },
                { x: 540, y: 25, val: 45, day: 'Sun' },
              ].map((pt, i) => (
                <g key={i}>
                  <circle cx={pt.x} cy={pt.y} r="4" fill="#047857" stroke="#FFFFFF" strokeWidth="2" />
                  <text x={pt.x} y="160" textAnchor="middle" className="text-[10px] fill-slate-400 font-sans">
                    {pt.day}
                  </text>
                  <text x={pt.x} y={pt.y - 10} textAnchor="middle" className="text-[10px] fill-emerald-900 font-mono font-bold">
                    {pt.val}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Chart 2: File Types Discovered */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-bold text-slate-900 text-sm">File Types Discovered</h2>
            <p className="text-xs text-slate-500">Distribution of 45 recovered evidence artifacts</p>
          </div>

          <div className="space-y-3.5 pt-2">
            {fileTypeDistribution.map((item) => (
              <div key={item.type} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">{item.type}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-900 font-semibold">{item.count}</span>
                    <span className="text-slate-400 text-[11px]">({item.pct}%)</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Signature confidence: 97.4% avg</span>
            <button
              onClick={() => onNavigate('recovered-files')}
              className="text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer"
            >
              Browse all artifacts →
            </button>
          </div>
        </div>
      </div>

      {/* Recent Operations Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900 text-sm">Recent Forensic Operations</h2>
            <p className="text-xs text-slate-500">Real-time bitstream carving and sanitization ledger</p>
          </div>
          <button
            onClick={() => onNavigate('audit-logs')}
            className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer"
          >
            View Full Audit Chain →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Operation ID</th>
                <th className="py-3 px-4">Case ID</th>
                <th className="py-3 px-4">Operation</th>
                <th className="py-3 px-4">Input Target</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Integrity</th>
                <th className="py-3 px-4">Operator</th>
                <th className="py-3 px-4">Completed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOperations.map((op) => (
                <tr key={op.id} className="hover:bg-emerald-50/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-slate-900">{op.id}</td>
                  <td className="py-3 px-4 font-mono text-emerald-800 font-medium">{op.caseId}</td>
                  <td className="py-3 px-4 font-medium text-slate-900">{op.operation}</td>
                  <td className="py-3 px-4 font-mono text-slate-600 text-[11px] truncate max-w-[160px]" title={op.input}>
                    {op.input}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={op.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700 text-xs">
                    <span className="text-emerald-700 font-medium">✓ {op.integrity}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{op.operator}</td>
                  <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">{op.completed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
