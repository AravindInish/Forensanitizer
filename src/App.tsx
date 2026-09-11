import React, { useState, useEffect } from 'react';
import { Sidebar, NavigationPage } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { CasesView } from './components/CasesView';
import { DriveAnalysisView } from './components/DriveAnalysisView';
import { SecureDriveEraserView } from './components/SecureDriveEraserView';
import { SecureFileEraserView } from './components/SecureFileEraserView';
import { FileRecoveryView } from './components/FileRecoveryView';
import { RecoveredFilesView } from './components/RecoveredFilesView';
import { FragmentedRecoveryView } from './components/FragmentedRecoveryView';
import { VerificationView } from './components/VerificationView';
import { AuditLogsView } from './components/AuditLogsView';
import { ReportsView } from './components/ReportsView';
import { SettingsAndDocsView } from './components/SettingsAndDocsView';
import { DemoDatasetModal } from './components/DemoDatasetModal';
import { NewCaseModal } from './components/NewCaseModal';

import {
  ForensicCase,
  EvidenceItem,
  RecoveredFile,
  SanitizationJob,
  AuditLogEntry,
  ForensicReport,
  DashboardStats,
} from './types';
import { forensicService } from './services/forensicService';
import { INITIAL_DASHBOARD_STATS } from './data/forensicData';

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState<string>('case-001');

  // Core forensic datasets
  const [cases, setCases] = useState<ForensicCase[]>([]);
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [recoveredFiles, setRecoveredFiles] = useState<RecoveredFile[]>([]);
  const [sanitizations, setSanitizations] = useState<SanitizationJob[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [reports, setReports] = useState<ForensicReport[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>(INITIAL_DASHBOARD_STATS);
  const [recentOperations, setRecentOperations] = useState<any[]>([]);

  // Modals
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);

  // Search filter
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');

  // Initial Data Fetch
  useEffect(() => {
    loadAllForensicData();
  }, []);

  const loadAllForensicData = async () => {
    try {
      const [statsData, casesData, evData, recData, sanData, auditData, repData] =
        await Promise.all([
          forensicService.getDashboardStats(),
          forensicService.getCases(),
          forensicService.getEvidence(),
          forensicService.getRecoveredFiles(),
          forensicService.getSanitizations(),
          forensicService.getAuditLogs(),
          forensicService.getReports(),
        ]);

      if (statsData) {
        setDashboardStats(statsData.stats);
        setRecentOperations(statsData.recentOperations || []);
      }
      if (casesData) setCases(casesData);
      if (evData) setEvidenceList(evData);
      if (recData) setRecoveredFiles(recData);
      if (sanData) setSanitizations(sanData);
      if (auditData) setAuditLogs(auditData.logs);
      if (repData) setReports(repData);
    } catch (err) {
      console.error('Failed to load forensic data:', err);
    }
  };

  const handleCreateCase = async (newCaseData: Partial<ForensicCase>) => {
    const created = await forensicService.createCase(newCaseData);
    setCases([created, ...cases]);
    setSelectedCaseId(created.id);
    // reload stats
    const statsData = await forensicService.getDashboardStats();
    if (statsData) setDashboardStats(statsData.stats);
  };

  const handleImportEvidence = async (data: any) => {
    const ev = await forensicService.importEvidence(data);
    setEvidenceList([ev, ...evidenceList]);
    setCurrentPage('drive-analysis');
  };

  const handleToggleEvidenceFlag = async (fileId: string, notes?: string) => {
    const updated = await forensicService.markFileAsEvidence(fileId, notes);
    if (updated) {
      setRecoveredFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, isMarkedAsEvidence: updated.isMarkedAsEvidence, notes: updated.notes } : f))
      );
    }
  };

  const handleSanitizationCreated = (job: SanitizationJob) => {
    setSanitizations([job, ...sanitizations]);
    // update recent operations
    setRecentOperations((prev) => [
      {
        id: `OP-${job.id.toUpperCase()}`,
        caseId: job.caseId || 'CASE-2026-001',
        operation: job.method,
        input: job.targetIdentifier,
        status: 'Verified',
        started: job.startedAt,
        completed: job.completedAt || 'Now',
        integrity: 'Zero Residual',
        operator: job.operator,
      },
      ...prev,
    ]);
  };

  const handleRecoveryFinished = (newFiles: RecoveredFile[]) => {
    setRecoveredFiles((prev) => [...newFiles, ...prev]);
  };

  const handleReportCreated = (report: ForensicReport) => {
    setReports([report, ...reports]);
  };

  const handleSelectDriveForRecovery = (evidenceId: string) => {
    setCurrentPage('file-recovery');
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden antialiased">
      {/* Left Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onSelectPage={(page) => setCurrentPage(page)}
        evidenceCount={evidenceList.length}
        recoveredCount={recoveredFiles.length}
        onGenerateDemo={() => setIsDemoModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation */}
        <Navbar
          cases={cases}
          selectedCaseId={selectedCaseId}
          onSelectCaseId={(id) => setSelectedCaseId(id)}
          onSearch={(term) => setGlobalSearchTerm(term)}
          onOpenDemoModal={() => setIsDemoModalOpen(true)}
        />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {currentPage === 'dashboard' && (
              <DashboardView
                stats={dashboardStats}
                recentOperations={recentOperations}
                onNavigate={(page) => setCurrentPage(page)}
                onOpenNewCaseModal={() => setIsNewCaseModalOpen(true)}
                onOpenDemoModal={() => setIsDemoModalOpen(true)}
              />
            )}

            {currentPage === 'cases' && (
              <CasesView
                cases={cases}
                selectedCaseId={selectedCaseId}
                onSelectCase={(id) => setSelectedCaseId(id)}
                evidence={evidenceList}
                recoveredFiles={recoveredFiles}
                sanitizations={sanitizations}
                auditLogs={auditLogs}
                reports={reports}
                onOpenNewCaseModal={() => setIsNewCaseModalOpen(true)}
              />
            )}

            {currentPage === 'drive-analysis' && (
              <DriveAnalysisView
                evidenceList={evidenceList}
                onImportEvidence={handleImportEvidence}
                onSelectForRecovery={handleSelectDriveForRecovery}
              />
            )}

            {currentPage === 'drive-eraser' && (
              <SecureDriveEraserView
                sanitizationJobs={sanitizations}
                onJobCreated={handleSanitizationCreated}
              />
            )}

            {currentPage === 'file-eraser' && (
              <SecureFileEraserView
                onFileSanitized={handleSanitizationCreated}
              />
            )}

            {currentPage === 'file-recovery' && (
              <FileRecoveryView
                evidenceList={evidenceList}
                selectedEvidenceId={evidenceList[0]?.id || ''}
                onSelectEvidenceId={() => {}}
                onRecoveryFinished={handleRecoveryFinished}
                onNavigateToRecoveredFiles={() => setCurrentPage('recovered-files')}
              />
            )}

            {currentPage === 'recovered-files' && (
              <RecoveredFilesView
                recoveredFiles={recoveredFiles}
                onToggleEvidence={handleToggleEvidenceFlag}
              />
            )}

            {currentPage === 'fragment-recovery' && (
              <FragmentedRecoveryView />
            )}

            {currentPage === 'verification' && (
              <VerificationView />
            )}

            {currentPage === 'audit-logs' && (
              <AuditLogsView auditLogs={auditLogs} />
            )}

            {currentPage === 'reports' && (
              <ReportsView
                reports={reports}
                cases={cases}
                onReportCreated={handleReportCreated}
              />
            )}

            {(currentPage === 'settings' || currentPage === 'docs') && (
              <SettingsAndDocsView />
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <DemoDatasetModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onGenerated={loadAllForensicData}
      />

      <NewCaseModal
        isOpen={isNewCaseModalOpen}
        onClose={() => setIsNewCaseModalOpen(false)}
        onSubmit={handleCreateCase}
      />
    </div>
  );
}
