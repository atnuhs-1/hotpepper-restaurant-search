'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Restaurant } from '../../../types/restaurant';
import { FiMapPin, FiClock, FiCalendar, FiDollarSign, FiArrowLeft, FiExternalLink } from 'react-icons/fi';

export default function RestaurantDetailPage() {
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
      <div className="bg-gray-50 min-h-screen w-full">
        <main className="container mx-auto px-4 py-8">
          <div className="my-6 p-4 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mr-3"></div>
            <p className="text-gray-700">読み込み中...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="bg-gray-50 min-h-screen w-full">
        <main className="container mx-auto px-4 py-8">
          <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-md text-red-600">
            <p>{error || '店舗情報の取得に失敗しました'}</p>
            <Link href="/" className="flex items-center mt-4 text-indigo-600 hover:text-indigo-800 transition-colors">
              <FiArrowLeft className="mr-1" /> 検索画面に戻る
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <main className="container mx-auto px-4 py-8">
        <Link 
          href="/" 
          className="inline-flex items-center px-4 py-2 bg-white rounded-md text-indigo-600 hover:bg-indigo-50 transition-colors shadow-sm border border-gray-100 mb-6"
        >
          <FiArrowLeft className="mr-2" /> 検索画面に戻る
        </Link>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          {/* ヘッダー画像 */}
          <div className="relative h-64 sm:h-80 bg-gray-200">
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
            
            {/* ジャンルタグ - 検索結果カードと同様のスタイル */}
            {restaurant.genre?.name && (
              <span className="absolute top-4 right-4 bg-black bg-opacity-70 text-white text-xs px-3 py-1.5 rounded-md">
                {restaurant.genre.name}
              </span>
            )}
          </div>
          
          {/* 店舗基本情報 */}
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">{restaurant.name}</h1>
            
            {restaurant.genre && (
              <p className="text-sm text-indigo-600 mb-6">
                {restaurant.genre.name} {restaurant.genre.catch && `・${restaurant.genre.catch}`}
              </p>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {/* 左カラム: 基本情報 */}
              <div>
                <h2 className="text-xl font-semibold border-b border-gray-200 pb-2 mb-6 text-gray-800">基本情報</h2>
                
                <dl className="space-y-6">
                  <div className="flex">
                    <div className="flex-shrink-0 w-8 text-gray-400">
                      <FiMapPin size={20} />
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 mb-1">住所</dt>
                      <dd className="text-gray-800">{restaurant.address}</dd>
                      {restaurant.lat && restaurant.lng && (
                        <a 
                          href={generateMapUrl(restaurant.lat, restaurant.lng, restaurant.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm inline-flex items-center text-indigo-600 hover:text-indigo-800 mt-2 transition-colors"
                        >
                          Google マップで見る <FiExternalLink className="ml-1" />
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 w-8 text-gray-400">
                      <FiMapPin size={20} />
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 mb-1">アクセス</dt>
                      <dd className="text-gray-800">{restaurant.access}</dd>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 w-8 text-gray-400">
                      <FiClock size={20} />
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 mb-1">営業時間</dt>
                      <dd className="text-gray-800 whitespace-pre-line">{restaurant.open}</dd>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 w-8 text-gray-400">
                      <FiCalendar size={20} />
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 mb-1">定休日</dt>
                      <dd className="text-gray-800">{restaurant.close || '記載なし'}</dd>
                    </div>
                  </div>
                  
                  {restaurant.budget && (
                    <div className="flex">
                      <div className="flex-shrink-0 w-8 text-gray-400">
                        <FiDollarSign size={20} />
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500 mb-1">予算</dt>
                        <dd className="text-gray-800">
                          {restaurant.budget.name}
                          {restaurant.budget.average && ` (平均: ${restaurant.budget.average})`}
                        </dd>
                      </div>
                    </div>
                  )}
                </dl>
              </div>
              
              {/* 右カラム: その他情報 */}
              <div>
                <h2 className="text-xl font-semibold border-b border-gray-200 pb-2 mb-6 text-gray-800">店舗情報</h2>
                
                <div className="space-y-6">
                  {/* クーポン情報 */}
                  {restaurant.ktai_coupon === 1 && restaurant.coupon_urls && (
                    <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                      <h3 className="text-md font-medium text-gray-800 mb-3">クーポン</h3>
                      <p className="text-sm text-gray-600 mb-3">このお店ではクーポンが利用できます。</p>
                      <a 
                        href={restaurant.coupon_urls.pc} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                      >
                        クーポンを見る <FiExternalLink className="ml-2" />
                      </a>
                    </div>
                  )}
                  
                  {/* 公式サイト */}
                  {restaurant.urls && (
                    <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                      <h3 className="text-md font-medium text-gray-800 mb-3">公式情報</h3>
                      <p className="text-sm text-gray-600 mb-3">ホットペッパーグルメで詳細な情報や予約状況を確認できます。</p>
                      <a 
                        href={restaurant.urls.pc} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                      >
                        ホットペッパーで詳細を見る <FiExternalLink className="ml-2" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}