import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import PageBreadcrumb from '../components/common/PageBreadCrumb';
import PageMeta from '../components/common/PageMeta';
import {
  getGroups,
  createGroup,
  CreateGroupInput,
  deleteGroup,
} from '../services/groupService';
import { Group } from '../interfaces/group';
import { useNavigate } from 'react-router-dom';
import GroupList from '../components/GroupList';
import CreateGroupForm from '../components/CreateGroupForm';
import Button from '../components/ui/button/Button'; // Import Button

// SVG Icon for the New Group button
const PlusIcon = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

export default function ManageGroups() {
  // Master list of all groups
  const [allGroups, setAllGroups] = useState<Group[]>([]);
  // List displayed after filtering
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);

  // Form States (for Modal)
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');

  // UI/API States
  const [loading, setLoading] = useState(true); // Used for initial data fetch
  const [formLoading, setFormLoading] = useState(false); // Used ONLY for form submission
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal control

  // Search State
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  const handleGroupClick = (groupId: number) => {
    navigate(`/groups/${groupId}`);
  };

  /**
   * Handler to update the search term state.
   */
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  /**
   * Closes the creation modal and resets form/error state.
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setGroupName('');
    setDescription('');
    setError(null); // Clear error on close
  };

  // --- Data Fetching Effect ---
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const fetchedGroups = await getGroups();
        setAllGroups(fetchedGroups);
        setFilteredGroups(fetchedGroups); // Initialize filtered list
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch groups');
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  // --- REAL-TIME SEARCH FILTERING LOGIC ---
  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();

    if (!term) {
      setFilteredGroups(allGroups);
      return;
    }

    const results = allGroups.filter((group) => {
      const nameMatch = group.GroupName?.toLowerCase().includes(term);
      const descMatch = group.Description?.toLowerCase().includes(term);
      const idMatch = group.GID ? String(group.GID).includes(term) : false;

      return nameMatch || descMatch || idMatch;
    });

    setFilteredGroups(results);
  }, [searchTerm, allGroups]); // Updates when search term changes or master list is modified

  /**
   * Handles the group creation form submission.
   */
  const handleCreateGroup = async (e: FormEvent) => {
    e.preventDefault();
    const input: CreateGroupInput = { group_name: groupName, description };

    try {
      setFormLoading(true); // Lock form fields
      setError(null);

      const newGroup = await createGroup(input);

      // Update the master list; filter will update automatically
      setAllGroups((prev) => [...prev, newGroup]);
      handleCloseModal(); // Creation successful, close modal
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create group');
    } finally {
      setFormLoading(false); // Unlock form fields
    }
  };

  /**
   * Handles group deletion.
   */
  const handleDeleteGroup = async (groupId: number) => {
    try {
      const res = await deleteGroup(groupId);
      if (res.message === 'Group deleted') {
        // Update the master list; filter will update automatically
        setAllGroups((prev) => prev.filter((g) => g.GID !== groupId));
      } else {
        setError(res.message || 'Failed to delete group.');
        console.error('Deletion failed:', res.message);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred during deletion.'
      );
    }
  };

  return (
    <div className="relative">
      <PageMeta
        title="Manage Groups"
        description="Admin panel to manage organizational groups."
      />
      <PageBreadcrumb pageTitle="Manage Groups" />

      {/* Main Content Container: Enhanced styling for dashboard view */}
      <div className="min-h-screen rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 xl:p-10">
        {/* Top Action Bar: Create Button */}
        <div className="flex justify-end mb-8">
          <Button
            type="button"
            onClick={() => setIsModalOpen(true)}
            // Consistent violet styling
            className="
                            flex items-center space-x-2 px-4 py-2 text-sm font-semibold 
                            bg-violet-600 text-white rounded-lg shadow-md
                            hover:bg-violet-700 transition duration-150 
                            focus:outline-none focus:ring-4 focus:ring-violet-500 focus:ring-opacity-50
                        "
          >
            <PlusIcon className="w-5 h-5" />
            <span>New Group</span>
          </Button>
        </div>

        {/* Group List Component (Includes Search Bar) */}
        <GroupList
          groups={filteredGroups} // Pass filtered data
          loading={loading}
          error={error}
          onGroupClick={handleGroupClick}
          onDeleteGroup={handleDeleteGroup}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />
      </div>

      {/* Create Group Modal (Conditional Rendering) */}
      <CreateGroupForm
        groupName={groupName}
        description={description}
        // Use dedicated form loading state
        loading={formLoading}
        error={error}
        isOpen={isModalOpen} // Modal control
        onClose={handleCloseModal} // Close handler
        // Handlers
        onGroupNameChange={(e: ChangeEvent<HTMLInputElement>) =>
          setGroupName(e.target.value)
        }
        // Assuming description uses an input field or similar change event
        onDescriptionChange={(e: ChangeEvent<HTMLInputElement>) =>
          setDescription(e.target.value)
        }
        onSubmit={handleCreateGroup}
      />
    </div>
  );
}
