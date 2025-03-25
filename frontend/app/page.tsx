"use client";

import LocationFinder from "./components/restaurants/LocationFinder";
import SearchForm from "./components/restaurants/SearchForm";
import LoadingIndicator from "./components/ui/LoadingIndicator";
import RestaurantCard from "./components/restaurants/RestaurantCard";
import Pagination from "./components/restaurants/Pagination";
import ErrorMessage from "./components/ui/ErrorMessage";
import { useGeolocation } from "./hooks/useGeolocation";
import { useRestaurantSearch } from "./hooks/useRestaurantSearch";
import { useMemo } from "react";

export default function SearchPage() {
  // このコンポーネントは、ユーザーの位置情報をもとにレストランを検索し結果を表示する
  // 主な機能:
  // 1. 現在地の取得と表示
  // 2. 検索半径の指定と検索実行
  // 3. 検索結果の表示とページネーション

  // 位置情報取得のカスタムフック - ユーザーの緯度・経度を提供
  const {
    location,
    isLoading: isLocationLoading,
    error: locationError,
    getCurrentLocation,
  } = useGeolocation();

    // レストラン検索のカスタムフック - 位置情報をもとにAPIからデータを取得
  const {
    register,
    handleSubmit,
    isLoading,       // データ取得中のローディング状態
    error,           // 検索エラー
    restaurants,     // 取得したレストラン一覧
    resultsInfo,     // 検索結果のメタデータ（総件数、表示件数など）
    pageFromUrl,     // URLから取得したページ番号
    totalPages,      // 総ページ数
    searchRestaurants, // 検索を実行する関数
    getPageNumbers,   // ページネーション用の表示ページ番号配列を生成
  } = useRestaurantSearch({ location });

  const pageNumbers = useMemo(() => getPageNumbers(), [getPageNumbers]);

  // 位置情報を直接受け取って検索を実行
  const handleLocationSuccess = (newLocation: { lat: number; lng: number }) => {
    // ここで直接新しい位置情報を使用して検索
    searchRestaurants(1, newLocation);
  };

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          グルメ検索
        </h1>

        {/* 現在地取得と検索フォームを横並びに */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* 現在地取得UI - 位置情報の表示と取得ボタン */}
          <LocationFinder
            location={location}
            isLoading={isLocationLoading}
            onGetLocation={() => getCurrentLocation(handleLocationSuccess)}
          />

          {/* 検索フォーム */}
          <SearchForm
             register={register}
             isLoading={isLoading}
             isDisabled={!location.lat || !location.lng}
             onSubmit={handleSubmit}
          />
        </div>

        {/* エラー表示 - 位置情報または検索でエラーが発生した場合 */}
        {(error || locationError) && (
          <ErrorMessage message={(error || locationError || "")} />
        )}

        {/* エラー表示 - 位置情報または検索でエラーが発生した場合 */}
        {isLoading && <LoadingIndicator />}

        {/* 検索結果のメタ情報表示 - 検索完了後のみ表示 */}
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

        {/* 条件分岐による結果表示 */}
        {!isLoading && resultsInfo && (
          restaurants.length > 0 ? (
            <>
              {/* レストランカードのグリッド表示 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                {restaurants.map((restaurant) => (
                  <RestaurantCard 
                    key={restaurant.id} 
                    restaurant={restaurant} 
                  />
                ))}
              </div>

              {/* ページネーションコントロール */}
              <Pagination
                currentPage={pageFromUrl}
                totalPages={totalPages}
                isLoading={isLoading}
                pageNumbers={pageNumbers}
                onPageChange={searchRestaurants}
              />
            </>
          ) : (
            // 検索結果が0件の場合のメッセージ
            <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-100">
              <p className="text-gray-600">検索結果がありません</p>
            </div>
          )
        )}
      </main>
    </div>
  );
}
