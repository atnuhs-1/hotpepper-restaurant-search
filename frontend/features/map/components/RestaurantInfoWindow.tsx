import Link from "next/link";
import Image from "next/image";
import { Restaurant } from "@/types/search";

interface RestaurantInfoWindowProps {
  restaurant: Restaurant;
}

const RestaurantInfoWindow = ({ restaurant }: RestaurantInfoWindowProps) => (
  <div className="p-3 max-w-64 text-left">
    <div className="font-semibold text-gray-800 mb-1 text-base">
      {restaurant.name}
    </div>

    <div className="flex flex-wrap gap-1 mb-2">
      <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-800 rounded-full">
        {restaurant.genre?.name}
      </span>
      {restaurant.budget?.name && (
        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
          {restaurant.budget.name}
        </span>
      )}
    </div>

    {restaurant.photo?.pc?.m && (
      <div className="relative w-full h-24 mb-2 rounded overflow-hidden">
        <Image
          src={restaurant.photo.pc.m}
          alt={restaurant.name}
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
        <span>{restaurant.access}</span>
      </div>
    </div>

    <Link
      href={`/restaurants/${restaurant.id}`}
      className="block text-center text-sm bg-orange-600 text-white py-1.5 px-3 rounded hover:bg-orange-700 transition-colors"
    >
      詳細を見る
    </Link>
  </div>
);

export default RestaurantInfoWindow;
