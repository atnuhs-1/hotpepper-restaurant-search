const CenterMarker = () => (
    <div className="relative">
      {/* 外側の青い円 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-blue-500 bg-opacity-20 rounded-full"></div>
      {/* 内側の青い円 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 bg-opacity-30 rounded-full"></div>
      {/* 中心の濃い青の点 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full border-2 border-white shadow-md"></div>
    </div>
  );
  
  export default CenterMarker;