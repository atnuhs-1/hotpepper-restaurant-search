import { RestaurantSearchParams } from "@/types/search";
import { getGenreName } from "@/constants/genres";

// 検索範囲のマッピング
export const RANGE_LABELS: Record<string, string> = {
  "1": "300m圏内",
  "2": "500m圏内",
  "3": "1km圏内",
  "4": "2km圏内",
  "5": "3km圏内"
};

/**
 * 検索条件から検索概要文を生成する
 */
export function getSearchSummary(searchParams: RestaurantSearchParams): string {
  const parts: string[] = ["現在地周辺"];
  
  // 検索範囲
  if (searchParams.range && RANGE_LABELS[searchParams.range]) {
    parts[0] = `現在地から${RANGE_LABELS[searchParams.range]}`;
  }
  
  // ジャンル
  if (searchParams.genre) {
    const genreName = getGenreName(searchParams.genre);
    if (genreName && genreName !== "指定なし") {
      parts.push(genreName);
    }
  }
  
  // キーワード
  if (searchParams.keyword) {
    parts.push(`「${searchParams.keyword}」`);
  }
  
  return `${parts.join('の')}のレストランを表示しています`;
}