type PaginationProps = {
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  pageNumbers: number[];
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  isLoading,
  pageNumbers,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-8 mb-4">
      <div className="inline-flex rounded-md shadow-sm">
        {/* 前へボタン */}
        {currentPage > 1 && (
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={isLoading}
            className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            前へ
          </button>
        )}

        {/* ページ番号 */}
        {pageNumbers.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            disabled={isLoading || pageNum === currentPage}
            className={`relative inline-flex items-center px-4 py-2 border ${
              pageNum === currentPage
                ? "z-10 bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            } text-sm font-medium`}
          >
            {pageNum}
          </button>
        ))}

        {/* 次へボタン */}
        {currentPage < totalPages && (
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={isLoading}
            className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            次へ
          </button>
        )}
      </div>
    </div>
  );
}
