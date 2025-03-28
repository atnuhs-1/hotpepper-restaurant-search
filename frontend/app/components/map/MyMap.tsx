"use client";

import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { Circle } from "./Circle";
import { useEffect, useState } from "react";
import { Restaurant } from "@/app/types/restaurant";
import { FiHome } from "react-icons/fi";
import { MdRestaurant } from "react-icons/md";
import Image from "next/image";

// 円の描画のためのプロパティ
interface CircleProps {
  center: { lat: number; lng: number };
  radius: number; // メートル単位
  restaurants?: Restaurant[]; // レストランデータを追加
}

// カスタムマーカーコンポーネント - 中心点用
const CenterMarker = () => (
  <div className="flex items-center justify-center w-8 h-8 bg-red-500 bg-opacity-70 rounded-full border-2 border-white shadow-md">
    <FiHome className="text-white text-lg" />
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
      ${isSelected ? "bg-indigo-600 scale-125" : "bg-blue-500"} 
      rounded-full border-2 border-white shadow-md transition-all duration-200`}
    title={restaurant.name}
  >
    <MdRestaurant className="text-white text-sm" />
  </div>
);

// 内部コンポーネントでuseMapフックを使用
function MapContent({ center, radius, restaurants = [] }: CircleProps) {
  const map = useMap();
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);

  // centerが変更されたときにマップの中心を変更
  useEffect(() => {
    if (map) {
      map.panTo(center);
    }
  }, [map, center]);

  return (
    <>
      <Circle
        center={center}
        radius={radius}
        fillColor={"#3B82F6"}
        fillOpacity={0.2}
        strokeColor={"#2563EB"}
        strokeOpacity={0.8}
        strokeWeight={2}
      />

      {/* 中心点のマーカー - カスタムスタイル */}
      <AdvancedMarker
        position={center}
        title="現在地/中心点"
        zIndex={1000}
        clickable={false}
      >
        <CenterMarker />
      </AdvancedMarker>

      {/* レストランのマーカー - カスタムスタイル */}
      {restaurants.map((restaurant) => {
        // lat, lngが存在する場合のみマーカーを表示
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

      {/* 標準のInfoWindowを使用 */}
      {selectedRestaurant &&
        selectedRestaurant.lat &&
        selectedRestaurant.lng && (
          <InfoWindow
            position={{
              lat: selectedRestaurant.lat,
              lng: selectedRestaurant.lng,
            }}
            onCloseClick={() => setSelectedRestaurant(null)}
            pixelOffset={[0, -40]} // 上方向に40ピクセルオフセット
            disableAutoPan={false}
          >
            <div className="p-2 max-w-64">
              <div className="font-semibold text-gray-800 mb-1">
                {selectedRestaurant.name}
              </div>
              <div className="text-xs text-gray-600 mb-2">
                {selectedRestaurant.genre?.name}
              </div>
              {selectedRestaurant.photo?.pc?.m && (
                <div className="relative w-full h-24 mb-2 rounded overflow-hidden">
                  <Image
                    src={selectedRestaurant.photo.pc.m}
                    alt={selectedRestaurant.name}
                    width={238}
                    height={238}
                    sizes="(max-width: 640px) 100vwm 300px"
                    className="rounded w-full h-full object-cover"
                  />
                </div>
              )}
              <a
                href={`/restaurants/${selectedRestaurant.id}`}
                className="text-xs text-center block bg-indigo-600 text-white py-1 px-2 rounded hover:bg-indigo-700 transition-colors"
              >
                詳細を見る
              </a>
            </div>
          </InfoWindow>
        )}
    </>
  );
}

export default function MyMap({
  center = { lat: 35.681236, lng: 139.767125 }, // デフォルト: 東京駅
  radius = 1000, // デフォルト: 1000m (1km)
  restaurants = [], // デフォルト: 空配列
}: Partial<CircleProps>) {
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;
  const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID as string;

  if (!API_KEY) {
    console.warn("Google Maps API キーが設定されていません。");

    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-700">
        Google Maps API キーが設定されていません
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <APIProvider apiKey={API_KEY}>
        <Map
          mapId={MAP_ID}
          defaultZoom={15} // 円がよく見えるようにズームレベルを調整
          defaultCenter={center}
          gestureHandling={"cooperative"}
          disableDefaultUI={true}
        >
          <MapContent
            center={center}
            radius={radius}
            restaurants={restaurants}
          />
        </Map>
      </APIProvider>
    </div>
  );
}
