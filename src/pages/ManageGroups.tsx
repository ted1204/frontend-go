import React, { useState, useEffect } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { getGroups, createGroup, CreateGroupInput, deleteGroup } from "../services/groupService";
import { Group } from "../interfaces/group";
import { useNavigate } from "react-router-dom";
import GroupList from "../components/GroupList";
import CreateGroupForm from "../components/CreateGroupForm"

export default function ManageGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGroupClick = (groupId: number) => {
    navigate(`/groups/${groupId}`);
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const allGroups = await getGroups();
        setGroups(allGroups);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch groups");
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    const input: CreateGroupInput = { group_name: groupName, description };
    try {
      setLoading(true);
      const newGroup = await createGroup(input);
      setGroups([...groups, newGroup]);
      setGroupName("");
      setDescription("");
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async (groupId: number) => {
    const res = await deleteGroup(groupId);
    if (res.message === "Group deleted") {
      setGroups((prev) => prev.filter((g) => g.GID !== groupId));
    } else {
      console.error("刪除失敗:", res.message);
    }
  }

  return (
    <div>
      <PageMeta
        title="React.js Manage Groups | TailAdmin - Admin Dashboard Template"
        description="This is Manage Groups page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Manage Groups" />

      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <CreateGroupForm
          groupName={groupName}
          description={description}
          loading={loading}
          error={error}
          onGroupNameChange={(e) => setGroupName(e.target.value)}
          onDescriptionChange={(e) => setDescription(e.target.value)}
          onSubmit={handleCreateGroup}
        />
        <GroupList
          groups={groups}
          loading={loading}
          error={error}
          onGroupClick={handleGroupClick}
          onDeleteGroup={handleDeleteGroup}
        />
      </div>
    </div>
  );
}