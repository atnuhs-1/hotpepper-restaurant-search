import { Suspense } from "react";
import { RestaurantSearchParams } from "@/types/search";
import Link from "next/link";
import RestaurantMapContainer from "@/features/map/components/RestaurantMapContainer";

export default async function SearchMapPage({
  searchParams,
}: {
  searchParams: Promise<RestaurantSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const searchParamsString = new URLSearchParams(
    resolvedSearchParams as Record<string, string>
  ).toString();

  // 範囲コードから実際のメートル値に変換（サーバー側で行う計算）
  const radiusMap: Record<string, number> = {
    "1": 300, "2": 500, "3": 1000, "4": 2000, "5": 3000,
  };
  const searchRadius = resolvedSearchParams.range && radiusMap[resolvedSearchParams.range]
    ? radiusMap[resolvedSearchParams.range]
    : 1000;

  // 検索の中心位置
  const searchCenter = resolvedSearchParams.lat && resolvedSearchParams.lng
    ? {
        lat: parseFloat(resolvedSearchParams.lat),
        lng: parseFloat(resolvedSearchParams.lng),
      }
    : undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <Link
              href="/"
              className="text-orange-600 hover:text-orange-700 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              検索条件に戻る
            </Link>

            {/* リスト表示へのリンク */}
            <Link
              href={`/search?${searchParamsString}`}
              className="px-4 py-2 bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              リストで見る
            </Link>
          </div>
        </div>

        {/* 地図コンテンツ部分 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              地図で見る
            </h1>
          </div>
          
          <Suspense
            fallback={
              <div className="bg-white rounded-lg shadow p-6 h-96 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
              </div>
            }
          >
            <RestaurantMapContainer 
              initialSearchParams={resolvedSearchParams}
              initialSearchCenter={searchCenter}
              initialSearchRadius={searchRadius}
            />
          </Suspense>
        </div>
      </main>
    </div>
  );
}