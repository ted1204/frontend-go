import React from 'react';
import useTranslation from '../../hooks/useTranslation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const { t } = useTranslation();
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-6">
      <nav className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 dark:border-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {t('pagination.prev')}
        </button>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {t('pagination.pageOf', { current: currentPage, total: totalPages })}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 dark:border-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {t('pagination.next')}
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
