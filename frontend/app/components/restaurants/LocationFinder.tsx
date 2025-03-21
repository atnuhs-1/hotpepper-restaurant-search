import { FiMapPin } from "react-icons/fi";

type LocationFinderProps = {
  location: { lat: number | null; lng: number | null };
  isLoading: boolean;
  onGetLocation: () => void;
};

export default function LocationFinder({ location, isLoading, onGetLocation }: LocationFinderProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        <h2 className="text-lg font-semibold text-gray-800">
          現在地を取得
        </h2>
        <button
          onClick={onGetLocation}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all
                  flex items-center justify-center gap-2 shadow-sm"
          disabled={isLoading}
        >
          <FiMapPin className="inline-block" />
          {isLoading ? "取得中..." : "現在地を取得"}
        </button>
      </div>

      {location.lat && location.lng ? (
        <div className="p-2 bg-green-50 border border-green-100 rounded-md text-green-700">
          <p>
            緯度: {location.lat.toFixed(6)}, 経度:{" "}
            {location.lng.toFixed(6)}
          </p>
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          位置情報を取得するには、上のボタンをクリックしてください。
        </p>
      )}
    </div>
  );
}