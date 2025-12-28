import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/GroupDetail.tsx
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getGroupById } from '../services/groupService';
import { getUsers } from '../services/userService';
import { createUserGroup, getUsersByGroup, deleteUserGroup, updateUserGroup, } from '../services/userGroupService';
import { PageMeta } from '@tailadmin/ui';
import PageBreadcrumb from './common/PageBreadCrumb';
import InviteUserModal from './InviteUserModal';
import EditRoleModal from './EditRoleModal';
import Button from './ui/button/Button';
import { IdentificationIcon, TagIcon, ChatBubbleLeftRightIcon, CalendarDaysIcon, } from '@heroicons/react/24/outline';
// --- Helper UI Components --- //
/**
 * A badge for displaying user roles with appropriate colors.
 */
const RoleBadge = ({ role }) => {
    const roleStyles = {
        admin: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
        manager: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        user: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    };
    return (_jsx("span", { className: `inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${roleStyles[role] || 'bg-gray-100 text-gray-800'}`, children: role.charAt(0).toUpperCase() + role.slice(1) }));
};
/**
 * A card to display the main details of the group.
 */
const GroupDetailCard = ({ group }) => {
    const details = [
        {
            label: 'ID',
            value: group.GID,
            icon: IdentificationIcon,
        },
        {
            label: '名稱',
            value: group.GroupName,
            icon: TagIcon,
        },
        {
            label: '描述',
            value: group.Description || 'N/A',
            icon: ChatBubbleLeftRightIcon,
        },
        {
            label: '建立時間',
            value: new Date(group.CreatedAt).toLocaleString(),
            icon: CalendarDaysIcon,
        },
        {
            label: '更新時間',
            value: new Date(group.UpdatedAt).toLocaleString(),
            icon: CalendarDaysIcon,
        },
    ];
    return (_jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "\u7FA4\u7D44\u8CC7\u8A0A" }), _jsx("p", { className: "mt-1 text-sm text-gray-500 dark:text-gray-400", children: "\u6B64\u7FA4\u7D44\u7684\u6838\u5FC3\u8A73\u7D30\u8CC7\u8A0A\u548C\u4E2D\u7E7C\u8CC7\u6599\u3002" }), _jsx("div", { className: "mt-6 space-y-6 border-t border-gray-200 pt-6 dark:border-gray-700", children: details.map((item) => (_jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400", children: _jsx(item.icon, { className: "h-6 w-6", "aria-hidden": "true" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-500 dark:text-gray-400", children: item.label }), _jsx("p", { className: "mt-1 text-base font-semibold text-gray-900 dark:text-white", children: item.value })] })] }, item.label))) })] }));
};
/**
 * Renders the loading state with a skeleton UI.
 */
const LoadingSkeleton = () => (_jsxs("div", { className: "animate-pulse", children: [_jsx("div", { className: "mb-8 h-8 w-1/3 rounded-lg bg-gray-200 dark:bg-gray-700" }), _jsxs("div", { className: "grid grid-cols-1 gap-8 lg:grid-cols-3", children: [_jsx("div", { className: "lg:col-span-1", children: _jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800", children: [_jsx("div", { className: "h-6 w-1/2 rounded bg-gray-200 dark:bg-gray-700" }), _jsx("div", { className: "mt-2 h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" }), _jsxs("div", { className: "mt-6 space-y-4 border-t border-gray-200 pt-6 dark:border-gray-700", children: [_jsx("div", { className: "h-4 rounded bg-gray-200 dark:bg-gray-700" }), _jsx("div", { className: "h-4 rounded bg-gray-200 dark:bg-gray-700" }), _jsx("div", { className: "h-4 rounded bg-gray-200 dark:bg-gray-700" })] })] }) }), _jsx("div", { className: "lg:col-span-2", children: _jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800", children: [_jsx("div", { className: "h-6 w-1/3 rounded bg-gray-200 dark:bg-gray-700" }), _jsx("div", { className: "mt-6 h-32 rounded-lg bg-gray-100 dark:bg-gray-700/50" })] }) })] })] }));
// --- Main Page Component --- //
export default function GroupDetail() {
    // --- State Management --- //
    const { id = '' } = useParams();
    const [group, setGroup] = useState(null);
    const [groupUsers, setGroupUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [selectedUserToEdit, setSelectedUserToEdit] = useState(null);
    // --- Data Fetching --- //
    // A memoized function to refetch group members, preventing redundant calls.
    const refetchGroupUsers = useCallback(async () => {
        if (!id)
            return;
        try {
            const userGroupsData = await getUsersByGroup(parseInt(id));
            setGroupUsers(userGroupsData);
        }
        catch (err) {
            setError('無法重新整理群組成員。');
            console.warn('refetchGroupUsers error', err);
        }
    }, [id]);
    useEffect(() => {
        const fetchInitialData = async () => {
            if (!id) {
                setError('缺少群組 ID。');
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                // Fetch group details and all system users concurrently.
                const [groupData, usersData] = await Promise.all([getGroupById(parseInt(id)), getUsers()]);
                setGroup(groupData);
                setAllUsers(usersData);
                await refetchGroupUsers(); // Fetch initial members
            }
            catch (err) {
                setError(err instanceof Error ? err.message : '無法取得群組資料');
            }
            finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, [id, refetchGroupUsers]);
    // --- Handlers --- //
    const handleInviteSubmit = async (formData) => {
        const { uid, role } = formData;
        if (uid <= 0 || !id) {
            throw new Error('必須選擇有效的使用者。');
        }
        await createUserGroup({ u_id: uid, g_id: parseInt(id), role });
        await refetchGroupUsers(); // Refresh member list
        setIsInviteModalOpen(false);
    };
    const handleDeleteUser = async (uid) => {
        if (!id)
            return;
        // Optional: Add a confirmation dialog here
        // if (window.confirm("Are you sure you want to remove this user?")) { ... }
        await deleteUserGroup({ u_id: uid, g_id: parseInt(id) });
        await refetchGroupUsers();
    };
    const handleUpdateRole = async (newRole) => {
        if (!selectedUserToEdit || !id)
            return;
        await updateUserGroup({
            u_id: selectedUserToEdit.UID,
            g_id: parseInt(id),
            role: newRole,
        });
        await refetchGroupUsers();
        setSelectedUserToEdit(null); // Close modal
    };
    // --- Render Logic --- //
    if (loading)
        return _jsx(LoadingSkeleton, {});
    if (error)
        return _jsx("p", { className: "text-red-500", children: error }); // Replace with a proper ErrorDisplay component
    if (!group)
        return _jsx("p", { className: "text-gray-500", children: "\u627E\u4E0D\u5230\u7FA4\u7D44\u3002" });
    return (_jsxs(_Fragment, { children: [_jsx(PageMeta, { title: `群組: ${group.GroupName} | AppName`, description: `群組 ${group.GroupName} 的詳細資訊和成員` }), _jsxs("div", { className: "space-y-6", children: [_jsx(PageBreadcrumb, { pageTitle: group.GroupName }), _jsx("div", { className: "mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center", children: _jsxs(Button, { onClick: () => setIsInviteModalOpen(true), variant: "primary", children: [_jsx("svg", { className: "-ml-1 mr-2 h-5 w-5", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { d: "M11 5a3 3 0 11-6 0 3 3 0 016 0zM2.5 12.5a.75.75 0 000 1.5h15a.75.75 0 000-1.5h-15zM11 12.5a.75.75 0 000 1.5h.75a2.25 2.25 0 012.25 2.25v.75a.75.75 0 001.5 0v-.75a3.75 3.75 0 00-3.75-3.75h-.75zM5 12.5a.75.75 0 01.75.75v.75a3.75 3.75 0 01-3.75 3.75H1.25a.75.75 0 010-1.5h.75a2.25 2.25 0 002.25-2.25v-.75A.75.75 0 015 12.5z" }) }), "\u9080\u8ACB\u4F7F\u7528\u8005"] }) }), _jsxs("div", { className: "grid grid-cols-1 gap-8 lg:grid-cols-3", children: [_jsx("div", { className: "lg:col-span-1", children: _jsx(GroupDetailCard, { group: group }) }), _jsx("div", { className: "lg:col-span-2", children: _jsxs("div", { className: "rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800", children: [_jsxs("div", { className: "border-b border-gray-200 p-4 dark:border-gray-700 sm:p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "\u7FA4\u7D44\u6210\u54E1" }), _jsxs("p", { className: "mt-1 text-sm text-gray-500 dark:text-gray-400", children: [groupUsers.length, " \u4F4D\u6210\u54E1\u5728\u6B64\u7FA4\u7D44\u4E2D\u3002"] })] }), groupUsers.length > 0 ? (_jsxs("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", children: [_jsx("thead", { className: "bg-gray-50 dark:bg-gray-700/50", children: _jsxs("tr", { children: [_jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400", children: "\u540D\u7A31" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400", children: "\u89D2\u8272" }), _jsx("th", { scope: "col", className: "relative px-6 py-3", children: _jsx("span", { className: "sr-only", children: "\u52D5\u4F5C" }) })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800", children: groupUsers.map((user) => (_jsxs("tr", { children: [_jsxs("td", { className: "whitespace-nowrap px-6 py-4", children: [_jsx("div", { className: "text-sm font-medium text-gray-900 dark:text-white", children: user.Username }), _jsxs("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: ["UID: ", user.UID] })] }), _jsx("td", { className: "whitespace-nowrap px-6 py-4 text-sm text-gray-500", children: _jsx(RoleBadge, { role: user.Role }) }), _jsxs("td", { className: "whitespace-nowrap px-6 py-4 text-right text-sm font-medium", children: [_jsx("button", { onClick: () => setSelectedUserToEdit(user), className: "mr-4 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300", children: "\u7DE8\u8F2F" }), _jsx("button", { onClick: () => handleDeleteUser(user.UID), className: "text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300", children: "\u79FB\u9664" })] })] }, user.UID))) })] })) : (_jsx("p", { className: "p-6 text-center text-sm text-gray-500 dark:text-gray-400", children: "\u5C1A\u672A\u9080\u8ACB\u4EFB\u4F55\u6210\u54E1\u52A0\u5165\u6B64\u7FA4\u7D44\u3002" }))] }) })] }), _jsx(InviteUserModal, { isOpen: isInviteModalOpen, onClose: () => setIsInviteModalOpen(false), users: allUsers.filter((u) => !groupUsers.some((gu) => gu.UID === u.UID)), onSubmit: handleInviteSubmit }), selectedUserToEdit && (_jsx(EditRoleModal, { isOpen: !!selectedUserToEdit, onClose: () => setSelectedUserToEdit(null), user: selectedUserToEdit, onUpdate: handleUpdateRole }))] })] }));
}
