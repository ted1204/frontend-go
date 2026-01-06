import { useState, useEffect, useRef } from 'react';
import { getAllowedImages, deleteAllowedImage, AllowedImage } from '@/core/services/imageService';
import { PageMeta } from '@nthucscc/components-shared';
import { PageBreadcrumb } from '@nthucscc/ui';
import { BASE_URL } from '@/core/config/url';

interface PullJobStatus {
  job_id: string;
  image: string;
  status: 'pending' | 'pulling' | 'completed' | 'failed';
  progress: number;
  message: string;
  timestamp: string;
}

interface PullImageRequest {
  names: string[];
}

export default function ManageImages() {
  const [images, setImages] = useState<AllowedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set());
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [pullJobStatuses, setPullJobStatuses] = useState<Map<string, PullJobStatus>>(new Map());
  const wsConnectionsRef = useRef<Map<string, WebSocket>>(new Map());

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

  useEffect(() => {
    return () => {
      // Close all WebSocket connections on unmount
      wsConnectionsRef.current.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      });
    };
  }, []);

  const connectWebSocket = (jobId: string) => {
    // Avoid duplicate connections
    if (wsConnectionsRef.current.has(jobId)) {
      return;
    }

    // Construct WebSocket URL
    const protocol = BASE_URL.startsWith('https') ? 'wss:' : 'ws:';
    const host = BASE_URL.replace(/^https?:\/\//, '');
    const wsUrl = `${protocol}//${host}/ws/image-pull/${jobId}`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log(`WebSocket connected for job ${jobId}`);
    };

    ws.onmessage = (event) => {
      try {
        const status: PullJobStatus = JSON.parse(event.data);
        setPullJobStatuses((prev) => new Map(prev).set(jobId, status));

        // If job is completed or failed, reload images
        if (status.status === 'completed') {
          setTimeout(() => {
            loadImages();
            ws.close();
            wsConnectionsRef.current.delete(jobId);
          }, 1000);
        } else if (status.status === 'failed') {
          ws.close();
          wsConnectionsRef.current.delete(jobId);
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };

    ws.onerror = (err) => {
      console.error(`WebSocket error for job ${jobId}:`, err);
    };

    ws.onclose = () => {
      console.log(`WebSocket closed for job ${jobId}`);
      wsConnectionsRef.current.delete(jobId);
    };

    wsConnectionsRef.current.set(jobId, ws);
  };

  const toggleImageSelect = (imageId: number) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(imageId)) {
      newSelected.delete(imageId);
    } else {
      newSelected.add(imageId);
    }
    setSelectedImages(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedImages.size === images.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(images.map((img) => img.ID)));
    }
  };

  const handlePullSelected = async () => {
    if (selectedImages.size === 0) return;

    const selectedImgs = images.filter((img) => selectedImages.has(img.ID));
    const confirmMsg = `Pull ${selectedImgs.length} image${selectedImgs.length > 1 ? 's' : ''}?\n\n${selectedImgs
      .map((img) => `${img.Name}:${img.Tag}`)
      .join('\n')}`;

    if (!confirm(confirmMsg)) return;

    try {
      setProcessing(true);

      // Send multiple images in one request
      const imageNames = selectedImgs.map((img) => `${img.Name}:${img.Tag}`);

      // Call API to pull multiple images
      const response = await fetch(`${BASE_URL}/images/pull`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ names: imageNames } as PullImageRequest),
      });

      if (!response.ok) {
        throw new Error('Failed to pull images');
      }

      const data = await response.json();
      const jobIds = data.data?.job_ids || [];

      // Connect WebSocket for each job to monitor progress
      jobIds.forEach((jobId: string) => {
        connectWebSocket(jobId);
      });

      setSelectedImages(new Set());
      setSuccessMessage(`Started pulling ${selectedImgs.length} image(s)...`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Failed to pull images: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setProcessing(true);
      await deleteAllowedImage(deleteId);
      await loadImages();
      setDeleteId(null);
      setSuccessMessage('Image deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Failed to delete image: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setProcessing(false);
    }
  };

  const pulledCount = images.filter((img) => img.IsPulled).length;
  const unPulledCount = images.length - pulledCount;

  return (
    <div>
      <PageMeta title="Manage Images" description="Manage Docker images in the system" />
      <PageBreadcrumb pageTitle="Manage Docker Images" />

      {successMessage && (
        <div className="mb-4 flex items-center gap-3 rounded-lg bg-green-50 p-4 text-green-800 dark:bg-green-900/20 dark:text-green-300">
          <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          {successMessage}
        </div>
      )}

      {/* Active Pull Jobs */}
      {pullJobStatuses.size > 0 && (
        <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/30 dark:bg-blue-900/20">
          <h3 className="mb-3 font-semibold text-blue-900 dark:text-blue-300">
            Active Pull Jobs ({pullJobStatuses.size})
          </h3>
          <div className="space-y-2">
            {Array.from(pullJobStatuses.values()).map((job) => (
              <div
                key={job.job_id}
                className="flex items-center gap-3 rounded-lg bg-white p-3 dark:bg-gray-800"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {job.image}
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        job.status === 'completed'
                          ? 'text-green-600 dark:text-green-400'
                          : job.status === 'failed'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      {job.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{job.message}</p>
                  {job.status === 'pulling' && (
                    <div className="mt-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-1.5 bg-blue-600 transition-all duration-300"
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* Header Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Docker Images</h2>
              <p className="mt-1 flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span>Total: {images.length}</span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
                  Pulled: {pulledCount}
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-yellow-400"></span>
                  Pulling: {pullJobStatuses.size}
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-gray-400"></span>
                  Not Pulled: {unPulledCount}
                </span>
              </p>
            </div>
            {selectedImages.size > 0 && (
              <button
                onClick={handlePullSelected}
                disabled={processing}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Pull {selectedImages.size} Image{selectedImages.size > 1 ? 's' : ''}
              </button>
            )}
          </div>
        </div>

        {/* Images List */}
        {loading ? (
          <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-white p-12 dark:border-gray-700 dark:bg-gray-800">
            <div className="text-center">
              <div className="inline-block">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 dark:border-gray-600 dark:border-t-blue-400"></div>
              </div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading images...</p>
            </div>
          </div>
        ) : images.length === 0 ? (
          <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 dark:border-gray-600 dark:bg-gray-800/50">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                No images yet
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Add images from project settings to get started
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            {/* Table Header */}
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={selectedImages.size === images.length && images.length > 0}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600"
                />
                <div className="flex-1 grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <div className="col-span-5">Image Name</div>
                  <div className="col-span-2">Tag</div>
                  <div className="col-span-2">Scope</div>
                  <div className="col-span-3">Status</div>
                </div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {images.map((img) => (
                <div
                  key={img.ID}
                  className="border-b border-gray-200 px-6 py-4 last:border-b-0 dark:border-gray-700"
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={selectedImages.has(img.ID)}
                      onChange={() => toggleImageSelect(img.ID)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600"
                    />
                    <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-5">
                        <div className="font-mono text-sm font-medium text-gray-900 dark:text-white break-all">
                          {img.Name}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <span className="inline-block rounded bg-gray-100 px-2 py-1 font-mono text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                          {img.Tag}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            img.IsGlobal
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                          }`}
                        >
                          {img.IsGlobal ? 'Global' : `Project ${img.ProjectID}`}
                        </span>
                      </div>
                      <div className="col-span-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {img.IsPulled ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/50 dark:text-green-300">
                              <span className="inline-block h-2 w-2 rounded-full bg-green-600 dark:bg-green-400"></span>
                              Pulled
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                              <span className="inline-block h-2 w-2 rounded-full bg-gray-400"></span>
                              Not Pulled
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => setDeleteId(img.ID)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <svg
                  className="h-6 w-6 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Image</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Are you sure you want to delete this image? This action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50 dark:bg-red-600 dark:hover:bg-red-700"
                disabled={processing}
              >
                {processing ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
