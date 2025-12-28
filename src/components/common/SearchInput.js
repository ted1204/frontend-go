import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from '@tailadmin/utils';
const SearchInput = ({ value, onChange, placeholder }) => {
    const { t } = useTranslation();
    const ph = placeholder ?? t('search.placeholder');
    return (_jsxs("div", { className: "relative w-full sm:w-64", children: [_jsx("input", { type: "text", value: value, onChange: (e) => onChange(e.target.value), placeholder: ph, className: "w-full rounded-lg border border-gray-300 bg-transparent py-2 pl-10 pr-4 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:text-white dark:focus:border-blue-500" }), _jsx("svg", { className: "absolute left-3 top-2.5 h-5 w-5 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) })] }));
};
export default SearchInput;
