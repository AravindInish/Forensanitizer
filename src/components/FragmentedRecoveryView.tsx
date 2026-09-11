import React, { useState } from 'react';
import {
  Split,
  Binary,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Download,
  Info,
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { HashBox } from './HashBox';

export const FragmentedRecoveryView: React.FC = () => {
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>(['FRAG-001', 'FRAG-003', 'FRAG-006']);
  const [isReconstructing, setIsReconstructing] = useState(false);
  const [reconstructResult, setReconstructResult] = useState<any>(null);

  const fragments = [
    {
      id: 'FRAG-001',
      type: 'PDF Header Chunk',
      startLBA: 14208,
      sizeBytes: 8192,
      entropy: 7.62,
      sampleBytes: '25 50 44 46 2D 31 2E 37 0A 25 E2 E3 CF D3',
      role: 'HEADER',
    },
    {
      id: 'FRAG-002',
      type: 'JPEG DCT Stream Chunk',
      startLBA: 18432,
      sizeBytes: 16384,
      entropy: 7.98,
      sampleBytes: 'FF D8 FF E0 00 10 4A 46 49 46 00 01 01 01',
      role: 'BODY_CONTIGUOUS',
    },
    {
      id: 'FRAG-003',
      type: 'Deflate Compressed Stream B',
      startLBA: 22528,
      sizeBytes: 32768,
      entropy: 7.85,
      sampleBytes: '78 9C 63 60 18 05 A3 60 14 8C 54 82 2D 00',
      role: 'BODY_STREAM',
    },
    {
      id: 'FRAG-004',
      type: 'Slack Noise / Corrupted Zeroes',
      startLBA: 28672,
      sizeBytes: 4096,
      entropy: 1.24,
      sampleBytes: '00 00 00 00 00 00 00 00 00 00 00 00 00 00',
      role: 'UNALLOCATED_SLACK',
    },
    {
      id: 'FRAG-005',
      type: 'MPEG-4 Audio Sample Buffer',
      startLBA: 34816,
      sizeBytes: 8192,
      entropy: 6.42,
      sampleBytes: '00 00 00 20 66 74 79 70 6D 70 34 32 00 00',
      role: 'MEDIA_CONTAINER',
    },
    {
      id: 'FRAG-006',
      type: 'PDF xref & %%EOF Trailer',
      startLBA: 42112,
      sizeBytes: 4096,
      entropy: 5.18,
      sampleBytes: '78 72 65 66 0A 30 20 31 32 0A 25 25 45 4F 46',
      role: 'TRAILER',
    },
  ];

  const candidateChains = [
    {
      chain: 'FRAG-001 → FRAG-003 → FRAG-006',
      targetType: 'Court_Affidavit_Scanned_Signed.pdf',
      continuityScore: 94.2,
      confidence: 'HIGH',
      entropyDelta: 0.12,
      validTrailer: true,
      selected: true,
    },
    {
      chain: 'FRAG-001 → FRAG-005 → FRAG-006',
      targetType: 'Court_Affidavit_Scanned_Signed.pdf',
      continuityScore: 82.4,
      confidence: 'MEDIUM',
      entropyDelta: 1.44,
      validTrailer: true,
      selected: false,
    },
    {
      chain: 'FRAG-002 → FRAG-003 → FRAG-004',
      targetType: 'Unknown Binary Composite',
      continuityScore: 41.0,
      confidence: 'LOW',
      entropyDelta: 3.82,
      validTrailer: false,
      selected: false,
    },
  ];

  const handleReconstruct = () => {
    setIsReconstructing(true);
    setTimeout(() => {
      setIsReconstructing(false);
      setReconstructResult({
        filename: 'RECONSTRUCTED_Court_Affidavit_Signed.pdf',
        sizeBytes: 45056,
        sha256: '9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e',
        fragmentsStitched: 3,
        continuityVerification: 'VALID_DEFLATE_STREAM',
        crcCheck: 'PASS',
      });
    }, 1200);
  };

  return (
    <div id="fragmented-recovery-view" className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Split className="w-5 h-5 text-emerald-800" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Advanced Fragment Reconstruction Engine (AI / Bi-Gram Continuity)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Reconstruct non-contiguous file streams across scattered disk sectors using entropy continuity and semantic bi-gram analysis.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-950">
          <Sparkles className="w-4 h-4 text-emerald-700" />
          <span>SMART CONTINUITY AI RANKING</span>
        </div>
      </div>

      {/* The Fragmentation Challenge Explanation */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
        <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-700" />
          <span>The Forensics Challenge: Solving Discontinuous Sector Carving</span>
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
          Standard file carving engines assume files occupy contiguous physical sectors. When storage media becomes
          fragmented, header magic bytes are found at Sector 14,208, but the body jump lands at Sector 22,528, and the
          %%EOF trailer lands at Sector 42,112. ForenSanitizer evaluates Shannon entropy gradients and header/footer
          compression dictionary continuities to reassemble fragmented files with cryptographic verification.
        </p>

        {/* Visual Fragment Map */}
        <div className="pt-2">
          <div className="text-[11px] font-mono text-slate-500 mb-1 font-semibold">
            Reconstructed Logical Cluster Chain:
          </div>
          <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-900 rounded-lg text-xs font-mono text-white">
            <div className="px-2.5 py-1 rounded bg-emerald-800 border border-emerald-600">
              Header Chunk (LBA 14,208)
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="px-2.5 py-1 rounded bg-emerald-800 border border-emerald-600">
              Deflate Stream (LBA 22,528)
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="px-2.5 py-1 rounded bg-emerald-800 border border-emerald-600">
              %%EOF Trailer (LBA 42,112)
            </div>
            <span className="ml-auto text-emerald-400 font-bold text-[11px]">
              ✓ Complete PDF Structure (94.2% Match)
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Fragment Pool & Candidate Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Isolated Fragment Candidates Matrix (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>Isolated Unallocated Sector Fragments</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">{fragments.length} Candidates Found</span>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {fragments.map((frag) => {
              const isSelected = selectedCandidates.includes(frag.id);
              return (
                <div
                  key={frag.id}
                  onClick={() => {
                    if (selectedCandidates.includes(frag.id)) {
                      setSelectedCandidates(selectedCandidates.filter((i) => i !== frag.id));
                    } else {
                      setSelectedCandidates([...selectedCandidates, frag.id]);
                    }
                  }}
                  className={`p-3 rounded-lg border text-xs transition-colors cursor-pointer space-y-1.5 ${
                    isSelected
                      ? 'bg-emerald-50/70 border-emerald-300'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-mono font-bold text-slate-900">
                      <span className="bg-slate-100 px-1.5 py-0.2 rounded text-[11px] text-slate-700">
                        {frag.id}
                      </span>
                      <span>{frag.type}</span>
                    </div>
                    <span className="font-mono text-[11px] text-emerald-800 font-bold">
                      Entropy: {frag.entropy.toFixed(2)} bits/byte
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Start LBA: {frag.startLBA.toLocaleString()}</span>
                    <span>Size: {(frag.sizeBytes / 1024).toFixed(0)} KB</span>
                    <span className="text-slate-700 font-semibold">{frag.role}</span>
                  </div>

                  <div className="bg-slate-950 text-emerald-400 font-mono text-[10px] p-1.5 rounded truncate">
                    Hex: {frag.sampleBytes}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Reconstruction Ranking & Assembly (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
              <Zap className="w-4 h-4 text-emerald-700" />
              <span>Continuity Ranking & Stitching</span>
            </h2>

            <div className="space-y-3">
              {candidateChains.map((cand, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-lg border text-xs space-y-2 transition-all cursor-pointer ${
                    cand.selected
                      ? 'bg-emerald-50/70 border-emerald-400 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{cand.targetType}</span>
                    <span
                      className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                        cand.continuityScore > 90
                          ? 'bg-emerald-100 text-emerald-900'
                          : cand.continuityScore > 70
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-rose-100 text-rose-900'
                      }`}
                    >
                      {cand.continuityScore}% Match
                    </span>
                  </div>

                  <div className="font-mono text-[11px] text-slate-600 bg-white p-1.5 rounded border border-slate-200">
                    {cand.chain}
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Entropy Δ: {cand.entropyDelta}</span>
                    <span>Trailer Check: {cand.validTrailer ? '✓ Valid' : '✗ Truncated'}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              id="btn-reconstruct-fragment"
              onClick={handleReconstruct}
              disabled={isReconstructing}
              className="w-full bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-md text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isReconstructing ? 'Reconstructing Streams...' : 'Stitch & Reconstruct Fragment Chain'}</span>
            </button>
          </div>

          {/* Reconstructed Outcome */}
          {reconstructResult && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 space-y-3 shadow-2xs animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <span className="font-bold text-emerald-950 text-sm">
                  Fragment Successfully Reconstructed
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-700">
                <div className="font-mono font-bold text-slate-900">{reconstructResult.filename}</div>
                <div className="text-[11px] text-slate-500">
                  Size: {(reconstructResult.sizeBytes / 1024).toFixed(0)} KB | Stitched Fragments: {reconstructResult.fragmentsStitched}
                </div>
              </div>

              <HashBox label="Cryptographic Verification Hash" hash={reconstructResult.sha256} />

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => alert('Exporting reconstructed forensic file into evidence vault.')}
                  className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded text-xs font-semibold cursor-pointer shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Reconstructed File</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
