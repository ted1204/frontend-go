import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  PlayIcon, 
  ListBulletIcon, 
  ArrowPathIcon, 
  CpuChipIcon, 
  CommandLineIcon, 
  CubeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { getUsername } from '@/core/services/authService';

type JobItem = {
  id: string | number;
  name?: string;
  namespace?: string;
  image?: string;
  status?: string;
};

const getStatusBadge = (status?: string) => {
  const s = status?.toLowerCase() || 'unknown';
  if (s.includes('run') || s.includes('succeed')) {
    return (
      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
        <CheckCircleIcon className="mr-1 h-3 w-3" /> {status}
      </span>
    );
  }
  if (s.includes('fail') || s.includes('error')) {
    return (
      <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
        <XCircleIcon className="mr-1 h-3 w-3" /> {status}
      </span>
    );
  }
  if (s.includes('pending') || s.includes('init')) {
    return (
      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
        <ClockIcon className="mr-1 h-3 w-3" /> {status}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
      {status || 'Unknown'}
    </span>
  );
};

export default function ProjectJobs() {
  const { id } = useParams<{ id?: string }>();
  
  // UI State
  const [tab, setTab] = useState<'list' | 'submit'>('list');
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Data State
  const [jobs, setJobs] = useState<JobItem[]>([]);
  
  // Form State
  const username = getUsername();
  const defaultNamespace = id && username ? `proj-${id}-${username}` : '';
  
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [namespace, setNamespace] = useState(defaultNamespace);
  const [command, setCommand] = useState('');
  const [gpuCount, setGpuCount] = useState(0);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    setNamespace(defaultNamespace);
  }, [defaultNamespace]);

  // Load Jobs
  useEffect(() => {
    if (!id) return;
    if (tab === 'list') {
      fetchJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, tab, refreshKey]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/projects/${id}/jobs`);
      if (!res.ok) throw new Error('Failed to fetch jobs');
      const j = await res.json();
      setJobs(Array.isArray(j) ? j : []);
    } catch (e) {
      console.error(e);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    const payload = {
      name,
      image,
      namespace,
      command: command ? command.split(' ') : [],
      gpu_count: gpuCount,
    };

    try {
      const res = await fetch(`/projects/${id}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setMsg({ type: 'error', text: j.error || j.message || res.statusText });
        return;
      }
      setMsg({ type: 'success', text: 'Job submitted successfully!' });
      setTimeout(() => {
        setTab('list');
        setRefreshKey(k => k + 1);
        setMsg(null);
        setName('');
      }, 1000);
    } catch (err) {
      setMsg({ type: 'error', text: 'Network error: ' + String(err) });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header Toolbar */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6 dark:border-gray-700">
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg dark:bg-gray-700">
          <button
            onClick={() => setTab('list')}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ${
              tab === 'list'
                ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <ListBulletIcon className="mr-2 h-4 w-4" />
            Job List
          </button>
          <button
            onClick={() => setTab('submit')}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ${
              tab === 'submit'
                ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <PlayIcon className="mr-2 h-4 w-4" />
            New Job
          </button>
        </div>
        
        {tab === 'list' && (
          <button
            onClick={() => setRefreshKey(k => k + 1)}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Refresh Jobs"
          >
            <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1">
        {tab === 'submit' && (
          <form onSubmit={submit} className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Job Name</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="my-training-job"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white sm:text-sm"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">GPU Count</label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <CpuChipIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="number"
                    min={0}
                    value={gpuCount}
                    onChange={(e) => setGpuCount(parseInt(e.target.value || '0'))}
                    className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white sm:text-sm"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image (name:tag)</label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <CubeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    required
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="pytorch/pytorch:latest"
                    className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white sm:text-sm"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Namespace</label>
                <input
                  required
                  value={namespace}
                  onChange={(e) => setNamespace(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-400 sm:text-sm"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Command <span className="text-xs text-gray-500 font-normal">(Space separated)</span>
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <CommandLineIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    placeholder="python train.py --epochs 10"
                    className="block w-full rounded-md border-gray-300 pl-10 font-mono text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="inline-flex w-full justify-center items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                <PlayIcon className="mr-2 h-4 w-4" />
                Submit Job
              </button>
            </div>

            {msg && (
              <div className={`p-4 rounded-md ${msg.type === 'error' ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' : 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'}`}>
                {msg.text}
              </div>
            )}
          </form>
        )}

        {tab === 'list' && (
          <div>
            {jobs.length === 0 && !loading ? (
              <div className="text-center py-12">
                <CubeIcon className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No jobs</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new job.</p>
                <div className="mt-6">
                  <button
                    onClick={() => setTab('submit')}
                    className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                  >
                    <PlayIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    New Job
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">Name</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Image</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                      <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 dark:text-white">ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                    {jobs.map((job) => (
                      <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="font-medium text-gray-900 dark:text-white">{job.name || 'Untitled'}</div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{job.namespace}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                          <div className="flex items-center gap-2" title={job.image}>
                             <span className="truncate max-w-[150px]">{job.image}</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          {getStatusBadge(job.status)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 text-right font-mono">
                          {job.id}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}