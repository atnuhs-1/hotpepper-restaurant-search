// app/components/search-server/SearchResultsSkeleton.tsx
export default function SearchResultsSkeleton() {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
        {/* ヘッダー部分 */}
        <div className="flex justify-between items-center mb-4">
          <div className="h-8 bg-gray-200 rounded w-36"></div>
          <div className="flex space-x-1">
            <div className="h-8 w-10 bg-gray-200 rounded"></div>
            <div className="h-8 w-10 bg-gray-200 rounded"></div>
            <div className="h-8 w-10 bg-gray-200 rounded"></div>
          </div>
        </div>
        
        {/* 検索概要 */}
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
        
        {/* 検索ステータス */}
        <div className="flex justify-between items-center mb-4">
          <div className="h-5 bg-gray-200 rounded w-1/4"></div>
          <div className="flex space-x-2">
            <div className="h-10 w-24 bg-gray-200 rounded-md"></div>
            <div className="h-10 w-24 bg-gray-200 rounded-md"></div>
          </div>
        </div>
        
        {/* 検索結果アイテム */}
        <div className="grid grid-cols-1 gap-6 mb-6">
          {Array(5).fill(0).map((_, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/4 p-4">
                  <div className="h-48 md:h-full min-h-[160px] bg-gray-200 rounded-lg"></div>
                </div>
                <div className="md:w-3/4 p-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                    <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="h-5 bg-gray-200 rounded w-5/6 mb-3"></div>
                  <div className="flex items-start mb-2">
                    <div className="h-5 w-5 bg-gray-200 rounded-full mr-2"></div>
                    <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="flex items-start">
                    <div className="h-5 w-5 bg-gray-200 rounded-full mr-2"></div>
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* ページネーション */}
        <div className="flex justify-center">
          <div className="flex space-x-1">
            <div className="h-10 w-10 bg-gray-200 rounded"></div>
            <div className="h-10 w-10 bg-gray-200 rounded"></div>
            <div className="h-10 w-10 bg-gray-200 rounded"></div>
            <div className="h-10 w-10 bg-gray-200 rounded"></div>
            <div className="h-10 w-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }