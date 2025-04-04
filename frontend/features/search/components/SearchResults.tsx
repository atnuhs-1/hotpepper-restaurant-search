import { fetchRestaurants } from "@/features/search/api";
import { RestaurantSearchParams } from "@/types/search";
import RestaurantList from "@/features/search/components/RestaurantList";
import { getSearchSummary } from "@/features/search/utils/formatters";
import Pagination from "./Pagination";

export default async function SearchResults({
  searchParams,
}: {
  searchParams: RestaurantSearchParams;
}) {
  // サーバーサイドでデータ取得
  const results = await fetchRestaurants(searchParams);

  // 結果が空の場合
  if (!results.shop || results.shop.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mx-auto text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-xl font-semibold text-gray-700 mt-4">
          お店が見つかりませんでした
        </h2>
        <p className="text-gray-600 mt-2">
          検索条件を変更して再度お試しください
        </p>
      </div>
    );
  }

  // 検索結果データの取り出し
  const {
    results_available,
    results_start,
    results_returned,
    shop: restaurants,
  } = results;

  // ページネーション用の計算
  const itemsPerPage = 20; // APIのデフォルト値
  const currentPage = Math.ceil(Number(results_start) / itemsPerPage);
  const totalPages = Math.ceil(Number(results_available) / itemsPerPage);

  return (
    <>
      <p className="text-gray-600 mb-4">{getSearchSummary(searchParams)}</p>

      <div className="mb-4">
        <p className="text-gray-600">
          全 {results_available} 件中 {results_start}〜
          {Math.min(
            Number(results_start) + Number(results_returned) - 1,
            results_available,
          )}{" "}
          件を表示
        </p>
      </div>

      {/* リスト表示 */}
      <div className="mb-6">
        <RestaurantList restaurants={restaurants} />
      </div>

      {/* ページネーション (下部) */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl="/search"
          />
        </div>
      )}
    </>
  );
}
