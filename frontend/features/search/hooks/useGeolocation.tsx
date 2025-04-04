"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

type Location = {
  lat: number | null;
  lng: number | null;
};

interface UseGeolocationOptions {
  loadFromUrl?: boolean; // URLからロードするかのオプション
}

export function useGeolocation(
  options: UseGeolocationOptions = { loadFromUrl: false },
) {
  const searchParams = useSearchParams();
  const [location, setLocation] = useState<Location>({ lat: null, lng: null });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLocationAvailable, setIsLocationAvailable] = useState(false);

  // URLからの位置情報をロードする処理
  useEffect(() => {
    if (options.loadFromUrl) {
      const latParam = searchParams.get("lat");
      const lngParam = searchParams.get("lng");

      if (latParam && lngParam) {
        try {
          const lat = parseFloat(latParam);
          const lng = parseFloat(lngParam);

          // 有効な数値かチェック
          if (!isNaN(lat) && !isNaN(lng)) {
            setLocation({ lat, lng });
            setIsLocationAvailable(true);
          }
        } catch (err) {
          console.error("URLからの位置情報の解析に失敗しました", err);
        }
      }
    }
  }, [searchParams, options.loadFromUrl]);

  // 位置情報の設定関数（外部からの更新用）
  const updateLocation = (newLocation: Location) => {
    setLocation(newLocation);
    setIsLocationAvailable(true);
    setError(null);
  };

  // 現在地を取得
  const getCurrentLocation = (onSuccess?: (location: Location) => void) => {
    if (!navigator.geolocation) {
      setError("お使いのブラウザは位置情報をサポートしていません");
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLocation(newLocation);
        setIsLoading(false);

        // 成功コールバックがあれば実行
        if (onSuccess) {
          onSuccess(newLocation);
        }
      },
      (error) => {
        setIsLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError("位置情報へのアクセスが拒否されました");
            break;
          case error.POSITION_UNAVAILABLE:
            setError("位置情報が利用できません");
            break;
          case error.TIMEOUT:
            setError("位置情報の取得がタイムアウトしました");
            break;
          default:
            setError("位置情報の取得中に問題が発生しました");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  // 位置情報をリセットする関数
  const resetLocation = () => {
    setLocation({ lat: 0, lng: 0 });
    setIsLocationAvailable(false);
    setError(null);
  };

  return {
    location,
    isLoading,
    error,
    isLocationAvailable,
    getCurrentLocation,
    updateLocation, // 外部から位置情報を更新するためのメソッド
    resetLocation, // 位置情報をリセットするメソッド
  };
}
