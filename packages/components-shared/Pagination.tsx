import React from 'react';

interface PaginationProps {
  current: number;
  total: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ current, total, onPageChange }) => (
  <div className="flex items-center justify-center gap-2 mt-4">
    <button
      className="px-3 py-1 border rounded disabled:opacity-50"
      onClick={() => onPageChange(current - 1)}
      disabled={current <= 1}
    >
      上一頁
    </button>
    <span>
      第 {current} 頁，共 {total} 頁
    </span>
    <button
      className="px-3 py-1 border rounded disabled:opacity-50"
      onClick={() => onPageChange(current + 1)}
      disabled={current >= total}
    >
      下一頁
    </button>
  </div>
);

export default Pagination;
