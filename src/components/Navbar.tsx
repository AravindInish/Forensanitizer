import React, { useState } from 'react';
import {
  Search,
  Bell,
  ShieldCheck,
  FolderLock,
  ChevronDown,
  User,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { ForensicCase } from '../types';

interface NavbarProps {
  cases: ForensicCase[];
  selectedCaseId: string;
  onSelectCaseId: (id: string) => void;
  onSearch: (term: string) => void;
  onOpenDemoModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cases,
  selectedCaseId,
  onSelectCaseId,
  onSearch,
  onOpenDemoModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const notifications = [
    {
      id: 'notif-1',
      title: 'Evidence Bitstream Verified',
      desc: 'seized_sandisk_ultra_32gb.raw SHA-256 matches warrant manifest.',
      time: '12m ago',
      type: 'success',
    },
    {
      id: 'notif-2',
      title: 'Sanitization Certificate Issued',
      desc: 'NIST SP 800-88 Clear completed on SAS sample LUN 0.',
      time: '45m ago',
      type: 'info',
    },
    {
      id: 'notif-3',
      title: 'Fragment Reconstruction Available',
      desc: 'OpenXML document reconstructed with 94% continuity.',
      time: '1h ago',
      type: 'warning',
    },
  ];

  return (
    <header
      id="top-navigation-bar"
      className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20"
    >
      {/* Left section: Case Selector & Search */}
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        {/* Case Selector Dropdown */}
        <div className="relative flex items-center">
          <div className="flex items-center gap-2 bg-emerald-50/80 border border-emerald-200 text-emerald-950 px-3 py-1.5 rounded-md text-xs font-medium">
            <FolderLock className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
              Active Case:
            </span>
            <select
              id="case-selector-dropdown"
              value={selectedCaseId}
              onChange={(e) => onSelectCaseId(e.target.value)}
              className="bg-transparent font-semibold text-emerald-900 border-none outline-none cursor-pointer pr-4 focus:ring-0 text-xs"
            >
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.caseNumber} - {c.title.slice(0, 32)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Global Forensic Search */}
        <div className="relative flex-1 max-w-md hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="global-forensic-search-input"
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search artifacts, SHA-256 hashes, offsets, sectors..."
            className="w-full bg-slate-50 border border-slate-200 rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all font-mono"
          />
        </div>
      </div>

      {/* Right Section: System Guard, Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* Hardware Write Block / Read-Only Guard Indicator */}
        <div
          id="system-guard-status"
          className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md text-xs"
          title="Digital Evidence Read-Only Guard: All original images mounted as read-only bitstreams."
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>FORENSIC READ-ONLY GUARD</span>
          </div>
          <span className="text-[10px] text-emerald-800 font-mono bg-emerald-100 px-1 py-0.2 rounded font-semibold">
            ENFORCED
          </span>
        </div>

        {/* SIH Quick Action */}
        <button
          id="btn-nav-demo-trigger"
          onClick={onOpenDemoModal}
          className="hidden sm:flex items-center gap-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 font-medium px-2.5 py-1.5 rounded-md text-xs transition-colors cursor-pointer"
          title="Generate synthetic forensic dataset for Smart India Hackathon jury review"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          <span>Demo Data</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            id="btn-notifications-toggle"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-md hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            title="System Audit & Forensics Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-600 rounded-full" />
          </button>

          {showNotifications && (
            <div
              id="notifications-dropdown-menu"
              className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs z-50 animate-in fade-in"
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="font-semibold text-slate-900">Forensic Event Alerts</span>
                <span className="text-[11px] text-emerald-700 font-medium cursor-pointer">
                  Mark all read
                </span>
              </div>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2 rounded bg-slate-50 border border-slate-100 space-y-0.5">
                    <div className="flex items-center justify-between font-medium text-slate-900">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-tight">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200 mx-1" />

        {/* Examiner Profile Chip */}
        <div className="flex items-center gap-2 pl-1">
          <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 font-bold text-xs">
            RS
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="font-semibold text-slate-900 text-xs leading-none">
              Insp. Rajesh Sharma
            </span>
            <span className="text-[10px] text-slate-500 font-mono mt-0.5">
              CERT-In / FSL Lead
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
