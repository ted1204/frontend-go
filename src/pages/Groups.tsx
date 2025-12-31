import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Group } from '../interfaces/group';
import { getGroups } from '../services/groupService';
import { getGroupsByUser } from '../services/userGroupService';
import { PageMeta } from '@nthucscc/ui';
import { PageBreadcrumb } from '../components/common/PageBreadCrumb';
import { useTranslation } from '@nthucscc/utils';
import { Pagination, SearchInput } from '@nthucscc/ui';

// Components
import GroupCard from '../components/groups/GroupCard';
import LoadingState from '../components/groups/LoadingState';
import ErrorState from '../components/groups/ErrorState';
import EmptyState from '../components/groups/EmptyState';

export default function Groups() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // --- State Management --- //
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // --- Data Fetching Effect --- //
  useEffect(() => {
    const fetchUserGroups = async () => {
      try {
        setLoading(true);
        setError(null);
        const userDataString = localStorage.getItem('userData');
        if (!userDataString) throw new Error(t('groups_error_userNotLogged'));

        const userData = JSON.parse(userDataString);
        const userId = userData?.user_id;
        if (!userId) throw new Error(t('groups_error_userIdMissing'));

        const [allGroups, userGroupMappings] = await Promise.all([
          getGroups(),
          getGroupsByUser(userId),
        ]);

        // Filter groups that the user belongs to
        const userGroupIds = new Set(userGroupMappings.map((ug) => ug.GID));
        const filteredGroups = allGroups.filter((group) => userGroupIds.has(group.GID));
        setGroups(filteredGroups);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('groups_error_unknown'));
      } finally {
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
  const handleGroupClick = (groupId: number) => {
    navigate(`/groups/${groupId}`);
  };

  // --- Filtering and Pagination --- //
  const filteredGroups = groups.filter(
    (group) =>
      group.GroupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (group.Description && group.Description.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
  const paginatedGroups = filteredGroups.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // --- Conditional Rendering --- //
  const renderContent = () => {
    if (loading) return <LoadingState />;
    if (error) return <ErrorState message={error} />;

    // 如果沒有任何群組，顯示 EmptyState (不帶 Action)
    if (groups.length === 0) return <EmptyState />;

    if (filteredGroups.length === 0) {
      return (
        <div className="text-center py-10 text-gray-500">
          {t('groups_noMatch', { term: searchTerm })}
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedGroups.map((group) => (
            <GroupCard key={group.GID} group={group} onClick={() => handleGroupClick(group.GID)} />
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </>
    );
  };

  // --- Render --- //
  return (
    <>
      <PageMeta title={t('groups_page_title')} description={t('groups_page_description')} />
      <PageBreadcrumb pageTitle={t('breadcrumb_groups') || 'Groups'} />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900/50 sm:p-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('groups_myGroups')}
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('groups_subtitle')}</p>
          </div>
          <div className="w-full sm:w-auto">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder={t('groups_searchPlaceholder')}
            />
            {/* Create Button Removed */}
          </div>
        </div>
        {renderContent()}
      </div>
    </>
  );
}
