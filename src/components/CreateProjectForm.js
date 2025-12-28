import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/CreateProjectForm.tsx
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@tailadmin/utils';
// Assuming InputField and Button are properly defined components
import InputField from './form/input/InputField';
import Button from './ui/button/Button';
// ------------------------------------------------------------------------
// SVG Components (Used for consistency and minimal style)
const SpinnerIcon = ({ className = 'w-4 h-4' }) => (_jsxs("svg", { className: `animate-spin ${className}`, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }));
const AlertIcon = ({ className = 'w-5 h-5' }) => (_jsx("svg", { className: className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.398 16c-.77 1.333.192 3 1.732 3z" }) }));
const CreateProjectForm = ({ projectName, description, groupId, gpuQuota, gpuAccess, mpsLimit, mpsMemory, loading, error, isOpen, onClose, onProjectNameChange, onDescriptionChange, onGpuQuotaChange, onGpuAccessChange, onMpsLimitChange, onMpsMemoryChange, onSubmit, availableGroups, selectedGroupName, onSelectedGroupChange, }) => {
    const { t } = useTranslation();
    // --- Local State for Search Dropdown ---
    const [searchTerm, setSearchTerm] = useState(selectedGroupName);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    // FIX: Defensive initialization of availableGroups
    const safeGroups = availableGroups || [];
    // Filter logic runs whenever local search term changes
    const filteredGroups = safeGroups.filter((group) => group.GroupName.toLowerCase().includes(searchTerm.toLowerCase()));
    // Synchronize local search term with external selectedGroupName
    useEffect(() => {
        setSearchTerm(selectedGroupName);
    }, [selectedGroupName]);
    // Handles group selection from the dropdown
    const handleSelectGroup = (group) => {
        onSelectedGroupChange(group.GID, group.GroupName);
        setIsDropdownOpen(false);
    };
    // Handles input change in the search field
    const handleSearchInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setIsDropdownOpen(true);
        // Clear selected group in parent if user starts typing a new name
        if (value !== selectedGroupName) {
            onSelectedGroupChange(0, value); // Pass 0 for ID and the new text for name
        }
    };
    // Logic to close dropdown when clicking outside of the search area
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
                // If nothing was selected, reset search input to the selected name
                setSearchTerm(selectedGroupName);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [selectedGroupName]);
    // --- Modal Animation Logic (FIXED: Eliminates flash by using dedicated render state) ---
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
            // Use requestAnimationFrame to safely apply fade-in class on the next tick
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setAnimationClass('fade-in-0');
                });
            });
        }
        else if (shouldRender) {
            setAnimationClass('fade-out-0');
            // Wait 300ms for the animation to complete before unmounting
            animationTimeoutRef.current = setTimeout(() => {
                setShouldRender(false);
                setAnimationClass('');
                onClose();
            }, 300);
        }
        // Cleanup function: Ensures timers are cleared when the component is unmounted or effect reruns
        return () => {
            if (animationTimeoutRef.current) {
                clearTimeout(animationTimeoutRef.current);
            }
        };
    }, [isOpen, shouldRender, onClose]);
    if (!shouldRender) {
        return null;
    }
    // -----------------------------------------------------------------------
    return (
    // Modal Backdrop: Apply dynamic animation class directly. No click-to-close on background.
    _jsx("div", { className: `fixed inset-0 bg-gray-900 bg-opacity-50 dark:bg-opacity-50 flex items-center justify-center z-50 p-4 ${animationClass}`, children: _jsx("div", { className: "w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl relative", onClick: (e) => e.stopPropagation(), children: _jsxs("div", { className: "p-8", children: [_jsx("button", { onClick: onClose, className: "absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:hover:text-white transition duration-200", "aria-label": "Close modal", children: _jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M6 18L18 6M6 6l12 12" }) }) }), _jsx("h3", { className: "mb-6 text-2xl font-bold text-gray-900 dark:text-white text-center", children: t('project.create.title') }), error && (_jsxs("p", { className: "mb-4 p-3 flex items-start bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 rounded-md text-sm font-medium", children: [_jsx(AlertIcon, { className: "w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-red-500 dark:text-red-400" }), _jsxs("span", { className: "text-left text-xs", children: [t('project.create.error'), ": ", error] })] })), _jsxs("form", { onSubmit: onSubmit, className: "space-y-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsx(InputField, { type: "text", label: t('project.create.name'), value: projectName, onChange: onProjectNameChange, required: true, placeholder: t('project.create.namePlaceholder'), className: "w-full", disabled: loading }), _jsxs("div", { className: "space-y-1.5 text-left", children: [_jsx("label", { htmlFor: "description-textarea", className: "block text-sm font-medium text-gray-700 dark:text-gray-300", children: t('project.create.description') }), _jsx("textarea", { id: "description-textarea", value: description, onChange: onDescriptionChange, rows: 4, placeholder: t('project.create.descriptionPlaceholder'), className: "w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-md shadow-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 disabled:bg-gray-100 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed", disabled: loading })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsx(InputField, { type: "number", label: t('project.create.gpuQuota'), value: gpuQuota, onChange: onGpuQuotaChange, placeholder: t('project.create.gpuQuotaPlaceholder'), className: "w-full", min: "0", disabled: loading }), _jsx(InputField, { type: "number", label: t('project.create.gpuThreadLimit'), value: mpsLimit, onChange: onMpsLimitChange, placeholder: t('project.create.gpuThreadLimitPlaceholder'), className: "w-full", min: "0", max: "100", disabled: loading }), _jsx(InputField, { type: "number", label: t('project.create.gpuMemoryLimit'), value: mpsMemory, onChange: onMpsMemoryChange, placeholder: t('project.create.gpuMemoryLimitPlaceholder'), className: "w-full", min: "0", disabled: loading })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("div", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: t('project.create.gpuAccessMode') }), _jsx("div", { className: "text-xs text-gray-500", children: t('project.create.mpsSettings') })] }), _jsxs("div", { className: "flex flex-wrap gap-4", children: [_jsxs("label", { className: "flex items-center space-x-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: gpuAccess.includes('shared'), onChange: () => onGpuAccessChange('shared'), className: "form-checkbox h-5 w-5 text-violet-600 rounded border-gray-300 focus:ring-violet-500 dark:border-gray-600 dark:bg-gray-700", disabled: loading }), _jsx("span", { className: "text-gray-700 dark:text-gray-300", children: t('project.create.gpuAccessShared') })] }), _jsxs("label", { className: "flex items-center space-x-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: gpuAccess.includes('dedicated'), onChange: () => onGpuAccessChange('dedicated'), className: "form-checkbox h-5 w-5 text-violet-600 rounded border-gray-300 focus:ring-violet-500 dark:border-gray-600 dark:bg-gray-700", disabled: loading }), _jsx("span", { className: "text-gray-700 dark:text-gray-300", children: t('project.create.gpuAccessDedicated') })] })] })] }), gpuAccess.includes('shared') && (_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-700", children: [_jsx(InputField, { type: "number", label: t('project.create.mpsThreadLimit'), value: mpsLimit, onChange: onMpsLimitChange, placeholder: "100", className: "w-full", min: "0", max: "100", disabled: loading }), _jsx(InputField, { type: "number", label: t('project.create.mpsMemoryLimit'), value: mpsMemory, onChange: onMpsMemoryChange, placeholder: "0 (\u7121\u9650\u5236)", className: "w-full", min: "0", disabled: loading })] })), _jsxs("div", { className: "space-y-1.5 text-left relative", ref: dropdownRef, children: [_jsx(InputField, { type: "text", id: "group-search", label: t('project.create.group'), value: searchTerm, onChange: handleSearchInputChange, onFocus: () => setIsDropdownOpen(true), placeholder: t('project.create.groupPlaceholder'), className: "w-full", required: true, disabled: loading, style: { borderColor: groupId > 0 ? '#4f46e5' : undefined } }), isDropdownOpen && (_jsx("ul", { className: "absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto", children: filteredGroups.length > 0 ? (filteredGroups.map((group) => (_jsxs("li", { onClick: () => handleSelectGroup(group), className: "px-4 py-2 cursor-pointer text-gray-800 dark:text-gray-200 hover:bg-violet-100 dark:hover:bg-violet-800 transition duration-100", children: [group.GroupName, _jsxs("span", { className: "text-xs text-gray-500 dark:text-gray-400 ml-2", children: ["(ID: ", group.GID, ")"] })] }, group.GID)))) : (_jsx("li", { className: "px-4 py-2 text-gray-500 dark:text-gray-400", children: t('project.create.noGroupsFound') })) })), groupId > 0 && (_jsxs("p", { className: "mt-1 text-sm text-green-600 dark:text-green-400", children: [t('project.create.selectedId'), " ", groupId] }))] }), _jsxs("div", { className: "flex gap-3 pt-2", children: [_jsx(Button, { type: "button", onClick: onClose, className: "flex-1 px-6 py-2.5 text-base font-semibold bg-white text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 transition duration-150 disabled:opacity-50", disabled: loading, children: t('project.create.cancel') }), _jsx(Button, { type: "submit", className: "flex-1 px-6 py-2.5 text-base font-semibold bg-violet-600 text-white rounded-md hover:bg-violet-700 transition duration-150 focus:outline-none focus:ring-4 focus:ring-violet-500 focus:ring-opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed", disabled: loading || groupId === 0, children: loading ? (_jsxs("span", { className: "flex items-center justify-center animate-pulse", children: [_jsx(SpinnerIcon, { className: "w-4 h-4 mr-2 text-white" }), t('project.create.creating')] })) : (t('project.create.submit')) })] })] })] }) }) }));
};
export default CreateProjectForm;
