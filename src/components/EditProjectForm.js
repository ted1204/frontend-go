import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@tailadmin/utils';
import InputField from './form/input/InputField';
import Button from './ui/button/Button';
const SpinnerIcon = ({ className = 'w-4 h-4' }) => (_jsxs("svg", { className: `animate-spin ${className}`, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }));
const AlertIcon = ({ className = 'w-5 h-5' }) => (_jsx("svg", { className: className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.398 16c-.77 1.333.192 3 1.732 3z" }) }));
const EditProjectForm = ({ projectName, description, gpuQuota, gpuAccess, mpsLimit, mpsMemory, loading, error, isOpen, onClose, onProjectNameChange, onDescriptionChange, onGpuQuotaChange, onGpuAccessChange, onMpsLimitChange, onMpsMemoryChange, onSubmit, }) => {
    const { t } = useTranslation();
    const [shouldRender, setShouldRender] = useState(false);
    const [animationClass, setAnimationClass] = useState('');
    const animationTimeoutRef = useRef(null);
    useEffect(() => {
        if (animationTimeoutRef.current) {
            clearTimeout(animationTimeoutRef.current);
            animationTimeoutRef.current = null;
        }
        if (isOpen) {
            setShouldRender(true);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setAnimationClass('fade-in-0');
                });
            });
        }
        else if (shouldRender) {
            setAnimationClass('fade-out-0');
            animationTimeoutRef.current = setTimeout(() => {
                setShouldRender(false);
                setAnimationClass('');
                onClose();
            }, 300);
        }
        return () => {
            if (animationTimeoutRef.current) {
                clearTimeout(animationTimeoutRef.current);
            }
        };
    }, [isOpen, shouldRender, onClose]);
    if (!shouldRender) {
        return null;
    }
    return (_jsx("div", { className: `fixed inset-0 bg-gray-900 bg-opacity-50 dark:bg-opacity-50 flex items-center justify-center z-50 p-4 ${animationClass}`, children: _jsx("div", { className: "w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-2xl relative", onClick: (e) => e.stopPropagation(), children: _jsxs("div", { className: "p-8", children: [_jsx("button", { onClick: onClose, className: "absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:hover:text-white transition duration-200", "aria-label": "Close modal", children: _jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M6 18L18 6M6 6l12 12" }) }) }), _jsx("h3", { className: "mb-6 text-2xl font-bold text-gray-900 dark:text-white text-center", children: t('project.edit.title') || 'Edit Project' }), error && (_jsxs("p", { className: "mb-4 p-3 flex items-start bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 rounded-md text-sm font-medium", children: [_jsx(AlertIcon, { className: "w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-red-500 dark:text-red-400" }), _jsxs("span", { className: "text-left text-xs", children: [t('project.create.error'), ": ", error] })] })), _jsxs("form", { onSubmit: onSubmit, className: "space-y-5", children: [_jsx(InputField, { type: "text", label: t('project.create.name'), value: projectName, onChange: onProjectNameChange, required: true, placeholder: t('project.create.namePlaceholder'), className: "w-full", disabled: loading }), _jsxs("div", { className: "space-y-1.5 text-left", children: [_jsx("label", { htmlFor: "description-textarea", className: "block text-sm font-medium text-gray-700 dark:text-gray-300", children: t('project.create.description') }), _jsx("textarea", { id: "description-textarea", value: description, onChange: onDescriptionChange, rows: 4, placeholder: t('project.create.descriptionPlaceholder'), className: "w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-md shadow-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 disabled:bg-gray-100 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed", disabled: loading })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsx(InputField, { type: "number", label: t('project.create.gpuQuota'), value: gpuQuota, onChange: onGpuQuotaChange, placeholder: t('project.create.gpuQuotaPlaceholder'), className: "w-full", min: "0", disabled: loading }), _jsx(InputField, { type: "number", label: t('project.create.gpuThreadLimit'), value: mpsLimit, onChange: onMpsLimitChange, placeholder: t('project.create.gpuThreadLimitPlaceholder'), className: "w-full", min: "0", max: "100", disabled: loading }), _jsx(InputField, { type: "number", label: t('project.create.gpuMemoryLimit'), value: mpsMemory, onChange: onMpsMemoryChange, placeholder: t('project.create.gpuMemoryLimitPlaceholder'), className: "w-full", min: "0", disabled: loading })] }), _jsxs("div", { className: "space-y-1.5 text-left", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300", children: t('project.create.gpuAccessMode') }), _jsxs("div", { className: "flex gap-4", children: [_jsxs("label", { className: "flex items-center space-x-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: gpuAccess.includes('shared'), onChange: () => onGpuAccessChange('shared'), className: "form-checkbox h-5 w-5 text-violet-600 rounded border-gray-300 focus:ring-violet-500 dark:border-gray-600 dark:bg-gray-700", disabled: loading }), _jsx("span", { className: "text-gray-700 dark:text-gray-300", children: t('project.create.gpuAccessShared') })] }), _jsxs("label", { className: "flex items-center space-x-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: gpuAccess.includes('dedicated'), onChange: () => onGpuAccessChange('dedicated'), className: "form-checkbox h-5 w-5 text-violet-600 rounded border-gray-300 focus:ring-violet-500 dark:border-gray-600 dark:bg-gray-700", disabled: loading }), _jsx("span", { className: "text-gray-700 dark:text-gray-300", children: t('project.create.gpuAccessDedicated') })] })] })] }), gpuAccess.includes('shared') && (_jsxs("div", { className: "grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-700", children: [_jsx("div", { className: "col-span-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-1", children: t('project.create.mpsSettings') }), _jsx(InputField, { type: "number", label: t('project.create.mpsThreadLimit'), value: mpsLimit, onChange: onMpsLimitChange, placeholder: "100", className: "w-full", min: "0", max: "100", disabled: loading }), _jsx(InputField, { type: "number", label: t('project.create.mpsMemoryLimit'), value: mpsMemory, onChange: onMpsMemoryChange, placeholder: "0 (\u7121\u9650\u5236)", className: "w-full", min: "0", disabled: loading })] })), _jsx("div", { className: "pt-2", children: _jsx(Button, { type: "submit", className: "w-full px-6 py-2.5 text-base font-semibold bg-violet-600 text-white rounded-md hover:bg-violet-700 transition duration-150 focus:outline-none focus:ring-4 focus:ring-violet-500 focus:ring-opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed", disabled: loading, children: loading ? (_jsxs("span", { className: "flex items-center justify-center animate-pulse", children: [_jsx(SpinnerIcon, { className: "w-4 h-4 mr-2 text-white" }), t('project.create.creating')] })) : (t('project.create.submit')) }) })] })] }) }) }));
};
export default EditProjectForm;
