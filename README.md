# グルメサーチ - 簡易仕様書

## 目次
1. [アプリ名](#アプリ名)
2. [対象OSおよびブラウザ](#対象osおよびブラウザ)
3. [開発環境/言語](#開発環境言語)
4. [開発期間](#開発期間)
5. [機能概要](#機能概要)
   - [検索条件入力画面](#検索条件入力画面)
   - [検索結果画面](#検索結果画面)
   - [店舗詳細画面](#店舗詳細画面)
6. [フレームワーク](#フレームワーク)
7. [テーブル定義/設計ドキュメント](#テーブル定義設計ドキュメント)
   - [データストレージ](#データストレージ)
   - [ディレクトリ構成詳細](#ディレクトリ構成詳細)
   - [コンポーネント設計](#コンポーネント設計)
   - [状態管理](#状態管理)
   - [レスポンシブデザイン](#レスポンシブデザイン)
8. [開発環境構築](#開発環境構築)
9. [コンセプト](#コンセプト)
10. [こだわったポイント](#こだわったポイント)
11. [デザイン面でこだわったポイント](#デザイン面でこだわったポイント)
12. [技術面でアドバイスして欲しいポイント](#技術面でアドバイスして欲しいポイント)
13. [自己評価](#自己評価)
14. [今後の改善点](#今後の改善点)

## アプリ名
NearSearch

## 対象OSおよびブラウザ
- **OS**: 
  - 動作確認済み: Windows 10/11, macOS 12以降
  - 動作未確認: iOS 15以降, Android 11以降
- **ブラウザ**: 
  - 動作確認済み: Google Chrome 90以降
  - 動作未確認: Firefox 90以降, Safari 15以降, Edge 90以降

**注意**: 開発・検証は上記の動作確認済み環境でのみ行っています。未確認の環境での動作については保証できませんが、標準的なWeb技術を使用しているため、多くの環境で動作する可能性があります。

## 開発環境/言語
- TypeScript
- HTML/CSS (Tailwind CSS)
- Docker

## 開発期間
2025年3月17日〜2025年3月31日

## 機能概要
### 検索条件入力画面
![検索条件入力画面](/doc/images/top-page.png)
- Geolocation APIを使用した現在地取得機能
- 検索半径設定機能（300m〜3km）
- ジャンル検索（居酒屋、イタリアン、中華など）
- キーワード検索機能

### 検索結果画面
![検索結果一覧画面](/doc/images/search-list.png)
- レストラン一覧表示（店舗名、アクセス、サムネイル画像、営業時間、予算）
- ページング機能（20件ごと）
- 検索結果概要表示（「現在地から1km圏内のイタリアンのレストラン」など）
- 地図表示切り替え機能

**注意**: スクリーンショットでは開発・テスト用にダミーの緯度経度を使用しています。実際のアプリでは現在地を取得して表示します。

### 店舗詳細画面
![店舗詳細画面](/doc/images/restaurant-detail.png)
- 基本情報（店舗名、住所、営業時間、定休日）
- 店舗画像（複数表示対応）
- アクセス情報
- コース・メニュー情報
- 設備・サービス情報
- 地図表示（Google Maps連携）
- ホットペッパー予約ページへのリンク

## フレームワーク
- Next.js 15
- React 18

## テーブル定義/設計ドキュメント

### データストレージ
本アプリケーションはデータベースを使用せず、ホットペッパーグルメサーチAPIからのデータを直接表示する構成のため、テーブル定義はありません。

### ディレクトリ構成詳細
- **app/**: Next.js App Routerの構造に基づくページコンポーネント
  - `page.tsx`: トップページ（検索条件入力画面）
  - `search/page.tsx`: 検索結果画面
  - `restaurants/[id]/page.tsx`: 店舗詳細画面
  - `map/page.tsx`: 地図表示画面
  - `layout.tsx`: 共通レイアウト

- **constants/**: アプリケーション全体で使用される定数
  - `genres.ts`: ジャンルコードとジャンル名のマッピング
  - `ranges.ts`: 検索範囲の定義

- **features/**: 機能別のコンポーネント・ロジック
  - `home/`: トップページ関連
    - `components/`: 検索フォームなど
  - `search/`: レストラン検索関連
    - `api/`: APIインターフェース
    - `components/`: 検索結果表示コンポーネント
    - `utils/`: 検索結果整形ユーティリティ
  - `restaurants/`: レストラン詳細表示関連
    - `components/`: 詳細表示コンポーネント
  - `map/`: 地図表示関連
    - `components/`: 地図コンポーネント

- **types/**: TypeScript型定義
  - `search.ts`: 検索関連型定義（レストラン、検索条件など）

### コンポーネント設計

#### 1. 検索条件入力（ホーム）
- `HomeSearchForm`: トップページの検索フォーム
  - 現在地取得ボタン
  - 検索範囲設定（ドロップダウン）
  - ジャンル選択（ドロップダウン）
  - キーワード入力（テキストフィールド）
  - 検索ボタン

#### 2. 検索結果表示
- `SearchResults`: 検索結果全体のコンテナ
  - `RestaurantCard`: 個別レストラン表示カード
  - `Pagination`: ページネーションコントロール
  - `SearchSummary`: 検索条件の要約表示

#### 3. 地図表示
- `RestaurantMap`: 地図表示のメインコンテナ
  - `MyMap`: Google Mapsとの連携
  - `MapContent`: 実際の地図コンテンツ（マーカー、円など）
  - `RestaurantCardList`: 地図下部に表示するレストランカードリスト
  - `MapControl`: 地図上のコントロール要素
  - `MapFooter`: 地図下部の操作コントロール

#### 4. レストラン詳細表示
- `RestaurantDetail`: レストラン詳細コンテナ
  - `InfoItem`: 情報項目のフォーマット表示
  - `BackButton`: 戻るボタン

### 状態管理
- サーバーコンポーネントとクライアントコンポーネントを適切に使い分け
- 検索条件はURL検索パラメータで管理し、ブックマークやシェアが可能
- 地図表示などのクライアントサイド機能ではReactフックを活用した状態管理

### レスポンシブデザイン
- モバイルファースト設計
- Tailwind CSSによるレスポンシブクラス活用
- デバイスサイズに応じたレイアウト最適化
  - モバイル: 縦長シングルカラムレイアウト
  - タブレット: 2カラムレイアウト（検索結果画面）
  - デスクトップ: 最適化されたマルチカラムレイアウト

## 開発環境構築

### 手順
1. リポジトリをクローン:
   ```sh
   git clone https://github.com/atnuhs-1/hotpepper-restaurant-search.git
   cd hotpepper-restaurant-search
   ```

2. 環境変数の設定:
    `.env.example`ファイルをコピーして`.env`ファイルを作成し、必要な値を設定:
    
    ```sh
    cp .env.example .env
    ```
    そして`.env`ファイルを編集して、あなたのAPIキーを設定します:
    ```
   HOTPEPPER_API_KEY="your_api_key_here"

   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your_google_maps_api_key_here"
   NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID="your_map_id_here"
    ```
    ※ ホットペッパーグルメサーチAPIのキーは[リクルートWEBサービス](https://webservice.recruit.co.jp/register)で取得できます

3. アプリケーションの起動:
   ```sh
   docker compose watch
   ```

4. ブラウザで以下のURLにアクセス:
   ```
   http://localhost:3000
   ```

## コンセプト
「現在地からすぐに行ける飲食店をシンプルに探せる」をテーマに、位置情報を起点とした直感的なレストラン検索体験を提供します。特に地図表示に重点を置き、ユーザーが現在地周辺の飲食店を視覚的に把握しながら選択できるアプリケーションを目指しました。

## こだわったポイント

### 設計面
1. **Next.jsとサーバー/クライアントコンポーネントの使い分け**
   - APIキー保護のためサーバーコンポーネントでのデータフェッチを実装
   - インタラクティブな操作が必要な地図表示はクライアントコンポーネントで実装
   - コンポーネント間の適切な責務分離

2. **検索条件のURL保持**
   - 検索条件をクエリパラメータとして保持し、ブラウザ履歴と連携
   - 検索結果共有やブックマークが可能なURL設計
   - ブラウザバックでの検索履歴復元機能

3. **Docker環境での開発最適化**
   - Compose Watchを活用した効率的な開発環境
   - ホットリロードの最適化
   - ボリューム管理の工夫

### UI/UX面
1. **現在地特化型のシンプルな検索体験**
   - Geolocation APIによる現在地取得の簡略化
   - 検索半径調整によるピンポイント検索
   - 必要最小限の検索条件入力で素早い操作を実現

2. **地図とリスト表示の複合的な情報提供**
   - 地図上でのマーカー表示と情報ウィンドウの連携
   - 横スクロールカードリストで効率的な店舗比較
   - 検索結果のページネーションと地図表示の統合

3. **モバイルファーストのレスポンシブデザイン**
   - スマートフォンでの片手操作に最適化
   - 重要な操作ボタンは親指が届きやすい位置に配置
   - 画面サイズに応じたレイアウト自動調整

## デザイン面でこだわったポイント
1. **視覚的階層と情報の整理**
   - 重要度に応じた情報の視覚的優先順位付け
   - カード型レイアウトによる情報のまとまり表現

2. **操作フィードバックの最適化**
   - ローディング状態の視覚的表現
   - エラー発生時の親切なガイダンス表示
   - タップ/クリック可能要素の明確な視覚的表現

3. **一貫したビジュアルシステム**
   - Tailwind CSSを活用した統一感のあるデザイン
   - オレンジを基調とした温かみのあるカラーパレット

## 技術面でアドバイスして欲しいポイント
1. **サーバー/クライアントコンポーネントの最適な使い分け**
   - 境界設計のベストプラクティス
   - パフォーマンスとDX（開発体験）のバランス

2. **地図表示の最適化**
   - 大量マーカー表示時のパフォーマンス改善策
   - 地図の表示範囲変更時のデータ再取得の効率的実装
   - @vis.gl/react-google-mapsのレンダリング最適化

3. **状態管理とルーティングの連携**
   - クエリパラメータとクライアントサイド状態の同期方法
   - 履歴管理とデータフェッチの効率的な連携
   - useEffectの依存配列管理と無限ループ防止策

4. **コンポーネント設計の改善**
   - 責務分離とコンポーネントサイズのバランス
   - カスタムフックの効果的な活用方法

## 自己評価

- **技術実装**: 7/10 - Next.jsの機能を活用し、効率的な実装ができた。サーバー/クライアントコンポーネントの境界設計に改善の余地あり。

- **開発プロセス**: 6/10 - Docker環境構築や開発フローの確立に時間を要した。設計変更による手戻りがあり効率的とは言えなかった。

- **機能完成度**: 6/10 - 基本機能は実装できたが、地図の表示範囲に応じた再検索や詳細な検索条件指定など拡張機能の実装が不十分。

- **総合評価**: 7/10 - 要件を満たす基本機能は実装できたが、中盤での設計変更により一部機能の実装時間が不足。次回は事前の設計検討をより綿密に行いたい。

## 今後の改善点
1. **デザイン・UI改善**
   - ページネーションを画面上下両方に配置
   - モバイル操作性の向上（ボタン配置の最適化）
   - Imageコンポーネントの最適化

2. **機能拡張**
   - 詳細な検索条件指定機能
   - 地図表示範囲連動の検索機能
   - GoogleのPlaces APIを活用したレビュー表示
   - 移動時間・移動手段の表示

***

簡易仕様書に書ききれなかったことや、アプリ開発中に学んだこと等をZennのスクラップにメモしています

[レストラン検索アプリについて](https://zenn.dev/atnuhs/scraps/84e2a438615e1c)
