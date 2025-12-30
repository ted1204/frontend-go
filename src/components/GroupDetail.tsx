// src/pages/GroupDetail.tsx

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Group } from '../interfaces/group';
import { User } from '../interfaces/user';
import { UserGroupUser } from '../interfaces/userGroup';
import { getGroupById } from '../services/groupService';
import { getUsers } from '../services/userService';
import {
  createUserGroup,
  getUsersByGroup,
  deleteUserGroup,
  updateUserGroup,
} from '../services/userGroupService';

import { PageMeta } from '@nthucscc/ui';
import { PageBreadcrumb } from './common/PageBreadCrumb';
import InviteUserModal, { FormData } from './InviteUserModal';
import EditRoleModal from './EditRoleModal';
import Button from './ui/button/Button';

import {
  IdentificationIcon,
  TagIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';

// --- Helper UI Components --- //

/**
 * A badge for displaying user roles with appropriate colors.
 */
const RoleBadge = ({ role }: { role: string }) => {
  const roleStyles: { [key: string]: string } = {
    admin: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    manager: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    user: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  };
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${roleStyles[role] || 'bg-gray-100 text-gray-800'}`}
    >
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
};

/**
 * A card to display the main details of the group.
 */
const GroupDetailCard = ({ group }: { group: Group }) => {
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

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">群組資訊</h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        此群組的核心詳細資訊和中繼資料。
      </p>
      <div className="mt-6 space-y-6 border-t border-gray-200 pt-6 dark:border-gray-700">
        {details.map((item) => (
          <div key={item.label} className="flex items-start gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</p>
              <p className="mt-1 text-base font-semibold text-gray-900 dark:text-white">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Renders the loading state with a skeleton UI.
 */
const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="mb-8 h-8 w-1/3 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Skeleton for Detail Card */}
      <div className="lg:col-span-1">
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="h-6 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="mt-2 h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="mt-6 space-y-4 border-t border-gray-200 pt-6 dark:border-gray-700">
            <div className="h-4 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-4 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-4 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
      {/* Skeleton for Member Table */}
      <div className="lg:col-span-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="h-6 w-1/3 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="mt-6 h-32 rounded-lg bg-gray-100 dark:bg-gray-700/50"></div>
        </div>
      </div>
    </div>
  </div>
);

// --- Main Page Component --- //

export default function GroupDetail() {
  // --- State Management --- //
  const { id = '' } = useParams<{ id?: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [groupUsers, setGroupUsers] = useState<UserGroupUser[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedUserToEdit, setSelectedUserToEdit] = useState<UserGroupUser | null>(null);

  // --- Data Fetching --- //

  // A memoized function to refetch group members, preventing redundant calls.
  const refetchGroupUsers = useCallback(async () => {
    if (!id) return;
    try {
      const userGroupsData = await getUsersByGroup(parseInt(id));
      setGroupUsers(userGroupsData);
    } catch (err) {
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
      } catch (err) {
        setError(err instanceof Error ? err.message : '無法取得群組資料');
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [id, refetchGroupUsers]);

  // --- Handlers --- //

  const handleInviteSubmit = async (formData: FormData) => {
    const { uid, role } = formData;
    if (uid <= 0 || !id) {
      throw new Error('必須選擇有效的使用者。');
    }
    await createUserGroup({ u_id: uid, g_id: parseInt(id), role });
    await refetchGroupUsers(); // Refresh member list
    setIsInviteModalOpen(false);
  };

  const handleDeleteUser = async (uid: number) => {
    if (!id) return;
    // Optional: Add a confirmation dialog here
    // if (window.confirm("Are you sure you want to remove this user?")) { ... }
    await deleteUserGroup({ u_id: uid, g_id: parseInt(id) });
    await refetchGroupUsers();
  };

  const handleUpdateRole = async (newRole: 'admin' | 'manager' | 'user') => {
    if (!selectedUserToEdit || !id) return;
    await updateUserGroup({
      u_id: selectedUserToEdit.UID,
      g_id: parseInt(id),
      role: newRole,
    });
    await refetchGroupUsers();
    setSelectedUserToEdit(null); // Close modal
  };

  // --- Render Logic --- //

  if (loading) return <LoadingSkeleton />;
  if (error) return <p className="text-red-500">{error}</p>; // Replace with a proper ErrorDisplay component
  if (!group) return <p className="text-gray-500">找不到群組。</p>;

  return (
    <>
      <PageMeta
        title={`群組: ${group.GroupName} | AppName`}
        description={`群組 ${group.GroupName} 的詳細資訊和成員`}
      />

      {/* Header */}
      <div className="space-y-6">
        <PageBreadcrumb pageTitle={group.GroupName} />
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <Button onClick={() => setIsInviteModalOpen(true)} variant="primary">
            <svg
              className="-ml-1 mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M11 5a3 3 0 11-6 0 3 3 0 016 0zM2.5 12.5a.75.75 0 000 1.5h15a.75.75 0 000-1.5h-15zM11 12.5a.75.75 0 000 1.5h.75a2.25 2.25 0 012.25 2.25v.75a.75.75 0 001.5 0v-.75a3.75 3.75 0 00-3.75-3.75h-.75zM5 12.5a.75.75 0 01.75.75v.75a3.75 3.75 0 01-3.75 3.75H1.25a.75.75 0 010-1.5h.75a2.25 2.25 0 002.25-2.25v-.75A.75.75 0 015 12.5z" />
            </svg>
            邀請使用者
          </Button>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: Group Details */}
          <div className="lg:col-span-1">
            <GroupDetailCard group={group} />
          </div>

          {/* Right Column: Group Members */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="border-b border-gray-200 p-4 dark:border-gray-700 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">群組成員</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {groupUsers.length} 位成員在此群組中。
                </p>
              </div>
              {groupUsers.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                      >
                        名稱
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                      >
                        角色
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">動作</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                    {groupUsers.map((user) => (
                      <tr key={user.UID}>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.Username}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            UID: {user.UID}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          <RoleBadge role={user.Role} />
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                          <button
                            onClick={() => setSelectedUserToEdit(user)}
                            className="mr-4 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            編輯
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.UID)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            移除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                  尚未邀請任何成員加入此群組。
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
        <InviteUserModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          users={allUsers.filter((u) => !groupUsers.some((gu) => gu.UID === u.UID))} // Only show users not already in the group
          onSubmit={handleInviteSubmit}
        />
        {selectedUserToEdit && (
          <EditRoleModal
            isOpen={!!selectedUserToEdit}
            onClose={() => setSelectedUserToEdit(null)}
            user={selectedUserToEdit}
            onUpdate={handleUpdateRole}
          />
        )}
      </div>
    </>
  );
}
