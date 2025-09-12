import React, { useState } from "react";
import { ConfigFile } from "../interfaces/configFile";
import { Resource } from "../interfaces/resource";
import { getResourcesByConfigFile } from "../services/resourceService";

interface ConfigFileListProps {
  configFiles: ConfigFile[];
  onDelete: (id: number) => void;
  onEdit: (config: ConfigFile) => void;
  onCreateInstance: (id: number) => void;
  onDeleteInstance: (id: number) => void;
  actionLoading: boolean;
}

export default function ConfigFileList({ configFiles, onDelete, onEdit, onCreateInstance, onDeleteInstance, actionLoading }: ConfigFileListProps) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [resources, setResources] = useState<Record<number, Resource[]>>({});
  const [loading, setLoading] = useState<Record<number, boolean>>({});

  const toggleExpand = async (cfId: number) => {
    const isOpen = !expanded[cfId];
    setExpanded(prev => ({ ...prev, [cfId]: isOpen }));

    if (isOpen && !resources[cfId]) {
      setLoading(prev => ({ ...prev, [cfId]: true }));
      try {
        const res = await getResourcesByConfigFile(cfId);
        setResources(prev => ({ ...prev, [cfId]: res }));
      } catch (error) {
        console.error("Error fetching resources:", error); // 加 toast error 生產級
      } finally {
        setLoading(prev => ({ ...prev, [cfId]: false }));
      }
    }
  };

  if (configFiles.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400">No config files.</p>;
  }

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-gray-100 dark:bg-gray-700">
          <th className="p-2 border-b dark:text-white">ID</th>
          <th className="p-2 border-b dark:text-white">Filename</th>
          <th className="p-2 border-b dark:text-white">Created At</th>
          <th className="p-2 border-b dark:text-white">Actions</th>
        </tr>
      </thead>
      <tbody>
        {configFiles.map((cf) => (
          <React.Fragment key={cf.CFID}>
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-600">
              <td className="p-2 border-b dark:text-gray-300">
                {cf.CFID}
                <button
                  onClick={() => toggleExpand(cf.CFID)}
                  className="ml-2 text-blue-500 hover:underline"
                  disabled={actionLoading}
                >
                  {expanded[cf.CFID] ? "▼" : "▶"} Resources
                </button>
              </td>
              <td className="p-2 border-b dark:text-gray-300">{cf.Filename}</td>
              <td className="p-2 border-b dark:text-gray-300">{cf.CreatedAt}</td>
              <td className="p-2 border-b dark:text-gray-300">
                {/* 現有 buttons */}
                <button onClick={() => onEdit(cf)} className="px-2 py-1 bg-yellow-500 text-white rounded-md mr-2 hover:bg-yellow-600" disabled={actionLoading}>Edit</button>
                <button onClick={() => onDelete(cf.CFID)} className="px-2 py-1 bg-red-500 text-white rounded-md mr-2 hover:bg-red-600" disabled={actionLoading}>Delete</button>
                <button onClick={() => onCreateInstance(cf.CFID)} className="px-2 py-1 bg-green-500 text-white rounded-md mr-2 hover:bg-green-600" disabled={actionLoading}>Deploy</button>
                <button onClick={() => onDeleteInstance(cf.CFID)} className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600" disabled={actionLoading}>Destruct</button>
              </td>
            </tr>
            {expanded[cf.CFID] && (
              <tr>
                <td colSpan={4} className="p-4 bg-gray-100 dark:bg-gray-700">
                  {loading[cf.CFID] ? (
                    <p>Loading resources...</p>
                  ) : resources[cf.CFID]?.length ? (
                    <ul className="list-disc pl-5">
                      {resources[cf.CFID].map(r => (
                        <li key={r.RID} className="mb-2">
                          {r.Name} ({r.Type}) - Created: {r.CreatedAt}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No resources found.</p>
                  )}
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}