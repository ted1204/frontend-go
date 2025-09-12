import React from "react";
import Input from "./form/input/InputField"; // 假設 Input 位於此路徑
import Button from "./ui/button/Button";
interface CreateGroupFormProps {
  groupName: string;
  description: string;
  loading: boolean;
  error: string | null;
  onGroupNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const CreateGroupForm: React.FC<CreateGroupFormProps> = ({
  groupName,
  description,
  loading,
  error,
  onGroupNameChange,
  onDescriptionChange,
  onSubmit,
}) => {
  return (
    <div className="mx-auto w-full max-w-[630px] text-center mb-6">
      <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
        Create New Group
      </h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          type="text"
          value={groupName}
          onChange={onGroupNameChange}
          placeholder="Group Name"
          className="w-full"
          required
          disabled={loading}
          error={!!error} // 轉為布林值觸發錯誤樣式
          hint={error || undefined} // 顯示錯誤訊息作為 hint
        />
        <Input
          type="text"
          value={description}
          onChange={onDescriptionChange}
          placeholder="Description (optional)"
          className="w-full"
          disabled={loading}
        />
        <Button
          type="submit"
          className="w-full bg-brand-500 text-white py-2 rounded-md hover:bg-brand-400 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Creating..." : "New Group"}
        </Button>
      </form>
    </div>
  );
};

export default CreateGroupForm;