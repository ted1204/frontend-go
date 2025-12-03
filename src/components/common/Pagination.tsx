import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-6">
      <nav className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 dark:border-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          上一頁
        </button>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          第 {currentPage} 頁，共 {totalPages} 頁
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 dark:border-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          下一頁
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
