import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useEffect } from 'react';
// Assuming the Button component is available via relative path
import Button from '../button/Button';
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, item, itemType, loading = false, }) => {
    const modalRef = useRef(null);
    // Handle ESC key press to close the modal
    useEffect(() => {
        if (!isOpen)
            return;
        const handleKeydown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeydown);
        return () => {
            document.removeEventListener('keydown', handleKeydown);
        };
    }, [isOpen, onClose]);
    // Do not render if the modal is closed or no item is selected
    if (!isOpen || !item) {
        return null;
    }
    // Determine the display name, covering various item types
    const itemName = item.GroupName ||
        item.ProjectName ||
        item.Filename ||
        (item.GID ? `ID: ${item.GID}` : '') ||
        (item.PID ? `ID: ${item.PID}` : '') ||
        (item.CFID ? `ID: ${item.CFID}` : '') ||
        'Unknown Item';
    return (
    // Modal Overlay container (fixed position with high z-index)
    _jsx("div", { ref: modalRef, 
        // Outer z-index is 50
        className: "fixed inset-0 z-50 overflow-y-auto", "aria-labelledby": "modal-title", role: "dialog", "aria-modal": "true", children: _jsxs("div", { className: "flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0", children: [_jsx("div", { className: "fixed inset-0 bg-black/40 transition-opacity dark:bg-black/50 z-40", "aria-hidden": "true", onClick: onClose }), _jsx("span", { className: "hidden sm:inline-block sm:align-middle sm:h-screen", "aria-hidden": "true", children: "\u200B" }), _jsxs("div", { 
                    // Added 'relative z-50' to ensure content panel floats above the z-40 backdrop
                    className: "inline-block align-bottom bg-white rounded-lg text-left overflow-hidden \n                     shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full \n                     dark:bg-gray-800 relative z-50", children: [_jsx("div", { className: "bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 dark:bg-gray-800", children: _jsxs("div", { className: "sm:flex sm:items-start", children: [_jsx("div", { className: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10 dark:bg-red-900/50", children: _jsx("svg", { className: "h-6 w-6 text-red-600 dark:text-red-400", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", "aria-hidden": "true", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.3 16c-.77 1.333.192 3 1.732 3z" }) }) }), _jsxs("div", { className: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left", children: [_jsxs("h3", { className: "text-lg leading-6 font-bold text-gray-900 dark:text-white", id: "modal-title", children: ["\u522A\u9664 ", itemType] }), _jsxs("div", { className: "mt-2", children: [_jsxs("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: ["\u60A8\u78BA\u5B9A\u8981\u6C38\u4E45\u522A\u9664 ", itemType, "\uFF1A", _jsxs("span", { className: "font-semibold text-gray-700 dark:text-gray-200", children: [' ', "\"", itemName, "\""] }), "? \u6B64\u52D5\u4F5C\u7121\u6CD5\u5FA9\u539F\u3002"] }), _jsx("p", { className: "mt-2 text-xs font-medium text-red-600 dark:text-red-500", children: "\u6240\u6709\u76F8\u95DC\u8CC7\u6599\u53EF\u80FD\u6703\u907A\u5931\u3002" })] })] })] }) }), _jsxs("div", { className: "bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse dark:bg-gray-900/50", children: [_jsx(Button, { type: "button", onClick: onConfirm, disabled: loading, className: "w-full inline-flex justify-center rounded-md border border-transparent shadow-sm \n                          px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 \n                          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm\n                          disabled:opacity-50 disabled:cursor-not-allowed transition duration-150", children: loading ? '刪除中...' : `刪除 ${itemType}` }), _jsx(Button, { type: "button", onClick: onClose, disabled: loading, className: "mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm \n                          px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm \n                          dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600\n                          disabled:opacity-50 disabled:cursor-not-allowed transition duration-150", children: "\u53D6\u6D88" })] })] })] }) }));
};
export default DeleteConfirmationModal;
