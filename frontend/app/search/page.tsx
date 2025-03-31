import Link from "next/link";
import { Suspense } from "react";
import { RestaurantSearchParams } from "@/types/search";
import SearchResults from "../../features/search/components/SearchResults";
import SearchResultsSkeleton from "../../features/search/components/SearchResultSkeleton";
import SearchForm from "../../features/search/components/SearchForm";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<RestaurantSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const searchParamsString = new URLSearchParams(
    resolvedSearchParams as Record<string, string>
  ).toString();

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

            {/* 地図表示へのリンク */}
            <Link
              href={`/search/map?${searchParamsString}`}
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
                  d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z"
                  clipRule="evenodd"
                />
              </svg>
              地図で見る
            </Link>
          </div>
        </div>

        {/* 2列レイアウト */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* 左側: 検索フォーム */}
          <div className="md:w-1/4">
            <SearchForm initialValues={resolvedSearchParams} />
          </div>

          {/* 右側: 検索結果 */}
          <div className="md:w-3/4">
            <Suspense fallback={<SearchResultsSkeleton />}>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    検索結果
                  </h1>
                </div>

                <SearchResults searchParams={resolvedSearchParams} />
              </div>
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
