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

  const [location, setLocation] = useState<Location>(
    getLocationFromSessionStorage()
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 位置情報が変更されたらセッションストレージに保存
  useEffect(() => {
    if (location.lat && location.lng) {
      sessionStorage.setItem(
        "userLocation",
        JSON.stringify({
          lat: location.lat,
          lng: location.lng,
        })
      );
    }
  }, [location]);

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
