import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/components/EditRoleModal.tsx
import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition, RadioGroup } from '@headlessui/react';
// --- Helper Data & Components --- //
const roles = [
    {
        name: '管理員',
        value: 'admin',
        description: '擁有所有資源和設定的完整權限。',
    },
    {
        name: '專案管理者',
        value: 'manager',
        description: '可以管理成員和特定資源。',
    },
    {
        name: '一般使用者',
        value: 'user',
        description: '可以檢視和互動指派的資源。',
    },
];
/**
 * A check icon component for the selected role.
 */
const CheckIcon = (props) => (_jsxs("svg", { viewBox: "0 0 24 24", fill: "none", ...props, children: [_jsx("circle", { cx: 12, cy: 12, r: 12, fill: "#fff", opacity: "0.2" }), _jsx("path", { d: "M7 13l3 3 7-7", stroke: "#fff", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" })] }));
export default function EditRoleModal({ isOpen, onClose, user, onUpdate }) {
    // --- State Management --- //
    const [selectedRole, setSelectedRole] = useState(user.Role);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    // Sync state if the user prop changes while the modal is open
    useEffect(() => {
        setSelectedRole(user.Role);
    }, [user]);
    // --- Handlers --- //
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        try {
            await onUpdate(selectedRole);
            onClose();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : '更新角色失敗。');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleClose = () => {
        // Reset state on close to avoid showing old data briefly on reopen
        setError(null);
        setIsSubmitting(false);
        onClose();
    };
    // --- Render --- //
    return (_jsx(Transition, { appear: true, show: isOpen, as: Fragment, children: _jsxs(Dialog, { as: "div", className: "relative z-50", onClose: handleClose, children: [_jsx(Transition.Child, { as: Fragment, enter: "ease-out duration-300", enterFrom: "opacity-0", enterTo: "opacity-100", leave: "ease-in duration-200", leaveFrom: "opacity-100", leaveTo: "opacity-0", children: _jsx("div", { className: "fixed inset-0 bg-black/30 backdrop-blur-sm", "aria-hidden": "true" }) }), _jsx("div", { className: "fixed inset-0 flex w-screen items-center justify-center p-4", children: _jsx(Transition.Child, { as: Fragment, enter: "ease-out duration-300", enterFrom: "opacity-0 scale-95", enterTo: "opacity-100 scale-100", leave: "ease-in duration-200", leaveFrom: "opacity-100 scale-100", leaveTo: "opacity-0 scale-95", children: _jsxs(Dialog.Panel, { as: "form", onSubmit: handleSubmit, className: "w-full max-w-md rounded-2xl bg-white p-6 dark:bg-gray-800", children: [_jsx(Dialog.Title, { as: "h3", className: "text-lg font-semibold leading-6 text-gray-900 dark:text-white", children: "\u7DE8\u8F2F\u89D2\u8272" }), _jsxs(Dialog.Description, { className: "mt-1 text-sm text-gray-500 dark:text-gray-400", children: ["\u8B8A\u66F4\u6B0A\u9650\u7B49\u7D1A\uFF1A", ' ', _jsx("span", { className: "font-medium text-gray-800 dark:text-gray-200", children: user.Username }), "."] }), _jsx("div", { className: "mt-4 w-full", children: _jsxs(RadioGroup, { value: selectedRole, onChange: setSelectedRole, children: [_jsx(RadioGroup.Label, { className: "sr-only", children: "Role" }), _jsx("div", { className: "space-y-2", children: roles.map((role) => (_jsx(RadioGroup.Option, { value: role.value, className: ({ active, checked }) => `${active ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-sky-300' : ''}
                          ${checked ? 'bg-sky-600 text-white' : 'bg-white dark:bg-gray-900/75'}
                          relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none transition`, children: ({ checked }) => (_jsx(_Fragment, { children: _jsxs("div", { className: "flex w-full items-center justify-between", children: [_jsx("div", { className: "flex items-center", children: _jsxs("div", { className: "text-sm", children: [_jsx(RadioGroup.Label, { as: "p", className: `font-medium ${checked ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`, children: role.name }), _jsx(RadioGroup.Description, { as: "span", className: `inline ${checked ? 'text-sky-100' : 'text-gray-500 dark:text-gray-400'}`, children: role.description })] }) }), checked && (_jsx("div", { className: "flex-shrink-0 text-white", children: _jsx(CheckIcon, { className: "h-6 w-6" }) }))] }) })) }, role.name))) })] }) }), error && _jsx("p", { className: "mt-3 text-sm text-red-600 dark:text-red-400", children: error }), _jsxs("div", { className: "mt-6 flex justify-end gap-3", children: [_jsx("button", { type: "button", onClick: handleClose, className: "rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 dark:ring-0", children: "\u53D6\u6D88" }), _jsx("button", { type: "submit", disabled: isSubmitting, className: "inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed", children: isSubmitting ? '更新中...' : '更新角色' })] })] }) }) })] }) }));
}
