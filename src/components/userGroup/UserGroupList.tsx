// src/components/UserGroupList.tsx
import React, { useEffect, useState } from "react";
import { getUsersByGroup, UserGroup } from "../../services/userGroupService";

const UserGroupList: React.FC<{ groupId: number }> = ({ groupId }) => {
  const [users, setUsers] = useState<UserGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsersByGroup(groupId);
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [groupId]);

  if (loading) return <div className="text-gray-500">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Users in Group {groupId}</h2>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={`${user.uid}-${user.gid}`} className="border p-2 rounded">
            User ID: {user.uid}, Role: {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserGroupList;