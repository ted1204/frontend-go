import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/AuthPages/SignIn';
import SignUp from './pages/AuthPages/SignUp';
import NotFound from './pages/OtherPage/NotFound';
import PodTables from './pages/Tables/MonitoringTables';
import AppLayout from './layout/AppLayout';
import { ScrollToTop } from './components/common/ScrollToTop';
import Home from './pages/Dashboard/Home';
import Groups from './pages/Groups';
import Projects from './pages/Projects';
import GroupDetail from './components/GroupDetail';
import ProjectDetail from './pages/ProjecDetails';
import ManageProjects from './pages/ManageProjects';
import ManageGroups from './pages/ManageGroups';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import TerminalWrapper from './pages/Terminal/TerminalPage';
import BrowserPage from './pages/BrowserPage';
import AdminFormDashboard from './pages/AdminFormDashboard';
import AdminDashboard from './pages/AdminDashboard';
import StoragePage from './pages/StoragePage';
import UserFormDashboard from './pages/UserFormDashboard';
import Jobs from './pages/Jobs';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicRoute />}>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route index path="/" element={<Home />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/groups/:id" element={<GroupDetail />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/manage-projects" element={<ManageProjects />} />
              <Route path="/admin/manage-groups" element={<ManageGroups />} />
              <Route path="/admin/forms" element={<AdminFormDashboard />} />
              <Route path="/admin/storage-management" element={<StoragePage />} />
              <Route path="/my-forms" element={<UserFormDashboard />} />
              <Route path="/pod-tables" element={<PodTables />} />
              <Route path="/terminal" element={<TerminalWrapper />} />
              <Route path="/file-browser" element={<BrowserPage />} />
            </Route>
          </Route>

          {/* Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
