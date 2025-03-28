"use client";

import { useState } from "react";
import MyMap from "../components/map/MyMap";
import { FiMapPin } from "react-icons/fi";

export default function GoogleMapPage() {
  // デフォルト値の設定（東京駅周辺、半径1km）
  const [center, setCenter] = useState({ lat: 35.681236, lng: 139.767125 });
  const [radius, setRadius] = useState(1000);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 現在地取得ボタンのハンドラー
  const handleGetCurrentLocation = () => {
    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLoading(false);
      },
      (error) => {
        console.error("位置情報の取得に失敗しました", error);
        setError("位置情報の取得に失敗しました");
        setIsLoading(false);
      }
    );
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="p-4 bg-white z-10">
        <h1 className="text-xl font-bold mb-2">マップ検索エリア</h1>
        <div className="flex flex-wrap gap-4 items-end justify-between text-black">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm text-gray-600">
                半径 (メートル)
              </label>
              <input
                type="number"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="border rounded px-3 py-2 w-32"
                min="100"
                max="5000"
                step="100"
              />
            </div>

            <button
              onClick={handleGetCurrentLocation}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all
                      flex items-center justify-center  gap-2 shadow-sm"
              disabled={isLoading}
            >
              <FiMapPin className="inline-block" />
              {isLoading ? "取得中..." : "現在地取得"}
            </button>

            {/* エラー表示 */}
            {error && (
              <div className="px-3 py-1 bg-red-50 border border-red-100 rounded-md text-red-700 text-sm">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 p-2 bg-white">
        <MyMap center={center} radius={radius} />
      </div>
    </div>
  );
}
