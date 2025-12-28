import { jsx as _jsx } from "react/jsx-runtime";
const TabSwitcher = ({ tab, setTab, tabs }) => (_jsx("div", { className: "mb-6 flex gap-2", children: tabs.map((t) => (_jsx("button", { className: `px-4 py-2 rounded-t-lg border-b-2 transition-colors font-semibold ${tab === t.key ? 'border-violet-600 text-violet-600 bg-white dark:bg-gray-800' : 'border-transparent text-gray-500 bg-gray-100 dark:bg-gray-700'}`, onClick: () => setTab(t.key), children: t.label }, t.key))) }));
export default TabSwitcher;
