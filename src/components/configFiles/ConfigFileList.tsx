// src/components/ConfigFileList.tsx
import React, { useEffect, useState } from "react";
import { getConfigFiles, ConfigFile } from "../../services/configFileService";

const ConfigFileList: React.FC = () => {
  const [configFiles, setConfigFiles] = useState<ConfigFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfigFiles = async () => {
      try {
        const data = await getConfigFiles();
        setConfigFiles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchConfigFiles();
  }, []);

  if (loading) return <div className="text-gray-500">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Config Files</h2>
      <ul className="space-y-2">
        {configFiles.map((file) => (
          <li key={file.cfid} className="border p-2 rounded">
            {file.filename} (ID: {file.cfid}, Project: {file.projectID})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConfigFileList;