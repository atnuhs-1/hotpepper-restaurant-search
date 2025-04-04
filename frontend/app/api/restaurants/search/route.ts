// app/api/restaurants/search/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const range = searchParams.get('range') || '3'; // デフォルト値: 3（3km）
  const start = searchParams.get('start') || '1'; // ページング用
  const count = searchParams.get('count') || '20'; // 1ページあたりの件数
  const genre = searchParams.get('genre') || '';
  const budget = searchParams.get('budget') || '';
  const keyword = searchParams.get('keyword') || '';
  
  // 詳細検索パラメータ
  const lunch = searchParams.get('lunch') || '';
  const free_food = searchParams.get('free_food') || '';
  const free_drink = searchParams.get('free_drink') || '';
  const parking = searchParams.get('parking') || '';
  const card = searchParams.get('card') || '';
  const private_room = searchParams.get('private_room') || '';
  
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
    let apiUrl = `https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=${apiKey}&lat=${lat}&lng=${lng}&range=${range}&start=${start}&count=${count}`;
    
    // 基本条件パラメータを追加
    if (genre) apiUrl += `&genre=${genre}`;
    if (budget) apiUrl += `&budget=${budget}`;
    if (keyword) apiUrl += `&keyword=${encodeURIComponent(keyword)}`;
    
    // 詳細条件パラメータを追加
    if (lunch) apiUrl += `&lunch=${lunch}`;
    if (free_food) apiUrl += `&free_food=${free_food}`;
    if (free_drink) apiUrl += `&free_drink=${free_drink}`;
    if (parking) apiUrl += `&parking=${parking}`;
    if (card) apiUrl += `&card=${card}`;
    if (private_room) apiUrl += `&private_room=${private_room}`;
    
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