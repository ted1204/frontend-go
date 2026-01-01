import React from 'react';
import { Job } from '@/core/services/jobService';

interface JobLogModalProps {
  job: Job | null;
  log: string;
  open: boolean;
  onClose: () => void;
}

const JobLogModal: React.FC<JobLogModalProps> = ({ job, log, open, onClose }) => {
  if (!open || !job) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-lg font-bold mb-2">Job Log: {job.Name}</h2>
        <pre className="bg-gray-100 dark:bg-gray-800 rounded p-4 text-xs overflow-x-auto max-h-96 whitespace-pre-wrap">
          {log || 'No log available.'}
        </pre>
      </div>
    </div>
  );
};

export default JobLogModal;
