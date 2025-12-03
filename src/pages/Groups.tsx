// src/pages/Groups.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Group } from '../interfaces/group';
import { getGroups } from '../services/groupService'; // Import createGroup
import { getGroupsByUser } from '../services/userGroupService';
import PageMeta from '../components/common/PageMeta';
import PageBreadcrumb from '../components/common/PageBreadCrumb';
import GroupCard from '../components/groups/GroupCard';
import LoadingState from '../components/groups/LoadingState';
import ErrorState from '../components/groups/ErrorState';
import EmptyState from '../components/groups/EmptyState';
import CreateGroupModal from '../components/groups/CreateGroupModal'; // Import the new modal component
import Pagination from '../components/common/Pagination';
import SearchInput from '../components/common/SearchInput';

export default function Groups() {
  // --- State Management --- //
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        if (!userDataString) throw new Error('使用者未登入。');

        const userData = JSON.parse(userDataString);
        const userId = userData?.user_id;
        if (!userId) throw new Error('找不到使用者 ID。');

        const [allGroups, userGroupMappings] = await Promise.all([
          getGroups(),
          getGroupsByUser(userId),
        ]);

        const userGroupIds = new Set(userGroupMappings.map((ug) => ug.GID));
        const filteredGroups = allGroups.filter((group) =>
          userGroupIds.has(group.GID)
        );
        setGroups(filteredGroups);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : '發生未知錯誤。'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUserGroups();
  }, []);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // --- Handlers --- //
  const handleGroupClick = (groupId: number) => {
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
  const handleGroupCreated = (newGroup: Group) => {
    setGroups((prevGroups) => [newGroup, ...prevGroups]);
    setIsModalOpen(false); // Close modal on success
  };

  // --- Filtering and Pagination --- //
  const filteredGroups = groups.filter(group => 
    group.GroupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (group.Description && group.Description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
  const paginatedGroups = filteredGroups.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // --- Conditional Rendering --- //
  const renderContent = () => {
    if (loading) return <LoadingState />;
    if (error) return <ErrorState message={error} />;
    if (groups.length === 0)
      return <EmptyState onActionClick={handleOpenCreateModal} />;

    if (filteredGroups.length === 0) {
       return (
         <div className="text-center py-10 text-gray-500">
           找不到符合 "{searchTerm}" 的群組
         </div>
       );
    }

    return (
      <>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedGroups.map((group) => (
            <GroupCard
              key={group.GID}
              group={group}
              onClick={() => handleGroupClick(group.GID)}
            />
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
      <PageMeta
        title="我的群組 | AI 平台"
        description="檢視並管理您的群組。"
      />
      <PageBreadcrumb pageTitle="群組" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900/50 sm:p-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              我的群組
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              存取您的專案群組並與團隊協作。
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="搜尋群組..." />
            <button
              onClick={handleOpenCreateModal} // This now opens the modal
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 whitespace-nowrap"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              建立新群組
            </button>
          </div>
        </div>
        {renderContent()}
      </div>

      {/* The Modal component is rendered here, its visibility is controlled by state */}
      <CreateGroupModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onGroupCreated={handleGroupCreated}
      />
    </>
  );
}
