// app/api/restaurants/detail/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json(
      { error: '店舗IDが必要です' },
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
    
    // ホットペッパーAPIへのリクエスト（店舗ID指定）
    const response = await fetch(
      `https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=${apiKey}&id=${id}&format=json`
    );
    
    if (!response.ok) {
      throw new Error('ホットペッパーAPI リクエストエラー');
    }
    
    const data = await response.json();
    
    // キャッシュヘッダーを設定してレスポンスを返す
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'max-age=3600, s-maxage=7200',
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