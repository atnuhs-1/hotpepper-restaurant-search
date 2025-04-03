import { useMap } from "@vis.gl/react-google-maps";
import { useEffect, useRef } from "react";
import { getZoomLevelForRadius } from "../utils/map";


// ズームコントローラーコンポーネント
export function ZoomController({ searchRadius, searchConditionChanged }: { searchRadius: number; searchConditionChanged: boolean }) {
  const map = useMap();
  const prevSearchRadiusRef = useRef(searchRadius);
  
  useEffect(() => {
    // マップが利用可能かつ検索条件が変更された場合のみズームを更新
    if (map && searchConditionChanged) {
      if (prevSearchRadiusRef.current !== searchRadius) {
        const newZoom = getZoomLevelForRadius(searchRadius || 1000);
        map.setZoom(newZoom);
        prevSearchRadiusRef.current = searchRadius;
        
        // デバッグ用
        console.log(`検索半径が変更されました: ${searchRadius}m, 新しいズームレベル: ${newZoom}`);
      }
    }
  }, [map, searchRadius, searchConditionChanged]);
  
  return null; // UIを持たないコンポーネント
}