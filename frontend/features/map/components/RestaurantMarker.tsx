import { MdRestaurant } from "react-icons/md";
import { Restaurant } from "@/types/search";

interface RestaurantMarkerProps {
  restaurant: Restaurant;
  isSelected: boolean;
}

const RestaurantMarker = ({ restaurant, isSelected }: RestaurantMarkerProps) => (
  <div
    className={`flex items-center justify-center w-8 h-8 
      ${isSelected ? "bg-orange-700 scale-125" : "bg-orange-500"} 
      rounded-full border-2 border-white shadow-md transition-all duration-200`}
    title={restaurant.name}
  >
    <MdRestaurant className="text-white text-sm" />
  </div>
);

export default RestaurantMarker;