import React from "react";
import Input from "./form/input/InputField"; // 假設與 CreateGroupForm 使用相同 Input，若無則用原 input
import Button from "./ui/button/Button";

interface CreateProjectFormProps {
  projectName: string;
  description: string;
  groupId: number;
  loading: boolean;
  error: string | null;
  onProjectNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGroupIdChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const CreateProjectForm: React.FC<CreateProjectFormProps> = ({
  projectName,
  description,
  groupId,
  loading,
  error,
  onProjectNameChange,
  onDescriptionChange,
  onGroupIdChange,
  onSubmit,
}) => {
  return (
    <div className="mx-auto w-full max-w-[630px] text-center mb-6">
      <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
        Create New Project
      </h3>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          type="text"
          value={projectName}
          onChange={onProjectNameChange}
          placeholder="Project Name"
          className="w-full"
          required
          disabled={loading}
        />
        <Input
          type="text"
          value={description}
          onChange={onDescriptionChange}
          placeholder="Description (optional)"
          className="w-full"
          disabled={loading}
        />
        <Input
          type="number"
          value={groupId || ""}
          onChange={onGroupIdChange}
          placeholder="Group ID"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
          disabled={loading}
        />
        <Button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Creating..." : "New Project"}
        </Button>
      </form>
    </div>
  );
};

export default CreateProjectForm;