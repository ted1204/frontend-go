import React, { useState } from "react";
import Button from "./ui/button/Button"

interface FormData {
  filename: string;
  raw_yaml: string;
}

interface AddConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: FormData) => void;
  actionLoading: boolean;
}

export default function AddConfigModal({ isOpen, onClose, onCreate, actionLoading }: AddConfigModalProps) {
  const [formData, setFormData] = useState<FormData>({ filename: "", raw_yaml: "" });

  const handleSubmit = () => {
    if (!formData.filename || !formData.raw_yaml) {
      alert("Filename and raw YAML are required"); // Use better error handling in production
      return;
    }
    onCreate(formData);
    setFormData({ filename: "", raw_yaml: "" }); // Reset form
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Create Config File</h3>
        <input
          type="text"
          value={formData.filename}
          placeholder="Filename (e.g., nginx.yaml)"
          className="w-full p-2 mb-2 border rounded"
          onChange={(e) => setFormData({ ...formData, filename: e.target.value })}
        />
        <textarea
          value={formData.raw_yaml}
          placeholder="Raw YAML content"
          className="w-full p-2 mb-2 border rounded h-40"
          onChange={(e) => setFormData({ ...formData, raw_yaml: e.target.value })}
        />
        <div className="flex justify-end">
          <button
            onClick={() => { onClose(); setFormData({ filename: "", raw_yaml: "" }); }}
            className="px-4 py-2 mr-2 bg-gray-300 rounded-md"
          >
            Cancel
          </button>
          <Button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={actionLoading}
          >
            {actionLoading ? "Creating..." : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
}