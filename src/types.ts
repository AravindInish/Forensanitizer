export type CaseStatus = 'ACTIVE' | 'ARCHIVED' | 'CLOSED' | 'UNDER_REVIEW';

export interface ForensicCase {
  id: string;
  caseNumber: string;
  title: string;
  investigator: string;
  agency: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: CaseStatus;
  evidenceCount: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  tags: string[];
}

export type FileSystemType = 'FAT32' | 'NTFS' | 'EXT4' | 'exFAT' | 'RAW';
export type EvidenceFormat = '.dd' | '.img' | '.raw' | '.bin' | '.E01';

export interface DiskPartition {
  index: number;
  name: string;
  filesystem: FileSystemType;
  startSector: number;
  endSector: number;
  sizeBytes: number;
  status: 'ACTIVE' | 'DAMAGED' | 'UNALLOCATED';
}

export interface EvidenceItem {
  id: string;
  caseId: string;
  filename: string;
  originalName: string;
  format: EvidenceFormat;
  sizeBytes: number;
  sha256: string;
  md5: string;
  sha1?: string;
  createdAt: string;
  importedAt: string;
  readOnlyLocked: boolean;
  sourceDevice: string;
  sectorSize: number;
  clusterSize: number;
  totalSectors: number;
  usedSpaceBytes: number;
  freeSpaceBytes: number;
  deletedEntriesCount: number;
  partitions: DiskPartition[];
  status: 'VERIFIED' | 'ANALYZED' | 'CARVING' | 'NEW';
  notes?: string;
}

export type FileTypeCategory =
  | 'JPEG'
  | 'PNG'
  | 'GIF'
  | 'PDF'
  | 'ZIP'
  | 'DOCX'
  | 'XLSX'
  | 'MP3'
  | 'WAV'
  | 'MP4'
  | 'TXT'
  | 'UNKNOWN';

export type IntegrityStatus = 'VALID' | 'PARTIAL' | 'CORRUPTED' | 'UNKNOWN';

export interface RecoveredFile {
  id: string;
  caseId: string;
  evidenceId: string;
  evidenceFilename: string;
  filename: string;
  fileType: FileTypeCategory;
  mimeType: string;
  sizeBytes: number;
  startOffsetHex: string;
  endOffsetHex: string;
  startSector: number;
  confidenceScore: number; // 0 - 100%
  integrity: IntegrityStatus;
  sha256: string;
  md5: string;
  recoveredAt: string;
  carvingMethod: 'HEADER_FOOTER_SIGNATURE' | 'ENTROPY_ANALYSIS' | 'FRAGMENT_STITCHING' | 'HEURISTIC_CLUSTER';
  isMarkedAsEvidence: boolean;
  notes?: string;
  hexPreviewSample?: string;
  textPreviewSample?: string;
  thumbnailUrl?: string;
  fragmentCount?: number;
}

export interface FileSignatureDefinition {
  id?: string;
  fileType: FileTypeCategory;
  name?: string;
  extension: string;
  headerSignatureHex: string;
  headerHex?: string;
  footerSignatureHex?: string;
  footerHex?: string;
  minSizeBytes: number;
  maxSizeBytes: number;
  description: string;
  mimeType: string;
  confidenceScore?: number;
  enabled?: boolean;
  category: 'IMAGE' | 'DOCUMENT' | 'ARCHIVE' | 'AUDIO' | 'VIDEO' | 'CODE';
}

export type SanitizationMethod =
  | 'NIST_800_88_CLEAR'
  | 'DOD_5220_22_M'
  | 'NIST_800_88_PURGE'
  | 'GUTMANN_35_PASS'
  | 'ZERO_FILL_SINGLE_PASS'
  | 'ZERO_FILL'
  | 'RANDOM_FILL'
  | 'ATA_SECURE_ERASE'
  | 'NVME_CRYPTOGRAPHIC_ERASE';

export interface SanitizationJob {
  id: string;
  caseId?: string;
  targetType: 'DISK_IMAGE' | 'SANDBOX_PARTITION' | 'FILE' | 'FOLDER';
  targetIdentifier: string;
  targetSizeBytes: number;
  method: SanitizationMethod;
  passesCompleted: number;
  totalPasses: number;
  preSanitizeSha256: string;
  postSanitizeSha256: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'VERIFIED';
  verificationStatus: 'PASS' | 'FAIL' | 'UNVERIFIED';
  residualEntropy: number; // 0.00 to 8.00 (Zero fill gives 0.00 entropy)
  startedAt: string;
  completedAt?: string;
  operator: string;
  certificateId: string;
  notes?: string;
  isSSDOrNVMeNoteAcknowledged: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  sequenceNumber: number;
  operator: string;
  caseId?: string;
  action: string;
  category: 'CASE' | 'EVIDENCE' | 'CARVING' | 'SANITIZATION' | 'VERIFICATION' | 'REPORT' | 'SECURITY';
  target: string;
  inputHash?: string;
  outputHash?: string;
  previousRecordHash: string;
  recordHash: string;
  result: 'SUCCESS' | 'WARNING' | 'FAILURE';
  softwareVersion: string;
  details: string;
}

export interface FragmentCandidate {
  id: string;
  sourceFile: string;
  fragmentLabel: string;
  offsetHex: string;
  sizeBytes: number;
  entropy: number;
  headerSignature: string;
  footerSignature?: string;
  continuityScore: number;
  compressionMatchScore: number;
  recommendedNextId?: string;
  stitchScore: number;
}

export interface ForensicReport {
  id: string;
  reportNumber: string;
  caseId: string;
  caseTitle: string;
  investigator: string;
  agency: string;
  createdAt: string;
  sha256: string;
  scope: string;
  evidenceExaminedCount: number;
  filesRecoveredCount: number;
  sanitizationOperationsCount: number;
  methodology: string[];
  findingsSummary: string;
  conclusion: string;
  examinerSignature: string;
  status: 'DRAFT' | 'FINAL_VERIFIED';
}

export interface DashboardStats {
  totalCases: number;
  activeCases: number;
  imagesAnalyzed: number;
  filesRecovered: number;
  filesSuccessfullyValidated: number;
  sanitizationOperations: number;
  verificationSuccessRate: number;
  totalStorageProcessedMB: number;
}
