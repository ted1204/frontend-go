import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from '@nthucscc/utils';
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const { t } = useTranslation();
    if (totalPages <= 1)
        return null;
    return (_jsx("div", { className: "flex justify-center mt-6", children: _jsxs("nav", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: () => onPageChange(currentPage - 1), disabled: currentPage === 1, className: "px-3 py-1 rounded border border-gray-300 disabled:opacity-50 dark:border-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors", children: t('pagination_prev') }), _jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: t('pagination_pageOf', { current: currentPage, total: totalPages }) }), _jsx("button", { onClick: () => onPageChange(currentPage + 1), disabled: currentPage === totalPages, className: "px-3 py-1 rounded border border-gray-300 disabled:opacity-50 dark:border-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors", children: t('pagination_next') })] }) }));
};
export default Pagination;
