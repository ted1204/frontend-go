import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { createForm } from '../services/formService';
import { useTranslation } from '@tailadmin/utils';
export default function CreateFormModal({ isOpen, onClose, projectId }) {
    const { t } = useTranslation();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createForm({
                title,
                description,
                project_id: projectId,
            });
            alert(t('form.created'));
            onClose();
            setTitle('');
            setDescription('');
        }
        catch (error) {
            alert(t('form.createFailed') + (error instanceof Error ? error.message : String(error)));
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx(Transition, { appear: true, show: isOpen, as: Fragment, children: _jsxs(Dialog, { as: "div", className: "relative z-50", onClose: onClose, children: [_jsx(Transition.Child, { as: Fragment, enter: "ease-out duration-300", enterFrom: "opacity-0", enterTo: "opacity-100", leave: "ease-in duration-200", leaveFrom: "opacity-100", leaveTo: "opacity-0", children: _jsx("div", { className: "fixed inset-0 bg-black/25" }) }), _jsx("div", { className: "fixed inset-0 overflow-y-auto", children: _jsx("div", { className: "flex min-h-full items-center justify-center p-4 text-center", children: _jsx(Transition.Child, { as: Fragment, enter: "ease-out duration-300", enterFrom: "opacity-0 scale-95", enterTo: "opacity-100 scale-100", leave: "ease-in duration-200", leaveFrom: "opacity-100 scale-100", leaveTo: "opacity-0 scale-95", children: _jsxs(Dialog.Panel, { className: "w-full max-w-md transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle transition-all dark:bg-gray-800", children: [_jsx(Dialog.Title, { as: "h3", className: "text-lg font-medium leading-6 text-gray-900 dark:text-white", children: t('form.title') }), _jsxs("form", { onSubmit: handleSubmit, className: "mt-3 space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300", children: t('form.field.title') }), _jsx("input", { type: "text", required: true, value: title, onChange: (e) => setTitle(e.target.value), className: "mt-1 block w-full rounded-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm", placeholder: t('form.exampleTitle') })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300", children: t('form.field.description') }), _jsx("textarea", { required: true, value: description, onChange: (e) => setDescription(e.target.value), rows: 4, className: "mt-1 block w-full rounded-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm", placeholder: t('form.placeholder.description') })] }), projectId && (_jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: t('form.projectId', { id: projectId }) })), _jsxs("div", { className: "mt-4 flex justify-end gap-2", children: [_jsx("button", { type: "button", className: "inline-flex justify-center rounded-sm border border-transparent bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600", onClick: onClose, children: t('form.cancel') }), _jsx("button", { type: "submit", disabled: loading, className: "inline-flex justify-center rounded-sm border border-transparent bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none disabled:opacity-50", children: loading ? t('form.submitting') : t('form.submit') })] })] })] }) }) }) })] }) }));
}
