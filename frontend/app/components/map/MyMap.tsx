"use client";

import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";
import { Circle } from "./Circle";
import { useEffect } from "react";

// 円の描画のためのプロパティ
interface CircleProps {
  center: { lat: number; lng: number };
  radius: number; // メートル単位
}

// 内部コンポーネントでuseMapフックを使用
function MapContent({ center, radius }: CircleProps) {
  const map = useMap();
  
  // centerが変更されたときにマップの中心を変更
  useEffect(() => {
    if (map) {
      map.panTo(center);
    }
  }, [map, center]);
  
  return (
    <Circle
      center={center}
      radius={radius}
      fillColor={"#3B82F6"}
      fillOpacity={0.2}
      strokeColor={"#2563EB"}
      strokeOpacity={0.8}
      strokeWeight={2}
    />
  );
}

export default function MyMap({
  center = { lat: 35.681236, lng: 139.767125 }, // デフォルト: 東京駅
  radius = 1000, // デフォルト: 1000m (1km)
}: Partial<CircleProps>) {
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

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
          defaultZoom={15} // 円がよく見えるようにズームレベルを調整
          defaultCenter={center}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
        >
          <MapContent center={center} radius={radius}/>
        </Map>
      </APIProvider>
    </div>
  );
}
