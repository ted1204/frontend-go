import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from '../../icons';
import Label from '../form/Label';
import Input from '../form/input/InputFieldDefault';
import Button from '../ui/button/Button';
import { login } from '../../services/authService';
export default function SignInForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    const handleLogin = async (e) => {
        console.log('handleLogin called');
        e.preventDefault();
        try {
            const data = await login(username, password);
            localStorage.setItem('userData', JSON.stringify({
                user_id: data.user_id,
                username: data.username,
                is_super_admin: data.is_super_admin,
            }));
            // Redirect to the page the user was trying to access, or default to home
            navigate(from, { replace: true });
        }
        catch (err) {
            console.error('Login error:', err);
            alert(err instanceof Error ? err.message : '登入失敗，請重試。');
        }
    };
    return (_jsxs("div", { className: "flex flex-col flex-1", children: [_jsx("div", { className: "w-full max-w-md pt-10 mx-auto", children: _jsxs(Link, { to: "/", className: "inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300", children: [_jsx(ChevronLeftIcon, { className: "size-5" }), "\u8FD4\u56DE\u5100\u8868\u677F"] }) }), _jsx("div", { className: "flex flex-col justify-center flex-1 w-full max-w-md mx-auto", children: _jsxs("div", { children: [_jsxs("div", { className: "mb-5 sm:mb-8", children: [_jsx("h1", { className: "mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md", children: "\u767B\u5165" }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "\u8F38\u5165\u60A8\u7684\u4F7F\u7528\u8005\u540D\u7A31\u548C\u5BC6\u78BC\u4EE5\u767B\u5165\uFF01" })] }), _jsxs("div", { children: [_jsx("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5" }), _jsx("form", { onSubmit: handleLogin, children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsxs(Label, { children: ["\u4F7F\u7528\u8005\u540D\u7A31 ", _jsx("span", { className: "text-error-500", children: "*" })] }), _jsx(Input, { placeholder: "\u8F38\u5165\u60A8\u7684\u4F7F\u7528\u8005\u540D\u7A31", value: username, onChange: (e) => setUsername(e.target.value) })] }), _jsxs("div", { children: [_jsxs(Label, { children: ["\u5BC6\u78BC ", _jsx("span", { className: "text-error-500", children: "*" })] }), _jsxs("div", { className: "relative", children: [_jsx(Input, { type: showPassword ? 'text' : 'password', placeholder: "\u8F38\u5165\u60A8\u7684\u5BC6\u78BC", value: password, onChange: (e) => setPassword(e.target.value) }), _jsx("span", { onClick: () => setShowPassword(!showPassword), className: "absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2", children: showPassword ? (_jsx(EyeIcon, { className: "fill-gray-500 dark:fill-gray-400 size-5" })) : (_jsx(EyeCloseIcon, { className: "fill-gray-500 dark:fill-gray-400 size-5" })) })] })] }), _jsx("div", { className: "flex items-center justify-between", children: _jsx(Link, { to: "/reset-password", className: "text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400", children: "\u5FD8\u8A18\u5BC6\u78BC\uFF1F" }) }), _jsx("div", { children: _jsx(Button, { className: "w-full", size: "sm", type: "submit", children: "\u767B\u5165" }) })] }) }), _jsx("div", { className: "mt-5", children: _jsxs("p", { className: "text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start", children: ["\u9084\u6C92\u6709\u5E33\u865F\uFF1F", ' ', _jsx(Link, { to: "/signup", className: "text-brand-500 hover:text-brand-600 dark:text-brand-400", children: "\u8A3B\u518A" })] }) })] })] }) })] }));
}
