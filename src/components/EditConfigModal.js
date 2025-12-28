import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import Button from './ui/button/Button';
// Import Monaco Editor
import MonacoEditor from 'react-monaco-editor';
export default function EditConfigModal({ isOpen, onClose, onSave, selectedConfig, actionLoading, }) {
    const [formData, setFormData] = useState({
        filename: '',
        raw_yaml: '',
    });
    const [error, setError] = useState(null);
    const [editorTheme, setEditorTheme] = useState('vs-light');
    useEffect(() => {
        if (selectedConfig) {
            setFormData({
                filename: selectedConfig.Filename,
                raw_yaml: selectedConfig.Content,
            });
            setError(null);
        }
    }, [selectedConfig]);
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
    const handleSubmit = () => {
        if (!formData.filename.trim()) {
            setError('檔名為必填。');
            return;
        }
        if (!formData.raw_yaml.trim()) {
            setError('YAML 內容不能為空。');
            return;
        }
        setError(null);
        onSave(formData);
    };
    if (!isOpen || !selectedConfig)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in-0", children: _jsxs("div", { className: "relative flex h-full max-h-[95vh] w-full max-w-7xl flex-col rounded-xl border border-gray-200 bg-white shadow-2xl animate-in zoom-in-95 dark:border-gray-700 dark:bg-gray-800", children: [_jsxs("div", { className: "flex flex-shrink-0 items-center justify-between border-b border-gray-200 p-4 sm:p-6 dark:border-gray-700", children: [_jsxs("h3", { className: "text-xl font-bold text-gray-900 dark:text-white", children: ["\u7DE8\u8F2F:", ' ', _jsx("span", { className: "font-mono text-blue-600 dark:text-blue-400", children: formData.filename })] }), _jsx("button", { onClick: onClose, className: "rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-white", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18L18 6M6 6l12 12" }) }) })] }), _jsxs("div", { className: "flex-grow space-y-6 overflow-y-auto p-4 sm:p-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "filename", className: "block text-sm font-bold text-gray-800 dark:text-gray-200", children: "\u8A2D\u5B9A\u6A94\u540D\u7A31" }), _jsxs("div", { className: "flex rounded-lg shadow-sm", children: [_jsx("span", { className: "inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 sm:text-sm", children: "\u6A94\u540D:" }), _jsx("input", { id: "filename", type: "text", value: formData.filename, placeholder: "my-deployment.yaml", className: "\n                    block w-full flex-1 rounded-none rounded-r-lg   // Shape for grouping\n                    border border-gray-300 px-4 py-3 text-base        // Size and border\n                    text-gray-900 placeholder:text-gray-400         // Colors\n                    focus:border-blue-500 focus:ring-blue-500       // Focus state\n                    dark:border-gray-600 dark:bg-gray-900 dark:text-white\n                    dark:focus:border-blue-500 dark:focus:ring-blue-500\n                  ", onChange: (e) => setFormData({ ...formData, filename: e.target.value }) })] }), _jsx("p", { className: "mt-2 text-sm text-gray-500 dark:text-gray-400", children: "\u5FC5\u9808\u662F\u552F\u4E00\u7684\u540D\u7A31\uFF0C\u4E14\u4EE5 .yaml \u6216 .yml \u7D50\u5C3E\u3002" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300", children: "YAML \u5167\u5BB9" }), _jsx("div", { className: "editor-container mt-2 h-[450px] rounded-lg border border-gray-300 p-px shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 dark:border-gray-600", children: _jsx(MonacoEditor, { width: "100%", height: "100%", language: "yaml", theme: editorTheme, value: formData.raw_yaml, onChange: (newValue) => setFormData((prev) => ({ ...prev, raw_yaml: newValue })), options: {
                                            minimap: { enabled: true },
                                            scrollBeyondLastLine: false,
                                            fontSize: 14,
                                        } }) })] })] }), _jsxs("div", { className: "flex flex-shrink-0 flex-col-reverse items-center gap-4 rounded-b-xl border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50 sm:flex-row sm:justify-between", children: [_jsx("div", { className: "text-sm text-red-600 dark:text-red-400", children: error && `錯誤: ${error}` }), _jsxs("div", { className: "flex w-full gap-3 sm:w-auto", children: [_jsx(Button, { variant: "outline", onClick: onClose, className: "w-full", children: "\u53D6\u6D88" }), _jsx(Button, { variant: "primary", onClick: handleSubmit, disabled: actionLoading, className: "w-full", children: actionLoading ? '儲存中...' : '儲存變更' })] })] })] }) }));
}
