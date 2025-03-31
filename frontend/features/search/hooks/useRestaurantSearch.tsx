import { useState, useCallback, useRef, useEffect } from "react";
import { Restaurant, SearchResults } from "../../types/search";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

type Location = {
  lat: number | null;
  lng: number | null;
};

interface UseRestaurantSearchProps {
  location: Location;
  initialRadius?: string;
  initialPage?: number;
  perPage?: number;
}

// 検索フォームの型定義
interface SearchFormInputs {
  radius: string;
  genre: string;
  budget: string;
  keyword: string;
  // 詳細条件
  lunch: string;
  free_food: string;
  free_drink: string;
  parking: string;
  card: string;
  private_room: string;
}

export function useRestaurantSearch({
  location,
  initialRadius = "3",
  initialPage = 1,
  perPage = 20,
}: UseRestaurantSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URLからページ番号を取得
  const pageFromUrl = searchParams.get("page")
    ? parseInt(searchParams.get("page") as string)
    : initialPage;

  // React Hook Formの初期化
  const {
    register,
    handleSubmit: formHandleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<SearchFormInputs>({
    defaultValues: {
      // 基本条件
      radius: searchParams.get("radius") || initialRadius,
      genre: searchParams.get("genre") || "",
      budget: searchParams.get("budget") || "",
      keyword: searchParams.get("keyword") || "",

      // 詳細条件
      lunch: searchParams.get("lunch") || "",
      free_food: searchParams.get("free_food") || "",
      free_drink: searchParams.get("free_drink") || "",
      parking: searchParams.get("parking") || "",
      card: searchParams.get("card") || "",
      private_room: searchParams.get("private_room") || "",
    },
  });

  // フォーム値の監視
  const formValues = watch();

  // 検索状態管理
  const [isLoading, setIsLoading] = useState<boolean>(isSubmitting);
  const [error, setError] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [resultsInfo, setResultsInfo] = useState<{
    available: number;
    returned: number;
    start: number;
  } | null>(null);

  // フォーム値を外部から設定する関数
  const setFormValues = useCallback(
    (values: Partial<SearchFormInputs>) => {
      Object.entries(values).forEach(([key, value]) => {
        setValue(key as keyof SearchFormInputs, value);
      });
    },
    [setValue]
  );

  // クエリパラメータを更新する関数
  const updateQueryParams = useCallback(
    (page: number, searchValues: SearchFormInputs) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());
      params.set("radius", searchValues.radius);

      // オプションパラメータは存在する場合のみセット
      if (searchValues.genre) params.set("genre", searchValues.genre);
      else params.delete("genre");

      if (searchValues.budget) params.set("budget", searchValues.budget);
      else params.delete("budget");

      if (searchValues.keyword) params.set("keyword", searchValues.keyword);
      else params.delete("keyword");

      // 詳細パラメータも同様に処理
      if (searchValues.lunch) params.set("lunch", searchValues.lunch);
      else params.delete("lunch");

      if (searchValues.free_food)
        params.set("free_food", searchValues.free_food);
      else params.delete("free_food");

      if (searchValues.free_drink)
        params.set("free_drink", searchValues.free_drink);
      else params.delete("free_drink");

      if (searchValues.parking) params.set("parking", searchValues.parking);
      else params.delete("parking");

      if (searchValues.card) params.set("card", searchValues.card);
      else params.delete("card");

      if (searchValues.private_room)
        params.set("private_room", searchValues.private_room);
      else params.delete("private_room");

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  // 検索を実行
  const searchRestaurants = useCallback(
    async (
      page: number = pageFromUrl,
      overrideLocation?: Location,
      formData?: SearchFormInputs
    ) => {
      // 使用する位置情報（オーバーライドか現在の状態）
      const locationToUse = overrideLocation || location;

      // 使用するフォームデータ
      const searchValues = formData || formValues;

      if (!locationToUse.lat || !locationToUse.lng) {
        setError("位置情報を先に取得してください");
        return;
      }

      setIsLoading(true);
      setError(null);

      // URLのページ番号を更新
      updateQueryParams(page, searchValues);

      // 開始位置を計算
      const start = (page - 1) * perPage + 1;

      try {
        let apiUrl = `/api/restaurants/search?lat=${locationToUse.lat}&lng=${locationToUse.lng}&radius=${searchValues.radius}&start=${start}&count=${perPage}`;

        // 基本パラメータ
        if (searchValues.genre) apiUrl += `&genre=${searchValues.genre}`;
        if (searchValues.budget) apiUrl += `&budget=${searchValues.budget}`;
        if (searchValues.keyword)
          apiUrl += `&keyword=${encodeURIComponent(searchValues.keyword)}`;

        // 詳細パラメータ
        if (searchValues.lunch) apiUrl += `&lunch=${searchValues.lunch}`;
        if (searchValues.free_food)
          apiUrl += `&free_food=${searchValues.free_food}`;
        if (searchValues.free_drink)
          apiUrl += `&free_drink=${searchValues.free_drink}`;
        if (searchValues.parking) apiUrl += `&parking=${searchValues.parking}`;
        if (searchValues.card) apiUrl += `&card=${searchValues.card}`;
        if (searchValues.private_room)
          apiUrl += `&private_room=${searchValues.private_room}`;

        const response = await fetch(apiUrl);

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
    [location, formValues, perPage, updateQueryParams, pageFromUrl]
  );

  // フォーム送信ハンドラ
  const handleSubmit = formHandleSubmit((data) => {
    searchRestaurants(1, undefined, data); // 検索時は1ページ目から表示
  });

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
  }, [
    location.lat,
    location.lng,
    pageFromUrl,
    searchParams,
    searchRestaurants,
  ]);

  return {
    // フォーム関連
    register,
    handleSubmit,
    formValues,
    setValue,
    setFormValues,

    // 検索状態
    isLoading,
    error,
    restaurants,
    resultsInfo,
    pageFromUrl,
    totalPages,

    // 関数
    getPageNumbers,
    searchRestaurants,
  };
}
