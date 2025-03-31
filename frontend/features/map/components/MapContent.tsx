"use client";

import {
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

interface MapContentProps {
  center: { lat: number; lng: number };
  radius: number;
  restaurants: Restaurant[];
  selectedRestaurantId?: string;
  onMarkerClick?: (restaurant: Restaurant) => void;
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

export default function MapContent({
  center,
  radius,
  restaurants,
  selectedRestaurantId,
  onMarkerClick,
}: MapContentProps) {
  const map = useMap();
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  // selectedRestaurantIdが変更されたときに対応するレストランを選択
  useEffect(() => {
    if (selectedRestaurantId) {
      const restaurant = restaurants.find(r => r.id === selectedRestaurantId);
      if (restaurant) {
        setSelectedRestaurant(restaurant);
        // 選択されたレストランの位置にパン
        if (map && restaurant.lat && restaurant.lng) {
          map.panTo({ lat: restaurant.lat, lng: restaurant.lng });
        }
      }
    } else {
      setSelectedRestaurant(null);
    }
  }, [selectedRestaurantId, restaurants, map]);

  // centerが変更されたときにマップの中心を変更
  useEffect(() => {
    if (map) {
      map.panTo(center);
    }
  }, [map, center]);

  // レストランマーカーがクリックされたときの処理
  const handleMarkerClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    if (onMarkerClick) {
      onMarkerClick(restaurant);
    }
  };

  // 情報ウィンドウが閉じられたときの処理
  const handleInfoWindowClose = () => {
    setSelectedRestaurant(null);
    if (onMarkerClick) {
      onMarkerClick(null as unknown as Restaurant); // nullを渡して選択解除
    }
  };

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
        const isSelected = selectedRestaurant?.id === restaurant.id;

        return (
          <div key={restaurant.id}>
            <AdvancedMarker
              position={position}
              onClick={() => handleMarkerClick(restaurant)}
              zIndex={isSelected ? 1001 : 1}
            >
              <RestaurantMarker
                restaurant={restaurant}
                isSelected={isSelected}
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
          onCloseClick={handleInfoWindowClose}
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