import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { PageMeta } from '@tailadmin/ui';
import { useTranslation } from '@tailadmin/utils';
export default function Home() {
    const { t } = useTranslation();
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: t('page.home.title') || 'Dashboard', description: t('page.home.description') || '' }), _jsx("div", { className: "grid grid-cols-1 gap-4 md:gap-6", children: _jsxs("div", { className: "rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-800 dark:text-white", children: t('home.welcome') }), _jsx("p", { className: "mt-2 text-gray-500 dark:text-gray-400", children: t('home.subtitle') })] }) })] }));
}
