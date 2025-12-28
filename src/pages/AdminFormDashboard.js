import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { getAllForms, updateFormStatus } from '../services/formService';
import { FormStatus } from '../interfaces/form';
import { PageMeta } from '@tailadmin/ui';
import PageBreadcrumb from '../components/common/PageBreadCrumb';
import { useTranslation } from '@tailadmin/utils';
export default function AdminFormDashboard() {
    const { t } = useTranslation();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchTickets = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getAllForms();
            setTickets(data);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : t('error.initData'));
        }
        finally {
            setLoading(false);
        }
    }, [t]);
    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);
    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateFormStatus(id, newStatus);
            setTickets((prev) => prev.map((t) => (t.ID === id ? { ...t, status: newStatus } : t)));
        }
        catch (err) {
            alert((t('form.createFailed') || 'Unable to update status: ') +
                (err instanceof Error ? err.message : String(err)));
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case FormStatus.Pending:
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
            case FormStatus.Processing:
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
            case FormStatus.Completed:
                return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
            case FormStatus.Rejected:
                return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    const getStatusText = (status) => {
        switch (status) {
            case FormStatus.Pending:
                return t('form.status.pending') || 'Pending';
            case FormStatus.Processing:
                return t('form.status.processing') || 'Processing';
            case FormStatus.Completed:
                return t('form.status.completed') || 'Completed';
            case FormStatus.Rejected:
                return t('form.status.rejected') || 'Rejected';
            default:
                return status;
        }
    };
    if (loading)
        return _jsx("div", { className: "p-6 text-center", children: t('loading.forms') || 'Loading forms...' });
    if (error)
        return _jsx("div", { className: "p-6 text-center text-red-500", children: error });
    return (_jsxs("div", { children: [_jsx(PageMeta, { title: t('page.adminForm.title') || 'Forms Dashboard', description: t('page.adminForm.description') || '' }), _jsx(PageBreadcrumb, { pageTitle: t('admin.forms') || 'Forms' }), _jsx("div", { className: "rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", children: [_jsx("thead", { className: "bg-gray-50 dark:bg-gray-700/50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400", children: "ID" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400", children: t('table.id') || 'ID' }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400", children: t('table.user') || 'User' }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400", children: t('table.project') || 'Project' }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400", children: t('table.titleDesc') || 'Title / Description' }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400", children: t('table.status') || 'Status' }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400", children: t('table.actions') || 'Actions' })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800", children: tickets.map((ticket) => (_jsxs("tr", { children: [_jsxs("td", { className: "whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400", children: ["#", ticket.ID] }), _jsx("td", { className: "whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white", children: ticket.user?.Username || ticket.user_id }), _jsx("td", { className: "whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400", children: ticket.project ? (_jsx("span", { className: "font-mono", children: ticket.project.ProjectName })) : ('-') }), _jsxs("td", { className: "px-6 py-4", children: [_jsx("div", { className: "text-sm font-medium text-gray-900 dark:text-white", children: ticket.title }), _jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: ticket.description })] }), _jsx("td", { className: "whitespace-nowrap px-6 py-4", children: _jsx("span", { className: `inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(ticket.status)}`, children: getStatusText(ticket.status) }) }), _jsx("td", { className: "whitespace-nowrap px-6 py-4 text-sm font-medium", children: _jsxs("div", { className: "flex gap-2", children: [ticket.status === FormStatus.Pending && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => handleStatusChange(ticket.ID, FormStatus.Processing), className: "text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300", children: t('form.action.process') }), _jsx("button", { onClick: () => handleStatusChange(ticket.ID, FormStatus.Rejected), className: "text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300", children: t('form.action.reject') })] })), ticket.status === FormStatus.Processing && (_jsx("button", { onClick: () => handleStatusChange(ticket.ID, FormStatus.Completed), className: "text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300", children: t('form.action.complete') }))] }) })] }, ticket.ID))) })] }) }) })] }));
}
