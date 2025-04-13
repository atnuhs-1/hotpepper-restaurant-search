import { RestaurantSearchParams, SearchResults } from "@/types/search";

/**
 * 地図表示用のレストランデータを取得する関数（全件取得）
 */
export async function fetchRestaurantsForMap(
  params: RestaurantSearchParams
): Promise<SearchResults> {
  // URLSearchParamsを使ってクエリパラメータを構築
  const searchParams = new URLSearchParams();

  // 必須パラメータのチェック
  if (!params.lat || !params.lng) {
    throw new Error("緯度(lat)と経度(lng)は必須パラメータです");
  }

  // 必須パラメータ
  searchParams.append("lat", params.lat);
  searchParams.append("lng", params.lng);

  // オプションパラメータを追加
  if (params.range) searchParams.append("range", params.range);
  if (params.keyword) searchParams.append("keyword", params.keyword);
  if (params.genre) searchParams.append("genre", params.genre);
  if (params.budget) searchParams.append("budget", params.budget);

  // API Route URLの構築
  const url = `/api/restaurants/search/map?${searchParams.toString()}`;

  try {
    // フェッチリクエスト
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`地図表示用データの取得に失敗しました: ${response.status}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("地図用レストラン検索エラー:", error);
    throw new Error("地図表示用データの取得中にエラーが発生しました");
  }
}