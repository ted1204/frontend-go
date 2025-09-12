import React, { useState, useEffect } from "react";
import { ConfigFile } from "../interfaces/configFile";

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

export default function EditConfigModal({ isOpen, onClose, onSave, selectedConfig, actionLoading }: EditConfigModalProps) {
  const [formData, setFormData] = useState<FormData>({ filename: "", raw_yaml: "" });

  useEffect(() => {
    if (selectedConfig) {
      setFormData({ filename: selectedConfig.Filename, raw_yaml: "" });
    }
  }, [selectedConfig]);

  const handleSubmit = () => {
    if (!formData.filename) {
      alert("Filename is required"); // Use better error handling in production
      return;
    }
    onSave(formData);
    setFormData({ filename: "", raw_yaml: "" }); // Reset form
  };

  if (!isOpen || !selectedConfig) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Edit Config File</h3>
        <input
          type="text"
          value={formData.filename}
          className="w-full p-2 mb-2 border rounded"
          onChange={(e) => setFormData({ ...formData, filename: e.target.value })}
        />
        <textarea
          value={formData.raw_yaml}
          placeholder="Raw YAML content (not editable yet)"
          className="w-full p-2 mb-2 border rounded h-40"
          onChange={(e) => setFormData({ ...formData, raw_yaml: e.target.value })}
          disabled
        />
        <div className="flex justify-end">
          <button
            onClick={() => { onClose(); setFormData({ filename: "", raw_yaml: "" }); }}
            className="px-4 py-2 mr-2 bg-gray-300 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={actionLoading}
          >
            {actionLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}