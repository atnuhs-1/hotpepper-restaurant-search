import { useState, useCallback, useRef, useEffect } from "react";
import { Restaurant, SearchResults } from "../types/restaurant";
import { useRouter, useSearchParams } from "next/navigation";

type Location = {
  lat: number | null;
  lng: number | null;
};

interface SearchParams {
  location: Location;
  initialRadius?: string;
  initialPage?: number;
  perPage?: number;
}

export function useRestaurantSearch({
  location,
  initialRadius = "3",
  initialPage = 1,
  perPage = 20,
}: SearchParams) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URLからページ番号を取得
  const pageFromUrl = searchParams.get("page")
    ? parseInt(searchParams.get("page") as string)
    : initialPage;

  const [radius, setRadius] = useState<string>(
    searchParams.get("radius") || initialRadius
  );
  const [genre, setGenre] = useState<string>(
    searchParams.get("genre") || ""
  );
  const [budget, setBudget] = useState<string>(
    searchParams.get("budget") || ""
  );
  const [keyword, setKeyword] = useState<string>(
    searchParams.get("keyword") || ""
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [resultsInfo, setResultsInfo] = useState<{
    available: number;
    returned: number;
    start: number;
  } | null>(null);

  // クエリパラメータを更新する関数
  const updateQueryParams = useCallback(
    (page: number, newRadius?: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());
      if (newRadius) params.set("radius", newRadius);

      // 新しいパラメータを追加
      if (genre) params.set("genre", genre);
      else params.delete("genre");
      
      if (budget) params.set("budget", budget);
      else params.delete("budget");
      
      if (keyword) params.set("keyword", keyword);
      else params.delete("keyword");

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, genre, budget, keyword]
  );

  // 検索を実行
  const searchRestaurants = useCallback(
    async (page: number = pageFromUrl, overrideLocation?: { lat: number; lng: number }) => {
      console.log("searchRestaurantsを実行")
      // 使用する位置情報（オーバーライドか現在の状態）
      const locationToUse = overrideLocation || location;

      if (!locationToUse.lat || !locationToUse.lng) {
        setError("位置情報を先に取得してください");
        return;
      }

      setIsLoading(true);
      setError(null);

      // URLのページ番号を更新
      updateQueryParams(page, radius);

      // 開始位置を計算
      const start = (page - 1) * perPage + 1;

      try {
        let apiUrl = `/api/restaurants/search?lat=${locationToUse.lat}&lng=${locationToUse.lng}&radius=${radius}&start=${start}&count=${perPage}`;
        
        if (genre) apiUrl += `&genre=${genre}`;
        if (budget) apiUrl += `&budget=${budget}`;
        if (keyword) apiUrl += `&keyword=${encodeURIComponent(keyword)}`;
        
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error("レストラン検索に失敗しました");
        }

        const data: SearchResults = await response.json();
        console.log("dataを取得 data: ", data.results.shop);
        setRestaurants(data.results.shop || []);
        setResultsInfo({
          available: data.results.results_available,
          returned: parseInt(data.results.results_returned),
          start: data.results.results_start,
        });
      } catch (error) {
        console.error("検索エラー:", error);
        setError("レストランの検索中にエラーが発生しました");
      } finally {
        setIsLoading(false);
      }
    },
    [
      location,
      radius,
      genre,
      budget,
      keyword,
      perPage,
      updateQueryParams,
      pageFromUrl,
    ]
  );

  // ページネーションの計算
  const totalPages = resultsInfo
    ? Math.ceil(resultsInfo.available / perPage)
    : 0;

  // ページネーションのコントロールに使用する配列の生成
  const getPageNumbers = useCallback(() => {
    const maxVisiblePages = 5;
    let startPage: number;
    let endPage: number;

    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const middleOffset = Math.floor(maxVisiblePages / 2);

      if (pageFromUrl <= middleOffset + 1) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (pageFromUrl >= totalPages - middleOffset) {
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        startPage = pageFromUrl - middleOffset;
        endPage = pageFromUrl + middleOffset;
      }
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  }, [totalPages, pageFromUrl]);

  // 検索範囲変更時のハンドラ
  const handleRadiusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newRadius = e.target.value;
      setRadius(newRadius);
    },
    []
  );

  const handleGenreChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setGenre(e.target.value);
    },
    []
  );

  const handleBudgetChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setBudget(e.target.value);
    },
    []
  );

  const handleKeywordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setKeyword(e.target.value);
    },
    []
  );

  // 検索フォームの送信ハンドラ
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      searchRestaurants(1); // 検索時は1ページ目から表示
    },
    [searchRestaurants]
  );

  // 初回マウント時のみ実行するためのフラグ
const initialRenderRef = useRef(true);

useEffect(() => {
  // 位置情報があり、URLにパラメータがある場合のみ検索を実行
  if (location.lat && location.lng && searchParams.toString()) {
    // 初回レンダリング時のみ実行
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      searchRestaurants(pageFromUrl);
    }
  }
}, [location.lat, location.lng, pageFromUrl, searchParams, searchRestaurants]);

  return {
    radius,
    genre,
    budget,
    keyword,
    isLoading,
    error,
    restaurants,
    resultsInfo,
    pageFromUrl,
    totalPages,
    getPageNumbers,
    handleRadiusChange,
    handleGenreChange,
    handleBudgetChange,
    handleKeywordChange,
    handleSubmit,
    searchRestaurants,
  };
}
