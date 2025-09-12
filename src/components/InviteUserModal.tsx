import React from "react";
import Button from "./ui/button/Button";
interface User {
  UID: number;
  Username: string;
}

export interface FormData {
  uid: number;
  role: "user" | "admin" | "manager";
}

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  formError: string | null;
  handleSubmit: (e: React.FormEvent) => void;
}

const InviteUserModal: React.FC<InviteUserModalProps> = ({
  isOpen,
  onClose,
  users,
  formData,
  setFormData,
  formError,
  handleSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Invite User to Group</h2>
        {formError && <p className="text-red-500 mb-2">{formError}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Select User</label>
            <select
              value={formData.uid}
              onChange={(e) => {
                setFormData({ ...formData, uid: parseInt(e.target.value) || 0 });
              }}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              required
            >
              <option value={0}>Choose user...</option>
              {users.map(user => (
                <option key={user.UID} value={user.UID}>{user.Username}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as "user" | "admin" | "manager" })}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="user">User</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md dark:bg-gray-600 dark:text-white"
            >
              Cancel
            </button>
            <Button
              type="submit"
              >
              Invite
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteUserModal;