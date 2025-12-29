import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PageMeta } from '@tailadmin/ui';
import PageBreadcrumb from './common/PageBreadCrumb';
import { getProjectById } from '../services/projectService';
import { getConfigFilesByProjectId, createConfigFile, updateConfigFile, deleteConfigFile, createInstance, deleteInstance, } from '../services/configFileService';
import { getPVCListByProject } from '../services/pvcService';
import AddConfigModal from './AddConfigModal';
import ConfigFileList from './ConfigFileList';
import PVCList from './PVCList';
import EditConfigModal from './EditConfigModal';
import { useGlobalWebSocket } from '../context/useGlobalWebSocket';
import MonitoringPanel from './MonitoringPanel';
import Button from './ui/button/Button';
import { getUsername } from '../services/authService';
import CreateFormModal from './CreateFormModal';
import ProjectMembers from './ProjectMembers';
import { useTranslation } from '@tailadmin/utils';
// Helper component for the initial page loading state (Skeleton)
const PageSkeleton = () => (_jsxs("div", { className: "animate-pulse", children: [_jsx("div", { className: "mb-6 h-8 w-1/3 rounded-md bg-gray-200 dark:bg-gray-700" }), _jsxs("div", { className: "grid grid-cols-1 gap-8", children: [_jsx("div", { className: "col-span-full", children: _jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800", children: [_jsx("div", { className: "mb-4 h-8 w-3/4 rounded-md bg-gray-300 dark:bg-gray-600" }), _jsx("div", { className: "h-40 w-full rounded bg-gray-200 dark:bg-gray-700" })] }) }), _jsxs("div", { className: "space-y-8 col-span-full", children: [_jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800", children: [_jsx("div", { className: "mb-4 h-8 w-1/2 rounded-md bg-gray-300 dark:bg-gray-600" }), _jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "h-4 w-full rounded bg-gray-200 dark:bg-gray-700" }), _jsx("div", { className: "h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" }), _jsx("div", { className: "h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" })] })] }), _jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800", children: [_jsx("div", { className: "mb-4 h-8 w-1/3 rounded-md bg-gray-300 dark:bg-gray-600" }), _jsx("div", { className: "h-10 w-full rounded bg-gray-200 dark:bg-gray-700" })] })] })] })] }));
// Helper for displaying error or not found states
const StateDisplay = ({ title, message }) => (_jsxs("div", { className: "flex h-96 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 text-center dark:border-gray-700 dark:bg-gray-800", children: [_jsx("h3", { className: "text-xl font-semibold text-gray-800 dark:text-white", children: title }), _jsx("p", { className: "mt-2 text-gray-500 dark:text-gray-400", children: message })] }));
export default function ProjectDetail() {
    const { t } = useTranslation();
    const { id } = useParams();
    if (!id)
        throw new Error(t('projectDetail.needProjectId'));
    // State management remains largely the same
    const { getProjectMessages } = useGlobalWebSocket();
    const username = getUsername();
    const namespace = `proj-${id}-${username}`;
    const messages = getProjectMessages(namespace);
    const [project, setProject] = useState(null);
    const [configFiles, setConfigFiles] = useState([]);
    const [pvcs, setPvcs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
    const [selectedConfig, setSelectedConfig] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    // Data fetching logic remains the same, fetching Project and Config Files in parallel
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const projectId = parseInt(id);
                const projectData = await getProjectById(projectId);
                const [configData, pvcData] = await Promise.all([
                    getConfigFilesByProjectId(projectId),
                    getPVCListByProject(projectId),
                ]);
                setProject(projectData);
                setConfigFiles(configData);
                setPvcs(pvcData);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : t('projectDetail.fetchError'));
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);
    // Handler functions for CRUD operations
    const handleCreate = async (data) => {
        setActionLoading(true);
        try {
            await createConfigFile({ ...data, project_id: parseInt(id) });
            setIsCreateModalOpen(false);
            const updated = await getConfigFilesByProjectId(parseInt(id));
            setConfigFiles(updated);
            setError(null);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : t('projectDetail.createConfigError'));
        }
        finally {
            setActionLoading(false);
        }
    };
    const handleUpdate = async (data) => {
        if (!selectedConfig)
            return;
        setActionLoading(true);
        try {
            await updateConfigFile(selectedConfig.CFID, {
                filename: data.filename || selectedConfig.Filename,
                raw_yaml: data.raw_yaml || selectedConfig.Content,
            });
            setIsEditModalOpen(false);
            const updated = await getConfigFilesByProjectId(parseInt(id));
            setConfigFiles(updated);
            setError(null);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : t('projectDetail.updateConfigError'));
        }
        finally {
            setActionLoading(false);
        }
    };
    const handleDelete = async (configId) => {
        if (confirm(t('common.confirmDelete'))) {
            setActionLoading(true);
            try {
                await deleteConfigFile(configId);
                const updated = await getConfigFilesByProjectId(parseInt(id));
                setConfigFiles(updated);
                setError(null);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : t('projectDetail.deleteConfigError'));
            }
            finally {
                setActionLoading(false);
            }
        }
    };
    // Handler for creating an instance from a config file
    const handleCreateInstance = async (id) => {
        setActionLoading(true);
        try {
            await createInstance(id);
            alert(t('projectDetail.instanceCreateSent'));
            setError(null);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : t('projectDetail.createInstanceError'));
        }
        finally {
            setActionLoading(false);
        }
    };
    // Handler for deleting an instance
    const handleDeleteInstance = async (id) => {
        if (confirm(t('projectDetail.confirmDeleteInstance'))) {
            setActionLoading(true);
            try {
                await deleteInstance(id);
                alert(t('projectDetail.instanceDeleteSent'));
                setError(null);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : t('projectDetail.deleteInstanceError'));
            }
            finally {
                setActionLoading(false);
            }
        }
    };
    // Prepares the config file data for the Edit Modal
    const handleEdit = (config) => {
        setSelectedConfig(config);
        setIsEditModalOpen(true);
    };
    // Render loading skeleton first
    if (loading)
        return _jsx(PageSkeleton, {});
    // Render error or not found states
    if (error)
        return _jsx(StateDisplay, { title: t('projectDetail.errorTitle'), message: error });
    if (!project)
        return (_jsx(StateDisplay, { title: t('projectDetail.notFoundTitle'), message: t('projectDetail.notFoundMessage', { id }) }));
    return (_jsxs("div", { children: [_jsx(PageMeta, { title: `${project.ProjectName} | ${t('projectDetail.titleSuffix')}`, description: t('projectDetail.description', {
                    name: project.ProjectName,
                }) }), _jsx(PageBreadcrumb, { pageTitle: project.ProjectName }), _jsx("div", { className: "mb-6 border-b border-gray-200 dark:border-gray-700", children: _jsx("nav", { className: "-mb-px flex space-x-8", "aria-label": "Tabs", children: [
                        { id: 'overview', label: t('projectDetail.tab.overview') },
                        {
                            id: 'configurations',
                            label: t('projectDetail.tab.configurations'),
                        },
                        { id: 'storage', label: t('projectDetail.tab.storage') },
                        { id: 'members', label: t('projectDetail.tab.members') },
                    ].map((tab) => (_jsx("button", { onClick: () => setActiveTab(tab.id), className: `
                  whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium capitalize
                  ${activeTab === tab.id
                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}
                `, children: tab.label }, tab.id))) }) }), _jsxs("div", { className: "mt-6", children: [activeTab === 'overview' && (_jsxs("div", { className: "flex flex-col gap-8", children: [_jsxs("div", { className: "overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800", children: [_jsxs("div", { className: "flex items-center justify-between border-b border-gray-200 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-800/50", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6 text-blue-600 dark:text-blue-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" }) }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-bold text-gray-900 dark:text-white", children: project.ProjectName }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: t('projectDetail.infoLabel') })] })] }), _jsx("div", { className: "flex gap-2", children: _jsx("button", { onClick: () => setIsTicketModalOpen(true), className: "rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800 dark:hover:bg-gray-700 dark:hover:text-white", title: t('project.requestSupport'), children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" }) }) }) })] }), _jsxs("div", { className: "p-6", children: [_jsx("p", { className: "mb-6 text-gray-600 dark:text-gray-300", children: project.Description || t('project.noDescription') }), _jsx("hr", { className: "mb-6 border-gray-200 dark:border-gray-700" }), _jsxs("dl", { className: "grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 flex-shrink-0 text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" }) }), _jsxs("div", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 dark:text-gray-400", children: t('project.idLabel', { id: project.PID }) }), _jsx("dd", { className: "mt-1 font-mono text-sm text-gray-900 dark:text-white", children: project.PID })] })] }), _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 flex-shrink-0 text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" }) }), _jsxs("div", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 dark:text-gray-400", children: t('project.members.title') }), _jsx("dd", { className: "mt-1", children: _jsxs("span", { className: "inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900/50 dark:text-blue-300", children: ["ID: ", project.GID] }) })] })] }), _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 flex-shrink-0 text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" }) }), _jsxs("div", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 dark:text-gray-400", children: t('project.gpuResources') }), _jsx("dd", { className: "mt-1 text-sm text-gray-900 dark:text-white", children: _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("span", { children: t('project.gpuQuotaUnit', { quota: project.GPUQuota }) }), _jsx("span", { children: t('project.gpuAccessMode', { mode: t(`project.gpuAccess${project.GPUAccess?.charAt(0).toUpperCase() + project.GPUAccess?.slice(1)}`) }) })] }) })] })] }), _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 flex-shrink-0 text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M13 10V3L4 14h7v7l9-11h-7z" }) }), _jsxs("div", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 dark:text-gray-400", children: t('project.mpsSettings') }), _jsx("dd", { className: "mt-1 text-sm text-gray-900 dark:text-white", children: _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("span", { children: t('project.mpsThreadLimit', { value: project.MPSLimit ? `${project.MPSLimit}%` : t('project.mpsUnlimited') }) }), _jsx("span", { children: t('project.mpsMemoryLimit', { value: project.MPSMemory ? `${project.MPSMemory} MB` : t('project.mpsUnlimited') }) })] }) })] })] }), _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 flex-shrink-0 text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }) }), _jsxs("div", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 dark:text-gray-400", children: t('projectDetail.createdAt') }), _jsx("dd", { className: "mt-1 text-sm text-gray-900 dark:text-white", children: new Date(project.CreatedAt).toLocaleString() })] })] }), _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 flex-shrink-0 text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4 4v5h5M23 18v-5h-5m-4-1V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v4h-4a1 1 0 00-1 1v4a1 1 0 001 1h4v4a1 1 0 001 1h4a1 1 0 001-1v-4h4a1 1 0 001-1v-4a1 1 0 00-1-1h-4z" }) }), _jsxs("div", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 dark:text-gray-400", children: t('projectDetail.updatedAt') }), _jsx("dd", { className: "mt-1 text-sm text-gray-900 dark:text-white", children: new Date(project.UpdatedAt).toLocaleString() })] })] })] })] })] }), _jsxs("div", { className: "rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700/50 dark:bg-gray-800/60 backdrop-blur-lg", children: [_jsxs("div", { className: "flex items-center gap-4 border-b border-gray-900/10 pb-4 dark:border-gray-50/10", children: [_jsx("div", { className: "grid h-10 w-10 flex-shrink-0 place-content-center rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }) }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-bold text-gray-900 dark:text-white", children: t('monitor.panel.title') }), _jsx("p", { className: "mt-1 text-sm text-gray-500 dark:text-gray-400", children: t('monitor.panel.subtitle') })] })] }), _jsx(MonitoringPanel, { messages: messages })] })] })), activeTab === 'configurations' && (_jsxs("div", { className: "rounded-xl border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800", children: [_jsxs("div", { className: "flex items-center justify-between border-b border-gray-200 p-4 sm:p-6 dark:border-gray-600", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold leading-6 text-gray-900 dark:text-white", children: t('projectDetail.configTitle') }), _jsx("p", { className: "mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400", children: t('projectDetail.configDesc') })] }), _jsxs(Button, { onClick: () => setIsCreateModalOpen(true), disabled: actionLoading, className: "inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm transition-all duration-150 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-800", children: [_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z", clipRule: "evenodd" }) }), actionLoading ? t('common.loading') : t('projectDetail.addConfig')] })] }), _jsx("div", { className: "p-4 sm:p-6", children: _jsx(ConfigFileList, { configFiles: configFiles, onDelete: handleDelete, onEdit: handleEdit, onCreateInstance: handleCreateInstance, onDeleteInstance: handleDeleteInstance, actionLoading: actionLoading }) })] })), activeTab === 'storage' && (_jsxs("div", { className: "rounded-xl border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800", children: [_jsx("div", { className: "flex items-center justify-between border-b border-gray-200 p-4 sm:p-6 dark:border-gray-600", children: _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold leading-6 text-gray-900 dark:text-white", children: t('projectDetail.pvcTitle') }), _jsx("p", { className: "mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400", children: t('projectDetail.pvcDesc') })] }) }), _jsx("div", { className: "p-4 sm:p-6", children: _jsx(PVCList, { pvcs: pvcs, namespace: `proj-${project.PID}-${getUsername()}`, pods: messages }) })] })), activeTab === 'members' && _jsx(ProjectMembers, { groupId: project.GID })] }), _jsx(AddConfigModal, { isOpen: isCreateModalOpen, onClose: () => setIsCreateModalOpen(false), onCreate: handleCreate, actionLoading: actionLoading, project: project }), _jsx(EditConfigModal, { isOpen: isEditModalOpen, onClose: () => setIsEditModalOpen(false), onSave: handleUpdate, selectedConfig: selectedConfig, actionLoading: actionLoading }), _jsx(CreateFormModal, { isOpen: isTicketModalOpen, onClose: () => setIsTicketModalOpen(false), projectId: project.PID })] }));
}
