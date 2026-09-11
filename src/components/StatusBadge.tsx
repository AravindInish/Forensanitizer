import React from 'react';
import { CheckCircle2, AlertCircle, XCircle, Clock, Loader2, ShieldCheck, ShieldAlert } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = (status || '').toUpperCase().trim();

  let bgClasses = 'bg-slate-100 text-slate-700 border-slate-200';
  let Icon = Clock;

  switch (normalized) {
    case 'VERIFIED':
    case 'VALID':
    case 'COMPLETED':
    case 'ACTIVE':
    case 'PASS':
    case 'FINAL_VERIFIED':
    case 'SUCCESS':
      bgClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200';
      Icon = CheckCircle2;
      break;
    case 'RUNNING':
    case 'CARVING':
    case 'PROCESSING':
      bgClasses = 'bg-teal-50 text-teal-800 border-teal-200';
      Icon = Loader2;
      break;
    case 'PENDING':
    case 'PARTIAL':
    case 'UNDER_REVIEW':
    case 'NEW':
    case 'DRAFT':
      bgClasses = 'bg-amber-50 text-amber-800 border-amber-200';
      Icon = AlertCircle;
      break;
    case 'FAILED':
    case 'CORRUPTED':
    case 'FAIL':
    case 'INVALID':
    case 'DAMAGED':
      bgClasses = 'bg-rose-50 text-rose-800 border-rose-200';
      Icon = XCircle;
      break;
    case 'ANALYZED':
      bgClasses = 'bg-blue-50 text-blue-800 border-blue-200';
      Icon = ShieldCheck;
      break;
    case 'UNKNOWN':
    case 'UNVERIFIED':
      bgClasses = 'bg-slate-100 text-slate-700 border-slate-200';
      Icon = ShieldAlert;
      break;
  }

  const isSpinning = normalized === 'RUNNING' || normalized === 'CARVING' || normalized === 'PROCESSING';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-full ${
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      } ${bgClasses}`}
    >
      <Icon className={`${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} ${isSpinning ? 'animate-spin' : ''}`} />
      <span className="tracking-wide">{normalized}</span>
    </span>
  );
};
