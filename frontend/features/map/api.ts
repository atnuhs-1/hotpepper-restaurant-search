import { RestaurantSearchParams, SearchResults } from "@/types/search";

/**
 * クライアントコンポーネントからレストランデータを取得するための関数
 * ブラウザ環境で実行され、内部的にはNext.jsのAPI Routeを呼び出す
 */
export async function fetchRestaurants(
  params: RestaurantSearchParams,
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
  if (params.page) {
    // pageからstartを計算
    const start = ((parseInt(params.page) - 1) * 20 + 1).toString();
    searchParams.append("start", start);
  } else if (params.count) {
    // startが直接指定されている場合
    searchParams.append("start", "1");
  }
  if (params.count) searchParams.append("count", params.count);

  // API Route URLの構築
  const url = `/api/restaurants/search?${searchParams.toString()}`;

  try {
    // フェッチリクエスト
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`検索リクエストに失敗しました: ${response.status}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("レストラン検索エラー:", error);
    throw new Error("レストランデータの取得中にエラーが発生しました");
  }
}

/**
 * レストラン詳細情報を取得する関数
 */
export async function fetchRestaurantDetail(id: string): Promise<any> {
  if (!id) {
    throw new Error("レストランIDが必要です");
  }

  try {
    const response = await fetch(`/api/restaurants/detail?id=${id}`);

    if (!response.ok) {
      throw new Error(`詳細情報の取得に失敗しました: ${response.status}`);
    }

    const data = await response.json();
    return data.results.shop?.[0] || null;
  } catch (error) {
    console.error("レストラン詳細取得エラー:", error);
    throw new Error("レストラン詳細の取得中にエラーが発生しました");
  }
}
