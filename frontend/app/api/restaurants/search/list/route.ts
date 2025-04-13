// 一覧表示用（ページネーション対応）
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const range = searchParams.get("range") || "3";
  const keyword = searchParams.get("keyword") || "";
  const genre = searchParams.get("genre") || "";
  const budget = searchParams.get("budget") || "";
  const start = searchParams.get("start") || "1";
  const count = searchParams.get("count") || "20";

  // API Key
  const apiKey = process.env.HOTPEPPER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "API Key is not configured" },
      { status: 500 }
    );
  }

  // APIのエンドポイント
  const apiEndpoint = "https://webservice.recruit.co.jp/hotpepper/gourmet/v1/";
  
  // パラメータの構築
  const apiParams = new URLSearchParams({
    key: apiKey,
    format: "json",
    lat: lat!,
    lng: lng!,
    range,
    keyword,
    genre,
    budget,
    start,
    count,
  });
  
  try {
    // APIリクエスト
    const response = await fetch(`${apiEndpoint}?${apiParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("API Request error:", error);
    return NextResponse.json(
      { error: "Failed to fetch restaurant data" },
      { status: 500 }
    );
  }
}