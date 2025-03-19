"use client";

import { useState } from "react";
import { Restaurant, SearchResults } from "../types/restaurant";
import Link from "next/link";
import { FiMapPin, FiTag, FiChevronRight, FiSearch } from "react-icons/fi";

export default function SearchPage() {
  // ステート管理部分はそのまま
  const [location, setLocation] = useState<{
    lat: number | null;
    lng: number | null;
  }>({ lat: null, lng: null });
  const [radius, setRadius] = useState<string>("3");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [resultsInfo, setResultsInfo] = useState<{
    available: number;
    returned: number;
    start: number;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const perPage = 20; // 1ページあたりの表示件数

  // 現在地を取得
  const getCurrentLocation = () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("お使いのブラウザは位置情報取得に対応していません");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setIsLoading(false);
      },
      (err) => {
        setError(`位置情報の取得に失敗しました: ${err.message}`);
        setIsLoading(false);
      }
    );
  };

  // 検索を実行
  const searchRestaurants = async (page: number = 1) => {
    if (!location.lat || !location.lng) {
      setError("位置情報を先に取得してください");
      return;
    }

    setIsLoading(true);
    setError(null);
    setCurrentPage(page);

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
  };

  // 検索フォームの送信ハンドラ
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchRestaurants(1); // 検索時は1ページ目から表示
  };

  const totalPages = resultsInfo
    ? Math.ceil(resultsInfo.available / perPage)
    : 0;

  // ページネーションのコントロールに使用する配列の生成
  const getPageNumbers = () => {
    // 表示するページネーション数
    const maxVisiblePages = 5;
    let startPage: number;
    let endPage: number;

    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const middleOffset = Math.floor(maxVisiblePages / 2);

      if (currentPage <= middleOffset + 1) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - middleOffset) {
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - middleOffset;
        endPage = currentPage + middleOffset;
      }
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          グルメ検索
        </h1>

        {/* 現在地取得と検索フォームを横並びに */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* 現在地取得エリア */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
              <h2 className="text-lg font-semibold text-gray-800">
                現在地を取得
              </h2>
              <button
                onClick={getCurrentLocation}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all
                        flex items-center justify-center gap-2 shadow-sm"
                disabled={isLoading}
              >
                <FiMapPin className="inline-block" />
                {isLoading ? "取得中..." : "現在地を取得"}
              </button>
            </div>

            {location.lat && location.lng ? (
              <div className="p-2 bg-green-50 border border-green-100 rounded-md text-green-700">
                <p>
                  緯度: {location.lat.toFixed(6)}, 経度:{" "}
                  {location.lng.toFixed(6)}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                位置情報を取得するには、上のボタンをクリックしてください。
              </p>
            )}
          </div>

          {/* 検索フォーム */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="flex-grow">
                <label
                  htmlFor="radius"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  検索範囲
                </label>
                <select
                  id="radius"
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 text-black transition-all"
                  disabled={isLoading}
                >
                  <option value="1">300m</option>
                  <option value="2">500m</option>
                  <option value="3">1km</option>
                  <option value="4">2km</option>
                  <option value="5">3km</option>
                </select>
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all shadow-sm disabled:opacity-50 disabled:bg-gray-400 flex items-center justify-center gap-2"
                disabled={isLoading || !location.lat || !location.lng}
              >
                <FiSearch className="inline-block" />
                {isLoading ? "検索中..." : "レストランを検索"}
              </button>
            </div>
          </form>
        </div>

        {/* エラー表示 - グローバルに */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-md text-red-600">
            {error}
          </div>
        )}

        {/* ローディングインジケータ - 非モーダル */}
        {isLoading && (
          <div className="my-6 p-4 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-600 mr-3"></div>
            <p className="text-gray-700">読み込み中...</p>
          </div>
        )}

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
                <div
                  key={restaurant.id}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col"
                >
                  {/* 画像部分 */}
                  <div className="relative h-36 bg-gray-200">
                    {restaurant.photo?.pc?.m && (
                      <img
                        src={restaurant.photo.pc.m}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {/* ジャンルタグ */}
                    {restaurant.genre?.name && (
                      <span className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-md">
                        {restaurant.genre.name}
                      </span>
                    )}
                  </div>

                  {/* コンテンツ部分 */}
                  <div className="p-3 flex-grow">
                    <h3
                      className="font-semibold text-base  text-black mb-1 truncate"
                      title={restaurant.name}
                    >
                      {restaurant.name}
                    </h3>

                    <div className="text-xs text-gray-600 mb-3">
                      <div className="flex items-start gap-1 mb-1">
                        <FiMapPin className="mt-0.5 min-w-4 text-gray-400" />
                        <span className="truncate" title={restaurant.access}>
                          {restaurant.access}
                        </span>
                      </div>
                      {restaurant.budget?.name && (
                        <div className="flex items-start gap-1">
                          <FiTag className="mt-0.5 min-w-4 text-gray-400" />
                          <span className="truncate">
                            {restaurant.budget.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* フッター部分 */}
                  <div className="px-3 pb-3 mt-auto">
                    <Link href={`/restaurants/${restaurant.id}`}>
                      <span className="block w-full text-center px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 transition-colors text-sm font-medium flex items-center justify-center gap-1">
                        詳細を見る
                        <FiChevronRight />
                      </span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* ページネーション */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 mb-4">
                <div className="inline-flex rounded-md shadow-sm">
                  {/* 前へボタン */}
                  {currentPage > 1 && (
                    <button
                      onClick={() => searchRestaurants(currentPage - 1)}
                      disabled={isLoading}
                      className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      前へ
                    </button>
                  )}

                  {/* ページ番号 */}
                  {getPageNumbers().map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => searchRestaurants(pageNum)}
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
                      onClick={() => searchRestaurants(currentPage + 1)}
                      disabled={isLoading}
                      className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      次へ
                    </button>
                  )}
                </div>
              </div>
            )}
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
