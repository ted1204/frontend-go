import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PageMeta from "./common/PageMeta";
import PageBreadcrumb from "./common/PageBreadCrumb";
import { getGroupById } from "../services/groupService";
import { getUsers} from "../services/userService";
import { Group } from "../interfaces/group";
import InviteUserModal from "./InviteUserModal";
import { FormData } from "./InviteUserModal";
import { User } from "../interfaces/user";
import { UserGroupUser } from "../interfaces/userGroup";
import { createUserGroup, getUsersByGroup, deleteUserGroup, updateUserGroup } from "../services/userGroupService";
import EditRoleModal from "./EditRoleModal";
import Button from "./ui/button/Button"

export default function GroupDetail() {
  const { id = "" } = useParams<{ id?: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [groupUsers, setGroupUsers] = useState<UserGroupUser[]>([]);
  const [formData, setFormData] = useState<FormData>({ uid: 0, role: "user" });
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<{ uid: number; gid: number; role: "admin" | "manager" | "user" } | null>(null);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        setLoading(true);
        if (id) {
          const groupData = await getGroupById(parseInt(id));
          setGroup(groupData);
          const userGroupsData = await getUsersByGroup(parseInt(id));
          setGroupUsers(userGroupsData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch group");
      } finally {
        setLoading(false);
      }
    };
    fetchGroup();
  }, [id]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        setUsers(usersData);
      } catch (err) {
        setFormError("Failed to load users");
      }
    };
    fetchUsers();
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const u_id = formData.uid;
    const g_id = id ? parseInt(id) : 0;
    if (u_id <= 0 || isNaN(g_id) || !id) {
      setFormError("Please select a valid user and group");
      return;
    }
    try {
      await createUserGroup({ u_id: u_id, g_id: g_id, role: formData.role });
      setIsModalOpen(false);
      setFormError(null);
      const updatedUserGroups = await getUsersByGroup(parseInt(id));
      setGroupUsers(updatedUserGroups);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to invite");
    }
  };

  const handleDelete = async (u_id: number) => {
  try {
    const response = await deleteUserGroup({ u_id, g_id: parseInt(id) });
    if (response.message === "204") {
      const updatedUserGroups = await getUsersByGroup(parseInt(id));
      setGroupUsers(updatedUserGroups);
    } else {
      setFormError(response.message || "Failed to delete user from group");
    }
  } catch (err) {
    setFormError(err instanceof Error ? err.message : "Failed to delete user from group");
  }
};

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
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Group Details
          </h3>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Invite User
          </Button>
        </div>
        <div className="space-y-2">  
          <p className="text-gray-800 dark:text-white/90"><strong>ID:</strong> {group.GID}</p>  
          <p className="text-gray-800 dark:text-white/90"><strong>Name:</strong> {group.GroupName}</p>  
          <p className="text-gray-800 dark:text-white/90"><strong>Description:</strong> {group.Description || "N/A"}</p>  
          <p className="text-gray-800 dark:text-white/90"><strong>Created At:</strong> {group.CreatedAt}</p>  
          <p className="text-gray-800 dark:text-white/90"><strong>Updated At:</strong> {group.UpdatedAt}</p>  
        </div>
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">Group Members</h4>
          {groupUsers.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="p-2 border-b dark:text-white">User ID</th>
                  <th className="p-2 border-b dark:text-white">User Name</th>
                  <th className="p-2 border-b dark:text-white">Role</th>
                  <th className="p-2 border-b dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {groupUsers.map((groupUser) => (
                  <tr key={groupUser.UID} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="p-2 border-b dark:text-gray-300">{groupUser.UID}</td>
                    <td className="p-2 border-b dark:text-gray-300">{groupUser.Username}</td>
                    <td className="p-2 border-b dark:text-gray-300">
                      <button
                        onClick={() => setSelectedUser({ uid: groupUser.UID, gid: parseInt(id), role: groupUser.Role })}
                        className="text-blue-500 hover:underline"
                      >
                        {groupUser.Role === 'admin' ? 'Admin' : groupUser.Role === 'manager' ? 'Manager' : 'User'}
                      </button>
                    </td>
                    <td className="p-2 border-b dark:text-gray-300">
                      <button
                        onClick={() => handleDelete(groupUser.UID)}
                        className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>                    
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No members in this group.</p>
          )}
        </div>
      </div>
      <InviteUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        users={users}
        formData={formData}
        setFormData={setFormData}
        formError={formError}
        handleSubmit={handleSubmit}
      />
      {selectedUser && (
        <EditRoleModal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          user={selectedUser}
          onUpdate={async (newRole) => {
            await updateUserGroup({ u_id: selectedUser.uid, g_id: selectedUser.gid, role: newRole });
            const updatedUserGroups = await getUsersByGroup(parseInt(id));
            setGroupUsers(updatedUserGroups);
          }}
        />
      )}
    </div>
  );
}