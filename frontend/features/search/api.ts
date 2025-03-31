import { RestaurantSearchParams, SearchResults } from "@/types/search";

export async function fetchRestaurants(params: RestaurantSearchParams): Promise<SearchResults> {
    // デフォルト値の設定
    const {
      lat,
      lng,
      range = '3',
      keyword = '',
      genre = '',
      budget = '',
      page = '1',
      count = '20'
    } = params;
  
    // 必須パラメータのチェック
    if (!lat || !lng) {
      // APIに必要な情報がない場合は空の結果を返す
      return {
        results_available: 0,
        results_returned: 0,
        results_start: 1,
        shop: []
      };
    }
  
    // サーバーサイドでAPIリクエストを構築
    const apiKey = process.env.HOTPEPPER_API_KEY;
    if (!apiKey) {
      throw new Error('HOTPEPPER_API_KEY is not set in environment variables');
    }

    // APIリクエスト用にstartを計算
  const start = ((parseInt(page) - 1) * parseInt(count) + 1).toString();
  
    // APIパラメータの構築
    const searchParams = new URLSearchParams({
      key: apiKey,
      lat: lat.toString(),
      lng: lng.toString(),
      range: range.toString(),
      start: start.toString(),
      count: count.toString(),
      format: 'json',
    });
  
    // オプションパラメータの追加
    if (keyword) searchParams.append('keyword', keyword);
    if (genre) searchParams.append('genre', genre);
    if (budget) searchParams.append('budget', budget);
  
    // リクエスト
    const url = `https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?${searchParams.toString()}`;
    
    // キャッシュ設定（本番では適切に調整）
    const res = await fetch(url, {
      next: { revalidate: 60 } // 60秒間キャッシュ
    });
  
    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status}`);
    }
  
    const data = await res.json();
    return data.results;
  }

  // レストラン詳細情報を取得する関数
  export async function fetchRestaurantDetail(id: string) {
    const apiKey = process.env.HOTPEPPER_API_KEY;
    if (!apiKey) {
      throw new Error('HOTPEPPER_API_KEY is not set in environment variables');
    }
    
    const url = `https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=${apiKey}&id=${id}&format=json`;
    
    const res = await fetch(url, {
      next: { revalidate: 3600 } // 1時間キャッシュ
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch restaurant detail: ${res.status}`);
    }
    
    const data = await res.json();
    const shop = data.results.shop?.[0] || null;
    
    if (!shop) {
      return null;
    }
    
    return shop;
  }