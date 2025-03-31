// 適切なズームレベルを設定
export const getZoomLevelForRadius = (radiusInMeters: number) => {
    // 1kmあたりのズームレベルを設定（おおよその値）
    if (radiusInMeters <= 300) return 16;
    if (radiusInMeters <= 500) return 15;
    if (radiusInMeters <= 1000) return 15;
    if (radiusInMeters <= 2000) return 14;
    return 13; // 3km以上
  };