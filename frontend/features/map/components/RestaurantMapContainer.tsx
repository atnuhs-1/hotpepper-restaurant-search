"use client";

import { useState, useEffect } from "react";
import { RestaurantSearchParams, Restaurant } from "@/types/search";
import { fetchRestaurantsForMap } from "@/features/map/api";
import RestaurantMap from "@/features/map/components/RestaurantMap";

interface RestaurantMapContainerProps {
  initialSearchParams: RestaurantSearchParams;
  initialSearchCenter?: { lat: number; lng: number };
  initialSearchRadius: number;
}

// デフォルト値（東京駅）
const DEFAULT_CENTER = { lat: 35.681236, lng: 139.767125 };

export default function RestaurantMapContainer({
  initialSearchParams,
  initialSearchCenter,
  initialSearchRadius,
}: RestaurantMapContainerProps) {
  // 検索条件とその結果を状態として管理
  const [searchParams, setSearchParams] =
    useState<RestaurantSearchParams>(initialSearchParams);
  const [searchCenter, setSearchCenter] = useState<{
    lat: number;
    lng: number;
  }>(initialSearchCenter || DEFAULT_CENTER);
  const [searchRadius, setSearchRadius] = useState(initialSearchRadius);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // デフォルト位置を使用しているかどうか
  const isUsingDefaultLocation = !searchParams.lat || !searchParams.lng;

  // データ取得関数
  const fetchData = async (params: RestaurantSearchParams) => {
    setLoading(true);
    try {
      // パラメータに位置情報がなければデフォルト値を使用
      const searchParamsWithLocation = {
        ...params,
        lat: params.lat || DEFAULT_CENTER.lat.toString(),
        lng: params.lng || DEFAULT_CENTER.lng.toString(),
      };

      const results = await fetchRestaurantsForMap(searchParamsWithLocation);
      setRestaurants(results.shop || []);
      setTotalCount(results.results_available);
    } catch (error) {
      console.error("データ取得エラー:", error);
      // エラー時は空の配列をセット
      setRestaurants([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // 初期表示時のデータ取得
  useEffect(() => {
    fetchData(initialSearchParams);
  }, []);

  // 戻る・進むボタン対応のためのpopstateイベントリスナー
  useEffect(() => {
    const handlePopState = () => {
      // URLから検索パラメータを取得して状態を更新
      const urlParams = new URLSearchParams(window.location.search);
      const currentParams: RestaurantSearchParams = {
        lat: urlParams.get("lat") || "",
        lng: urlParams.get("lng") || "",
        range: urlParams.get("range") || "3",
        keyword: urlParams.get("keyword") || "",
        genre: urlParams.get("genre") || "",
        budget: urlParams.get("budget") || "",
      };

      // 状態を更新
      setSearchParams(currentParams);

      if (currentParams.lat && currentParams.lng) {
        setSearchCenter({
          lat: parseFloat(currentParams.lat),
          lng: parseFloat(currentParams.lng),
        });
      }

      if (currentParams.range) {
        const radiusMap: Record<string, number> = {
          "1": 300,
          "2": 500,
          "3": 1000,
          "4": 2000,
          "5": 3000,
        };
        setSearchRadius(radiusMap[currentParams.range] || 1000);
      }

      // データを再取得
      fetchData(currentParams);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // 検索条件変更時のハンドラ
  const handleSearchSubmit = (newParams: RestaurantSearchParams) => {
    // 状態を更新
    setSearchParams(newParams);

    // 検索中心の更新
    if (newParams.lat && newParams.lng) {
      setSearchCenter({
        lat: parseFloat(newParams.lat),
        lng: parseFloat(newParams.lng),
      });
    }

    // 半径の更新
    if (newParams.range) {
      const radiusMap: Record<string, number> = {
        "1": 300,
        "2": 500,
        "3": 1000,
        "4": 2000,
        "5": 3000,
      };
      setSearchRadius(radiusMap[newParams.range] || 1000);
    }

    // URLパラメータを更新（履歴に追加）
    const newUrlParams = new URLSearchParams();
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) newUrlParams.set(key, value.toString());
    });

    // 現在のURLパスを維持しながらクエリパラメータだけ更新
    const url = `${window.location.pathname}?${newUrlParams.toString()}`;

    // pushStateを使って履歴に追加（戻る・進むボタン対応）
    window.history.pushState(null, "", url);

    // データの再取得
    fetchData(newParams);
  };

  return (
    <div>
      {/* 現在地未設定の通知 */}
      {isUsingDefaultLocation && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                現在地が設定されていません。東京駅周辺のレストランを表示しています。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 情報表示部分 */}
      <p className="text-gray-600 mb-4">
        {loading ? (
          "データを取得中..."
        ) : restaurants.length > 0 ? (
          <>
            検索範囲内の {totalCount} 件すべてを地図上に表示しています
          </>
        ) : (
          <>検索条件に一致するレストランが見つかりませんでした</>
        )}
      </p>

      <RestaurantMap
        restaurants={restaurants}
        searchCenter={searchCenter}
        searchRadius={searchRadius}
        initialSearchParams={searchParams}
        onSearchSubmit={handleSearchSubmit}
      />
    </div>
  );
}
