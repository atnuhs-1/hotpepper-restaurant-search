"use client";

import { GENRES } from "@/constants/genres";
import { RestaurantSearchParams } from "@/types/search";
import { useState, useEffect } from "react";
import { FiMapPin, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";
import clsx from "clsx";

interface MapSearchFormProps {
  initialValues?: RestaurantSearchParams;
  onSubmit: (params: RestaurantSearchParams) => void;
  onClose?: () => void;
}

type LocationStatus = "idle" | "loading" | "success" | "error";

export default function MapSearchForm({
  initialValues,
  onSubmit,
  onClose,
}: MapSearchFormProps) {
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isGenreExpanded, setIsGenreExpanded] = useState(false);

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
            setErrorMessage("位置情報の取得が許可されていません。");
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
      },
    );
  };

  // フォーム入力の処理
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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
      setErrorMessage("検索には位置情報が必要です。");
      return;
    }

    // 親コンポーネントへ通知
    onSubmit(formData);
  };

  // 人気ジャンル（上位8つ表示）
  const popularGenres = GENRES.slice(0, 8);

  return (
    <div className="bg-white rounded-lg shadow-md p-3 max-w-xs w-full overflow-y-auto max-h-[calc(100vh-120px)] relative z-50">
      {" "}
      {/* z-indexを高く設定 */}
      {/* ヘッダー部分 */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
        <h3 className="text-sm font-medium text-gray-700">検索条件</h3>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="閉じる"
          >
            <FiX size={18} />
          </button>
        )}
      </div>
      {/* 位置情報ボタン */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-medium text-gray-700">
            位置情報
          </label>
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={locationStatus === "loading"}
            className="flex items-center text-xs border border-orange-600 text-orange-600 bg-white px-2 py-0.5 rounded hover:bg-orange-50 disabled:opacity-50"
          >
            <FiMapPin className="mr-1" size={14} />
            {locationStatus === "loading" ? "取得中..." : "現在地取得"}
          </button>
        </div>

        {locationStatus === "success" && formData.lat && formData.lng && (
          <div className="p-1.5 bg-green-50 border border-green-100 rounded text-green-700 text-xs flex items-center">
            <FiMapPin className="mr-1" size={14} />
            <span>
              現在地周辺
              {rangeOptions.find((opt) => opt.value === formData.range)
                ?.label || "1km"}
              圏内
            </span>
          </div>
        )}

        {locationStatus === "error" && errorMessage && (
          <div className="p-1.5 bg-red-50 border border-red-100 rounded text-red-700 text-xs">
            {errorMessage}
          </div>
        )}
      </div>
      <form onSubmit={handleFilterSubmit} className="text-xs">
        <div className="space-y-3">
          {/* 検索範囲 */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              検索範囲
            </label>
            <div className="flex flex-wrap gap-2">
              {rangeOptions.map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="range"
                    value={option.value}
                    checked={formData.range === option.value}
                    onChange={handleInputChange}
                    className="mr-1 text-orange-600 focus:ring-orange-500 h-3 w-3"
                  />
                  <span className="text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* キーワード */}
          <div>
            <label
              htmlFor="map-keyword"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              キーワード
            </label>
            <input
              type="text"
              id="map-keyword"
              name="keyword"
              value={formData.keyword}
              onChange={handleInputChange}
              placeholder="店名、料理名など"
              className="w-full rounded text-xs text-gray-800 border-gray-300 shadow-sm px-2 py-1 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          {/* ジャンル（折りたたみ可能） */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-gray-700">
                ジャンル
              </label>
              <button
                type="button"
                onClick={() => setIsGenreExpanded(!isGenreExpanded)}
                className="text-gray-500 hover:text-gray-700"
              >
                {isGenreExpanded ? (
                  <FiChevronUp size={16} />
                ) : (
                  <FiChevronDown size={16} />
                )}
              </button>
            </div>

            {/* 人気ジャンルのボタン */}
            <div className="flex flex-wrap gap-1 mb-1">
              {popularGenres.map((genre) => (
                <button
                  key={genre.code}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, genre: genre.code }))
                  }
                  className={clsx(
                    "px-2 py-0.5 rounded-full text-xs",
                    formData.genre === genre.code
                      ? "bg-orange-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                  )}
                >
                  {genre.name}
                </button>
              ))}
            </div>

            {/* 展開時に表示されるセレクトボックス */}
            {isGenreExpanded && (
              <select
                id="map-genre"
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
                className="w-full mt-1 rounded text-xs text-gray-800 border-gray-300 shadow-sm px-2 py-1 focus:border-orange-500 focus:ring-orange-500"
              >
                <option value="">すべてのジャンル</option>
                {GENRES.map((genre) => (
                  <option key={genre.code} value={genre.code}>
                    {genre.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* 検索ボタン */}
          <div>
            <button
              type="submit"
              disabled={locationStatus !== "success"}
              className="w-full px-3 py-1.5 bg-orange-600 text-white text-xs rounded hover:bg-orange-700 transition disabled:opacity-50 disabled:bg-gray-400"
            >
              この条件で検索
            </button>

            {/* 検索実行時のエラーメッセージ表示 */}
            {errorMessage && locationStatus !== "error" && (
              <div className="p-1.5 bg-red-50 border border-red-100 rounded text-red-700 text-xs mt-1">
                {errorMessage}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
