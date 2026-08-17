import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { getDefaultPath } from "./utils/rolePermissions";
import { lazy, Suspense } from "react";

// Auth pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import NotFoundPage from "./pages/Common/NotFoundPage";

// ── Public Portal (no login required) ──
const PublicLayout = lazy(() => import("./pages/Public/PublicLayout"));
const DataPortalHome = lazy(() => import("./pages/Public/DataPortalHome"));
const AdmissionLookup = lazy(() => import("./pages/Public/AdmissionLookup"));
const ScoreCalculator = lazy(() => import("./pages/Public/ScoreCalculator"));
const OnlineApplication = lazy(() => import("./pages/Public/OnlineApplication"));
const FPTCandidatePortal = lazy(() => import("./pages/Public/FPTCandidatePortal"));

// ── Student Portal ──
const FPTStudentPortal = lazy(() => import("./pages/Student/FPTStudentPortal"));
const StudentLayout = lazy(() => import("./pages/Student/StudentLayout"));
const StudentDashboard = lazy(() => import("./pages/Student/Dashboard"));
const StudentDocuments = lazy(() => import("./pages/Student/Documents"));
const StudentNotifications = lazy(() => import("./pages/Student/Notifications"));
const UniversityInfo = lazy(() => import("./pages/Student/UniversityInfo"));
// NEW
const AcademicRecords = lazy(() => import("./pages/Student/AcademicRecords"));
const StudentFinancialInfo = lazy(() => import("./pages/Student/FinancialInfo"));
const LearningResources = lazy(() => import("./pages/Student/LearningResources"));
const StudentProfile = lazy(() => import("./pages/Student/StudentProfile"));

// ── Officer Portal ──
const OfficerLayout = lazy(() => import("./pages/Officer/OfficerLayout"));
const OfficerDashboard = lazy(() => import("./pages/Officer/Dashboard"));
const ApplicantList = lazy(() => import("./pages/Officer/Applicants/ApplicantList"));
const ApplicationReview = lazy(() => import("./pages/Officer/Applicants/ApplicationReview"));
const OfficerCommunication = lazy(() => import("./pages/Officer/Communication"));
const OfficerSettings = lazy(() => import("./pages/Officer/Settings"));
const MoetResults = lazy(() => import("./pages/Officer/MoetResults"));
const EnrollmentNotification = lazy(() => import("./pages/Officer/EnrollmentNotification"));
// NEW Specific Department Officer Portals
const FinanceOfficerPortal = lazy(() => import("./pages/Officer/FinanceOfficerPortal"));
const AdmissionOfficerPortal = lazy(() => import("./pages/Officer/AdmissionOfficerPortal"));
const AcademicOfficerPortal = lazy(() => import("./pages/Officer/AcademicOfficerPortal"));
const StudentAffairsOfficerPortal = lazy(() => import("./pages/Officer/StudentAffairsOfficerPortal"));
const HROfficerPortal = lazy(() => import("./pages/Officer/HROfficerPortal"));
const DepartmentDashboard = lazy(() => import("./pages/Officer/DepartmentDashboard"));
const StudentManagement = lazy(() => import("./pages/Officer/StudentManagement"));
const AcademicReports = lazy(() => import("./pages/Officer/AcademicReports"));

// ── Manager Portal ──
const ManagerLayout = lazy(() => import("./pages/Manager/ManagerLayout"));
const ManagerDashboard = lazy(() => import("./pages/Manager/Dashboard"));
const OverviewChart = lazy(() => import("./pages/Manager/Analytics/OverviewChart"));
const MajorAnalysis = lazy(() => import("./pages/Manager/Analytics/MajorAnalysis"));
const RegionalAnalysis = lazy(() => import("./pages/Manager/Analytics/RegionalAnalysis"));
const ManagerForecast = lazy(() => import("./pages/Manager/Forecast"));
const ManagerRecommendations = lazy(() => import("./pages/Manager/Recommendations"));
const WhatIfSimulation = lazy(() => import("./pages/Manager/WhatIfSimulation"));
// NEW
const DataWarehouseOverview = lazy(() => import("./pages/Manager/DataWarehouseOverview"));
const FinancialManagement = lazy(() => import("./pages/Manager/FinancialManagement"));
const HRManagement = lazy(() => import("./pages/Manager/HRManagement"));
const DataQualityMonitor = lazy(() => import("./pages/Manager/DataQualityMonitor"));

// ── BOD Portal ──
const BODExecutivePortal = lazy(() => import("./pages/BOD/BODExecutivePortal"));
const BodLayout = lazy(() => import("./pages/BOD/BodLayout"));
const BodDashboard = lazy(() => import("./pages/BOD/ExecutiveDashboard"));
const BodForecast = lazy(() => import("./pages/BOD/ForecastReport"));
const RiskMonitor = lazy(() => import("./pages/BOD/RiskMonitor"));
const BodRecommendations = lazy(() => import("./pages/BOD/Recommendations"));
const ExportReports = lazy(() => import("./pages/BOD/ExportReports"));
// NEW
const DepartmentOverview = lazy(() => import("./pages/BOD/DepartmentOverview"));
const DirectivesManager = lazy(() => import("./pages/BOD/DirectivesManager"));
const UniversityOverview = lazy(() => import("./pages/BOD/UniversityOverview"));
const FinancialAnalytics = lazy(() => import("./pages/BOD/FinancialAnalytics"));
const ResearchAnalytics = lazy(() => import("./pages/BOD/ResearchAnalytics"));
const DataLineageView = lazy(() => import("./pages/BOD/DataLineageView"));

// ── Admin Portal ──
const AdminLayout = lazy(() => import("./pages/Admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/Admin/Dashboard"));
const UserManagement = lazy(() => import("./pages/Admin/UserManagement"));
const SystemConfig = lazy(() => import("./pages/Admin/SystemConfig"));
const AuditLog = lazy(() => import("./pages/Admin/AuditLog"));
// NEW
const DataCatalog = lazy(() => import("./pages/Admin/DataCatalog"));
const ETLMonitor = lazy(() => import("./pages/Admin/ETLMonitor"));
const DataGovernance = lazy(() => import("./pages/Admin/DataGovernance"));
const DataWarehouseStudio = lazy(() => import("./pages/Admin/DataWarehouseStudio"));

// Loading fallback
const PageLoader = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "linear-gradient(135deg, #FFF7F4 0%, #EFF6FF 100%)" }}>
    <div style={{ textAlign: "center" }}>
      <div style={{ width: 56, height: 56, background: "linear-gradient(135deg, #FF6B35, #E85A2A)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", animation: "pulse 2s infinite" }}>
        <span style={{ color: "#fff", fontWeight: 800, fontSize: 24 }}>F</span>
      </div>
      <div style={{ width: 32, height: 32, border: "3px solid #FF6B35", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
      <p style={{ color: "#6B7280", marginTop: 12, fontSize: 14 }}>Đang tải hệ thống...</p>
    </div>
  </div>
);

// Root redirect based on role
function RootRedirect() {
  const { isLoading, user } = useAuth();
  if (isLoading) return null;
  return <Navigate to={user?.role ? getDefaultPath(user.role) : "/portal"} replace />;
}

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<RootRedirect />} />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ========================
            PUBLIC & CANDIDATE PORTAL (Thí sinh)
            ======================== */}
        <Route path="/portal" element={<PublicLayout />}>
          <Route index element={<DataPortalHome />} />
          <Route path="apply" element={<FPTCandidatePortal />} />
          <Route path="admission-lookup" element={<AdmissionLookup />} />
          <Route path="score-calculator" element={<ScoreCalculator />} />
        </Route>

        <Route path="/candidate" element={<FPTCandidatePortal />} />
        <Route path="/candidate/portal" element={<FPTCandidatePortal />} />
        <Route path="/candidate/*" element={<FPTCandidatePortal />} />

        {/* ========================
            STUDENT PORTAL
            ======================== */}
        <Route path="/student" element={<FPTStudentPortal />} />
        <Route path="/student/dashboard" element={<FPTStudentPortal />} />
        <Route path="/student/*" element={<FPTStudentPortal />} />

        {/* ========================
            OFFICER PORTAL
            ======================== */}
        <Route path="/officer" element={<OfficerLayout />}>
          <Route index element={<Navigate to="/officer/dashboard" replace />} />
          <Route path="dashboard" element={<OfficerDashboard />} />
          <Route path="department" element={<DepartmentDashboard />} />
          <Route path="applicants" element={<ApplicantList />} />
          <Route path="applicants/:id" element={<ApplicationReview />} />
          <Route path="students" element={<StudentManagement />} />
          <Route path="academic-reports" element={<AcademicReports />} />
          <Route path="communication" element={<OfficerCommunication />} />
          <Route path="settings" element={<OfficerSettings />} />
          <Route path="moet-results" element={<MoetResults />} />
          <Route path="enrollment" element={<EnrollmentNotification />} />
        </Route>

        {/* Standalone portals — layout riêng, không dùng OfficerLayout */}
        <Route path="/officer/finance" element={<FinanceOfficerPortal />} />
        <Route path="/staff/finance" element={<Navigate to="/officer/finance" replace />} />
        <Route path="/officer/admission" element={<AdmissionOfficerPortal />} />
        <Route path="/officer/academic" element={<AcademicOfficerPortal />} />
        <Route path="/officer/student-affairs" element={<StudentAffairsOfficerPortal />} />
        <Route path="/officer/hr" element={<HROfficerPortal />} />
        <Route path="/staff/hr" element={<Navigate to="/officer/hr" replace />} />

        {/* ========================
            MANAGER PORTAL
            ======================== */}
        <Route path="/manager" element={<ManagerLayout />}>
          <Route index element={<Navigate to="/manager/dashboard" replace />} />
          <Route path="dashboard" element={<ManagerDashboard />} />
          <Route path="data-warehouse" element={<DataWarehouseOverview />} />
          <Route path="financial" element={<FinancialManagement />} />
          <Route path="human-resources" element={<HRManagement />} />
          <Route path="data-quality" element={<DataQualityMonitor />} />
          <Route path="analytics/overview" element={<OverviewChart />} />
          <Route path="analytics/majors" element={<MajorAnalysis />} />
          <Route path="analytics/regional" element={<RegionalAnalysis />} />
          <Route path="forecast" element={<ManagerForecast />} />
          <Route path="recommendations" element={<ManagerRecommendations />} />
          <Route path="simulation" element={<WhatIfSimulation />} />
        </Route>

        {/* ========================
            BOD PORTAL
            ======================== */}
        <Route path="/bod" element={<BODExecutivePortal />} />
        <Route path="/bod/dashboard" element={<BODExecutivePortal />} />
        <Route path="/bod/*" element={<BODExecutivePortal />} />

        {/* ========================
            ADMIN PORTAL
            ======================== */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="config" element={<SystemConfig />} />
          <Route path="audit-logs" element={<AuditLog />} />
          {/* NEW — Data Governance extensions */}
          <Route path="data-catalog" element={<DataCatalog />} />
          <Route path="etl-monitor" element={<ETLMonitor />} />
          <Route path="data-governance" element={<DataGovernance />} />
          <Route path="data-warehouse" element={<DataWarehouseStudio />} />
        </Route>

        {/* ========================
             DATA WAREHOUSE STUDIO (DWH Schema & Data Lake)
             ======================== */}
        <Route path="/dwh" element={<DataWarehouseStudio />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
