import Image from 'next/image';
import { Restaurant } from '@/types/search';

interface RestaurantDetailProps {
  restaurant: Restaurant;
}

export default function RestaurantDetail({ restaurant }: RestaurantDetailProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* ヘッダー情報 */}
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{restaurant.name}</h1>
        {restaurant.catch && (
          <p className="text-lg text-gray-600 mb-4">{restaurant.catch}</p>
        )}
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
            {restaurant.genre.name}
          </span>
          {restaurant.budget && restaurant.budget.name && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              予算: {restaurant.budget.name}
            </span>
          )}
        </div>
      </div>
      
      {/* 画像とメイン情報 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* 左側: 画像 */}
        <div>
          <div className="relative h-80 rounded-lg overflow-hidden">
            <Image
              src={restaurant.photo.pc.l || '/images/no-image.png'}
              alt={restaurant.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
        
        {/* 右側: 基本情報 */}
        <div className="space-y-4">
          <InfoItem 
            label="住所" 
            value={restaurant.address} 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-1 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            } 
          />
          
          <InfoItem 
            label="アクセス" 
            value={restaurant.access} 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-1 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            }
          />
          
          <InfoItem 
            label="営業時間" 
            value={restaurant.open} 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-1 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            }
          />
          
          <InfoItem 
            label="定休日" 
            value={restaurant.close || '記載なし'} 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-1 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            }
          />
          
          {restaurant.budget && restaurant.budget.average && (
            <InfoItem 
              label="平均予算" 
              value={restaurant.budget.average} 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-1 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
              }
            />
          )}
          
          {/* 公式サイトへのリンク */}
          {restaurant.urls && restaurant.urls.pc && (
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-1 mt-1 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium text-gray-700 mb-1">公式サイト</p>
                <a
                  href={restaurant.urls.pc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {restaurant.urls.pc}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 店舗の地図 */}
      <div className="p-6 border-t">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">店舗の場所</h2>
        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
          <iframe
            title={`${restaurant.name}の地図`}
            width="100%"
            height="400"
            frameBorder="0"
            src={`https://maps.google.com/maps?q=${restaurant.lat},${restaurant.lng}&z=16&output=embed`}
            allowFullScreen
          />
        </div>
        
        {/* 地図アプリで開くボタン */}
        <div className="mt-4 flex justify-center">
          <a
            href={`https://maps.google.com/maps?q=${restaurant.lat},${restaurant.lng}&z=16`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Google マップで開く
          </a>
        </div>
      </div>
      
      {/* ホットペッパーのクレジット表示 */}
      <div className="p-4 bg-gray-50 text-center text-gray-500 text-sm">
        <p>
          Powered by{' '}
          <a
            href="https://webservice.recruit.co.jp/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 hover:underline"
          >
            ホットペッパー Webサービス
          </a>
        </p>
      </div>
    </div>
  );
}

// 情報項目コンポーネント
interface InfoItemProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

function InfoItem({ label, value, icon }: InfoItemProps) {
  return (
    <div className="flex items-start">
      {icon}
      <div>
        <p className="font-medium text-gray-700 mb-1">{label}</p>
        <p className="text-gray-600 whitespace-pre-line">{value}</p>
      </div>
    </div>
  );
}