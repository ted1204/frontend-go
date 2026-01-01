import React, { useState, useEffect } from 'react';
import { getJobs, Job } from '@/core/services/jobService';
import { getJobLog } from '@/core/services/jobLogService';
import { submitJob, SubmitJobRequest } from '@/core/services/jobSubmitService';
import { PageBreadcrumb } from '@nthucscc/ui';
import JobCard from '../components/job/JobCard';
import JobLogModal from '../components/job/JobLogModal';
import JobApplyModal from '../components/job/JobApplyModal';
import { ViewModeToggle } from '@/features/forms/components/form';
import { SearchInput } from '@nthucscc/components-shared';
import { Pagination } from '@nthucscc/components-shared';

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
  const itemsPerPage = 8;

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

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
    try {
      const log = await getJobLog(job.ID);
      setLogContent(log);
    } catch {
      setLogContent('Failed to fetch log.');
    } finally {
      setLogLoading(false);
    }
  };

  const filteredJobs = jobs.filter(
    (j) =>
      j.Name.toLowerCase().includes(search.toLowerCase()) ||
      j.Image?.toLowerCase().includes(search.toLowerCase()) ||
      j.Namespace?.toLowerCase().includes(search.toLowerCase()),
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
        <div className="py-8 text-center text-gray-400">Loading...</div>
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
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                        job.Status === 'Succeeded'
                          ? 'bg-green-100 text-green-800'
                          : job.Status === 'Failed'
                            ? 'bg-red-100 text-red-800'
                            : job.Status === 'Running'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {job.Status}
                    </span>
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
        log={logLoading ? 'Loading...' : logContent}
        open={showLog}
        onClose={() => setShowLog(false)}
      />
    </div>
  );
};

export default Jobs;
