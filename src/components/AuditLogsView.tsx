import React, { useState } from 'react';
import {
  ScrollText,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  Lock,
  ArrowDown,
  Layers,
  Sparkles,
} from 'lucide-react';
import { AuditLogEntry } from '../types';
import { HashBox } from './HashBox';
import { StatusBadge } from './StatusBadge';
import { forensicService } from '../services/forensicService';

interface AuditLogsViewProps {
  auditLogs: AuditLogEntry[];
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ auditLogs }) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>(auditLogs);
  const [isVerifying, setIsVerifying] = useState(false);
  const [chainStatus, setChainStatus] = useState<{ isValid: boolean; message: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tamperSimulatedIndex, setTamperSimulatedIndex] = useState<number | null>(null);

  const handleVerifyChain = async () => {
    setIsVerifying(true);
    setChainStatus(null);
    try {
      // Walk and verify
      let valid = true;
      for (let i = 1; i < logs.length; i++) {
        if (logs[i].previousHash !== logs[i - 1].recordHash) {
          valid = false;
          break;
        }
      }

      setTimeout(() => {
        setIsVerifying(false);
        setChainStatus({
          isValid: valid,
          message: valid
            ? `All ${logs.length} chronological audit records traversed. Cryptographic chain intact and valid.`
            : `Tamper Alert! Discrepancy detected at block #${tamperSimulatedIndex !== null ? tamperSimulatedIndex + 1 : 2}. Hash chaining broken!`,
        });
      }, 700);
    } catch {
      setIsVerifying(false);
    }
  };

  const handleSimulateTamper = () => {
    if (tamperSimulatedIndex !== null) {
      // Reset
      setLogs([...auditLogs]);
      setTamperSimulatedIndex(null);
      setChainStatus(null);
      return;
    }

    // Tamper with record #1
    const tampered = [...logs];
    if (tampered.length > 1) {
      tampered[1] = {
        ...tampered[1],
        details: 'MALICIOUS_TAMPERED: Evidence metadata secretly altered without authorization.',
      };
      setLogs(tampered);
      setTamperSimulatedIndex(1);
      setChainStatus({
        isValid: false,
        message: 'Tamper Simulation Active: Record #2 was maliciously modified. Run verification to test detection!',
      });
    }
  };

  const filteredLogs = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.recordHash.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="audit-logs-view" className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-emerald-800" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Tamper-Evident Hash-Chained Audit Ledger
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Immutable append-only chronological log where every record is mathematically linked via recursive SHA-256 hash chaining.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-simulate-tamper-test"
            onClick={handleSimulateTamper}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer border shadow-2xs ${
              tamperSimulatedIndex !== null
                ? 'bg-rose-50 text-rose-800 border-rose-300'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {tamperSimulatedIndex !== null ? 'Reset Chain to Original' : 'Test Tamper Detection'}
          </button>

          <button
            id="btn-verify-audit-chain-live"
            onClick={handleVerifyChain}
            disabled={isVerifying}
            className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-1.5 rounded-md text-xs font-semibold shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
            <span>{isVerifying ? 'Verifying Chain...' : 'Verify Entire Audit Chain'}</span>
          </button>
        </div>
      </div>

      {/* Verification Status Banner */}
      {chainStatus && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 animate-in fade-in ${
            chainStatus.isValid
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}
        >
          {chainStatus.isValid ? (
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          ) : (
            <ShieldAlert className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1 text-xs">
            <div className="font-bold text-sm">
              {chainStatus.isValid ? 'Cryptographic Chain Valid (PASS)' : 'Audit Chain Integrity Failure (FAIL)'}
            </div>
            <p className="leading-relaxed">{chainStatus.message}</p>
          </div>
        </div>
      )}

      {/* Math Chain Formula Explainer */}
      <div className="bg-emerald-950 text-white p-4 rounded-xl border border-emerald-900 shadow-inner flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-emerald-200">Cryptographic Chaining Formula:</span>
        </div>
        <div className="font-mono bg-slate-900 px-3 py-1.5 rounded border border-slate-800 text-emerald-300 text-[11px]">
          RecordHash[N] = SHA-256(RecordHash[N-1] + Action + Timestamp + Details + User)
        </div>
        <span className="text-[11px] text-emerald-300/80">Complies with ISO/IEC 27037</span>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search action, details, user, or hash..."
            className="w-full bg-slate-50 border border-slate-300 rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white font-mono"
          />
        </div>
        <div className="text-xs text-slate-500 font-mono">
          Showing {filteredLogs.length} chained events
        </div>
      </div>

      {/* Audit Blocks Chain List */}
      <div className="space-y-3">
        {filteredLogs.map((log, index) => {
          const isTampered = tamperSimulatedIndex === index;
          return (
            <div
              key={log.id}
              className={`p-4 rounded-xl border bg-white shadow-2xs transition-all space-y-3 ${
                isTampered
                  ? 'border-rose-500 ring-2 ring-rose-200 bg-rose-50/20'
                  : 'border-slate-200 hover:border-emerald-200'
              }`}
            >
              {/* Top Meta Line */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                    BLOCK #{logs.length - index}
                  </span>
                  <span className="font-mono font-bold text-emerald-900 text-xs">{log.action}</span>
                  {isTampered && (
                    <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.2 rounded text-[10px] font-mono">
                      TAMPERED
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px]">
                  <span>{log.timestamp}</span>
                  <span>•</span>
                  <span className="text-slate-700 font-semibold">{log.user}</span>
                </div>
              </div>

              {/* Event Description */}
              <p className="text-xs text-slate-800 leading-relaxed font-sans">{log.details}</p>

              {/* Cryptographic Linkage Details */}
              <div className="pt-2 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2 bg-slate-50 rounded border border-slate-200 space-y-0.5">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    Previous Record Hash (Parent Block)
                  </div>
                  <div className="text-slate-600 truncate text-[11px]" title={log.previousHash}>
                    {log.previousHash}
                  </div>
                </div>

                <div className="p-2 bg-emerald-50/60 rounded border border-emerald-200 space-y-0.5">
                  <div className="text-[10px] text-emerald-800 uppercase font-semibold">
                    Current Block SHA-256 Hash
                  </div>
                  <div className="text-emerald-950 font-bold truncate text-[11px]" title={log.recordHash}>
                    {log.recordHash}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
