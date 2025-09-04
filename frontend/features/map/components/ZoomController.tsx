import { useMap } from "@vis.gl/react-google-maps";
import { useEffect, useRef } from "react";
import { Restaurant } from "@/types/search";

interface ZoomControllerProps {
  restaurants: Restaurant[];
  searchCenter: { lat: number; lng: number };
  searchRadius: number;
  searchConditionChanged: boolean;
}

export function ZoomController({
  restaurants,
  searchCenter,
  searchRadius,
  searchConditionChanged,
}: ZoomControllerProps) {
  const map = useMap();
  const isInitialMountRef = useRef(true);
  const prevSearchRadiusRef = useRef(searchRadius);
  const prevRestaurantsLengthRef = useRef(restaurants.length);

  // マップの境界を設定する関数
  const setBounds = () => {
    if (!map) return;
    
    console.log("境界を設定します:", 
      isInitialMountRef.current ? "初期マウント時" : "更新時", 
      "レストラン数:", restaurants.length
    );

    // レストランのマーカーがある場合
    if (restaurants.length > 0) {
      // LatLngBounds オブジェクトを作成
      const bounds = new google.maps.LatLngBounds();
      
      // デモ用の固定ポイント - 実際のアプリでは削除し、下記のコメントを解除してください
      // bounds.extend({ lat: 34.648854, lng: 135.577447 }); 
      // bounds.extend({ lat: 34.654149, lng: 135.589297 });
      
      // 検索中心を必ず含める
      bounds.extend({ lat: searchCenter.lat, lng: searchCenter.lng });
      
      // 各レストランの位置を境界に追加
      restaurants.forEach(restaurant => {
        if (restaurant.lat && restaurant.lng) {
          bounds.extend({ lat: restaurant.lat, lng: restaurant.lng });
        }
      });
      
      if (bounds) {
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();
        
        console.log('境界設定前 - 南西の角:', sw.lat(), sw.lng());
        console.log('境界設定前 - 北東の角:', ne.lat(), ne.lng());
      }
      
      // 境界に余白を追加するためのパディング（ピクセル単位）
      const padding = { top: 50, right: 50, bottom: 50, left: 50 };
      
      // 地図をフィットさせる
      console.log("fitBoundsを実行します");
      map.fitBounds(bounds, padding);

      // 適用後の境界を確認（少し遅延させて確実に適用後の状態を取得）
      setTimeout(() => {
        const currentBounds = map.getBounds();
        if (currentBounds) {
          const csw = currentBounds.getSouthWest();
          const cne = currentBounds.getNorthEast();
          console.log('境界設定後 - 南西の角:', csw.lat(), csw.lng());
          console.log('境界設定後 - 北東の角:', cne.lat(), cne.lng());
        }
      }, 300);
      
      // 極端にズームしすぎないようにする（最大ズームレベルを制限）
      setTimeout(() => {
        const currentZoom = map.getZoom();
        if (currentZoom !== undefined && currentZoom > 18) {
          map.setZoom(18);
        }
      }, 400);
    } else {
      // レストランがない場合は検索半径に基づいてズームを設定
      const circleDistanceToEdge = searchRadius;
      const bounds = new google.maps.LatLngBounds();
      
      // 検索円の範囲を表す境界を作成
      bounds.extend({
        lat: searchCenter.lat + circleDistanceToEdge / 111320, // 1度あたり約111.32km
        lng: searchCenter.lng
      });
      bounds.extend({
        lat: searchCenter.lat - circleDistanceToEdge / 111320,
        lng: searchCenter.lng
      });
      bounds.extend({
        lat: searchCenter.lat,
        lng: searchCenter.lng + circleDistanceToEdge / (111320 * Math.cos(searchCenter.lat * (Math.PI / 180)))
      });
      bounds.extend({
        lat: searchCenter.lat,
        lng: searchCenter.lng - circleDistanceToEdge / (111320 * Math.cos(searchCenter.lat * (Math.PI / 180)))
      });
      
      // 地図をフィットさせる
      map.fitBounds(bounds);
    }
  };

  // マップが利用可能になったらすぐに一度実行するためのエフェクト
  useEffect(() => {
    if (map) {
      console.log("マップが初期化されました");
      // マウント時に一度だけ実行
      setBounds();
      isInitialMountRef.current = false;
    }
  }, [map]); // mapだけに依存

  // 検索条件が変更された時のエフェクト
  useEffect(() => {
    // 初回マウント時はスキップ（上のuseEffectで処理済み）
    if (isInitialMountRef.current) return;
    
    // マップが利用可能で、検索条件が変更された場合または
    // レストラン数が変わった場合に表示範囲を調整
    if (map && (searchConditionChanged || prevRestaurantsLengthRef.current !== restaurants.length)) {
      console.log("検索条件が変更されたため境界を更新します");
      setBounds();
      
      // 現在の状態を記録
      prevSearchRadiusRef.current = searchRadius;
      prevRestaurantsLengthRef.current = restaurants.length;
    }
  }, [map, restaurants, searchCenter, searchRadius, searchConditionChanged]);

  return null; // UIを持たないコンポーネント
}