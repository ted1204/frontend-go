import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable */
import { useEffect, useState } from 'react';
import UserFormApply from '../components/form/UserFormApply';
import UserFormHistory from '../components/form/UserFormHistory';
import TabSwitcher from '../components/form/TabSwitcher';
import { PageMeta } from '@tailadmin/ui';
import PageBreadcrumb from '../components/common/PageBreadCrumb';
import { useTranslation } from '@tailadmin/utils';
import { getProjects } from '../services/projectService';
import { createForm, getMyForms } from '../services/formService';
export default function UserFormDashboard() {
    // 新增 tab 狀態: 'history' 或 'apply'
    const [tab, setTab] = useState('history');
    const { t } = useTranslation();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedProject, setSelectedProject] = useState(undefined);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [success, setSuccess] = useState(null);
    const [myForms, setMyForms] = useState([]);
    const [loadingForms, setLoadingForms] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const filteredForms = myForms.filter((form) => form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (form.description && form.description.toLowerCase().includes(searchTerm.toLowerCase())));
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentForms = filteredForms.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredForms.length / itemsPerPage);
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);
    useEffect(() => {
        const fetchForms = async () => {
            setLoadingForms(true);
            try {
                const data = await getMyForms();
                setMyForms(data);
            }
            catch (e) {
                // ignore
            }
            finally {
                setLoadingForms(false);
            }
        };
        fetchForms();
    }, []);
    useEffect(() => {
        const load = async () => {
            try {
                const data = await getProjects();
                setProjects(data);
            }
            catch (e) {
                /* ignore silently */
            }
        };
        load();
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            setError(t('form.error.titleRequired'));
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await createForm({
                project_id: selectedProject,
                title: title.trim(),
                description,
            });
            setSuccess(t('form.success.submitted'));
            setTitle('');
            setDescription('');
            setSelectedProject(undefined);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : t('form.error.submitFailed'));
        }
        finally {
            setLoading(false);
        }
    };
    const statusText = (s) => (s ? t('form.status.' + s.toLowerCase()) : '');
    return (_jsxs("div", { children: [_jsx(TabSwitcher, { tab: tab, setTab: setTab, tabs: [
                    { key: 'history', label: t('form.history.title') },
                    { key: 'apply', label: t('form.apply.title') },
                ] }), _jsx(PageMeta, { title: t('form.page.title'), description: t('form.page.description') }), _jsx(PageBreadcrumb, { pageTitle: t('form.page.title') }), tab === 'history' && (_jsx(UserFormHistory, { loadingForms: loadingForms, filteredForms: filteredForms, currentForms: currentForms, viewMode: viewMode, setViewMode: setViewMode, searchTerm: searchTerm, setSearchTerm: setSearchTerm, itemsPerPage: itemsPerPage, currentPage: currentPage, totalPages: totalPages, setCurrentPage: setCurrentPage, statusText: statusText })), tab === 'apply' && (_jsx(UserFormApply, { projects: projects, selectedProject: selectedProject, setSelectedProject: setSelectedProject, title: title, setTitle: setTitle, description: description, setDescription: setDescription, loading: loading, error: error, success: success, handleSubmit: handleSubmit }))] }));
}
