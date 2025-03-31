import Image from 'next/image';
import Link from 'next/link';
import { Restaurant } from '@/types/search';

interface RestaurantListProps {
  restaurants: Restaurant[];
}

export default function RestaurantList({ restaurants }: RestaurantListProps) {
  return (
    <div className="grid grid-cols-1 gap-6">
      {restaurants.map((restaurant) => (
        <Link
          href={`/restaurants/${restaurant.id}`}
          key={restaurant.id}
          className="block bg-white rounded-lg border border-gray-200 hover:shadow-md transition overflow-hidden"
        >
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/4 p-4">
              <div className="relative h-48 md:h-full min-h-[160px] rounded-lg overflow-hidden bg-gray-200">
                <Image
                  src={restaurant.photo.pc.l || "/images/no-image.png"}
                  alt={restaurant.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="md:w-3/4 p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                {restaurant.name}
              </h2>

              <div className="flex flex-wrap gap-2 mb-2">
                <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                  {restaurant.genre.name}
                </span>
                {restaurant.budget?.name && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {restaurant.budget.name}
                  </span>
                )}
              </div>

              <p className="text-gray-600 mb-2">
                {restaurant.catch}
              </p>

              <div className="flex items-start mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500 mr-1 mt-0.5 shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-600">
                  {restaurant.access}
                </span>
              </div>

              <div className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500 mr-1 mt-0.5 shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-600">
                  {restaurant.open}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}