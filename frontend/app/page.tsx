"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import LocationFinder from "./components/restaurants/LocationFinder";
import ErrorMessage from "./components/ui/ErrorMessage";
import { useGeolocation } from "./hooks/useGeolocation";

type Location = {
  lat: number | null;
  lng: number | null;
};

export default function HomePage() {
  const router = useRouter();
  const [radius, setRadius] = useState("3"); // デフォルト1kmで設定

  // 位置情報取得のカスタムフック
  const {
    location,
    isLoading: isLocationLoading,
    error: locationError,
    getCurrentLocation,
  } = useGeolocation();

  // 位置情報を取得して検索結果ページへ遷移
  const handleLocationSuccess = (newLocation: Location) => {
    // 検索結果ページへリダイレクト（クエリパラメータに位置情報と半径を含める）
    router.push(
      `/search?lat=${newLocation.lat}&lng=${newLocation.lng}&radius=${radius}`
    );
  };

  // フォーム送信時の処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (location.lat && location.lng) {
      router.push(
        `/search?lat=${location.lat}&lng=${location.lng}&radius=${radius}`
      );
    } else {
      // 位置情報がまだない場合は取得してから遷移
      getCurrentLocation(handleLocationSuccess);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center">
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h1 className="text-4xl font-bold mb-6 text-indigo-700">
            グルメ検索
          </h1>
          
          <p className="text-gray-600 mb-8">
            現在地周辺のレストランを簡単に検索できます。
            位置情報を取得して周辺のお店を探してみましょう。
          </p>

          {/* エラー表示 */}
          {locationError && <ErrorMessage message={locationError} />}

          {/* 位置情報取得UI */}
          <LocationFinder
            location={location}
            isLoading={isLocationLoading}
            onGetLocation={() => getCurrentLocation(handleLocationSuccess)}
          />

          {/* 簡易検索フォーム */}
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                検索範囲
              </label>
              <select
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isLocationLoading}
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
              disabled={isLocationLoading || (!location.lat && !location.lng)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {location.lat && location.lng ? "この条件で検索" : "現在地周辺から探す"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}