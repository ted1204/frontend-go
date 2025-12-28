import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { getUsersByGroup, getGroupsByUser, createUserGroup } from '../services/userGroupService';
import { getUsers } from '../services/userService';
import InviteUserModal from './InviteUserModal';
import { useTranslation } from '@tailadmin/utils';
const ProjectMembers = ({ groupId }) => {
    const [members, setMembers] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [canManage, setCanManage] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { t } = useTranslation();
    const fetchMembers = useCallback(async () => {
        try {
            setLoading(true);
            const users = await getUsersByGroup(groupId);
            setMembers(users);
            // Check permissions
            const userData = localStorage.getItem('userData');
            if (userData) {
                const { user_id: userId } = JSON.parse(userData);
                const userGroups = await getGroupsByUser(userId);
                const currentGroup = userGroups.find((g) => g.GID === groupId);
                if (currentGroup && (currentGroup.Role === 'admin' || currentGroup.Role === 'manager')) {
                    setCanManage(true);
                }
            }
        }
        catch (error) {
            console.error('Failed to fetch members:', error);
        }
        finally {
            setLoading(false);
        }
    }, [groupId]);
    const fetchAvailableUsers = useCallback(async () => {
        try {
            const allUsers = await getUsers();
            // Filter out users who are already members
            const memberIds = members.map((m) => m.UID);
            const filtered = allUsers.filter((u) => !memberIds.includes(u.UID));
            setAvailableUsers(filtered);
        }
        catch (error) {
            console.error('Failed to fetch users:', error);
        }
    }, [members]);
    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);
    useEffect(() => {
        if (isInviteModalOpen) {
            fetchAvailableUsers();
        }
    }, [isInviteModalOpen, fetchAvailableUsers]);
    const handleInvite = async (data) => {
        await createUserGroup({
            u_id: data.uid,
            g_id: groupId,
            role: data.role,
        });
        setIsInviteModalOpen(false);
        fetchMembers();
    };
    const filteredMembers = members.filter((member) => member.Username.toLowerCase().includes(searchTerm.toLowerCase()));
    if (loading) {
        return _jsx("div", { className: "animate-pulse h-20 bg-gray-200 rounded-lg" });
    }
    return (_jsxs("div", { className: "rounded-xl border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800", children: [_jsxs("div", { className: "flex flex-col gap-4 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6 dark:border-gray-600", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold leading-6 text-gray-900 dark:text-white", children: t('project.members.title') }), _jsx("p", { className: "mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400", children: t('project.members.description', { groupId }) })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "text", placeholder: t('project.members.searchPlaceholder'), value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white" }), canManage && (_jsx("button", { onClick: () => setIsInviteModalOpen(true), className: "inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800", children: t('project.members.addMember') }))] })] }), _jsx("div", { className: "p-4 sm:p-6", children: _jsxs("ul", { className: "divide-y divide-gray-200 dark:divide-gray-700", children: [filteredMembers.map((member) => (_jsx("li", { className: "py-3 flex justify-between items-center", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold", children: member.Username.charAt(0).toUpperCase() }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children: member.Username }), _jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: t('role.label', { role: member.Role }) })] })] }) }, member.UID))), filteredMembers.length === 0 && (_jsx("li", { className: "py-4 text-center text-gray-500 dark:text-gray-400", children: members.length === 0 ? t('members.noneFound') : t('members.noMatch') }))] }) }), canManage && (_jsx(InviteUserModal, { isOpen: isInviteModalOpen, onClose: () => setIsInviteModalOpen(false), users: availableUsers, onSubmit: handleInvite }))] }));
};
export default ProjectMembers;
