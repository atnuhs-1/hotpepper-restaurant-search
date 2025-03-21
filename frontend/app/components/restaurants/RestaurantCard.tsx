import Link from "next/link";
import { FiMapPin, FiTag, FiChevronRight } from "react-icons/fi";
import { Restaurant } from "../../types/restaurant";

type RestaurantCardProps = {
  restaurant: Restaurant;
};

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col"
    >
      {/* 画像部分 */}
      <div className="relative h-36 bg-gray-200">
        {restaurant.photo?.pc?.m && (
          <img
            src={restaurant.photo.pc.m}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        )}
        {/* ジャンルタグ */}
        {restaurant.genre?.name && (
          <span className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-md">
            {restaurant.genre.name}
          </span>
        )}
      </div>

      {/* コンテンツ部分 */}
      <div className="p-3 flex-grow">
        <h3
          className="font-semibold text-base text-black mb-1 truncate"
          title={restaurant.name}
        >
          {restaurant.name}
        </h3>

        <div className="text-xs text-gray-600 mb-3">
          <div className="flex items-start gap-1 mb-1">
            <FiMapPin className="mt-0.5 min-w-4 text-gray-400" />
            <span className="truncate" title={restaurant.access}>
              {restaurant.access}
            </span>
          </div>
          {restaurant.budget?.name && (
            <div className="flex items-start gap-1">
              <FiTag className="mt-0.5 min-w-4 text-gray-400" />
              <span className="truncate">
                {restaurant.budget.name}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* フッター部分 */}
      <div className="px-3 pb-3 mt-auto">
        <Link href={`/restaurants/${restaurant.id}`}>
          <span className="block w-full text-center px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 transition-colors text-sm font-medium flex items-center justify-center gap-1">
            詳細を見る
            <FiChevronRight />
          </span>
        </Link>
      </div>
    </div>
  );
}