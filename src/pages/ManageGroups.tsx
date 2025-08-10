import React, { useState, useEffect } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { getGroups, createGroup, Group, CreateGroupInput } from "../services/groupService";
import { useNavigate } from "react-router-dom";

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

  return (
    <div>
      <PageMeta
        title="React.js Manage Groups | TailAdmin - Admin Dashboard Template"
        description="This is Manage Groups page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Manage Groups" />

      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        {/* 創建群組表單 */}
        <div className="mx-auto w-full max-w-[630px] text-center mb-6">
          <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Create New Group
          </h3>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleCreateGroup} className="space-y-4">
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Group Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
              disabled={loading}
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              disabled={loading}
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? "Creating..." : "New Group"}
            </button>
          </form>
        </div>

        {/* 群組列表 */}
        <div className="mx-auto w-full max-w-[630px] text-left">
          <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Group List
          </h3>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : groups.length === 0 ? (
            <p className="text-gray-500">No groups found.</p>
          ) : (
            <ul className="space-y-2">
              {groups.map((group) => (
                <li
                  key={group.GID}
                  className="border-b py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleGroupClick(group.GID)}
                >
                  <span className="font-medium">{group.GroupName}</span>
                  {group.Description && (
                    <span className="text-gray-500 ml-2">{group.Description}</span>
                  )}
                  {group.GID && <span className="text-gray-500 ml-2">id: {group.GID}</span>}
                </li>
              ))}
            </ul>
          )}
          <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
            Explore groups
          </button>
        </div>
      </div>
    </div>
  );
}