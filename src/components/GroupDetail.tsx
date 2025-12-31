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
import { PageBreadcrumb } from '../components/common/PageBreadCrumb';
import InviteUserModal, { FormData } from '../components/InviteUserModal';
import EditRoleModal from '../components/EditRoleModal';
import Button from '../components/ui/button/Button';

import {
  IdentificationIcon,
  TagIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  UsersIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { useTranslation } from '@nthucscc/utils';

// --- Helper UI Components --- //

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

const GroupDetailCard = ({ group }: { group: Group }) => {
  const { t } = useTranslation();
  const details = [
    { label: 'ID', value: group.GID, icon: IdentificationIcon },
    { label: t('groups.name'), value: group.GroupName, icon: TagIcon },
    {
      label: t('groups.description'),
      value: group.Description || 'N/A',
      icon: ChatBubbleLeftRightIcon,
    },
    {
      label: t('common.createdAt'),
      value: new Date(group.CreatedAt).toLocaleString(),
      icon: CalendarDaysIcon,
    },
    {
      label: t('common.updatedAt'),
      value: new Date(group.UpdatedAt).toLocaleString(),
      icon: CalendarDaysIcon,
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {t('groups.infoTitle')}
      </h3>
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

// --- Main Page Component --- //

export default function GroupDetail() {
  const { t } = useTranslation();
  const { id = '' } = useParams<{ id?: string }>();

  // Data State
  const [group, setGroup] = useState<Group | null>(null);
  const [groupUsers, setGroupUsers] = useState<UserGroupUser[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // UI State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Modal State
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedUserToEdit, setSelectedUserToEdit] = useState<UserGroupUser | null>(null);

  // --- Data Fetching --- //

  const refetchGroupUsers = useCallback(async () => {
    if (!id) return;
    try {
      const userGroupsData = await getUsersByGroup(parseInt(id));
      setGroupUsers(userGroupsData);
    } catch (err) {
      console.warn('refetchGroupUsers error', err);
    }
  }, [id]);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!id) {
        setError(t('groups_error_idMissing'));
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const [groupData, usersData] = await Promise.all([getGroupById(parseInt(id)), getUsers()]);
        setGroup(groupData);
        setAllUsers(usersData);
        await refetchGroupUsers();
      } catch (err) {
        setError(err instanceof Error ? err.message : t('groups_error_fetchFailed'));
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [id, refetchGroupUsers, t]);

  // --- Handlers --- //

  const handleInviteSubmit = async (formData: FormData) => {
    const { uid, role } = formData;
    if (uid <= 0 || !id) return;
    await createUserGroup({ u_id: uid, g_id: parseInt(id), role });
    await refetchGroupUsers();
    setIsInviteModalOpen(false);
  };

  const handleDeleteUser = async (uid: number) => {
    if (!id || !window.confirm(t('common.confirmDelete'))) return;
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
    setSelectedUserToEdit(null);
  };

  if (loading) return <div className="p-10 text-center animate-pulse">{t('common.loading')}</div>;
  if (error) return <p className="p-10 text-center text-red-500">{error}</p>;
  if (!group) return <p className="p-10 text-center text-gray-500">{t('groups.notFound')}</p>;

  return (
    <>
      <PageMeta title={`${group.GroupName} | Groups`} description={group.Description} />
      <PageBreadcrumb pageTitle={group.GroupName} />

      {/* Tab Navigation */}
      <div className="mb-6 mt-4 border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: t('groups.tab.overview'), icon: ChartBarIcon },
            { id: 'members', label: t('groups.tab.members'), icon: UsersIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium
                ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }
              `}
            >
              <tab.icon className="mr-2 h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="min-h-[500px]">
        {/* --- OVERVIEW TAB --- */}
        {activeTab === 'overview' && (
          <div className="max-w-3xl">
            <GroupDetailCard group={group} />
          </div>
        )}

        {/* --- MEMBERS TAB --- */}
        {activeTab === 'members' && (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex justify-end">
              <Button
                onClick={() => setIsInviteModalOpen(true)}
                className="inline-flex items-center gap-2"
              >
                <PlusIcon className="h-5 w-5" />
                {t('groups.inviteUser')}
              </Button>
            </div>

            {/* Members Table */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
              <div className="border-b border-gray-200 p-4 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {t('groups.membersList')}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {t('groups.memberCount', { count: groupUsers.length })}
                </p>
              </div>

              {groupUsers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          {t('user.name')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          {t('user.role')}
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          {t('common.actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                      {groupUsers.map((user) => (
                        <tr key={user.UID} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3 dark:bg-blue-900/30 dark:text-blue-400">
                                {user.Username.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {user.Username}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                                  UID: {user.UID}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <RoleBadge role={user.Role} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => setSelectedUserToEdit(user)}
                              className="mr-4 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              {t('common.edit')}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.UID)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            >
                              {t('common.remove')}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-10 text-center text-gray-500 dark:text-gray-400">
                  {t('groups.noMembers')}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <InviteUserModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        users={allUsers.filter((u) => !groupUsers.some((gu) => gu.UID === u.UID))}
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
    </>
  );
}
