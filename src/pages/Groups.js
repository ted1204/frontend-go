import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/Groups.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGroups } from '../services/groupService'; // Import createGroup
import { getGroupsByUser } from '../services/userGroupService';
import { PageMeta } from '@tailadmin/ui';
import PageBreadcrumb from '../components/common/PageBreadCrumb';
import { useTranslation } from '@tailadmin/utils';
import GroupCard from '../components/groups/GroupCard';
import LoadingState from '../components/groups/LoadingState';
import ErrorState from '../components/groups/ErrorState';
import EmptyState from '../components/groups/EmptyState';
import CreateGroupModal from '../components/groups/CreateGroupModal'; // Import the new modal component
import { Pagination } from '@tailadmin/ui';
import { SearchInput } from '@tailadmin/ui';
export default function Groups() {
    const { t } = useTranslation();
    // --- State Management --- //
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const navigate = useNavigate();
    // --- Data Fetching Effect --- //
    useEffect(() => {
        const fetchUserGroups = async () => {
            try {
                setLoading(true);
                setError(null);
                const userDataString = localStorage.getItem('userData');
                if (!userDataString)
                    throw new Error(t('groups.error.userNotLogged'));
                const userData = JSON.parse(userDataString);
                const userId = userData?.user_id;
                if (!userId)
                    throw new Error(t('groups.error.userIdMissing'));
                const [allGroups, userGroupMappings] = await Promise.all([
                    getGroups(),
                    getGroupsByUser(userId),
                ]);
                const userGroupIds = new Set(userGroupMappings.map((ug) => ug.GID));
                const filteredGroups = allGroups.filter((group) => userGroupIds.has(group.GID));
                setGroups(filteredGroups);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : t('groups.error.unknown'));
            }
            finally {
                setLoading(false);
            }
        };
        fetchUserGroups();
    }, [t]);
    // Reset page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);
    // --- Handlers --- //
    const handleGroupClick = (groupId) => {
        navigate(`/groups/${groupId}`);
    };
    // Opens the modal instead of navigating
    const handleOpenCreateModal = () => {
        setIsModalOpen(true);
    };
    // Closes the modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    // Callback function for when a new group is successfully created
    // It adds the new group to the state to instantly update the UI
    const handleGroupCreated = (newGroup) => {
        setGroups((prevGroups) => [newGroup, ...prevGroups]);
        setIsModalOpen(false); // Close modal on success
    };
    // --- Filtering and Pagination --- //
    const filteredGroups = groups.filter((group) => group.GroupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (group.Description && group.Description.toLowerCase().includes(searchTerm.toLowerCase())));
    const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
    const paginatedGroups = filteredGroups.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    // --- Conditional Rendering --- //
    const renderContent = () => {
        if (loading)
            return _jsx(LoadingState, {});
        if (error)
            return _jsx(ErrorState, { message: error });
        if (groups.length === 0)
            return _jsx(EmptyState, { onActionClick: handleOpenCreateModal });
        if (filteredGroups.length === 0) {
            return (_jsx("div", { className: "text-center py-10 text-gray-500", children: t('groups.noMatch', { term: searchTerm }) }));
        }
        return (_jsxs(_Fragment, { children: [_jsx("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3", children: paginatedGroups.map((group) => (_jsx(GroupCard, { group: group, onClick: () => handleGroupClick(group.GID) }, group.GID))) }), _jsx(Pagination, { currentPage: currentPage, totalPages: totalPages, onPageChange: setCurrentPage })] }));
    };
    // --- Render --- //
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: t('groups.page.title'), description: t('groups.page.description') }), _jsx(PageBreadcrumb, { pageTitle: t('breadcrumb.groups') || 'Groups' }), _jsxs("div", { className: "rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900/50 sm:p-8", children: [_jsxs("div", { className: "mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: t('groups.myGroups') }), _jsx("p", { className: "mt-1 text-sm text-gray-500 dark:text-gray-400", children: t('groups.subtitle') })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3 w-full sm:w-auto", children: [_jsx(SearchInput, { value: searchTerm, onChange: setSearchTerm, placeholder: t('groups.searchPlaceholder') }), _jsxs("button", { onClick: handleOpenCreateModal, className: "inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 whitespace-nowrap", children: [_jsx("svg", { className: "-ml-1 mr-2 h-5 w-5", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { d: "M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" }) }), t('groups.createNew')] })] })] }), renderContent()] }), _jsx(CreateGroupModal, { isOpen: isModalOpen, onClose: handleCloseModal, onGroupCreated: handleGroupCreated })] }));
}
