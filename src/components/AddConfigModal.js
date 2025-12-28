import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import Button from './ui/button/Button';
import { getPVCList } from '../services/pvcService';
// Import Monaco Editor and its assets
import MonacoEditor from 'react-monaco-editor';
import { useTranslation } from '@tailadmin/utils';
export default function AddConfigModal({ isOpen, onClose, onCreate, actionLoading, project, }) {
    const [formData, setFormData] = useState({
        filename: '',
        raw_yaml: '',
    });
    const [error, setError] = useState(null);
    const [editorTheme, setEditorTheme] = useState('vs-light');
    const [activeTab, setActiveTab] = useState('wizard');
    const { t } = useTranslation();
    // Wizard State
    const [wizardData, setWizardData] = useState({
        image: '',
        gpu: 0,
        pvcName: '',
        mountPath: '/data',
        command: '',
        args: '',
    });
    const [pvcs, setPvcs] = useState([]);
    const [loadingPvcs, setLoadingPvcs] = useState(false);
    //  1. State to control the modal's presence in the DOM for animations
    const [isRendered, setIsRendered] = useState(false);
    //  2. useEffect hook to coordinate the enter and exit animations
    useEffect(() => {
        let timeoutId;
        if (isOpen) {
            // If opening, immediately render the component to play the enter animation
            setIsRendered(true);
            setFormData({ filename: '', raw_yaml: '' });
            setWizardData({
                image: '',
                gpu: 0,
                pvcName: '',
                mountPath: '/data',
                command: '',
                args: '',
            });
            setError(null);
            setActiveTab('wizard'); // Default to wizard
        }
        else {
            // If closing, wait for the animation to finish (e.g., 300ms) before unmounting
            timeoutId = setTimeout(() => setIsRendered(false), 300);
        }
        // Cleanup the timeout if the component unmounts or isOpen changes again
        return () => clearTimeout(timeoutId);
    }, [isOpen]);
    // Fetch PVCs when modal opens and project is available
    useEffect(() => {
        const fetchPvcs = async () => {
            if (isOpen && project) {
                setLoadingPvcs(true);
                try {
                    // Assuming project.ProjectName is the namespace or we use a default
                    // [Backend Requirement] Ensure getPVCList returns PVC[]
                    const pvcList = await getPVCList(project.ProjectName);
                    // Cast to array if necessary, or handle single object
                    if (Array.isArray(pvcList)) {
                        setPvcs(pvcList);
                    }
                    else {
                        // Fallback if it returns a single object or different structure
                        // For now, wrap in array if it looks like a single PVC, or empty
                        setPvcs(pvcList ? [pvcList] : []);
                    }
                }
                catch (err) {
                    console.error('Failed to fetch PVCs:', err);
                    // Don't block the UI, just show empty list
                }
                finally {
                    setLoadingPvcs(false);
                }
            }
        };
        fetchPvcs();
    }, [isOpen, project]);
    // Effect to dynamically set the editor's theme based on light/dark mode
    useEffect(() => {
        const isDarkMode = document.documentElement.classList.contains('dark');
        setEditorTheme(isDarkMode ? 'vs-dark' : 'vs-light');
        const observer = new MutationObserver(() => {
            setEditorTheme(document.documentElement.classList.contains('dark') ? 'vs-dark' : 'vs-light');
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });
        return () => observer.disconnect();
    }, []);
    const generateYAML = useCallback(() => {
        const { image, gpu, pvcName, mountPath, command, args } = wizardData;
        const name = formData.filename.replace(/\.(yaml|yml)$/, '') || 'app';
        let yaml = `apiVersion: v1
kind: Pod
metadata:
  name: ${name}
spec:
  containers:
    - name: ${name}
      image: ${image}
      resources:
        limits:
          nvidia.com/gpu: ${gpu}
`;
        if (command) {
            yaml += `      command: [${command
                .split(' ')
                .map((c) => `"${c}"`)
                .join(', ')}]\n`;
        }
        if (args) {
            yaml += `      args: [${args
                .split(' ')
                .map((a) => `"${a}"`)
                .join(', ')}]\n`;
        }
        if (pvcName) {
            yaml += `      volumeMounts:
        - mountPath: ${mountPath}
          name: data-volume
  volumes:
    - name: data-volume
      persistentVolumeClaim:
        claimName: ${pvcName}
`;
        }
        else {
            // Close containers list if no volumes
            yaml += `\n`;
        }
        return yaml;
    }, [wizardData, formData.filename]);
    // Update YAML when switching to YAML tab
    useEffect(() => {
        if (activeTab === 'yaml') {
            // Only auto-generate if YAML is empty or we want to overwrite?
            // Let's overwrite if it's empty or looks like a previous generation
            if (!formData.raw_yaml || formData.raw_yaml.trim() === '') {
                setFormData((prev) => ({ ...prev, raw_yaml: generateYAML() }));
            }
        }
    }, [activeTab, generateYAML, formData.raw_yaml]);
    const handleSubmit = () => {
        // Validation logic remains the same
        if (!formData.filename.trim()) {
            setError(t('config.error.filenameRequired'));
            return;
        }
        if (!formData.filename.endsWith('.yaml') && !formData.filename.endsWith('.yml')) {
            setError(t('config.error.filenameSuffix'));
            return;
        }
        let finalYaml = formData.raw_yaml;
        if (activeTab === 'wizard') {
            finalYaml = generateYAML();
        }
        if (!finalYaml.trim()) {
            setError(t('config.error.yamlEmpty'));
            return;
        }
        setError(null);
        onCreate({ ...formData, raw_yaml: finalYaml });
    };
    //  3. Use isRendered to control the final return
    if (!isRendered)
        return null;
    return (
    //  4. Conditionally apply enter/exit animation classes based on the isOpen prop
    _jsx("div", { className: `fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm 
                 ${isOpen ? 'animate-in fade-in-0' : 'animate-out fade-out-0'}`, children: _jsxs("div", { className: `relative flex h-full max-h-[95vh] w-full max-w-7xl flex-col rounded-xl border border-gray-200 bg-white shadow-2xl 
                       ${isOpen
                ? 'animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-12 duration-300'
                : 'animate-out fade-out-0 zoom-out-95 slide-out-to-bottom-12 duration-300'}`, children: [_jsxs("div", { className: "flex flex-shrink-0 items-center justify-between border-b border-gray-200 p-4 sm:p-6 dark:border-gray-700", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-xl font-bold text-gray-900 dark:text-white", children: t('config.createTitle') }), _jsx("p", { className: "mt-1 text-sm text-gray-500 dark:text-gray-400", children: t('config.createSubtitle') })] }), _jsx("button", { onClick: onClose, className: "rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-white", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18L18 6M6 6l12 12" }) }) })] }), _jsx("div", { className: "border-b border-gray-200 px-6 dark:border-gray-700", children: _jsxs("nav", { className: "-mb-px flex space-x-8", "aria-label": "Tabs", children: [_jsx("button", { onClick: () => setActiveTab('wizard'), className: `
                whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium
                ${activeTab === 'wizard'
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}
              `, children: t('config.tab.wizard') }), _jsx("button", { onClick: () => setActiveTab('yaml'), className: `
                whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium
                ${activeTab === 'yaml'
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}
              `, children: t('config.tab.yaml') })] }) }), _jsxs("div", { className: "flex-grow space-y-8 overflow-y-auto p-4 sm:p-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "filename", className: "block text-sm font-bold text-gray-800 dark:text-gray-200", children: t('config.filename.label') }), _jsxs("div", { className: "flex rounded-lg shadow-sm", children: [_jsx("span", { className: "inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 sm:text-sm", children: t('config.filename.prefix') }), _jsx("input", { id: "filename", type: "text", value: formData.filename, placeholder: "my-new-deployment.yaml", className: "block w-full flex-1 rounded-none rounded-r-lg border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500", onChange: (e) => setFormData({ ...formData, filename: e.target.value }) })] }), _jsx("p", { className: "mt-2 text-sm text-gray-500 dark:text-gray-400", children: t('config.filename.note') })] }), activeTab === 'wizard' && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-2", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300", children: t('config.wizard.imageLabel') }), _jsx("input", { type: "text", placeholder: "e.g., nginx:latest", value: wizardData.image, onChange: (e) => setWizardData({ ...wizardData, image: e.target.value }), className: "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500" }), _jsx("p", { className: "text-xs text-gray-500", children: t('config.wizard.imageNote') })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300", children: t('config.wizard.gpuLabel') }), _jsx("input", { type: "number", min: "0", value: wizardData.gpu, onChange: (e) => setWizardData({
                                                        ...wizardData,
                                                        gpu: parseInt(e.target.value) || 0,
                                                    }), className: "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500" })] })] }), _jsxs("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-2", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300", children: t('config.wizard.pvcLabel') }), _jsxs("select", { value: wizardData.pvcName, onChange: (e) => setWizardData({ ...wizardData, pvcName: e.target.value }), className: "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500", children: [_jsx("option", { value: "", children: t('config.pvc.placeholder') }), loadingPvcs ? (_jsx("option", { disabled: true, children: t('config.pvc.loading') })) : (pvcs.map((pvc) => (_jsxs("option", { value: pvc.name, children: [pvc.name, " (", pvc.size, ")"] }, pvc.name))))] }), _jsx("p", { className: "text-xs text-gray-500", children: t('config.pvc.note') })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300", children: t('config.mountPath') }), _jsx("input", { type: "text", placeholder: "/data", value: wizardData.mountPath, onChange: (e) => setWizardData({
                                                        ...wizardData,
                                                        mountPath: e.target.value,
                                                    }), disabled: !wizardData.pvcName, className: "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300", children: t('config.commandLabel') }), _jsx("input", { type: "text", placeholder: "e.g., /bin/sh -c", value: wizardData.command, onChange: (e) => setWizardData({ ...wizardData, command: e.target.value }), className: "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300", children: t('config.argsLabel') }), _jsx("input", { type: "text", placeholder: "e.g., echo hello", value: wizardData.args, onChange: (e) => setWizardData({ ...wizardData, args: e.target.value }), className: "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500" })] })] })), activeTab === 'yaml' && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-bold text-gray-800 dark:text-gray-200", children: t('config.yamlContentLabel') }), _jsx("div", { className: "editor-container mt-2 h-[450px] rounded-lg border border-gray-300 p-px shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 dark:border-gray-600", children: _jsx(MonacoEditor, { width: "100%", height: "100%", language: "yaml", theme: editorTheme, value: formData.raw_yaml, onChange: (newValue) => setFormData((prev) => ({ ...prev, raw_yaml: newValue })), options: {
                                            minimap: { enabled: true },
                                            scrollBeyondLastLine: false,
                                            fontSize: 14,
                                        } }) })] }))] }), _jsxs("div", { className: "flex flex-shrink-0 flex-col-reverse items-center gap-4 rounded-b-xl border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50 sm:flex-row sm:justify-between", children: [_jsx("div", { className: "text-sm text-red-600 dark:text-red-400", children: error && `${t('label.error')}: ${error}` }), _jsxs("div", { className: "flex w-full gap-3 sm:w-auto", children: [_jsx(Button, { variant: "outline", onClick: onClose, className: "w-full", children: t('form.cancel') }), _jsx(Button, { variant: "primary", onClick: handleSubmit, disabled: actionLoading, className: "w-full", children: actionLoading ? t('config.creating') : t('config.createButton') })] })] })] }) }));
}
