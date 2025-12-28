import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { PageMeta } from '@tailadmin/ui';
import AuthLayout from './AuthPageLayout';
import SignUpForm from '../../components/auth/SignUpForm';
export default function SignUp() {
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: "\u8A3B\u518A | AI \u5E73\u53F0", description: "\u9019\u662F AI \u5E73\u53F0\u7684\u8A3B\u518A\u9801\u9762" }), _jsx(AuthLayout, { children: _jsx(SignUpForm, {}) })] }));
}
