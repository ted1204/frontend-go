import React, { useState, useEffect } from "react";
import { ConfigFile } from "../interfaces/configFile";
import MonacoEditor from "react-monaco-editor";

interface FormData {
  filename: string;
  raw_yaml: string;
}

interface EditConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormData) => void;
  selectedConfig: ConfigFile | null;
  actionLoading: boolean;
}

export default function EditConfigModal({
  isOpen,
  onClose,
  onSave,
  selectedConfig,
  actionLoading,
}: EditConfigModalProps) {
  const [formData, setFormData] = useState<FormData>({ filename: "", raw_yaml: "" });

  useEffect(() => {
    if (selectedConfig) {
      setFormData({ filename: selectedConfig.Filename, raw_yaml: selectedConfig.Content });
    }
  }, [selectedConfig]);

  const handleChange = (newData: any) => {
    setFormData({ ...formData, raw_yaml: newData });
  }

  const handleSubmit = () => {
    if (!formData.filename) {
      alert("Filename is required");
      return;
    }
    if (!formData.raw_yaml) {
      alert("Raw YAML is required");
      return;
    }
    onSave(formData);
    setFormData({ filename: "", raw_yaml: "" }); // Reset form
  };

  if (!isOpen || !selectedConfig) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-10 rounded-lg shadow-xl w-full md:w-4/5 lg:w-3/5 xl:w-2/3">
        <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Edit Config File</h3>

        {/* Filename input */}
        <div className="mb-6">
          <label htmlFor="filename" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filename (e.g., nginx.yaml)
          </label>
          <input
            id="filename"
            type="text"
            value={formData.filename}
            placeholder="Enter the filename"
            className="w-full p-4 border-2 border-blue-500 dark:border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-700 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            onChange={(e) => setFormData({ ...formData, filename: e.target.value })}
          />
        </div>

        {/* Raw YAML editor using Monaco Editor */}
        <div className="mb-6">
          <label htmlFor="raw_yaml" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Raw YAML content
          </label>
          <MonacoEditor
            width="100%"
            height="500px"
            language="yaml"
            theme={document.documentElement.classList.contains("dark") ? "vs-dark" : "vs-light"}
            value={formData.raw_yaml}
            onChange={handleChange}
            options={{
              border: "2px solid #3B82F6", // Add border styling to Monaco Editor
              focusBorder: "#2563EB", // Focused border color
            }}
          />
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-6 mt-6">
          <button
            onClick={() => { onClose(); setFormData({ filename: "", raw_yaml: "" }); }}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
            disabled={actionLoading}
          >
            {actionLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
