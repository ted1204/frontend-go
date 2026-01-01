import React, { useState, FormEvent } from 'react';

interface JobApplyModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    image: string;
    namespace: string;
    priority: string;
  }) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: string | null;
}

const JobApplyModal: React.FC<JobApplyModalProps> = ({
  open,
  onClose,
  onSubmit,
  loading,
  error,
  success,
}) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [namespace, setNamespace] = useState('default');
  const [priority, setPriority] = useState('normal');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit({ name, image, namespace, priority });
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-lg font-bold mb-4">Submit New Job</h2>
        {error && <div className="mb-2 text-sm text-red-600">{error}</div>}
        {success && <div className="mb-2 text-sm text-green-600">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Job Name</label>
            <input
              className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-700"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image</label>
            <input
              className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-700"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Namespace</label>
            <input
              className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-700"
              value={namespace}
              onChange={(e) => setNamespace(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select
              className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-700"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <button
              type="submit"
              className="px-4 py-2 bg-violet-600 text-white rounded disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobApplyModal;
