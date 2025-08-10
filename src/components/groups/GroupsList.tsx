// src/components/GroupList.tsx
import React, { useEffect, useState } from "react";
import { getGroups } from "../../services/groupService";

const GroupList: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await getGroups();
        setGroups(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  if (loading) return <div className="text-gray-500">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Groups</h2>
      <ul className="space-y-2">
        {groups.map((group) => (
          <li key={group.gid} className="border p-2 rounded">
            {group.groupName} (ID: {group.gid})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupList;