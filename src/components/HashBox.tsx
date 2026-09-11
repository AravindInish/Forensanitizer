import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface HashBoxProps {
  label?: string;
  hash: string;
  algorithm?: 'SHA-256' | 'MD5' | 'SHA-1';
  truncate?: boolean;
}

export const HashBox: React.FC<HashBoxProps> = ({
  label = 'SHA-256',
  hash,
  algorithm,
  truncate = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayHash = truncate && hash.length > 28
    ? `${hash.slice(0, 14)}...${hash.slice(-14)}`
    : hash;

  return (
    <div className="flex flex-col gap-1 w-full max-w-full">
      {label && (
        <div className="flex items-center justify-between text-xs font-semibold text-emerald-900 tracking-wide uppercase">
          <span>{label} {algorithm ? `(${algorithm})` : ''}</span>
          <span className="text-[11px] text-slate-500 font-mono lowercase">verified bitstream</span>
        </div>
      )}
      <div className="flex items-center justify-between bg-emerald-50/70 border border-emerald-200/80 rounded-md px-2.5 py-1.5 text-xs transition-colors hover:bg-emerald-50">
        <span
          className="font-mono text-emerald-950 select-all break-all pr-2 tracking-tight"
          title={hash}
        >
          {displayHash}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 bg-white border border-emerald-200 hover:border-emerald-300 px-2 py-0.5 rounded text-[11px] font-medium shadow-2xs transition-all shrink-0 cursor-pointer"
          title="Copy cryptographic hash"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-600" />
              <span className="text-emerald-700 font-semibold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
