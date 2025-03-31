import { FiSearch, FiList } from "react-icons/fi";

interface MapFooterProps {
  restaurantCount: number;
  zoom?: number;
  onSearchClick?: () => void;
  onListClick?: () => void;
  noResults?: boolean;
  showListButton?: boolean;
  isListVisible?: boolean;
}

export default function MapFooter({
  restaurantCount,
  zoom,
  onSearchClick,
  onListClick,
  noResults = false,
  showListButton = false,
  isListVisible = false,
}: MapFooterProps) {
  return (
    <div className="p-2 sm:p-4 bg-gray-50 border-t border-gray-100">
      {/* モバイル向けレイアウト */}
      <div className="flex flex-col sm:hidden space-y-2">
        <div className="text-xs text-gray-600 text-center">
          {noResults ? (
            <span className="text-orange-600">検索条件を変更して再度お試しください</span>
          ) : (
            <>
              <span className="font-medium">{restaurantCount}件</span>のレストラン
            </>
          )}
        </div>
        
        <div className="flex justify-center space-x-2">
          {/* 検索ボタン（オプション） */}
          {onSearchClick && (
            <button
              onClick={onSearchClick}
              className="flex items-center text-xs px-3 py-1 bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition"
            >
              <FiSearch className="mr-1" size={14} />
              検索条件
            </button>
          )}

          {/* リスト表示ボタン（オプション） */}
          {showListButton && onListClick && (
            <button
              onClick={onListClick}
              className={`flex items-center text-xs px-3 py-1 rounded-md transition ${
                isListVisible 
                  ? "bg-orange-600 text-white hover:bg-orange-700" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FiList className="mr-1" size={14} />
              {isListVisible ? "リスト閉じる" : "リスト表示"}
            </button>
          )}
        </div>
      </div>

      {/* デスクトップ向けレイアウト */}
      <div className="hidden sm:flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {noResults ? (
            <span className="text-orange-600">検索条件を変更して再度お試しください</span>
          ) : (
            <>
              <span className="font-medium">{restaurantCount}件</span>のレストランを地図上に表示しています
            </>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          {/* ボタングループ */}
          <div className="flex items-center space-x-2">
            {/* 検索ボタン（オプション） */}
            {onSearchClick && (
              <button
                onClick={onSearchClick}
                className="flex items-center text-xs px-3 py-1 bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition"
              >
                <FiSearch className="mr-1" size={14} />
                検索条件
              </button>
            )}

            {/* リスト表示ボタン（オプション） */}
            {showListButton && onListClick && (
              <button
                onClick={onListClick}
                className={`flex items-center text-xs px-3 py-1 rounded-md transition ${
                  isListVisible 
                    ? "bg-orange-600 text-white hover:bg-orange-700" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FiList className="mr-1" size={14} />
                {isListVisible ? "リスト閉じる" : "リスト表示"}
              </button>
            )}
          </div>

          {/* ズームレベル表示（オプション） */}
          {zoom !== undefined && (
            <div className="text-xs text-gray-500 ml-3">
              ズーム: {zoom.toFixed(1)}
            </div>
          )}
          
          {/* 凡例 */}
          <div className="flex items-center space-x-3 ml-3">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-600 rounded-full border border-white mr-1"></div>
              <span className="text-xs text-gray-600">検索中心</span>
            </div>
            {!noResults && (
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 rounded-full border border-white mr-1"></div>
                <span className="text-xs text-gray-600">レストラン</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}