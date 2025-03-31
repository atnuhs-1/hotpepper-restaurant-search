"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Restaurant } from "@/types/search";
import { MapControl, ControlPosition } from "@vis.gl/react-google-maps";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";

interface RestaurantCardListProps {
  restaurants: Restaurant[];
  onSelectRestaurant?: (restaurant: Restaurant) => void;
  selectedRestaurantId?: string;
  onClose?: () => void;
}

export default function RestaurantCardList({
  restaurants,
  onSelectRestaurant,
  selectedRestaurantId,
  onClose,
}: RestaurantCardListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // 選択されたレストランのインデックスを特定
  const selectedIndex = restaurants.findIndex(r => r.id === selectedRestaurantId);

  // スクロール位置に基づいて矢印の表示/非表示を制御
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10); // 10pxの余裕を持たせる
  };

  // コンポーネントマウント時やrestaurantsが変更された時にスクロール状態をチェック
  useEffect(() => {
    checkScrollPosition();
    
    // リサイズイベントリスナーを追加
    const handleResize = () => {
      checkScrollPosition();
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [restaurants]);

  // 選択されたレストランが変更されたときにスクロール位置を調整
  useEffect(() => {
    if (selectedIndex >= 0 && scrollContainerRef.current) {
      const cardElement = scrollContainerRef.current.children[selectedIndex] as HTMLElement;
      if (cardElement) {
        const containerWidth = scrollContainerRef.current.clientWidth;
        const cardWidth = cardElement.offsetWidth;
        const scrollLeft = cardElement.offsetLeft - (containerWidth / 2) + (cardWidth / 2);
        
        scrollContainerRef.current.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [selectedIndex]);

  

  // スクロールハンドラー
  const handleScroll = () => {
    checkScrollPosition();
  };

  // 左右スクロールボタンのハンドラー
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  if (restaurants.length === 0) return null;

  return (
    <MapControl position={ControlPosition.BOTTOM_CENTER}>
      <div className="w-full max-w-screen-lg mx-auto relative mb-2">
        {/* 閉じるボタン */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute -top-6 right-4 bg-white rounded-full p-1 shadow-md z-10 hover:bg-gray-100"
            aria-label="カードリストを閉じる"
          >
            <FiX className="text-gray-700" size={16} />
          </button>
        )}

        {/* スクロール矢印 - 左 */}
        {showLeftArrow && (
          <button
            onClick={scrollLeft}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-md z-10 hover:bg-gray-100"
            aria-label="左にスクロール"
          >
            <FiChevronLeft className="text-gray-700" size={20} />
          </button>
        )}

        {/* スクロール矢印 - 右 */}
        {showRightArrow && (
          <button
            onClick={scrollRight}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-md z-10 hover:bg-gray-100"
            aria-label="右にスクロール"
          >
            <FiChevronRight className="text-gray-700" size={20} />
          </button>
        )}

        {/* レストランカードのスクロールコンテナ */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-2 pt-2 px-96 hide-scrollbar"
          onScroll={handleScroll}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className={`flex-shrink-0 w-[clamp(180px,80vw,224px)] md:w-56 bg-white rounded-lg shadow-md mx-2 overflow-hidden transition-transform 
                ${selectedRestaurantId === restaurant.id ? 'ring-2 ring-orange-600 scale-105' : 'hover:shadow-lg'}`}
              onClick={() => onSelectRestaurant && onSelectRestaurant(restaurant)}
            >
              {/* レストラン画像 */}
              <div className="relative w-full h-24">
                {restaurant.photo?.pc?.m ? (
                  <Image
                    src={restaurant.photo.pc.m}
                    alt={restaurant.name}
                    fill
                    sizes="256px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">画像なし</span>
                  </div>
                )}
              </div>

              {/* レストラン情報 */}
              <div className="p-2">
                <h3 className="font-medium text-gray-800 mb-0.5 text-sm line-clamp-1">{restaurant.name}</h3>
                
                <div className="flex flex-wrap gap-1 mb-1">
                  {restaurant.genre?.name && (
                    <span className="text-xs px-1.5 py-0.5 bg-orange-100 text-orange-800 rounded-full whitespace-nowrap">
                      {restaurant.genre.name}
                    </span>
                  )}
                  {restaurant.budget?.name && (
                    <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-full whitespace-nowrap">
                      {restaurant.budget.name}
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-gray-600 mb-1.5 line-clamp-1">
                  {restaurant.access || restaurant.address}
                </p>
                
                <Link
                  href={`/restaurants/${restaurant.id}`}
                  className="block text-center text-xs bg-orange-600 text-white py-1 px-2 rounded hover:bg-orange-700 transition-colors"
                >
                  詳細を見る
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MapControl>
  );
}