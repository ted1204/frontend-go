import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route } from 'react-router';
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
import ProjectDetail from './components/ProjectDetail';
import ManageProjects from './pages/ManageProjects';
import ManageGroups from './pages/ManageGroups';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import TerminalWrapper from './pages/Terminal/TerminalPage';
import FileBrowser from './pages/FileBrowser';
import AdminFormDashboard from './pages/AdminFormDashboard';
import AdminDashboard from './pages/AdminDashboard';
import UserFormDashboard from './pages/UserFormDashboard';
import Jobs from './pages/Jobs';
export default function App() {
    return (_jsx(_Fragment, { children: _jsxs(Router, { children: [_jsx(ScrollToTop, {}), _jsxs(Routes, { children: [_jsxs(Route, { element: _jsx(PublicRoute, {}), children: [_jsx(Route, { path: "/signin", element: _jsx(SignIn, {}) }), _jsx(Route, { path: "/signup", element: _jsx(SignUp, {}) })] }), _jsx(Route, { element: _jsx(PrivateRoute, {}), children: _jsxs(Route, { element: _jsx(AppLayout, {}), children: [_jsx(Route, { index: true, path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/groups", element: _jsx(Groups, {}) }), _jsx(Route, { path: "/groups/:id", element: _jsx(GroupDetail, {}) }), _jsx(Route, { path: "/projects", element: _jsx(Projects, {}) }), _jsx(Route, { path: "/projects/:id", element: _jsx(ProjectDetail, {}) }), _jsx(Route, { path: "/jobs", element: _jsx(Jobs, {}) }), _jsx(Route, { path: "/admin", element: _jsx(AdminDashboard, {}) }), _jsx(Route, { path: "/admin/manage-projects", element: _jsx(ManageProjects, {}) }), _jsx(Route, { path: "/admin/manage-groups", element: _jsx(ManageGroups, {}) }), _jsx(Route, { path: "/admin/forms", element: _jsx(AdminFormDashboard, {}) }), _jsx(Route, { path: "/my-forms", element: _jsx(UserFormDashboard, {}) }), _jsx(Route, { path: "/pod-tables", element: _jsx(PodTables, {}) }), _jsx(Route, { path: "/terminal", element: _jsx(TerminalWrapper, {}) }), _jsx(Route, { path: "/file-browser", element: _jsx(FileBrowser, {}) })] }) }), _jsx(Route, { path: "*", element: _jsx(NotFound, {}) })] })] }) }));
}
