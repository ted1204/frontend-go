import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, Fragment } from 'react';
import { useTranslation } from '@tailadmin/utils';
import { Dialog, Transition, Combobox, RadioGroup } from '@headlessui/react';
import { CheckIcon as CheckMarkIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
const roles = [
    {
        nameKey: 'role.admin.name',
        value: 'admin',
        descKey: 'role.admin.desc',
    },
    {
        nameKey: 'role.manager.name',
        value: 'manager',
        descKey: 'role.manager.desc',
    },
    {
        nameKey: 'role.user.name',
        value: 'user',
        descKey: 'role.user.desc',
    },
];
// --- Helper Components --- //
// Helper component for the checkmark icon in the role selection
const RoleCheckIcon = (props) => (_jsxs("svg", { viewBox: "0 0 24 24", fill: "none", ...props, children: [_jsx("circle", { cx: 12, cy: 12, r: 12, fill: "currentColor", opacity: "0.2" }), _jsx("path", { d: "M7 13l3 3 7-7", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" })] }));
// Helper to generate a consistent background color for avatars based on username
const generateAvatarBgColor = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 50%, 70%)`;
    return color;
};
// --- Main Component --- //
const InviteUserModal = ({ isOpen, onClose, users, onSubmit }) => {
    // --- Internal State Management --- //
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState('user');
    const [query, setQuery] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const { t } = useTranslation();
    // --- Derived State --- //
    // Filter users based on the search query
    const filteredUsers = query === ''
        ? users
        : users.filter((user) => user.Username.toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, '')));
    // --- Event Handlers --- //
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedUser) {
            setError(t('invite.selectUserError'));
            return;
        }
        setIsSubmitting(true);
        setError(null);
        try {
            await onSubmit({ uid: selectedUser.UID, role: selectedRole });
            handleClose(); // Close and reset on success
        }
        catch (err) {
            setError(err instanceof Error ? err.message : t('invite.unknownError'));
        }
        finally {
            setIsSubmitting(false);
        }
    };
    // Resets all state fields when the modal is closed
    const handleClose = () => {
        setSelectedUser(null);
        setSelectedRole('user');
        setQuery('');
        setError(null);
        setIsSubmitting(false);
        onClose();
    };
    return (_jsx(Transition, { appear: true, show: isOpen, as: Fragment, children: _jsxs(Dialog, { as: "div", className: "relative z-50", onClose: handleClose, children: [_jsx(Transition.Child, { as: Fragment, enter: "ease-out duration-300", enterFrom: "opacity-0", enterTo: "opacity-100", leave: "ease-in duration-200", leaveFrom: "opacity-100", leaveTo: "opacity-0", children: _jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm" }) }), _jsx("div", { className: "fixed inset-0 flex w-screen items-center justify-center p-4", children: _jsx(Transition.Child, { as: Fragment, enter: "ease-out duration-300", enterFrom: "opacity-0 scale-95", enterTo: "opacity-100 scale-100", leave: "ease-in duration-200", leaveFrom: "opacity-100 scale-100", leaveTo: "opacity-0 scale-95", children: _jsxs(Dialog.Panel, { as: "form", onSubmit: handleSubmit, 
                            // Increased modal width from max-w-md to max-w-lg
                            className: "w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800", children: [_jsx(Dialog.Title, { as: "h3", className: "text-xl font-semibold leading-6 text-gray-900 dark:text-white", children: t('invite.title') }), _jsx(Dialog.Description, { className: "mt-2 text-sm text-gray-500 dark:text-gray-400", children: t('invite.description') }), _jsx("div", { className: "relative mt-4", children: _jsxs(Combobox, { value: selectedUser, onChange: setSelectedUser, children: [_jsxs(Combobox.Label, { className: "block text-sm font-medium text-gray-700 dark:text-gray-300", children: [t('invite.userLabel'), " ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("div", { className: "relative mt-1", children: [_jsx(Combobox.Input, { className: "w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white", displayValue: (user) => user?.Username || '', onChange: (event) => setQuery(event.target.value), placeholder: t('invite.userSearchPlaceholder') }), _jsx(Combobox.Button, { className: "absolute inset-y-0 right-0 flex items-center pr-2", children: _jsx(ChevronUpDownIcon, { className: "h-5 w-5 text-gray-400", "aria-hidden": "true" }) })] }), _jsx(Transition, { as: Fragment, leave: "transition ease-in duration-100", leaveFrom: "opacity-100", leaveTo: "opacity-0", afterLeave: () => setQuery(''), children: _jsx(Combobox.Options, { className: "absolute z-10 mt-1 max-h-52 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm dark:bg-gray-700", children: filteredUsers.length === 0 && query !== '' ? (_jsx("div", { className: "relative cursor-default select-none px-4 py-2 text-gray-700 dark:text-gray-300", children: t('invite.noResults') })) : (filteredUsers.map((user) => (_jsx(Combobox.Option, { value: user, className: ({ active }) => `relative cursor-pointer select-none py-2 pl-4 pr-4 ${active ? 'bg-blue-600 text-white' : 'text-gray-900 dark:text-white'}`, children: ({ selected, active }) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { style: {
                                                                                backgroundColor: generateAvatarBgColor(user.Username),
                                                                            }, className: "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white", children: user.Username.charAt(0).toUpperCase() }), _jsx("span", { className: `block truncate ${selected ? 'font-semibold' : 'font-normal'}`, children: user.Username })] }), selected && (_jsx("span", { className: `flex items-center ${active ? 'text-white' : 'text-blue-600'}`, children: _jsx(CheckMarkIcon, { className: "h-5 w-5", "aria-hidden": "true" }) }))] })) }, user.UID)))) }) })] }) }), _jsx("div", { className: "mt-5", children: _jsxs(RadioGroup, { value: selectedRole, onChange: setSelectedRole, children: [_jsxs(RadioGroup.Label, { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: ["\u89D2\u8272 ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("div", { className: "mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3", children: roles.map((role) => (_jsx(RadioGroup.Option, { value: role.value, className: ({ active, checked }) => `${active ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-blue-400' : ''} ${checked ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-900/75'} relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none transition`, children: ({ checked }) => (_jsxs("div", { className: "flex w-full items-start", children: [_jsxs("div", { className: "text-sm", children: [_jsx(RadioGroup.Label, { as: "p", className: `font-semibold ${checked ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`, children: t(role.nameKey) }), _jsx(RadioGroup.Description, { as: "span", className: `inline ${checked ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`, children: t(role.descKey) })] }), checked && (_jsx("div", { className: "ml-auto flex-shrink-0 text-white", children: _jsx(RoleCheckIcon, { className: "h-6 w-6" }) }))] })) }, role.value))) })] }) }), error && (_jsx("p", { className: "mt-4 text-center text-sm text-red-600 dark:text-red-400", children: error })), _jsxs("div", { className: "mt-8 flex justify-end gap-4", children: [_jsx("button", { type: "button", onClick: handleClose, className: "rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 dark:ring-0", children: "\u53D6\u6D88" }), _jsx("button", { type: "submit", disabled: isSubmitting || !selectedUser, className: "inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50", children: isSubmitting ? '邀請中...' : '邀請成員' })] })] }) }) })] }) }));
};
export default InviteUserModal;
