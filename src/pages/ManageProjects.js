import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/ManageProjects.tsx
import { useState, useEffect } from 'react';
import ProjectList from '../components/ProjectList';
import { getProjects, createProject, deleteProject, } from '../services/projectService';
// removed unused import: useNavigate
import EditProjectForm from '../components/EditProjectForm';
import CreateProjectForm from '../components/CreateProjectForm';
import { Button } from '@tailadmin/ui';
import DeleteConfirmationModal from '../components/ui/modal/DeleteConfirmationModal';
import { updateProject } from '../services/projectService';
import { getGroups } from '../services/groupService';
import { useTranslation } from '@tailadmin/utils';
// ----------------------------------------------------------------
const PlusIcon = ({ className = 'w-5 h-5' }) => (_jsx("svg", { className: className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 4v16m8-8H4" }) }));
export default function ManageProjects() {
    const { t } = useTranslation();
    // Project States
    const [allProjects, setAllProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    // Group/Form States
    const [availableGroups, setAvailableGroups] = useState([]); // Groups for dropdown
    const [selectedGroupName, setSelectedGroupName] = useState(''); // Name for dropdown display
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [gpuQuota, setGpuQuota] = useState(0);
    const [gpuAccess, setGpuAccess] = useState(['shared']);
    const [mpsLimit, setMpsLimit] = useState(100);
    const [mpsMemory, setMpsMemory] = useState(0);
    const [groupId, setGroupId] = useState(0); // Group ID to submit
    // UI/API States
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false); // 2. Add dedicated action loading state
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    // 3. Add delete confirmation related states
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);
    // Edit Modal States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [projectToEdit, setProjectToEdit] = useState(null);
    // navigation not used currently
    const handleProjectClick = (projectId) => {
        // Instead of navigating, open edit modal
        const project = allProjects.find((p) => p.PID === projectId);
        if (project) {
            setProjectToEdit(project);
            setProjectName(project.ProjectName);
            setDescription(project.Description || '');
            setGpuQuota(project.GPUQuota || 0);
            setGpuAccess(project.GPUAccess ? project.GPUAccess.split(',') : ['shared']);
            setMpsLimit(project.MPSLimit || 100);
            setMpsMemory(project.MPSMemory || 0);
            setIsEditModalOpen(true);
        }
    };
    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setProjectToEdit(null);
        setProjectName('');
        setDescription('');
        setGpuQuota(0);
        setGpuAccess(['shared']);
        setMpsLimit(100);
        setMpsMemory(0);
        setError(null);
    };
    const handleUpdateProject = async (e) => {
        e.preventDefault();
        if (!projectToEdit)
            return;
        const input = {
            project_name: projectName,
            description,
            gpu_quota: gpuQuota,
            gpu_access: gpuAccess.join(','),
            mps_limit: mpsLimit,
            mps_memory: mpsMemory,
        };
        try {
            setActionLoading(true);
            setError(null);
            const updatedProject = await updateProject(projectToEdit.PID, input);
            setAllProjects((prev) => prev.map((p) => (p.PID === updatedProject.PID ? updatedProject : p)));
            handleCloseEditModal();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update project');
        }
        finally {
            setActionLoading(false);
        }
    };
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };
    /**
     * Handles setting the Group ID and Name from the modal's search-select.
     */
    const handleSelectedGroupChange = (id, name) => {
        setGroupId(id);
        setSelectedGroupName(name);
    };
    /**
     * Handles closing the creation modal and resets the form state.
     */
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setProjectName('');
        setDescription('');
        setGpuQuota(0);
        setGpuAccess(['shared']);
        setMpsLimit(100);
        setMpsMemory(0);
        setGroupId(0);
        setSelectedGroupName('');
        setError(null);
    };
    // 4. Handle closing delete modal
    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setProjectToDelete(null);
        setError(null);
    };
    // --- INITIAL DATA FETCH (Projects and Groups) ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch Projects
                const fetchedProjects = await getProjects();
                setAllProjects(fetchedProjects);
                setFilteredProjects(fetchedProjects);
                // Fetch Groups for Modal
                const groups = await getGroups();
                setAvailableGroups(groups);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : t('error.initData'));
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [t]);
    // REAL-TIME SEARCH FILTERING LOGIC (for ProjectList)
    useEffect(() => {
        const term = searchTerm.toLowerCase().trim();
        if (!term) {
            setFilteredProjects(allProjects);
            return;
        }
        const results = allProjects.filter((project) => {
            const nameMatch = project.ProjectName?.toLowerCase().includes(term);
            const descMatch = project.Description?.toLowerCase().includes(term);
            const idMatch = project.PID ? String(project.PID).includes(term) : false;
            return nameMatch || descMatch || idMatch;
        });
        setFilteredProjects(results);
    }, [searchTerm, allProjects]);
    /**
     * Handles form submission to create a new project.
     */
    const handleCreateProject = async (e) => {
        e.preventDefault();
        if (groupId === 0) {
            setError(t('error.selectGroup'));
            return;
        }
        const input = {
            project_name: projectName,
            description,
            g_id: groupId,
            gpu_quota: gpuQuota,
            gpu_access: gpuAccess.join(','),
            mps_limit: mpsLimit,
            mps_memory: mpsMemory,
        };
        try {
            setActionLoading(true); // Use actionLoading to lock button
            setError(null);
            const newProject = await createProject(input);
            if (newProject && newProject.PID) {
                setAllProjects((prev) => [...prev, newProject]);
                handleCloseModal();
            }
            else {
                setError(t('error.invalidProjectData'));
            }
        }
        catch (err) {
            setError(err instanceof Error ? err.message : t('error.createProject'));
        }
        finally {
            setActionLoading(false);
        }
    };
    // 5. Handle delete button click (open modal)
    const handleDeleteClick = (project) => {
        // If other operations are in progress (actionLoading), do not respond to click
        if (actionLoading || loading)
            return;
        setProjectToDelete(project);
        setIsDeleteModalOpen(true);
    };
    /**
     * 6. 處理確認刪除 (執行 API)
     */
    const handleConfirmDelete = async () => {
        if (!projectToDelete)
            return;
        const projectId = projectToDelete.PID;
        // Lock operation and close modal immediately
        setActionLoading(true);
        handleCloseDeleteModal();
        try {
            const res = await deleteProject(projectId);
            if (res.message === 'project deleted') {
                // Update list
                setAllProjects((prev) => prev.filter((p) => p.PID !== projectId));
            }
            else {
                setError(res.message || t('error.deleteProject'));
                console.error('Deletion failed:', res.message);
            }
        }
        catch (err) {
            setError(err instanceof Error ? err.message : t('error.deleteFailed'));
        }
        finally {
            setActionLoading(false);
        }
    };
    // Original handleDeleteProject removed, ensure ProjectList calls handleDeleteClick
    return (_jsxs("div", { className: "relative", children: [_jsxs("div", { className: "min-h-screen rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 xl:p-10", children: [_jsx("div", { className: "flex justify-end mb-8", children: _jsxs(Button, { type: "button", onClick: () => setIsModalOpen(true), 
                            // Disable button if loading or performing other actions
                            disabled: loading || actionLoading, className: "flex items-center space-x-2 px-4 py-2 text-sm font-semibold bg-violet-600 text-white rounded-lg shadow-md hover:bg-violet-700 transition duration-150 focus:outline-none focus:ring-4 focus:ring-violet-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed", children: [_jsx(PlusIcon, { className: "w-5 h-5" }), _jsx("span", { children: t('button.newProject') })] }) }), _jsx(ProjectList, { projects: filteredProjects, loading: loading, error: error, onProjectClick: handleProjectClick, 
                        // Pass new handler that accepts Project object
                        onDeleteProject: handleDeleteClick, searchTerm: searchTerm, isActionLoading: actionLoading, onSearchChange: handleSearchChange })] }), _jsx(CreateProjectForm, { projectName: projectName, description: description, groupId: groupId, gpuQuota: gpuQuota, gpuAccess: gpuAccess, mpsLimit: mpsLimit, mpsMemory: mpsMemory, 
                // Use actionLoading to control form submission loading state
                loading: actionLoading, error: error, isOpen: isModalOpen, onClose: handleCloseModal, onProjectNameChange: (e) => setProjectName(e.target.value), onDescriptionChange: (e) => setDescription(e.target.value), onGpuQuotaChange: (e) => setGpuQuota(Number(e.target.value)), onGpuAccessChange: (access) => {
                    setGpuAccess((prev) => {
                        if (prev.includes(access)) {
                            return prev.filter((a) => a !== access);
                        }
                        else {
                            return [...prev, access];
                        }
                    });
                }, onMpsLimitChange: (e) => setMpsLimit(Number(e.target.value)), onMpsMemoryChange: (e) => setMpsMemory(Number(e.target.value)), onGroupIdChange: () => {
                    /* No operation */
                }, onSubmit: handleCreateProject, availableGroups: availableGroups, selectedGroupName: selectedGroupName, onSelectedGroupChange: handleSelectedGroupChange }), _jsx(EditProjectForm, { projectName: projectName, description: description, gpuQuota: gpuQuota, gpuAccess: gpuAccess, mpsLimit: mpsLimit, mpsMemory: mpsMemory, loading: actionLoading, error: error, isOpen: isEditModalOpen, onClose: handleCloseEditModal, onProjectNameChange: (e) => setProjectName(e.target.value), onDescriptionChange: (e) => setDescription(e.target.value), onGpuQuotaChange: (e) => setGpuQuota(Number(e.target.value)), onGpuAccessChange: (access) => {
                    setGpuAccess((prev) => {
                        if (prev.includes(access)) {
                            return prev.filter((a) => a !== access);
                        }
                        else {
                            return [...prev, access];
                        }
                    });
                }, onMpsLimitChange: (e) => setMpsLimit(Number(e.target.value)), onMpsMemoryChange: (e) => setMpsMemory(Number(e.target.value)), onSubmit: handleUpdateProject }), _jsx(DeleteConfirmationModal, { isOpen: isDeleteModalOpen, onClose: handleCloseDeleteModal, onConfirm: handleConfirmDelete, item: projectToDelete, itemType: "Project", loading: actionLoading })] }));
}
