"use client";

import { GENRES } from "@/constants/genres";
import { RestaurantSearchParams } from "@/types/search";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FiMapPin } from "react-icons/fi";
import clsx from "clsx";

interface SearchFormProps {
  initialValues?: RestaurantSearchParams;
  serverRoute?: boolean;
}

type LocationStatus = "idle" | "loading" | "success" | "error";

export default function SearchForm({ initialValues }: SearchFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // 検索条件の状態
  const [formData, setFormData] = useState<RestaurantSearchParams>({
    lat: initialValues?.lat || "",
    lng: initialValues?.lng || "",
    range: initialValues?.range || "3",
    keyword: initialValues?.keyword || "",
    genre: initialValues?.genre || "",
    budget: initialValues?.budget || "",
  });

  // 検索範囲のオプション
  const rangeOptions = [
    { value: "1", label: "300m" },
    { value: "2", label: "500m" },
    { value: "3", label: "1km" },
    { value: "4", label: "2km" },
    { value: "5", label: "3km" },
  ];

  // 初期値がある場合は位置情報取得済みとする
  useEffect(() => {
    if (initialValues?.lat && initialValues?.lng) {
      setLocationStatus("success");
    }
  }, [initialValues]);

  // 現在地取得
  const getCurrentLocation = () => {
    setLocationStatus("loading");
    setErrorMessage("");

    if (!navigator.geolocation) {
      setLocationStatus("error");
      setErrorMessage("お使いのブラウザはGeolocation APIに対応していません。");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      // 成功時
      (position) => {
        setFormData((prev) => ({
          ...prev,
          lat: position.coords.latitude.toString(),
          lng: position.coords.longitude.toString(),
        }));
        setLocationStatus("success");
      },
      // エラー時
      (error) => {
        setLocationStatus("error");
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setErrorMessage(
              "位置情報の取得が許可されていません。ブラウザの設定をご確認ください。"
            );
            break;
          case error.POSITION_UNAVAILABLE:
            setErrorMessage("現在の位置情報が取得できませんでした。");
            break;
          case error.TIMEOUT:
            setErrorMessage("位置情報の取得がタイムアウトしました。");
            break;
          default:
            setErrorMessage("位置情報の取得中にエラーが発生しました。");
        }
      },
      // オプション
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // フォーム入力の処理
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 検索実行
  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 位置情報が未取得の場合は検索できない
    if (!formData.lat || !formData.lng) {
      setErrorMessage(
        "検索には位置情報が必要です。「現在地を取得」を押してください。"
      );
      return;
    }

    // 新しい検索パラメータを構築
    const newParams = new URLSearchParams();
    newParams.append("lat", formData.lat);
    newParams.append("lng", formData.lng);
    newParams.append("range", formData.range || "3");

    if (formData.keyword) {
      newParams.append("keyword", formData.keyword);
    }

    if (formData.genre) {
      newParams.append("genre", formData.genre);
    }

    if (formData.budget) {
      newParams.append("budget", formData.budget);
    }

    // ページは1に戻す
    newParams.append("page", "1");

    // 現在のパスに基づいてリダイレクト先を決定
    const targetPath = pathname.includes('/map') ? '/search/map' : '/search';

    // 検索を実行
    router.push(`${targetPath}?${newParams.toString()}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4 h-fit sticky top-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">検索条件</h2>

      {/* 位置情報取得 */}
      <div className="mb-4 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <label className="block font-medium text-gray-700">位置情報</label>
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={locationStatus === "loading"}
            className="flex items-center text-sm border border-orange-600 text-orange-600 bg-white px-3 py-1 rounded-md hover:bg-orange-50 disabled:opacity-50"
          >
            <FiMapPin className="mr-1" />
            {locationStatus === "loading" ? "取得中..." : "現在地を取得"}
          </button>
        </div>

        {locationStatus === "success" && formData.lat && formData.lng && (
          <div className="p-2 bg-green-50 border border-green-100 rounded-md text-green-700 text-sm flex items-center">
            <FiMapPin className="mr-2" />
            <span>
              現在地周辺の
              {rangeOptions.find((opt) => opt.value === formData.range)
                ?.label || "1km"}
              圏内で検索します
            </span>
          </div>
        )}

        {/* エラーメッセージ表示 - ここを追加 */}
        {locationStatus === "error" && errorMessage && (
          <div className="p-2 bg-red-50 border border-red-100 rounded-md text-red-700 text-sm flex items-center mt-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleFilterSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              検索範囲
            </label>
            <div className="flex flex-wrap gap-3">
              {rangeOptions.map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="range"
                    value={option.value}
                    checked={formData.range === option.value}
                    onChange={handleInputChange}
                    className="mr-2 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text- text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ジャンル
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {GENRES.slice(0, 8).map((genre) => (
                <button
                  key={genre.code}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, genre: genre.code }))
                  }
                  className={clsx(
                    "px-3 py-1 rounded-full text-sm",
                    formData.genre === genre.code
                      ? "bg-orange-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {genre.name}
                </button>
              ))}
            </div>
            {/* すべてのジャンルをカバーするためのセレクトボックス */}
            <select
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
              className="w-full mt-2 rounded-md text-gray-800 border-gray-300 shadow-sm px-3 py-2 focus:border-orange-500 focus:ring-orange-500"
            >
              {GENRES.map((genre) => (
                <option key={genre.code} value={genre.code}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="keyword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              キーワード
            </label>
            <input
              type="text"
              id="keyword"
              name="keyword"
              value={formData.keyword}
              onChange={handleInputChange}
              placeholder="店名、料理名など"
              className="w-full rounded-md text-gray-800 border-gray-300 shadow-sm px-3 py-1 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={locationStatus !== "success"}
              className="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition disabled:opacity-50 disabled:bg-gray-400"
            >
              検索する
            </button>

            {/* 検索実行時のエラーメッセージ表示 */}
            {errorMessage && locationStatus !== "error" && (
              <div className="p-2 bg-red-50 border border-red-100 rounded-md text-red-700 text-sm mt-2">
                {errorMessage}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
