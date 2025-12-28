import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useTranslation } from '@tailadmin/utils';
import SearchBar from './SearchBar';
import ViewModeToggle from './ViewModeToggle';
import FormList from './FormList';
import PaginationWrapper from './PaginationWrapper';
const UserFormHistory = ({ loadingForms, currentForms, viewMode, setViewMode, searchTerm, setSearchTerm, currentPage, totalPages, setCurrentPage, statusText, }) => {
    const { t } = useTranslation();
    return (_jsxs("div", { className: "rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 p-6 mb-8", children: [_jsxs("div", { className: "mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2", children: [_jsx("h3", { className: "text-xl font-semibold text-gray-800 dark:text-white", children: t('form.history.title') }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(ViewModeToggle, { viewMode: viewMode, setViewMode: setViewMode }), _jsx(SearchBar, { value: searchTerm, onChange: setSearchTerm })] })] }), loadingForms ? (_jsx("div", { className: "py-8 text-center text-gray-400", children: t('form.history.loading') })) : (_jsxs(_Fragment, { children: [_jsx(FormList, { viewMode: viewMode, currentForms: currentForms, statusText: statusText }), _jsx(PaginationWrapper, { currentPage: currentPage, totalPages: totalPages, setCurrentPage: setCurrentPage })] }))] }));
};
export default UserFormHistory;
