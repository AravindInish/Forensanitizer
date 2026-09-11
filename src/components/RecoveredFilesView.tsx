import React, { useState } from 'react';
import {
  FolderArchive,
  Search,
  Filter,
  Download,
  ShieldCheck,
  Eye,
  Binary,
  Tag,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Image as ImageIcon,
  Archive,
  Film,
  Music,
  FileCode,
  SlidersHorizontal,
} from 'lucide-react';
import { RecoveredFile } from '../types';
import { StatusBadge } from './StatusBadge';
import { HexViewerModal } from './HexViewerModal';

interface RecoveredFilesViewProps {
  recoveredFiles: RecoveredFile[];
  onToggleEvidence: (fileId: string, notes?: string) => void;
}

export const RecoveredFilesView: React.FC<RecoveredFilesViewProps> = ({
  recoveredFiles,
  onToggleEvidence,
}) => {
  const [selectedFileForHex, setSelectedFileForHex] = useState<RecoveredFile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [integrityFilter, setIntegrityFilter] = useState('ALL');
  const [evidenceOnlyFilter, setEvidenceOnlyFilter] = useState(false);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);

  // Filter logic
  const filtered = recoveredFiles.filter((f) => {
    if (evidenceOnlyFilter && !f.isMarkedAsEvidence) return false;
    if (typeFilter !== 'ALL' && f.fileType !== typeFilter) return false;
    if (integrityFilter !== 'ALL' && f.integrity !== integrityFilter) return false;
    if (
      searchQuery &&
      !f.filename.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !f.sha256.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !f.startOffsetHex.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const toggleSelectFile = (id: string) => {
    if (selectedFileIds.includes(id)) {
      setSelectedFileIds(selectedFileIds.filter((i) => i !== id));
    } else {
      setSelectedFileIds([...selectedFileIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedFileIds.length === filtered.length) {
      setSelectedFileIds([]);
    } else {
      setSelectedFileIds(filtered.map((f) => f.id));
    }
  };

  const handleBatchMarkEvidence = () => {
    selectedFileIds.forEach((id) => onToggleEvidence(id, 'Batch marked as court evidence.'));
    setSelectedFileIds([]);
  };

  const handleBatchExport = () => {
    const exportedItems = filtered.filter((f) => selectedFileIds.includes(f.id));
    const content = JSON.stringify(exportedItems, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forensic_carved_artifacts_batch_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'JPEG':
      case 'PNG':
        return <ImageIcon className="w-4 h-4 text-emerald-700" />;
      case 'PDF':
      case 'DOCX':
      case 'XLSX':
        return <FileText className="w-4 h-4 text-emerald-800" />;
      case 'ZIP':
        return <Archive className="w-4 h-4 text-amber-700" />;
      case 'MP4':
        return <Film className="w-4 h-4 text-teal-700" />;
      case 'WAV':
        return <Music className="w-4 h-4 text-cyan-700" />;
      default:
        return <FileCode className="w-4 h-4 text-slate-700" />;
    }
  };

  return (
    <div id="recovered-files-browser-view" className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <FolderArchive className="w-5 h-5 text-emerald-800" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Recovered Forensic Artifacts & Evidence Browser
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Displaying carved bitstream artifacts extracted from unallocated sectors with validated SHA-256 signatures.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-950">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>{recoveredFiles.length} TOTAL CARVED ARTIFACTS</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="search-recovered-artifacts"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search filename, SHA-256 hash, or offset (0x...)"
              className="w-full bg-slate-50 border border-slate-300 rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white font-mono"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Type Selector */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1.5 text-slate-800 font-medium focus:border-emerald-600 focus:outline-none text-xs"
            >
              <option value="ALL">All File Types</option>
              <option value="JPEG">JPEG Photos</option>
              <option value="PDF">PDF Documents</option>
              <option value="PNG">PNG Graphics</option>
              <option value="DOCX">Word Documents</option>
              <option value="XLSX">Excel Sheets</option>
              <option value="ZIP">ZIP Archives</option>
              <option value="MP4">MP4 Video</option>
              <option value="SQLITE">SQLite Databases</option>
            </select>

            {/* Integrity Selector */}
            <select
              value={integrityFilter}
              onChange={(e) => setIntegrityFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1.5 text-slate-800 font-medium focus:border-emerald-600 focus:outline-none text-xs"
            >
              <option value="ALL">All Integrities</option>
              <option value="VALID">VALID (Intact Signature)</option>
              <option value="PARTIAL">PARTIAL (Truncated EOF)</option>
              <option value="CORRUPTED">CORRUPTED (Sector Damage)</option>
            </select>

            {/* Evidence Only Toggle */}
            <button
              onClick={() => setEvidenceOnlyFilter(!evidenceOnlyFilter)}
              className={`px-3 py-1.5 rounded-md border font-semibold transition-colors cursor-pointer text-xs ${
                evidenceOnlyFilter
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-slate-50 text-slate-600 border-slate-300 hover:bg-slate-100'
              }`}
            >
              Marked as Evidence Only
            </button>
          </div>
        </div>

        {/* Batch Operations Bar (if any selected) */}
        {selectedFileIds.length > 0 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 flex items-center justify-between text-xs animate-in fade-in">
            <span className="font-semibold text-emerald-950">
              {selectedFileIds.length} artifact(s) selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBatchMarkEvidence}
                className="bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-100 px-3 py-1 rounded font-medium cursor-pointer shadow-2xs"
              >
                Mark as Court Evidence
              </button>
              <button
                onClick={handleBatchExport}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1 rounded font-medium cursor-pointer shadow-2xs"
              >
                Batch Export JSON
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Artifacts Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-8">
                  <input
                    type="checkbox"
                    checked={selectedFileIds.length === filtered.length && filtered.length > 0}
                    onChange={handleSelectAll}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-700 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">Artifact Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Integrity</th>
                <th className="py-3 px-4">Start Offset / Sector</th>
                <th className="py-3 px-4">SHA-256 Hash</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No artifacts match the specified filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((file) => {
                  const isSelected = selectedFileIds.includes(file.id);
                  return (
                    <tr
                      key={file.id}
                      className={`hover:bg-emerald-50/40 transition-colors ${
                        isSelected ? 'bg-emerald-50/50' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectFile(file.id)}
                          className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-700 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(file.fileType)}
                          <span
                            onClick={() => setSelectedFileForHex(file)}
                            className="font-mono font-bold text-slate-900 hover:text-emerald-800 cursor-pointer"
                          >
                            {file.filename}
                          </span>
                          {file.isMarkedAsEvidence && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded font-mono">
                              EVIDENCE
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-800">{file.fileType}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {(file.sizeBytes / 1024).toFixed(0)} KB
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-600 rounded-full"
                              style={{ width: `${file.confidenceScore}%` }}
                            />
                          </div>
                          <span className="font-mono font-bold text-emerald-800 text-[11px]">
                            {file.confidenceScore}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={file.integrity} size="sm" />
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600 text-[11px]">
                        {file.startOffsetHex} (Sec {file.startSector})
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500 text-[11px] truncate max-w-[140px]" title={file.sha256}>
                        {file.sha256.slice(0, 10)}...{file.sha256.slice(-8)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedFileForHex(file)}
                            className="p-1.5 text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                            title="Open Hex Viewer & Safe Inspector"
                          >
                            <Binary className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onToggleEvidence(file.id)}
                            className={`p-1.5 rounded transition-colors cursor-pointer ${
                              file.isMarkedAsEvidence
                                ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                                : 'text-slate-400 hover:text-emerald-700 hover:bg-slate-100'
                            }`}
                            title={file.isMarkedAsEvidence ? 'Unmark Evidence' : 'Mark as Court Evidence'}
                          >
                            <Tag className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hex Modal */}
      {selectedFileForHex && (
        <HexViewerModal
          file={selectedFileForHex}
          onClose={() => setSelectedFileForHex(null)}
          onToggleEvidence={onToggleEvidence}
        />
      )}
    </div>
  );
};
