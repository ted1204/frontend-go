import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getJobs, getJobLogs, Job } from '@/core/services/jobService';
import { submitJob, SubmitJobRequest } from '@/core/services/jobSubmitService';
import { PageBreadcrumb } from '@nthucscc/ui';
import JobCard from '../components/job/JobCard';
import JobLogModal from '../components/job/JobLogModal';
import JobApplyModal from '../components/job/JobApplyModal';
import { ViewModeToggle } from '@/features/forms/components/form';
import { SearchInput } from '@nthucscc/components-shared';
import { Pagination } from '@nthucscc/components-shared';
import { getJobStatusMeta } from '../components/job/status';
import { toast } from 'react-hot-toast';
import { JOB_LOGS_WS_URL, JOBS_WS_URL } from '@/core/config/url';

const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [showApply, setShowApply] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [applySuccess, setApplySuccess] = useState<string | null>(null);
  const [logJob, setLogJob] = useState<Job | null>(null);
  const [logContent, setLogContent] = useState('');
  const [showLog, setShowLog] = useState(false);
  const [logLoading, setLogLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const jobWsRef = useRef<WebSocket | null>(null);
  const jobReconnectRef = useRef<NodeJS.Timeout | null>(null);
  const logWsRef = useRef<WebSocket | null>(null);
  const itemsPerPage = 8;

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
      toast.error(err instanceof Error ? err.message : 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  }, []);

  const connectJobSocket = useCallback(() => {
    closeJobSocket();
    try {
      const ws = new WebSocket(JOBS_WS_URL());
      jobWsRef.current = ws;

      ws.onopen = () => {
        // Initial fetch is already triggered; socket will stream updates.
      };

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          const batch: Job[] = Array.isArray(payload)
            ? payload
            : Array.isArray(payload?.jobs)
              ? payload.jobs
              : payload?.job
                ? [payload.job]
                : [payload];

          setJobs((prev) => {
            const map = new Map<number, Job>();
            prev.forEach((j) => map.set(j.ID, j));
            batch.forEach((j) => {
              if (j && typeof j.ID === 'number') {
                const existing = map.get(j.ID) || {};
                map.set(j.ID, { ...existing, ...j });
              }
            });
            return Array.from(map.values());
          });
          setLoading(false);
        } catch (err) {
          console.error('Failed to parse job WS message', err);
        }
      };

      ws.onerror = (err) => {
        console.error('Job WS error', err);
        toast.error('Job live updates disconnected');
        if (!jobReconnectRef.current) {
          jobReconnectRef.current = setTimeout(() => {
            jobReconnectRef.current = null;
            connectJobSocket();
          }, 5000);
        }
      };

      ws.onclose = () => {
        if (!jobReconnectRef.current) {
          jobReconnectRef.current = setTimeout(() => {
            jobReconnectRef.current = null;
            connectJobSocket();
          }, 5000);
        }
      };
    } catch (err) {
      console.error('Job WS connect error', err);
      if (!jobReconnectRef.current) {
        jobReconnectRef.current = setTimeout(() => {
          jobReconnectRef.current = null;
          connectJobSocket();
        }, 5000);
      }
    }
  }, []);

  const closeJobSocket = () => {
    if (jobReconnectRef.current) {
      clearTimeout(jobReconnectRef.current);
      jobReconnectRef.current = null;
    }
    if (jobWsRef.current) {
      try {
        jobWsRef.current.close();
      } catch {
        /* ignore */
      }
      jobWsRef.current = null;
    }
  };

  useEffect(() => {
    fetchJobs();
    connectJobSocket();
    return () => {
      closeJobSocket();
      closeLogSocket();
    };
  }, [fetchJobs, connectJobSocket]);

  const handleApply = async (data: SubmitJobRequest) => {
    setApplyLoading(true);
    setApplyError(null);
    setApplySuccess(null);
    try {
      await submitJob(data);
      setApplySuccess('Job submitted successfully!');
      fetchJobs();
    } catch (err) {
      setApplyError(err instanceof Error ? err.message : 'Failed to submit job');
    } finally {
      setApplyLoading(false);
    }
  };

  const handleViewLog = async (job: Job) => {
    setLogJob(job);
    setShowLog(true);
    setLogLoading(true);
    await fetchLogs(job.ID, true);
    connectLogSocket(job.ID);
  };

  const fetchLogs = async (jobId: number, silent = false) => {
    try {
      const logs = await getJobLogs(jobId);
      setLogContent(logs.join('\n'));
    } catch (err) {
      if (!silent) toast.error(err instanceof Error ? err.message : 'Failed to fetch log');
      setLogContent('Failed to fetch log.');
    } finally {
      setLogLoading(false);
    }
  };

  const connectLogSocket = (jobId: number) => {
    closeLogSocket();
    try {
      const ws = new WebSocket(JOB_LOGS_WS_URL(jobId));
      logWsRef.current = ws;

      ws.onmessage = (event) => {
        let lines: string[] = [];
        try {
          const payload = JSON.parse(event.data);
          if (Array.isArray(payload)) {
            lines = payload.map(String);
          } else if (Array.isArray(payload?.logs)) {
            lines = payload.logs.map(String);
          } else if (typeof payload?.log === 'string') {
            lines = [payload.log];
          } else if (typeof payload === 'string') {
            lines = [payload];
          }
        } catch {
          lines = [event.data];
        }

        if (lines.length > 0) {
          setLogContent((prev) => (prev ? `${prev}\n${lines.join('\n')}` : lines.join('\n')));
        }
      };

      ws.onerror = (err) => {
        console.error('Log WS error', err);
        toast.error('Log stream disconnected');
      };

      ws.onclose = () => {
        // Keep last logs; reconnect on demand when reopened
      };
    } catch (err) {
      console.error('Log WS connect error', err);
    }
  };

  const closeLogSocket = () => {
    if (logWsRef.current) {
      try {
        logWsRef.current.close();
      } catch {
        /* ignore */
      }
      logWsRef.current = null;
    }
  };

  useEffect(() => {
    if (!showLog) {
      closeLogSocket();
    }
    return () => closeLogSocket();
  }, [showLog]);

  const filteredJobs = useMemo(
    () =>
      jobs.filter(
        (j) =>
          j.Name.toLowerCase().includes(search.toLowerCase()) ||
          j.Image?.toLowerCase().includes(search.toLowerCase()) ||
          j.Namespace?.toLowerCase().includes(search.toLowerCase()),
      ),
    [jobs, search],
  );
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const pagedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div>
      <PageBreadcrumb pageTitle="Jobs" />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
          <SearchInput value={search} onChange={setSearch} placeholder="Search jobs..." />
        </div>
        <button
          className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700"
          onClick={() => setShowApply(true)}
        >
          Submit Job
        </button>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: itemsPerPage }).map((_, idx) => (
            <div
              key={idx}
              className="animate-pulse rounded-lg border p-4 space-y-3 bg-white/40 dark:bg-gray-800/40"
            >
              <div className="h-4 w-1/3 bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-3 w-1/4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-24 w-full bg-gray-100 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">{error}</div>
      ) : filteredJobs.length === 0 ? (
        <div className="py-8 text-center text-gray-400">No jobs found</div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pagedJobs.map((job) => (
            <JobCard key={job.ID} job={job} onViewLog={handleViewLog} />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-4 py-2">Job Name</th>
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Namespace</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Created At</th>
                <th className="px-4 py-2">Log</th>
              </tr>
            </thead>
            <tbody>
              {pagedJobs.map((job) => (
                <tr key={job.ID} className="border-t">
                  <td className="px-4 py-2 font-medium text-gray-800 dark:text-white">
                    {job.Name}
                  </td>
                  <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{job.Image}</td>
                  <td className="px-4 py-2">{job.Namespace}</td>
                  <td className="px-4 py-2">
                    {(() => {
                      const meta = getJobStatusMeta(job.Status);
                      return (
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${meta.className}`}
                        >
                          {meta.label}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="px-4 py-2">{new Date(job.CreatedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2">
                    <button
                      className="px-2 py-1 text-xs rounded bg-violet-600 text-white hover:bg-violet-700"
                      onClick={() => handleViewLog(job)}
                    >
                      View Log
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination current={currentPage} total={totalPages} onPageChange={setCurrentPage} />
      <JobApplyModal
        open={showApply}
        onClose={() => {
          setShowApply(false);
          setApplyError(null);
          setApplySuccess(null);
        }}
        onSubmit={handleApply}
        loading={applyLoading}
        error={applyError}
        success={applySuccess}
      />
      <JobLogModal
        job={logJob}
        log={logContent}
        loading={logLoading}
        open={showLog}
        onClose={() => setShowLog(false)}
        onRefresh={() => {
          if (logJob) fetchLogs(logJob.ID);
        }}
      />
    </div>
  );
};

export default Jobs;
