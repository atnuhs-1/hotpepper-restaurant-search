"use client";

import { useState } from 'react';
import { APIProvider, Map, MapControl, ControlPosition } from "@vis.gl/react-google-maps";
import { Restaurant, RestaurantSearchParams } from "@/types/search";
import { getZoomLevelForRadius } from "@/features/map/utils/map";
import MapContent from '@/features/map/components/MapContent';
import MapError from '@/features/map/components/MapError';
import MapFooter from '@/features/map/components/MapFooter';
import MapSearchForm from '@/features/map/components/MapSearchForm';
import RestaurantCardList from '@/features/map/components/RestaurantCardList';
import { FiSearch, FiX, FiList } from "react-icons/fi";
import { ZoomController } from './ZoomController';

interface RestaurantMapProps {
  restaurants: Restaurant[];
  searchCenter: { lat: number; lng: number };
  searchRadius: number;
  initialSearchParams?: RestaurantSearchParams;
  onSearchSubmit?: (params: RestaurantSearchParams) => void;
}

export default function RestaurantMap({
  restaurants,
  searchCenter,
  searchRadius,
  initialSearchParams,
  onSearchSubmit,
}: RestaurantMapProps) {
  // 検索フォームの表示状態
  const [showSearchForm, setShowSearchForm] = useState(false);
  // カードリストの表示状態
  const [showCardList, setShowCardList] = useState(false);
  // 選択されたレストラン
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  // 検索条件が変更されたかどうか
  const [searchConditionChanged, setSearchConditionChanged] = useState(false);

  // 検索の中心位置を計算（未設定の場合は最初のレストランかデフォルト位置）
  const center = searchCenter || 
    (restaurants[0]?.lat && restaurants[0]?.lng 
      ? { lat: restaurants[0].lat, lng: restaurants[0].lng }
      : { lat: 35.681236, lng: 139.767125 }); // デフォルト: 東京駅
  
  // 検索範囲の半径（未設定の場合はデフォルト値）
  const radius = searchRadius || 1000; // デフォルト: 1000m (1km)
  
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;
  const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID as string;

  // 検索フォームのサブミット処理
  const handleSearchSubmit = (values: RestaurantSearchParams) => {
    if (onSearchSubmit) {
      onSearchSubmit(values);
      setSearchConditionChanged(true);
      
      // 検索条件変更フラグを短時間後にリセット（マップの更新が完了した後）
      setTimeout(() => {
        setSearchConditionChanged(false);
      }, 1000);
    }
    // フォームを閉じる
    setShowSearchForm(false);
  };

  // レストラン選択時の処理
  const handleSelectRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  // MapContentに渡すフィルター済みのレストラン（選択状態を含む）
  const hasRestaurants = restaurants && restaurants.length > 0;

  if (!API_KEY) {
    return <MapError />;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="h-[calc(100vh-14rem)] min-h-[480px] relative">
        <APIProvider apiKey={API_KEY}>
          <Map
            mapId={MAP_ID}
            defaultZoom={getZoomLevelForRadius(searchRadius)}
            defaultCenter={center}
            gestureHandling={"greedy"}
            disableDefaultUI={false}
            mapTypeControl={false}
            fullscreenControl={true}
            streetViewControl={false}
          >
            {/* ズームコントローラー - 検索条件が変更された場合のみズームを調整 */}
            <ZoomController
              searchRadius={radius} 
              searchConditionChanged={searchConditionChanged} 
            />

            {hasRestaurants ? (
              <MapContent
                center={center}
                radius={radius}
                restaurants={restaurants}
                selectedRestaurantId={selectedRestaurant?.id}
                onMarkerClick={handleSelectRestaurant}
              />
            ) : (
              <MapControl position={ControlPosition.CENTER}>
                <div className="bg-white bg-opacity-90 rounded-lg shadow-md p-4 text-center max-w-xs z-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-gray-400 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-700">
                    表示できるレストランがありません
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    検索条件を変更して再度お試しください
                  </p>
                </div>
              </MapControl>
            )}
            
            {/* 検索ボタン - 左上に配置 */}
            <MapControl position={ControlPosition.TOP_LEFT}>
              <div className="m-2 z-50">
                {!showSearchForm ? (
                  <button 
                    onClick={() => setShowSearchForm(true)}
                    className="bg-white shadow-md rounded-lg p-2 hover:bg-gray-100 transition-colors flex items-center text-sm"
                    aria-label="検索フォームを開く"
                  >
                    <FiSearch className="text-gray-700 mr-1" size={16} />
                    <span className="text-gray-700">検索条件を変更</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => setShowSearchForm(false)}
                    className="bg-white shadow-md rounded-lg p-2 hover:bg-gray-100 transition-colors"
                    aria-label="検索フォームを閉じる"
                  >
                    <FiX className="text-gray-700" size={16} />
                  </button>
                )}
              </div>
            </MapControl>
            
            {/* リスト表示ボタン - 右上に配置 */}
            {hasRestaurants && (
              <MapControl position={ControlPosition.TOP_RIGHT}>
                <div className="m-2 z-50">
                  <button 
                    onClick={() => setShowCardList(!showCardList)}
                    className="bg-white shadow-md rounded-lg p-2 hover:bg-gray-100 transition-colors flex items-center text-sm"
                    aria-label={showCardList ? "リストを閉じる" : "リスト表示"}
                  >
                    <FiList className="text-gray-700 mr-1" size={16} />
                    <span className="text-gray-700">{showCardList ? "リストを閉じる" : "リスト表示"}</span>
                  </button>
                </div>
              </MapControl>
            )}
            
            {/* 検索フォーム - 表示/非表示を切り替え */}
            {showSearchForm && (
              <MapControl position={ControlPosition.TOP_LEFT}>
                <div className="m-2 z-50">
                  <MapSearchForm 
                    initialValues={initialSearchParams}
                    onSubmit={handleSearchSubmit}
                    onClose={() => setShowSearchForm(false)}
                  />
                </div>
              </MapControl>
            )}
            
            {/* レストランカードリスト - 下部に表示 */}
            {showCardList && hasRestaurants && (
              <RestaurantCardList 
                restaurants={restaurants}
                selectedRestaurantId={selectedRestaurant?.id}
                onSelectRestaurant={handleSelectRestaurant}
                onClose={() => setShowCardList(false)}
              />
            )}
          </Map>
        </APIProvider>
      </div>
      
      <MapFooter 
        restaurantCount={hasRestaurants ? restaurants.length : 0} 
        onSearchClick={() => setShowSearchForm(!showSearchForm)}
        noResults={!hasRestaurants}
        onListClick={() => setShowCardList(!showCardList)}
        showListButton={hasRestaurants}
        isListVisible={showCardList}
      />
    </div>
  );
}