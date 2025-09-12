import React, { useState, useEffect } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { Group } from "../interfaces/group";
import { getGroups } from "../services/groupService";
import { getGroupsByUser } from "../services/userGroupService";
import { useNavigate } from "react-router-dom";

export default function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleGroupClick = (groupId: number) => {
    navigate(`/groups/${groupId}`);
  };

  useEffect(() => {
    const fetchGroupsAndFilter = async () => {
      try {
        setLoading(true);
        const allGroups = await getGroups();
        const userData = localStorage.getItem("userData");
        if (userData) {
          const parsedData = JSON.parse(userData);
          setUserId(parsedData.user_id);
          if (userId) {
            const userGroups = await getGroupsByUser(userId);
            const userGroupIds = userGroups.map((ug) => ug.GID);
            const filteredGroups = allGroups.filter((group) =>
              userGroupIds.includes(group.GID)
            );
            setGroups(filteredGroups);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch groups");
      } finally {
        setLoading(false);
      }
    };
    fetchGroupsAndFilter();
  }, [userId]);

  return (
    <div>
      <PageMeta
        title="React.js Groups Dashboard | TailAdmin"
        description="This is Groups Dashboard page for TailAdmin"
      />
      <PageBreadcrumb pageTitle="Groups" />

      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
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
                  className="border-b py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600"
                  onClick={() => handleGroupClick(group.GID)}
                >
                  <span className="font-medium dark:text-white">{group.GroupName}</span>
                  {group.Description && (
                    <span className="text-gray-500 ml-2">{group.Description}</span>
                  )}
                  {group.GID && <span className="text-gray-500 ml-2">id: {group.GID}</span>}
                </li>
              ))}
            </ul>
          )}
          {/* <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
            Explore groups
          </button> */}
        </div>
      </div>
    </div>
  );
}