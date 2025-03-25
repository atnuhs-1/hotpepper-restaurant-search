// app/api/restaurants/search/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const radius = searchParams.get('radius') || '3'; // デフォルト値: 3（3km）
  const start = searchParams.get('start') || '1'; // ページング用
  const count = searchParams.get('count') || '20'; // 1ページあたりの件数
  const genre = searchParams.get('genre') || '';
  const budget = searchParams.get('budget') || '';
  const keyword = searchParams.get('keyword') || '';
  
  if (!lat || !lng) {
    return NextResponse.json(
      { error: '緯度・経度が必要です' },
      { status: 400 }
    );
  }

  try {
    // 環境変数からAPIキーを取得
    const apiKey = process.env.HOTPEPPER_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API KEY が設定されていません' },
        { status: 500 }
      );
    }
    
    // API URLのベース部分
    let apiUrl = `https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=${apiKey}&lat=${lat}&lng=${lng}&range=${radius}&start=${start}&count=${count}`;
    
    // 条件パラメータを追加
    if (genre) apiUrl += `&genre=${genre}`;
    if (budget) apiUrl += `&budget=${budget}`;
    if (keyword) apiUrl += `&keyword=${encodeURIComponent(keyword)}`;
    
    // 最後にフォーマットを追加
    apiUrl += '&format=json';
    
    // ホットペッパーAPIへのリクエスト
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error('ホットペッパーAPI リクエストエラー');
    }
    
    const data = await response.json();
    
    // キャッシュヘッダーを設定してレスポンスを返す
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'max-age=300, s-maxage=600',
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}