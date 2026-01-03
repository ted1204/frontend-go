import React from 'react';
import { useTranslation } from '@nthucscc/utils';

interface PaginationProps {
  current: number;
  total: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ current, total, onPageChange }) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center justify-center gap-3 mt-6">
      <button
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        onClick={() => onPageChange(current - 1)}
        disabled={current <= 1}
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span>{t('pagination.previous')}</span>
      </button>
      
      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
        {t('pagination.pageInfo', { current: current.toString(), total: total.toString() })}
      </span>
      
      <button
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        onClick={() => onPageChange(current + 1)}
        disabled={current >= total}
      >
        <span>{t('pagination.next')}</span>
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
