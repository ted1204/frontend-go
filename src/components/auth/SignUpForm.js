import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from '../../icons';
import Label from '../form/Label';
import Input from '../form/input/InputFieldDefault';
import Button from '../ui/button/Button';
import { register } from '../../services/authService';
export default function SignUpForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const handleSignUp = async (e) => {
        e.preventDefault();
        // Basic validation
        if (!username || !password) {
            alert('請填寫使用者名稱和密碼欄位。');
            return;
        }
        const full_name = `${fname} ${lname}`.trim();
        try {
            const data = await register({
                username,
                password,
                email,
                full_name,
                type: 'origin', // Default to 'origin' as per Swagger enum
                status: 'online', // Default to 'online' as per Swagger enum
            });
            alert(data.message || '註冊成功！請登入。');
            navigate('/signin');
        }
        catch (err) {
            console.error('Registration error:', err);
            alert(err instanceof Error ? err.message : '註冊失敗，請重試。');
        }
    };
    return (_jsxs("div", { className: "flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar", children: [_jsx("div", { className: "w-full max-w-md mx-auto mb-5 sm:pt-10", children: _jsxs(Link, { to: "/", className: "inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300", children: [_jsx(ChevronLeftIcon, { className: "size-5" }), "\u8FD4\u56DE\u5100\u8868\u677F"] }) }), _jsx("div", { className: "flex flex-col justify-center flex-1 w-full max-w-md mx-auto", children: _jsxs("div", { children: [_jsxs("div", { className: "mb-5 sm:mb-8", children: [_jsx("h1", { className: "mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md", children: "\u8A3B\u518A" }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "\u8F38\u5165\u60A8\u7684\u96FB\u5B50\u90F5\u4EF6\u548C\u5BC6\u78BC\u4EE5\u8A3B\u518A\uFF01" })] }), _jsxs("div", { children: [_jsx("form", { onSubmit: handleSignUp, children: _jsxs("div", { className: "space-y-5", children: [_jsxs("div", { className: "grid grid-cols-1 gap-5 sm:grid-cols-2", children: [_jsxs("div", { className: "sm:col-span-1", children: [_jsxs(Label, { children: ["\u540D\u5B57", _jsx("span", { className: "text-error-500" })] }), _jsx(Input, { type: "text", id: "fname", name: "fname", placeholder: "\u8F38\u5165\u60A8\u7684\u540D\u5B57", value: fname, onChange: (e) => setFname(e.target.value) })] }), _jsxs("div", { className: "sm:col-span-1", children: [_jsxs(Label, { children: ["\u59D3\u6C0F", _jsx("span", { className: "text-error-500" })] }), _jsx(Input, { type: "text", id: "lname", name: "lname", placeholder: "\u8F38\u5165\u60A8\u7684\u59D3\u6C0F", value: lname, onChange: (e) => setLname(e.target.value) })] })] }), _jsxs("div", { children: [_jsxs(Label, { children: ["\u4F7F\u7528\u8005\u540D\u7A31", _jsx("span", { className: "text-error-500", children: "*" })] }), _jsx(Input, { type: "text", id: "username", name: "username", placeholder: "\u8F38\u5165\u60A8\u7684\u4F7F\u7528\u8005\u540D\u7A31", value: username, onChange: (e) => setUsername(e.target.value) })] }), _jsxs("div", { children: [_jsxs(Label, { children: ["\u96FB\u5B50\u90F5\u4EF6", _jsx("span", { className: "text-error-500" })] }), _jsx(Input, { type: "email", id: "email", name: "email", placeholder: "\u8F38\u5165\u60A8\u7684\u96FB\u5B50\u90F5\u4EF6", value: email, onChange: (e) => setEmail(e.target.value) })] }), _jsxs("div", { children: [_jsxs(Label, { children: ["\u5BC6\u78BC", _jsx("span", { className: "text-error-500", children: "*" })] }), _jsxs("div", { className: "relative", children: [_jsx(Input, { placeholder: "\u8F38\u5165\u60A8\u7684\u5BC6\u78BC", type: showPassword ? 'text' : 'password', value: password, onChange: (e) => setPassword(e.target.value) }), _jsx("span", { onClick: () => setShowPassword(!showPassword), className: "absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2", children: showPassword ? (_jsx(EyeIcon, { className: "fill-gray-500 dark:fill-gray-400 size-5" })) : (_jsx(EyeCloseIcon, { className: "fill-gray-500 dark:fill-gray-400 size-5" })) })] })] }), _jsx("div", { children: _jsx(Button, { className: "w-full", size: "sm", type: "submit", children: "\u8A3B\u518A" }) })] }) }), _jsx("div", { className: "mt-5", children: _jsxs("p", { className: "text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start", children: ["\u5DF2\u7D93\u6709\u5E33\u865F\uFF1F", ' ', _jsx(Link, { to: "/signin", className: "text-brand-500 hover:text-brand-600 dark:text-brand-400", children: "\u767B\u5165" })] }) })] })] }) })] }));
}
