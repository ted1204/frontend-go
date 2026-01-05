import React, { useState, FormEvent, useEffect } from 'react';
import { getAllowedImages, AllowedImage } from '@/core/services/imageService';

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
  const [allowedImages, setAllowedImages] = useState<AllowedImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);

  useEffect(() => {
    if (open) {
      loadAllowedImages();
    }
  }, [open]);

  const loadAllowedImages = async () => {
    setLoadingImages(true);
    try {
      const images = await getAllowedImages();
      setAllowedImages(images);
    } catch (err) {
      console.error('Failed to load allowed images:', err);
    } finally {
      setLoadingImages(false);
    }
  };

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
            {loadingImages ? (
              <div className="text-sm text-gray-500">Loading images...</div>
            ) : allowedImages.length > 0 ? (
              <select
                className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-700"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
              >
                <option value="">Select an image...</option>
                {allowedImages.map((img) => (
                  <option key={img.ID} value={`${img.Name}:${img.Tag}`}>
                    {img.Name}:{img.Tag}
                  </option>
                ))}
              </select>
            ) : (
              <div>
                <input
                  className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-700"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="e.g., ubuntu:22.04"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  No pre-approved images. Contact admin to add images.
                </p>
              </div>
            )}
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
