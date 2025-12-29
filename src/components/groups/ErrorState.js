import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/groups/ErrorState.tsx
import { useTranslation } from '@tailadmin/utils';
const ErrorState = ({ message }) => {
    const { t } = useTranslation();
    return (_jsxs("div", { className: "rounded-lg bg-red-50 p-4 text-center dark:bg-red-900/30", children: [_jsx("h3", { className: "text-sm font-semibold text-red-800 dark:text-red-300", children: t('groups.error.loadFailed') }), _jsx("p", { className: "mt-1 text-sm text-red-700 dark:text-red-400", children: message })] }));
};
export default ErrorState;
