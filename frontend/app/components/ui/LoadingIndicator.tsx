export default function LoadingIndicator() {
    return (
      <div className="my-6 p-4 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-600 mr-3"></div>
        <p className="text-gray-700">読み込み中...</p>
      </div>
    );
  }