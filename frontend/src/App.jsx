import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { getDefaultPath } from "./utils/rolePermissions";
import { lazy, Suspense } from "react";

// Auth pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import NotFoundPage from "./pages/Common/NotFoundPage";

// Lazy load portals
const StudentLayout = lazy(() => import("./pages/Student/StudentLayout"));
const OfficerLayout = lazy(() => import("./pages/Officer/OfficerLayout"));
const ManagerLayout = lazy(() => import("./pages/Manager/ManagerLayout"));
const BodLayout = lazy(() => import("./pages/BOD/BodLayout"));
const AdminLayout = lazy(() => import("./pages/Admin/AdminLayout"));

// Student pages
const StudentDashboard = lazy(() => import("./pages/Student/Dashboard"));
const NewApplication = lazy(() => import("./pages/Student/Application/NewApplication"));
const MyApplications = lazy(() => import("./pages/Student/Application/MyApplications"));
const StudentDocuments = lazy(() => import("./pages/Student/Documents"));
const StudentNotifications = lazy(() => import("./pages/Student/Notifications"));
const UniversityInfo = lazy(() => import("./pages/Student/UniversityInfo"));

// Officer pages
const OfficerDashboard = lazy(() => import("./pages/Officer/Dashboard"));
const ApplicantList = lazy(() => import("./pages/Officer/Applicants/ApplicantList"));
const ApplicationReview = lazy(() => import("./pages/Officer/Applicants/ApplicationReview"));
const OfficerCommunication = lazy(() => import("./pages/Officer/Communication"));

// Manager pages
const ManagerDashboard = lazy(() => import("./pages/Manager/Dashboard"));
const OverviewChart = lazy(() => import("./pages/Manager/Analytics/OverviewChart"));
const MajorAnalysis = lazy(() => import("./pages/Manager/Analytics/MajorAnalysis"));
const RegionalAnalysis = lazy(() => import("./pages/Manager/Analytics/RegionalAnalysis"));
const ManagerForecast = lazy(() => import("./pages/Manager/Forecast"));
const ManagerRecommendations = lazy(() => import("./pages/Manager/Recommendations"));

// BOD pages
const BodDashboard = lazy(() => import("./pages/BOD/ExecutiveDashboard"));
const BodForecast = lazy(() => import("./pages/BOD/ForecastReport"));
const RiskMonitor = lazy(() => import("./pages/BOD/RiskMonitor"));
const BodRecommendations = lazy(() => import("./pages/BOD/Recommendations"));
const ExportReports = lazy(() => import("./pages/BOD/ExportReports"));

// Admin pages
const AdminDashboard = lazy(() => import("./pages/Admin/Dashboard"));
const UserManagement = lazy(() => import("./pages/Admin/UserManagement"));
const SystemConfig = lazy(() => import("./pages/Admin/SystemConfig"));
const AuditLog = lazy(() => import("./pages/Admin/AuditLog"));

// Loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
  </div>
);

const RoleRoute = ({ children }) => {
  return children;
};

// Root redirect based on role
function RootRedirect() {
  const { isLoading, user } = useAuth();
  if (isLoading) return null;
  return <Navigate to={user?.role ? getDefaultPath(user.role) : "/student/dashboard"} replace />;
}

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<RootRedirect />} />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ========================
            STUDENT PORTAL
            ======================== */}
        <Route
          path="/student"
          element={
            <RoleRoute allowedRoles={["STUDENT"]}>
              <StudentLayout />
            </RoleRoute>
          }
        >
          <Route index element={<Navigate to="/student/dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="apply" element={<NewApplication />} />
          <Route path="applications" element={<MyApplications />} />
          <Route path="documents" element={<StudentDocuments />} />
          <Route path="notifications" element={<StudentNotifications />} />
          <Route path="university-info" element={<UniversityInfo />} />
        </Route>

        {/* ========================
            OFFICER PORTAL
            ======================== */}
        <Route
          path="/officer"
          element={
            <RoleRoute allowedRoles={["ADMISSION_OFFICER", "ADMISSION_MANAGER", "ADMIN"]}>
              <OfficerLayout />
            </RoleRoute>
          }
        >
          <Route index element={<Navigate to="/officer/dashboard" replace />} />
          <Route path="dashboard" element={<OfficerDashboard />} />
          <Route path="applicants" element={<ApplicantList />} />
          <Route path="applicants/:id" element={<ApplicationReview />} />
          <Route path="communication" element={<OfficerCommunication />} />
        </Route>

        {/* ========================
            MANAGER PORTAL
            ======================== */}
        <Route
          path="/manager"
          element={
            <RoleRoute allowedRoles={["ADMISSION_MANAGER", "ADMIN"]}>
              <ManagerLayout />
            </RoleRoute>
          }
        >
          <Route index element={<Navigate to="/manager/dashboard" replace />} />
          <Route path="dashboard" element={<ManagerDashboard />} />
          <Route path="analytics/overview" element={<OverviewChart />} />
          <Route path="analytics/majors" element={<MajorAnalysis />} />
          <Route path="analytics/regional" element={<RegionalAnalysis />} />
          <Route path="forecast" element={<ManagerForecast />} />
          <Route path="recommendations" element={<ManagerRecommendations />} />
        </Route>

        {/* ========================
            BOD PORTAL
            ======================== */}
        <Route
          path="/bod"
          element={
            <RoleRoute allowedRoles={["BOD", "ADMIN"]}>
              <BodLayout />
            </RoleRoute>
          }
        >
          <Route index element={<Navigate to="/bod/dashboard" replace />} />
          <Route path="dashboard" element={<BodDashboard />} />
          <Route path="forecast" element={<BodForecast />} />
          <Route path="risks" element={<RiskMonitor />} />
          <Route path="recommendations" element={<BodRecommendations />} />
          <Route path="export" element={<ExportReports />} />
        </Route>

        {/* ========================
            ADMIN PORTAL
            ======================== */}
        <Route
          path="/admin"
          element={
            <RoleRoute allowedRoles={["ADMIN"]}>
              <AdminLayout />
            </RoleRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="config" element={<SystemConfig />} />
          <Route path="audit-logs" element={<AuditLog />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
