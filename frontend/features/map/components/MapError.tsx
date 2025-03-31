const MapError = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 text-center">
      <div className="py-12">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mx-auto text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h2 className="text-xl font-semibold text-gray-700 mt-4">
          Google Maps APIキーが設定されていません
        </h2>
        <p className="text-gray-600 mt-2">
          地図を表示するにはAPIキーの設定が必要です
        </p>
      </div>
    </div>
  );
  
  export default MapError;