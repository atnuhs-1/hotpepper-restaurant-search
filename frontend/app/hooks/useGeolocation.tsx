"use client";

import { useState, useEffect } from "react";

type Location = {
  lat: number | null;
  lng: number | null;
};

export function useGeolocation() {
  // セッションストレージからユーザーの位置情報を取得する関数
  const getLocationFromSessionStorage = () => {
    if (typeof window !== "undefined") {
      const savedLocation = sessionStorage.getItem("userLocation");
      if (savedLocation) {
        try {
          return JSON.parse(savedLocation);
        } catch (e) {
          console.error("Stored location parsing error:", e);
        }
      }
    }
    return { lat: null, lng: null };
  };

  const [location, setLocation] = useState<Location>({ lat: null, lng: null } );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 現在地を取得（検索コールバックを受け取れるように修正）
  const getCurrentLocation = (
    callback?: (position: { lat: number; lng: number }) => void
  ) => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("お使いのブラウザは位置情報取得に対応していません");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        sessionStorage.setItem(
          "userLocation",
          JSON.stringify({
            lat: newLocation.lat,
            lng: newLocation.lng,
          })
        );

        // 状態を更新
        setLocation(newLocation);
        setIsLoading(false);

        // 新しい位置情報を直接コールバックに渡す
        if (callback) {
          callback(newLocation);
        }
      },
      (err) => {
        setError(`位置情報の取得に失敗しました: ${err.message}`);
        setIsLoading(false);
      }
    );
  };

  // コンポーネントがマウントされた時にセッションストレージから位置情報を取得
  useEffect(() => {
    const storedLocation = getLocationFromSessionStorage();
    if (storedLocation.lat && storedLocation.lng) {
      setLocation(storedLocation);
    }
  }, []);

  return {
    location,
    setLocation,
    isLoading,
    error,
    getCurrentLocation,
  };
}
