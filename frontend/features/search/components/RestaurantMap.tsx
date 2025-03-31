"use client";

import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { Circle } from "@/features/map/components/Circle";
import { useEffect, useState } from "react";
import { Restaurant } from "@/types/search";
import { MdRestaurant } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";
import { getZoomLevelForRadius } from "@/features/map/utils/map";

interface RestaurantMapProps {
  restaurants: Restaurant[];
  searchCenter?: { lat: number; lng: number };
  searchRadius?: number;
}

// カスタムマーカーコンポーネント - 中心点用 (GoogleMapの現在地スタイルに近いデザイン)
const CenterMarker = () => (
  <div className="relative">
    {/* 外側の青い円 */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-blue-500 bg-opacity-20 rounded-full"></div>
    {/* 内側の青い円 */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 bg-opacity-30 rounded-full"></div>
    {/* 中心の濃い青の点 */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full border-2 border-white shadow-md"></div>
  </div>
);

// カスタムマーカーコンポーネント - レストラン用
const RestaurantMarker = ({
  restaurant,
  isSelected,
}: {
  restaurant: Restaurant;
  isSelected: boolean;
}) => (
  <div
    className={`flex items-center justify-center w-8 h-8 
      ${isSelected ? "bg-orange-700 scale-125" : "bg-orange-500"} 
      rounded-full border-2 border-white shadow-md transition-all duration-200`}
    title={restaurant.name}
  >
    <MdRestaurant className="text-white text-sm" />
  </div>
);

// 内部コンポーネントでuseMapフックを使用
function MapContent({
  restaurants,
  center,
  radius,
}: {
  restaurants: Restaurant[];
  center: { lat: number; lng: number };
  radius: number;
}) {
  const map = useMap();
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  // centerが変更されたときにマップの中心を変更
  useEffect(() => {
    if (map) {
      map.panTo(center);
      
      map.setZoom(getZoomLevelForRadius(radius));
    }
  }, [map, center, radius]);

  return (
    <>
      {/* 検索範囲の円 */}
      <Circle
        center={center}
        radius={radius}
        fillColor={"#FB923C"}
        fillOpacity={0.1}
        strokeColor={"#EA580C"}
        strokeOpacity={0.8}
        strokeWeight={2}
      />

      {/* 中心点のマーカー */}
      <AdvancedMarker
        position={center}
        title="検索の中心点"
        zIndex={1000}
        clickable={false}
      >
        <CenterMarker />
      </AdvancedMarker>

      {/* レストランのマーカー */}
      {restaurants.map((restaurant) => {
        if (!restaurant.lat || !restaurant.lng) return null;

        const position = { lat: restaurant.lat, lng: restaurant.lng };

        return (
          <div key={restaurant.id}>
            <AdvancedMarker
              position={position}
              onClick={() => setSelectedRestaurant(restaurant)}
            >
              <RestaurantMarker
                restaurant={restaurant}
                isSelected={selectedRestaurant?.id === restaurant.id}
              />
            </AdvancedMarker>
          </div>
        );
      })}

      {/* 選択されたレストランの情報ウィンドウ */}
      {selectedRestaurant && selectedRestaurant.lat && selectedRestaurant.lng && (
        <InfoWindow
          position={{
            lat: selectedRestaurant.lat,
            lng: selectedRestaurant.lng,
          }}
          onCloseClick={() => setSelectedRestaurant(null)}
          pixelOffset={[0, -40]}
          disableAutoPan={false}
        >
          <div className="p-3 max-w-64 text-left">
            <div className="font-semibold text-gray-800 mb-1 text-base">
              {selectedRestaurant.name}
            </div>
            
            <div className="flex flex-wrap gap-1 mb-2">
              <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-800 rounded-full">
                {selectedRestaurant.genre?.name}
              </span>
              {selectedRestaurant.budget?.name && (
                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                  {selectedRestaurant.budget.name}
                </span>
              )}
            </div>
            
            {selectedRestaurant.photo?.pc?.m && (
              <div className="relative w-full h-24 mb-2 rounded overflow-hidden">
                <Image
                  src={selectedRestaurant.photo.pc.m}
                  alt={selectedRestaurant.name}
                  width={238}
                  height={238}
                  sizes="(max-width: 640px) 100vw, 300px"
                  className="rounded w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="text-xs text-gray-600 mb-2">
              <div className="flex items-start mb-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-500 mr-1 mt-0.5 shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{selectedRestaurant.access}</span>
              </div>
            </div>
            
            <Link
              href={`/restaurants/${selectedRestaurant.id}`}
              className="block text-center text-sm bg-orange-600 text-white py-1.5 px-3 rounded hover:bg-orange-700 transition-colors"
            >
              詳細を見る
            </Link>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

export default function RestaurantMap({
  restaurants,
  searchCenter,
  searchRadius,
}: RestaurantMapProps) {
  // 検索の中心位置を計算（未設定の場合は最初のレストランかデフォルト位置）
  const center = searchCenter || 
    (restaurants[0]?.lat && restaurants[0]?.lng 
      ? { lat: restaurants[0].lat, lng: restaurants[0].lng }
      : { lat: 35.681236, lng: 139.767125 }); // デフォルト: 東京駅
  
  // 検索範囲の半径（未設定の場合はデフォルト値）
  const radius = searchRadius || 1000; // デフォルト: 1000m (1km)
  
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;
  const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID as string;

  if (!API_KEY) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="py-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-700 mt-4">
            Google Maps APIキーが設定されていません
          </h2>
          <p className="text-gray-600 mt-2">
            地図を表示するにはAPIキーの設定が必要です
          </p>
        </div>
      </div>
    );
  }

  // レストランがない場合
  if (!restaurants || restaurants.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="py-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400"
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
          <h2 className="text-xl font-semibold text-gray-700 mt-4">
            表示できるレストランがありません
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="h-[calc(100vh-16rem)] min-h-[500px]">
        <APIProvider apiKey={API_KEY}>
          <Map
            mapId={MAP_ID}
            defaultZoom={getZoomLevelForRadius(radius)}
            defaultCenter={center}
            gestureHandling={"cooperative"}
            disableDefaultUI={false}
            mapTypeControl={false}
            fullscreenControl={true}
            streetViewControl={false}
          >
            <MapContent
              center={center}
              radius={radius}
              restaurants={restaurants}
            />
          </Map>
        </APIProvider>
      </div>
      
      <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{restaurants.length}件</span>のレストランを地図上に表示しています
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-600 rounded-full border border-white mr-1"></div>
            <span className="text-xs text-gray-600">検索中心</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-orange-500 rounded-full border border-white mr-1"></div>
            <span className="text-xs text-gray-600">レストラン</span>
          </div>
        </div>
      </div>
    </div>
  );
}