import React from 'react';
import {
  LayoutDashboard,
  FolderLock,
  HardDrive,
  Trash2,
  FileMinus,
  Binary,
  FolderArchive,
  Split,
  ShieldCheck,
  ScrollText,
  FileText,
  Sliders,
  HelpCircle,
  Shield,
  Sparkles,
} from 'lucide-react';

export type NavigationPage =
  | 'dashboard'
  | 'cases'
  | 'drive-analysis'
  | 'drive-eraser'
  | 'file-eraser'
  | 'file-recovery'
  | 'recovered-files'
  | 'fragment-recovery'
  | 'verification'
  | 'audit-logs'
  | 'reports'
  | 'settings'
  | 'docs';

interface SidebarProps {
  currentPage: NavigationPage;
  onSelectPage: (page: NavigationPage) => void;
  evidenceCount?: number;
  recoveredCount?: number;
  onGenerateDemo: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  evidenceCount = 5,
  recoveredCount = 45,
  onGenerateDemo,
}) => {
  const navGroups = [
    {
      title: 'OPERATIONS',
      items: [
        { id: 'dashboard' as NavigationPage, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'cases' as NavigationPage, label: 'Case Management', icon: FolderLock },
        { id: 'drive-analysis' as NavigationPage, label: 'Drive Analysis', icon: HardDrive, badge: evidenceCount },
      ],
    },
    {
      title: 'SANITIZATION ENGINE',
      items: [
        { id: 'drive-eraser' as NavigationPage, label: 'Secure Drive Eraser', icon: Trash2 },
        { id: 'file-eraser' as NavigationPage, label: 'Secure File Eraser', icon: FileMinus },
      ],
    },
    {
      title: 'FORENSIC RECOVERY',
      items: [
        { id: 'file-recovery' as NavigationPage, label: 'File Carving Engine', icon: Binary },
        { id: 'recovered-files' as NavigationPage, label: 'Recovered Artifacts', icon: FolderArchive, badge: recoveredCount },
        { id: 'fragment-recovery' as NavigationPage, label: 'Fragment Reconstruction', icon: Split, tag: 'AI' },
      ],
    },
    {
      title: 'INTEGRITY & COMPLIANCE',
      items: [
        { id: 'verification' as NavigationPage, label: 'Verification Engine', icon: ShieldCheck },
        { id: 'audit-logs' as NavigationPage, label: 'Audit Logs (Chained)', icon: ScrollText },
        { id: 'reports' as NavigationPage, label: 'Forensic Reports', icon: FileText },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'settings' as NavigationPage, label: 'Settings & Standards', icon: Sliders },
        { id: 'docs' as NavigationPage, label: 'SIH Documentation', icon: HelpCircle },
      ],
    },
  ];

  return (
    <aside
      id="sidebar-navigation"
      className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 h-screen sticky top-0 select-none z-30"
    >
      {/* Brand Header */}
      <div className="h-16 border-b border-slate-200 flex items-center px-4 gap-3">
        <div className="w-10 h-10 rounded-lg bg-emerald-800 flex items-center justify-center text-white shadow-sm shrink-0">
          <Shield className="w-5 h-5 text-emerald-100 stroke-[2.2]" />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-900 tracking-tight text-base font-sans leading-none">
              ForenSanitizer
            </span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono font-semibold px-1 py-0.2 rounded">
              SIH
            </span>
          </div>
          <span className="text-[11px] text-slate-500 truncate mt-0.5">
            Forensics & Data Erasure
          </span>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 text-xs">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <div className="px-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              {group.title}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = currentPage === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    onClick={() => onSelectPage(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md transition-all font-medium text-left cursor-pointer group ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-900 font-semibold border-l-3 border-emerald-700 shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-emerald-800' : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      />
                      <span className="truncate text-xs">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {item.tag && (
                        <span className="bg-teal-100 text-teal-800 text-[9px] font-mono px-1 py-0.2 rounded uppercase font-semibold">
                          {item.tag}
                        </span>
                      )}
                      {typeof item.badge === 'number' && (
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                            isActive
                              ? 'bg-emerald-200/70 text-emerald-900 font-semibold'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Demo Generation CTA */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/50">
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-900">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>SIH Live Demo Mode</span>
          </div>
          <p className="text-[11px] text-emerald-800/80 leading-snug">
            Generate synthetic forensic images & simulated bad sectors for live presentation.
          </p>
          <button
            id="btn-sidebar-generate-demo"
            onClick={onGenerateDemo}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-1.5 px-2 rounded text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-3 h-3" />
            <span>Generate Demo Image</span>
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 px-1 font-mono">
          <span>SEC-GUARD: ENFORCED</span>
          <span>v2.6.4</span>
        </div>
      </div>
    </aside>
  );
};
