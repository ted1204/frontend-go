import React from "react";
import { Group } from "../interfaces/group"; // Adjust import based on your structure

interface GroupListProps {
  groups: Group[];
  loading: boolean;
  error: string | null;
  onGroupClick: (groupId: number) => void;
  onDeleteGroup: (groupId: number) => void;
}

const GroupList: React.FC<GroupListProps> = ({
  groups,
  loading,
  error,
  onGroupClick,
  onDeleteGroup,
}) => {
  return (
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
              className="flex justify-between items-center border-b py-2 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <div onClick={() => onGroupClick(group.GID)} className="cursor-pointer">
                <span className="font-medium dark:text-white">{group.GroupName}</span>
                {group.Description && (
                  <span className="text-gray-500 ml-2">{group.Description}</span>
                )}
                {group.GID && <span className="text-gray-500 ml-2">id: {group.GID}</span>}
              </div>
              <button
                className="text-red-500 hover:text-red-700 px-2 py-1 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteGroup(group.GID);
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
      {/* <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
        Explore groups
      </button> */}
    </div>
  );
};

export default GroupList;