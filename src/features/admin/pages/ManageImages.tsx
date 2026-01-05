import { useState, useEffect } from 'react';
import {
  getAllowedImages,
  deleteAllowedImage,
  pullImage,
  AllowedImage,
} from '@/core/services/imageService';
import { PageMeta } from '@nthucscc/components-shared';
import { PageBreadcrumb } from '@nthucscc/ui';

export default function ManageImages() {
  const [images, setImages] = useState<AllowedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isPullModalOpen, setIsPullModalOpen] = useState(false);
  const [pullName, setPullName] = useState('');
  const [pullTag, setPullTag] = useState('');

  const loadImages = async () => {
    try {
      setLoading(true);
      const data = await getAllowedImages();
      setImages(data);
    } catch (err) {
      console.error('Failed to load images:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setProcessing(true);
      await deleteAllowedImage(deleteId);
      await loadImages();
      setDeleteId(null);
    } catch (err) {
      alert('Failed to delete image: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setProcessing(false);
    }
  };

  const handlePull = async () => {
    if (!pullName || !pullTag) return;
    try {
      setProcessing(true);
      await pullImage(pullName, pullTag);
      alert('Image pull triggered successfully');
      setIsPullModalOpen(false);
      setPullName('');
      setPullTag('');
    } catch (err) {
      alert('Failed to trigger pull: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <PageMeta title="Manage Images" description="Manage allowed images in the system" />
      <PageBreadcrumb pageTitle="Manage Images" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center justify-between px-4 py-6 md:px-6 xl:px-7.5">
          <h4 className="text-xl font-semibold text-black dark:text-white">Allowed Images</h4>
          <button
            onClick={() => setIsPullModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            Pull Image
          </button>
        </div>

        <div className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
          <div className="col-span-2 flex items-center">
            <p className="font-medium">Name</p>
          </div>
          <div className="col-span-2 hidden items-center sm:flex">
            <p className="font-medium">Tag</p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="font-medium">Scope</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Project ID</p>
          </div>
          <div className="col-span-1 flex items-center justify-end">
            <p className="font-medium">Actions</p>
          </div>
        </div>

        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : (
          images.map((img) => (
            <div
              key={img.ID}
              className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
            >
              <div className="col-span-2 flex items-center">
                <p className="text-sm text-black dark:text-white">{img.Name}</p>
              </div>
              <div className="col-span-2 hidden items-center sm:flex">
                <p className="text-sm text-black dark:text-white">{img.Tag}</p>
              </div>
              <div className="col-span-2 flex items-center">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                    img.IsGlobal
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {img.IsGlobal ? 'Global' : 'Project Specific'}
                </span>
              </div>
              <div className="col-span-1 flex items-center">
                <p className="text-sm text-black dark:text-white">{img.ProjectID || '-'}</p>
              </div>
              <div className="col-span-1 flex items-center justify-end">
                <button
                  onClick={() => setDeleteId(img.ID)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-boxdark">
            <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
              Confirm Deletion
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Are you sure you want to delete this allowed image? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteId(null)}
                className="rounded px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:opacity-50"
                disabled={processing}
              >
                {processing ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pull Image Modal */}
      {isPullModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-boxdark">
            <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
              Pull Image on Cluster
            </h3>
            <div className="mb-4">
              <label className="mb-2.5 block text-black dark:text-white">Image Name</label>
              <input
                type="text"
                placeholder="e.g. nginx"
                value={pullName}
                onChange={(e) => setPullName(e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
            <div className="mb-6">
              <label className="mb-2.5 block text-black dark:text-white">Tag</label>
              <input
                type="text"
                placeholder="e.g. latest"
                value={pullTag}
                onChange={(e) => setPullTag(e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsPullModalOpen(false)}
                className="rounded px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={handlePull}
                className="rounded bg-primary px-4 py-2 text-white hover:bg-opacity-90 disabled:opacity-50"
                disabled={processing || !pullName || !pullTag}
              >
                {processing ? 'Triggering...' : 'Pull'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
