"use client";

import LocationFinder from "./components/restaurants/LocationFinder";
import SearchForm from "./components/restaurants/SearchForm";
import LoadingIndicator from "./components/ui/LoadingIndicator";
import RestaurantCard from "./components/restaurants/RestaurantCard";
import Pagination from "./components/restaurants/Pagination";
import ErrorMessage from "./components/ui/ErrorMessage";
import { useGeolocation } from "./hooks/useGeolocation";
import { useRestaurantSearch } from "./hooks/useRestaurantSearch";
import { useMemo, useState } from "react";
import MyMap from "./components/map/MyMap";

export default function SearchPage() {
  // このコンポーネントは、ユーザーの位置情報をもとにレストランを検索し結果を表示する
  // 主な機能:
  // 1. 現在地の取得と表示
  // 2. 検索半径の指定と検索実行
  // 3. 検索結果の表示とページネーション

  // 地図表示モードのステート追加
  const [showMap, setShowMap] = useState(false);

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
    formValues,
    handleSubmit,
    isLoading, // データ取得中のローディング状態
    error, // 検索エラー
    restaurants, // 取得したレストラン一覧
    resultsInfo, // 検索結果のメタデータ（総件数、表示件数など）
    pageFromUrl, // URLから取得したページ番号
    totalPages, // 総ページ数
    searchRestaurants, // 検索を実行する関数
    getPageNumbers, // ページネーション用の表示ページ番号配列を生成
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

        {/* 表示切替ボタン - 追加 */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setShowMap(false)}
              className={`px-4 py-2 text-sm font-medium ${
                !showMap ? "bg-indigo-600 text-white" : "bg-white text-gray-700"
              } border border-indigo-300 rounded-l-md`}
            >
              リスト表示
            </button>
            <button
              onClick={() => setShowMap(true)}
              className={`px-4 py-2 text-sm font-medium ${
                showMap ? "bg-indigo-600 text-white" : "bg-white text-gray-700"
              } border border-indigo-300 rounded-r-md`}
            >
              マップ表示
            </button>
          </div>
        </div>

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
          <ErrorMessage message={error || locationError || ""} />
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

        {/* マップ表示モード - レストランデータを渡す */}
        {showMap && location.lat && location.lng && (
          <div className="h-[600px] mb-6 border border-gray-200 rounded-lg overflow-hidden">
            <MyMap
              center={{ lat: location.lat, lng: location.lng }}
              radius={Number(
                formValues.radius === "1"
                  ? 300
                  : formValues.radius === "2"
                  ? 500
                  : formValues.radius === "3"
                  ? 1000
                  : formValues.radius === "4"
                  ? 2000
                  : 3000
              )}
              restaurants={restaurants} // レストランデータを渡す
            />
          </div>
        )}

        {/* 条件分岐による結果表示 */}
        {!isLoading &&
          resultsInfo &&
          (restaurants.length > 0 ? (
            <>
              {/* レストランカードのグリッド表示 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                {restaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
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
          ))}
      </main>
    </div>
  );
}
