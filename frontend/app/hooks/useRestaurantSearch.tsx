import { useState, useCallback, useEffect } from "react";
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
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  // 検索を実行
  const searchRestaurants = useCallback(
    async (page: number = pageFromUrl) => {
      if (!location.lat || !location.lng) {
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
        const response = await fetch(
          `/api/restaurants/search?lat=${location.lat}&lng=${location.lng}&radius=${radius}&start=${start}&count=${perPage}`
        );

        if (!response.ok) {
          throw new Error("レストラン検索に失敗しました");
        }

        const data: SearchResults = await response.json();
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
      location.lat,
      location.lng,
      radius,
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

  // 検索フォームの送信ハンドラ
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      searchRestaurants(1); // 検索時は1ページ目から表示
    },
    [searchRestaurants]
  );

  // 位置情報が変わった時に検索を実行
  useEffect(() => {
    if (location.lat && location.lng) {
      searchRestaurants(pageFromUrl);
    }
  }, [pageFromUrl, location.lat, location.lng, searchRestaurants]);

  return {
    radius,
    isLoading,
    error,
    restaurants,
    resultsInfo,
    pageFromUrl,
    totalPages,
    getPageNumbers,
    handleRadiusChange,
    handleSubmit,
    searchRestaurants,
  };
}
