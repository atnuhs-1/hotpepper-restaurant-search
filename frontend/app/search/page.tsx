"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import LocationFinder from "../components/restaurants/LocationFinder";
import SearchForm from "../components/restaurants/SearchForm";
import LoadingIndicator from "../components/ui/LoadingIndicator";
import RestaurantCard from "../components/restaurants/RestaurantCard";
import Pagination from "../components/restaurants/Pagination";
import ErrorMessage from "../components/ui/ErrorMessage";
import { useGeolocation } from "../hooks/useGeolocation";
import { useRestaurantSearch } from "../hooks/useRestaurantSearch";
import { useMemo, useState } from "react";
import MyMap from "../components/map/MyMap";
import Link from "next/link";

type Location = {
    lat: number | null;
    lng: number | null;
  };

export default function SearchPage() {
  // このコンポーネントは、ユーザーの位置情報をもとにレストランを検索し結果を表示する
  // 主な機能:
  // 1. 現在地の取得と表示
  // 2. 検索半径の指定と検索実行
  // 3. 検索結果の表示とページネーション
  const searchParams = useSearchParams();
  const [showMap, setShowMap] = useState(false); // 地図表示モード

  // URLから検索範囲を取得
  const radiusParam = searchParams.get("radius") || "3";

  // URLから位置情報を読み込むオプションを有効化
  const {
    location,
    isLoading: isLocationLoading,
    error: locationError,
    getCurrentLocation
  } = useGeolocation({ loadFromUrl: true });

  // レストラン検索のカスタムフック
  const {
    register,
    formValues,
    handleSubmit,
    isLoading: isSearchLoading,
    error: searchError,
    restaurants,
    resultsInfo,
    pageFromUrl,
    totalPages,
    searchRestaurants,
    getPageNumbers,
    setFormValues,
  } = useRestaurantSearch({ location });

  // 初期ロード時に検索範囲を設定
  useEffect(() => {
    setFormValues({ radius: radiusParam });
  }, [radiusParam, setFormValues]);

  // ページ番号の計算
  const pageNumbers = useMemo(() => getPageNumbers(), [getPageNumbers]);

  // 位置情報を取得して検索
  const handleLocationSuccess = (newLocation: Location) => {
    // 新しい位置情報（newLocation）をオーバーライドとして渡す
    searchRestaurants(1, newLocation);
  };

  // 半径をメートルに変換する関数
  const getRadiusInMeters = (radiusValue: string): number => {
    switch (radiusValue) {
      case "1":
        return 300;
      case "2":
        return 500;
      case "3":
        return 1000;
      case "4":
        return 2000;
      case "5":
        return 3000;
      default:
        return 1000;
    }
  };

  // 読み込み中の状態
  const isLoading = isLocationLoading || isSearchLoading;

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">グルメ検索結果</h1>
          <Link
            href="/"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            トップに戻る
          </Link>
        </div>

        {/* 表示切替ボタン */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg shadow-md inline-flex">
            <button
              onClick={() => setShowMap(false)}
              className={`px-4 py-2 rounded-l-lg ${
                !showMap ? "bg-indigo-600 text-white" : "bg-white text-gray-700"
              }`}
            >
              リスト表示
            </button>
            <button
              onClick={() => setShowMap(true)}
              className={`px-4 py-2 rounded-r-lg ${
                showMap ? "bg-indigo-600 text-white" : "bg-white text-gray-700"
              }`}
            >
              地図表示
            </button>
          </div>
        </div>

        {/* 検索フォーム */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {/* 位置情報取得UI */}
          <LocationFinder
            location={location}
            isLoading={isLocationLoading}
            onGetLocation={() => getCurrentLocation(handleLocationSuccess)}
          />

          {/* エラー表示 */}
          {locationError && <ErrorMessage message={locationError} />}
          {searchError && <ErrorMessage message={searchError} />}

          {/* 検索条件フォーム */}
          <SearchForm
            register={register}
            onSubmit={handleSubmit}
            isLoading={isSearchLoading || isLocationLoading}
            isDisabled={!location.lat || !location.lng}
          />
        </div>

        {/* 検索結果 - 読み込み中 */}
        {(isSearchLoading || isLocationLoading) && (
          <div className="flex justify-center my-12">
            <LoadingIndicator />
          </div>
        )}

        {/* 検索結果情報 - 両方の表示モードで共通 */}
        {!isLoading && resultsInfo && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <p className="text-gray-700">
              <span className="font-bold">{resultsInfo.available}</span>{" "}
              件中
              <span className="font-bold">{resultsInfo.start}</span> 〜
              <span className="font-bold">
                {resultsInfo.returned + resultsInfo.start - 1}
              </span>{" "}
              件を表示
            </p>
          </div>
        )}

        {/* 検索結果がない場合のメッセージ - 両方の表示モードで共通 */}
        {!isLoading && (!restaurants || restaurants.length === 0) && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center mb-8">
            <p className="text-gray-700">
              お店が見つかりませんでした。検索条件を変えてお試しください。
            </p>
          </div>
        )}

        {/* 検索結果 - 地図表示 */}
        {showMap &&
          location.lat &&
          location.lng &&
          !isLoading &&
          restaurants &&
          restaurants.length > 0 && (
            <div className="h-[600px] bg-white rounded-lg shadow-md p-2 mb-6">
              <MyMap
                center={{ lat: location.lat, lng: location.lng }}
                radius={getRadiusInMeters(formValues.radius)}
                restaurants={restaurants}
              />
            </div>
          )}

        {/* 検索結果 - リスト表示 */}
        {!showMap && !isLoading && restaurants && restaurants.length > 0 && (
          <>
            {/* レストラン一覧 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {restaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>

            {/* ページネーション */}
            {totalPages > 1 && (
              <Pagination
                currentPage={pageFromUrl}
                totalPages={totalPages}
                pageNumbers={pageNumbers}
                onPageChange={(page) => searchRestaurants(page)}
                isLoading={isLoading}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
