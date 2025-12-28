import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
const PublicRoute = () => {
    if (isAuthenticated()) {
        return _jsx(Navigate, { to: "/", replace: true });
    }
    return _jsx(Outlet, {});
};
export default PublicRoute;
