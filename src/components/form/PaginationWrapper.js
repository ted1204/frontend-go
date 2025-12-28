import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from '@tailadmin/utils';
const PaginationWrapper = ({ currentPage, totalPages, setCurrentPage, className = '', }) => {
    const { t } = useTranslation();
    if (totalPages <= 1)
        return null;
    return (_jsxs("div", { className: className + ' mt-4 flex items-center gap-2', children: [_jsx("button", { className: "mr-2 px-3 py-1 rounded border bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50", onClick: () => setCurrentPage(Math.max(1, currentPage - 1)), disabled: currentPage === 1, children: t('pagination.prev') }), _jsx("span", { className: "text-sm text-gray-500 dark:text-gray-400", children: t('pagination.pageOf', { current: currentPage, total: totalPages }) }), _jsx("button", { className: "ml-2 px-3 py-1 rounded border bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50", onClick: () => setCurrentPage(Math.min(totalPages, currentPage + 1)), disabled: currentPage === totalPages, children: t('pagination.next') })] }));
};
export default PaginationWrapper;
