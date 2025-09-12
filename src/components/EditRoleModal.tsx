import React, { useState } from "react";

interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { uid: number; gid: number; role: "admin" | "manager" | "user" };
  onUpdate: (newRole: "admin" | "manager" | "user") => Promise<void>;
}

export default function EditRoleModal({ isOpen, onClose, user, onUpdate }: EditRoleModalProps) {
  const [selectedRole, setSelectedRole] = useState<"admin" | "manager" | "user">(user.role);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onUpdate(selectedRole);
      onClose();
    } catch (err) {
      setError("Failed to update role");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-md dark:bg-gray-800">
        <h2 className="text-lg font-semibold mb-4">Edit Role for User {user.uid}</h2>
        <form onSubmit={handleSubmit}>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as "admin" | "manager" | "user")}
            className="w-full p-2 border rounded-md mb-4"
          >
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="user">User</option>
          </select>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 mr-2 bg-gray-300 rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
}