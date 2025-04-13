// 地図表示用（全件取得）
import { Restaurant } from "@/types/search";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const range = searchParams.get("range") || "3";
  const keyword = searchParams.get("keyword") || "";
  const genre = searchParams.get("genre") || "";
  const budget = searchParams.get("budget") || "";

  // API Key
  const apiKey = process.env.HOTPEPPER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "API Key is not configured" },
      { status: 500 }
    );
  }

  try {
    // まず1件だけ取得して総件数を確認
    const countCheckParams = new URLSearchParams({
      key: apiKey,
      format: "json",
      lat: lat!,
      lng: lng!,
      range,
      keyword,
      genre,
      budget,
      start: "1",
      count: "1",
    });

    const countCheckResponse = await fetch(
      `https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?${countCheckParams.toString()}`
    );
    
    if (!countCheckResponse.ok) {
      throw new Error(`API request failed with status ${countCheckResponse.status}`);
    }
    
    const countData = await countCheckResponse.json();
    const totalResults = countData.results.results_available;
    
    // 結果が0件の場合はそのまま返す
    if (totalResults === 0) {
      return NextResponse.json(countData);
    }
    
    // 複数回のリクエストが必要な場合（APIの最大取得件数は100件）
    const MAX_PER_REQUEST = 100;
    const requestCount = Math.ceil(totalResults / MAX_PER_REQUEST);
    const allShops: Restaurant[] = [];
    
    // 並列リクエストを作成
    const requests = [];
    for (let i = 0; i < requestCount; i++) {
      const startIndex = i * MAX_PER_REQUEST + 1;
      const batchParams = new URLSearchParams({
        key: apiKey,
        format: "json",
        lat: lat!,
        lng: lng!,
        range,
        keyword,
        genre,
        budget,
        start: startIndex.toString(),
        count: MAX_PER_REQUEST.toString(),
      });
      
      requests.push(
        fetch(`https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?${batchParams.toString()}`)
          .then(res => res.json())
          .then(data => data.results.shop || [])
      );
    }
    
    // 全リクエストを並列実行
    const results = await Promise.all(requests);
    
    // 結果を結合
    results.forEach(shops => {
      allShops.push(...shops);
    });
    
    // 結果を整形して返す
    const response = {
      results: {
        api_version: countData.results.api_version,
        results_available: totalResults,
        results_returned: allShops.length,
        results_start: 1,
        shop: allShops
      }
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error("API Request error:", error);
    return NextResponse.json(
      { error: "Failed to fetch restaurant data" },
      { status: 500 }
    );
  }
}