import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import RestaurantDetail from '@/features/restaurants/components/RestaurantDetail';
import BackButton from '@/features/restaurants/components/BackButton';
import { fetchRestaurantDetail } from '@/features/search/api';

interface RestaurantDetailPageProps {
  params: {
    id: string;
  };
  searchParams: Record<string, string | string[]>;
}

export default async function RestaurantDetailPage({ params }: RestaurantDetailPageProps) {
  const restaurant = await fetchRestaurantDetail(params.id);
  
  if (!restaurant) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <BackButton />
        </div>
        
        <Suspense fallback={
          <div className="bg-white rounded-lg shadow-lg p-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-80 bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-5/6"></div>
                <div className="h-6 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        }>
          <RestaurantDetail restaurant={restaurant} />
        </Suspense>
      </main>
    </div>
  );
}

// 動的メタデータの生成
export async function generateMetadata({ params }: RestaurantDetailPageProps) {
  const restaurant = await fetchRestaurantDetail(params.id);
  
  if (!restaurant) {
    return {
      title: '店舗が見つかりません',
      description: '指定された店舗情報は見つかりませんでした。',
    };
  }
  
  return {
    title: `${restaurant.name} | グルメ検索`,
    description: restaurant.catch || `${restaurant.name}の詳細情報です。`,
    openGraph: {
      title: restaurant.name,
      description: restaurant.catch || `${restaurant.name}の詳細情報です。`,
      images: [restaurant.photo.pc.l],
    },
  };
}