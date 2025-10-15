// src/pages/ManageProjects.tsx

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Project } from '../interfaces/project';
import ProjectList from '../components/ProjectList';
import {
  getProjects,
  createProject,
  deleteProject,
  CreateProjectDTO,
} from '../services/projectService';
import { useNavigate } from 'react-router-dom';
import CreateProjectForm from '../components/CreateProjectForm';
import Button from '../components/ui/button/Button';

import { getGroups } from '../services/groupService';
// --- Conceptual Group Interfaces (Must be defined in your app) ---
interface GroupOption {
  GID: number;
  GroupName: string;
}
// ----------------------------------------------------------------

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

export default function ManageProjects() {
  // Project States
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  // Group/Form States
  const [availableGroups, setAvailableGroups] = useState<GroupOption[]>([]); // Groups for dropdown
  const [selectedGroupName, setSelectedGroupName] = useState(''); // Name for dropdown display
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [groupId, setGroupId] = useState<number>(0); // Group ID to submit

  // UI/API States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  const handleProjectClick = (projectId: number) => {
    navigate(`/projects/${projectId}`);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  /**
   * Handles setting the Group ID and Name from the modal's search-select.
   */
  const handleSelectedGroupChange = (id: number, name: string) => {
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
    setGroupId(0);
    setSelectedGroupName('');
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
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch initial data'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
  const handleCreateProject = async (e: FormEvent) => {
    e.preventDefault();

    if (groupId === 0) {
      setError('Please select a valid Group Name before submitting.');
      return;
    }

    const input: CreateProjectDTO = {
      project_name: projectName,
      description,
      g_id: groupId,
    };

    try {
      setLoading(true);
      setError(null);

      const newProject = await createProject(input);

      if (newProject && newProject.PID) {
        setAllProjects((prev) => [...prev, newProject]);
        handleCloseModal();
      } else {
        setError(
          'Invalid project data received from server or creation failed.'
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles project deletion.
   */
  const handleDeleteProject = async (projectId: number) => {
    try {
      const res = await deleteProject(projectId);
      if (res.message === 'project deleted') {
        setAllProjects((prev) => prev.filter((p) => p.PID !== projectId));
      } else {
        setError(res.message || 'Failed to delete project.');
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
      {/* PageMeta and PageBreadcrumb elements (assumed to be here) */}

      <div className="min-h-screen rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 xl:p-10">
        {/* Top Action Bar: Create Button */}
        <div className="flex justify-end mb-8">
          <Button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="
                            flex items-center space-x-2 px-4 py-2 text-sm font-semibold 
                            bg-violet-600 text-white rounded-lg shadow-md
                            hover:bg-violet-700 transition duration-150 
                            focus:outline-none focus:ring-4 focus:ring-violet-500 focus:ring-opacity-50
                        "
          >
            <PlusIcon className="w-5 h-5" />
            <span>New Project</span>
          </Button>
        </div>

        {/* Project List Component */}
        <ProjectList
          projects={filteredProjects}
          loading={loading}
          error={error}
          onProjectClick={handleProjectClick}
          onDeleteProject={handleDeleteProject}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />
      </div>

      {/* Project Creation Modal (Conditional Rendering) */}
      <CreateProjectForm
        projectName={projectName}
        description={description}
        groupId={groupId}
        loading={loading}
        error={error}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onProjectNameChange={(e: ChangeEvent<HTMLInputElement>) =>
          setProjectName(e.target.value)
        }
        onDescriptionChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          setDescription(e.target.value)
        }
        // This handler is effectively deprecated but kept to satisfy the prop interface
        onGroupIdChange={(e: ChangeEvent<HTMLInputElement>) => {
          /* No operation */
        }}
        onSubmit={handleCreateProject}
        // === NEW PROPS for Search-Select ===
        availableGroups={availableGroups}
        selectedGroupName={selectedGroupName}
        onSelectedGroupChange={handleSelectedGroupChange}
      />
    </div>
  );
}
