'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Restaurant } from '../../../types/restaurant';

export default function RestaurantDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 店舗詳細情報を取得
  useEffect(() => {
    async function fetchRestaurantDetail() {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/restaurants/detail?id=${id}`);
        
        if (!response.ok) {
          throw new Error('店舗情報の取得に失敗しました');
        }
        
        const data = await response.json();
        
        if (data.results?.shop && data.results.shop.length > 0) {
          setRestaurant(data.results.shop[0]);
        } else {
          setError('店舗情報が見つかりませんでした');
        }
      } catch (error) {
        console.error('詳細取得エラー:', error);
        setError('店舗情報の取得中にエラーが発生しました');
      } finally {
        setIsLoading(false);
      }
    }

    fetchRestaurantDetail();
  }, [id]);

  // 地図URLを生成
  const generateMapUrl = (lat?: number, lng?: number, name?: string) => {
    if (!lat || !lng) return '';
    const encodedName = encodeURIComponent(name || '');
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodedName}`;
  };

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">読み込み中...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !restaurant) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <p>{error || '店舗情報の取得に失敗しました'}</p>
          <Link href="/" className="text-blue-500 hover:underline mt-4 inline-block">
            ← 検索画面に戻る
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Link href="/" className="text-blue-500 hover:underline mb-6 inline-block">
        ← 検索画面に戻る
      </Link>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* ヘッダー画像 */}
        <div className="relative h-64 bg-gray-200">
          {restaurant.photo?.pc?.l ? (
            <img 
              src={restaurant.photo.pc.l}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <p className="text-gray-500">写真がありません</p>
            </div>
          )}
        </div>
        
        {/* 店舗基本情報 */}
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
          
          {restaurant.genre && (
            <p className="text-sm text-blue-600 mb-4">
              {restaurant.genre.name} {restaurant.genre.catch && `・${restaurant.genre.catch}`}
            </p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {/* 左カラム: 基本情報 */}
            <div>
              <h2 className="text-xl font-semibold border-b border-gray-200 pb-2 mb-4">基本情報</h2>
              
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">住所</dt>
                  <dd className="mt-1">{restaurant.address}</dd>
                  {restaurant.lat && restaurant.lng && (
                    <a 
                      href={generateMapUrl(restaurant.lat, restaurant.lng, restaurant.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline mt-1 inline-block"
                    >
                      Google マップで見る
                    </a>
                  )}
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">アクセス</dt>
                  <dd className="mt-1">{restaurant.access}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">営業時間</dt>
                  <dd className="mt-1 whitespace-pre-line">{restaurant.open}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">定休日</dt>
                  <dd className="mt-1">{restaurant.close || '記載なし'}</dd>
                </div>
                
                {restaurant.budget && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">予算</dt>
                    <dd className="mt-1">
                      {restaurant.budget.name}
                      {restaurant.budget.average && ` (平均: ${restaurant.budget.average})`}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
            
            {/* 右カラム: その他情報 */}
            <div>
              <h2 className="text-xl font-semibold border-b border-gray-200 pb-2 mb-4">店舗情報</h2>
              
              <div className="space-y-4">
                {/* クーポン情報 */}
                {restaurant.ktai_coupon === 1 && restaurant.coupon_urls && (
                  <div>
                    <h3 className="text-md font-medium text-gray-700">クーポン</h3>
                    <div className="mt-2">
                      <a 
                        href={restaurant.coupon_urls.pc} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                      >
                        クーポンを見る
                      </a>
                    </div>
                  </div>
                )}
                
                {/* 公式サイト */}
                {restaurant.urls && (
                  <div>
                    <h3 className="text-md font-medium text-gray-700">公式情報</h3>
                    <div className="mt-2">
                      <a 
                        href={restaurant.urls.pc} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                      >
                        ホットペッパーで詳細を見る
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}