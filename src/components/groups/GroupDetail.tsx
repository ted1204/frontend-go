import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PageMeta from "../common/PageMeta";
import PageBreadcrumb from "../common/PageBreadCrumb";
import { getGroupById } from "../../services/groupService";

interface Group {
  GID: number;
  GroupName: string;
  Description?: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export default function GroupDetail() {
  const { id } = useParams<{ id: string }>(); // 從 URL 中獲取 group id
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        setLoading(true);
        if (id) {
          const groupData = await getGroupById(parseInt(id)); // 假設 getGroup 函數已定義
          setGroup(groupData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch group");
      } finally {
        setLoading(false);
      }
    };
    fetchGroup();
  }, [id]);

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!group) return <p className="text-gray-500">Group not found.</p>;

  return (
    <div>
      <PageMeta
        title={`React.js Group ${group.GroupName} | TailAdmin`}
        description={`Details for group ${group.GroupName}`}
      />
      <PageBreadcrumb pageTitle={group.GroupName} />

      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
          Group Details
        </h3>
        <div className="space-y-2">
          <p><strong>ID:</strong> {group.GID}</p>
          <p><strong>Name:</strong> {group.GroupName}</p>
          <p><strong>Description:</strong> {group.Description || "N/A"}</p>
          <p><strong>Created At:</strong> {group.CreatedAt}</p>
          <p><strong>Updated At:</strong> {group.UpdatedAt}</p>
        </div>
      </div>
    </div>
  );
}