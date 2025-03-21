"use client";

import { useState, useEffect, useCallback } from "react";
import { Restaurant, SearchResults } from "./types/restaurant";
import { useRouter, useSearchParams } from "next/navigation";
import LocationFinder from "./components/restaurants/LocationFinder";
import SearchForm from "./components/restaurants/SearchForm";
import LoadingIndicator from "./components/ui/LoadingIndicator";
import RestaurantCard from "./components/restaurants/RestaurantCard";
import Pagination from "./components/restaurants/Pagination";
import ErrorMessage from "./components/ui/ErrorMessage";
import { useGeolocation } from "./hooks/useGeolocation";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URLからページ番号を取得（ない場合は1をデフォルト値とする）
  const pageFromUrl = searchParams.get("page")
    ? parseInt(searchParams.get("page") as string)
    : 1;

  const {
    location,
    isLoading: isLocationLoading,
    error: locationError,
    getCurrentLocation,
  } = useGeolocation();

  const [radius, setRadius] = useState<string>(
    searchParams.get("radius") || "3"
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [resultsInfo, setResultsInfo] = useState<{
    available: number;
    returned: number;
    start: number;
  } | null>(null);
  const perPage = 20; // 1ページあたりの表示件数

  // クエリパラメータを更新する関数（位置情報は含めない）
  const updateQueryParams = useCallback((page: number, newRadius?: string) => {
    // 現在のURLパラメータを取得
    const params = new URLSearchParams(searchParams.toString());

    // パラメータ更新
    params.set("page", page.toString());
    if (newRadius) params.set("radius", newRadius);

    // URLを更新（ページ遷移せずにURLのみ変更）
    router.push(`?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  // 検索を実行
  const searchRestaurants = useCallback(async (page: number = pageFromUrl) => {
    if (!location.lat || !location.lng) {
      setError("位置情報を先に取得してください");
      return;
    }

    setIsLoading(true);
    setError(null);

    // URLのページ番号を更新
    updateQueryParams(page, radius);

    // 開始位置を計算
    const start = (page - 1) * perPage + 1;

    try {
      const response = await fetch(
        `/api/restaurants/search?lat=${location.lat}&lng=${location.lng}&radius=${radius}&start=${start}&count=${perPage}`
      );

      if (!response.ok) {
        throw new Error("レストラン検索に失敗しました");
      }

      const data: SearchResults = await response.json();
      setRestaurants(data.results.shop || []);
      setResultsInfo({
        available: data.results.results_available,
        returned: parseInt(data.results.results_returned),
        start: data.results.results_start,
      });
    } catch (error) {
      console.error("検索エラー:", error);
      setError("レストランの検索中にエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  }, [location.lat, location.lng, radius, perPage, updateQueryParams, pageFromUrl]);

  // 検索フォームの送信ハンドラ
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchRestaurants(1); // 検索時は1ページ目から表示
  };

  // 検索範囲変更時のハンドラ
  const handleRadiusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRadius = e.target.value;
    setRadius(newRadius);
  };

  const totalPages = resultsInfo
    ? Math.ceil(resultsInfo.available / perPage)
    : 0;

  // ページネーションのコントロールに使用する配列の生成
  const getPageNumbers = useCallback(() => {
    // 表示するページネーション数
    const maxVisiblePages = 5;
    let startPage: number;
    let endPage: number;

    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const middleOffset = Math.floor(maxVisiblePages / 2);

      if (pageFromUrl <= middleOffset + 1) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (pageFromUrl >= totalPages - middleOffset) {
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        startPage = pageFromUrl - middleOffset;
        endPage = pageFromUrl + middleOffset;
      }
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  }, [totalPages, pageFromUrl]);

  // コンポーネントがマウントされたときとURLのページ番号が変わったときに検索を実行
  useEffect(() => {
    // 位置情報がある場合のみ検索を実行
    if (location.lat && location.lng) {
      searchRestaurants(pageFromUrl);
    }
  }, [pageFromUrl, location.lat, location.lng, searchRestaurants]); // URLのページが変わったら、または位置情報が設定されたら再検索

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          グルメ検索
        </h1>

        {/* 現在地取得と検索フォームを横並びに */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* 現在地取得エリア */}
          <LocationFinder
            location={location}
            isLoading={isLocationLoading}
            onGetLocation={getCurrentLocation}
          />

          {/* 検索フォーム */}
          <SearchForm
            radius={radius}
            isLoading={isLoading}
            isDisabled={!location.lat || !location.lng}
            onRadiusChange={handleRadiusChange}
            onSubmit={handleSubmit}
          />
        </div>

        {/* エラー表示 - グローバルに */}
        {( error || locationError ) && (<ErrorMessage message={error || locationError || ""} />)}

        {/* ローディングインジケータ - 非モーダル */}
        {isLoading && <LoadingIndicator />}

        {/* 検索結果 */}
        {resultsInfo && !isLoading && (
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">検索結果</h2>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                {resultsInfo.available}件中 {resultsInfo.start}-
                {Math.min(
                  resultsInfo.start + resultsInfo.returned - 1,
                  resultsInfo.available
                )}
                件
              </span>
            </div>
          </div>
        )}

        {restaurants.length > 0 && !isLoading ? (
          <>
            {/* カードグリッド */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {restaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>

            {/* ページネーション */}
            <Pagination
              currentPage={pageFromUrl}
              totalPages={totalPages}
              isLoading={isLoading}
              pageNumbers={getPageNumbers()}
              onPageChange={searchRestaurants}
            />
          </>
        ) : resultsInfo && !isLoading ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-100">
            <p className="text-gray-600">検索結果がありません</p>
          </div>
        ) : null}
      </main>
    </div>
  );
}
