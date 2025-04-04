"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GENRES } from "@/constants/genres";

interface SearchParams {
  lat: number | null;
  lng: number | null;
  range: number;
  keyword: string;
  genre: string;
}

// 位置情報の型
interface Location {
  lat: number | null;
  lng: number | null;
}

export default function HomeSearchForm() {
  const router = useRouter();

  // 状態管理
  const [location, setLocation] = useState<Location>({ lat: null, lng: null });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    lat: null,
    lng: null,
    range: 3, // デフォルト値: 1km
    keyword: "",
    genre: "",
  });

  const genres = GENRES;

  // 検索範囲のオプション
  const rangeOptions = [
    { value: 1, label: "300m", apiValue: 1 },
    { value: 2, label: "500m", apiValue: 2 },
    { value: 3, label: "1km", apiValue: 3 },
    { value: 4, label: "2km", apiValue: 4 },
    { value: 5, label: "3km", apiValue: 5 },
  ];

  // 現在地を取得
  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("お使いのブラウザではGeolocation APIがサポートされていません");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      // 成功時
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setSearchParams((prev) => ({
          ...prev,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }));
        setLoading(false);
      },
      // エラー時
      (error) => {
        let errorMessage;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "位置情報の取得が許可されていません";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "位置情報が取得できませんでした";
            break;
          case error.TIMEOUT:
            errorMessage = "位置情報の取得がタイムアウトしました";
            break;
          default:
            errorMessage = "位置情報の取得中に予期せぬエラーが発生しました";
        }
        setError(errorMessage);
        setLoading(false);
      },
      // オプション
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
    );
  };

  // フォーム入力の処理
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 検索実行
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchParams.lat || !searchParams.lng) {
      setError("現在地を取得してから検索してください");
      return;
    }

    // 検索ページへ遷移
    const queryParams = new URLSearchParams();
    queryParams.append("lat", searchParams.lat.toString());
    queryParams.append("lng", searchParams.lng.toString());
    queryParams.append("range", searchParams.range.toString());

    if (searchParams.keyword) {
      queryParams.append("keyword", searchParams.keyword);
    }

    if (searchParams.genre) {
      queryParams.append("genre", searchParams.genre);
    }

    router.push(`/search?${queryParams.toString()}`);
  };

  return (
    <div className="rounded-lg shadow-lg p-6 mb-6">
      {/* 位置情報セクション */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">現在地</h2>
          <button
            onClick={getCurrentLocation}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition flex items-center"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            {location.lat && location.lng ? "現在地を更新" : "現在地を取得"}
          </button>
        </div>

        {/* 位置情報の状態表示 */}
        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">位置情報を取得中...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-2">
            <p>{error}</p>
            <button
              onClick={getCurrentLocation}
              className="text-red-700 underline mt-1"
              type="button"
            >
              再試行
            </button>
          </div>
        ) : location.lat && location.lng ? (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mt-2">
            <p>✓ 現在地を取得しました！</p>
            {/* 詳細情報はオプションや設定で表示・非表示を切り替えるとよい */}
          </div>
        ) : (
          <div className="bg-gray-100 border-l-4 border-gray-500 text-gray-700 p-4 mt-2">
            <p>「現在地を取得」ボタンを押して位置情報を設定してください</p>
          </div>
        )}
      </div>

      {/* 検索フォーム */}
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="range"
              className="block text-gray-700 font-medium mb-1"
            >
              検索範囲
            </label>
            <select
              id="range"
              name="range"
              value={searchParams.range}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              {rangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="genre"
              className="block text-gray-700 font-medium mb-1"
            >
              ジャンル
            </label>
            <select
              id="genre"
              name="genre"
              value={searchParams.genre}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              {genres.map((genre) => (
                <option key={genre.code} value={genre.code}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="keyword"
            className="block text-gray-700 font-medium mb-1"
          >
            キーワード
          </label>
          <input
            type="text"
            id="keyword"
            name="keyword"
            value={searchParams.keyword}
            onChange={handleInputChange}
            placeholder="店名、料理名など"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <button
          type="submit"
          disabled={!location.lat || !location.lng}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition ${
            !location.lat || !location.lng
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-600 hover:bg-orange-700"
          }`}
        >
          検索する
        </button>
      </form>
    </div>
  );
}
