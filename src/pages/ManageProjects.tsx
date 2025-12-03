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
import DeleteConfirmationModal from '../components/ui/modal/DeleteConfirmationModal'; // 🚨 1. 引入 Modal

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
  const [actionLoading, setActionLoading] = useState(false); // 🚨 2. 新增專門的 action loading state
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 🚨 3. 新增刪除確認相關 States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

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

  // 🚨 4. 處理關閉刪除 Modal
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
      } catch (err) {
        setError(
          err instanceof Error ? err.message : '無法取得初始資料'
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
      setError('提交前請選擇有效的群組名稱。');
      return;
    }

    const input: CreateProjectDTO = {
      project_name: projectName,
      description,
      g_id: groupId,
    };

    try {
      setActionLoading(true); // 使用 actionLoading 鎖定按鈕
      setError(null);

      const newProject = await createProject(input);

      if (newProject && newProject.PID) {
        setAllProjects((prev) => [...prev, newProject]);
        handleCloseModal();
      } else {
        setError(
          '從伺服器接收到無效的專案資料或建立失敗。'
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '無法建立專案');
    } finally {
      setActionLoading(false);
    }
  };

  // 🚨 5. 處理點擊刪除按鈕 (開啟 Modal)
  const handleDeleteClick = (project: Project) => {
    // 如果有其他操作正在執行 (actionLoading)，則不響應點擊
    if (actionLoading || loading) return;
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  };

  /**
   * 🚨 6. 處理確認刪除 (執行 API)
   */
  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;

    const projectId = projectToDelete.PID;

    // 鎖定操作並立即關閉 Modal
    setActionLoading(true);
    handleCloseDeleteModal();

    try {
      const res = await deleteProject(projectId);
      if (res.message === 'project deleted') {
        // 更新列表
        setAllProjects((prev) => prev.filter((p) => p.PID !== projectId));
      } else {
        setError(res.message || '無法刪除專案。');
        console.error('Deletion failed:', res.message);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : '刪除時發生錯誤。'
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ⚠️ 原本的 handleDeleteProject 被刪除，請確保 ProjectList 改為呼叫 handleDeleteClick

  return (
    <div className="relative">
      {/* 假設 PageMeta 和 PageBreadcrumb 在這裡 */}

      <div className="min-h-screen rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 xl:p-10">
        {/* Top Action Bar: Create Button */}
        <div className="flex justify-end mb-8">
          <Button
            type="button"
            onClick={() => setIsModalOpen(true)}
            // 禁用按鈕如果正在載入或執行其他動作
            disabled={loading || actionLoading}
            className="
                          flex items-center space-x-2 px-4 py-2 text-sm font-semibold 
                          bg-violet-600 text-white rounded-lg shadow-md
                          hover:bg-violet-700 transition duration-150 
                          focus:outline-none focus:ring-4 focus:ring-violet-500 focus:ring-opacity-50
                          disabled:opacity-50 disabled:cursor-not-allowed
                      "
          >
            <PlusIcon className="w-5 h-5" />
            <span>新專案</span>
          </Button>
        </div>

        {/* Project List Component */}
        <ProjectList
          projects={filteredProjects}
          loading={loading}
          error={error}
          onProjectClick={handleProjectClick}
          // 🚨 傳遞新的 handler，它接受 Project 物件
          onDeleteProject={handleDeleteClick}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          // 🚨 傳遞 action loading 狀態給列表，禁用刪除按鈕
          isActionLoading={actionLoading}
        />
      </div>

      {/* Project Creation Modal (Conditional Rendering) */}
      <CreateProjectForm
        projectName={projectName}
        description={description}
        groupId={groupId}
        // 🚨 這裡使用 actionLoading 來控制表單提交的載入狀態
        loading={actionLoading}
        error={error}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onProjectNameChange={(e: ChangeEvent<HTMLInputElement>) =>
          setProjectName(e.target.value)
        }
        onDescriptionChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          setDescription(e.target.value)
        }
        onGroupIdChange={() => {
          /* No operation */
        }}
        onSubmit={handleCreateProject}
        availableGroups={availableGroups}
        selectedGroupName={selectedGroupName}
        onSelectedGroupChange={handleSelectedGroupChange}
      />

      {/* 🚨 7. 渲染 Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        item={projectToDelete}
        itemType="Project"
        loading={actionLoading} // 使用 actionLoading 鎖定 Modal 內部的按鈕
      />
    </div>
  );
}
