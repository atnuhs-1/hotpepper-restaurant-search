# ホットペッパーレストラン検索アプリ

リクルートWEBサービスのホットペッパー グルメサーチAPI を使用して、現在地付近のレストラン情報を検索するウェブアプリケーション。

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
    HOTPEPPER_API_KEY=<APIキー>
    ```
    ※ ホットペッパーグルメサーチAPIのキーは[リクルートWEBサービス](https://webservice.recruit.co.jp/register)で取得できます

3. アプリケーションの起動:
   ```sh
   docker compose up
   ```

4. ブラウザで以下のURLにアクセス:
   ```
   http://localhost:3000
   ```

## 使用技術
- Next.js 15
- TypeScript
- Docker
- ホットペッパーグルメサーチAPI

## 機能
- Geolocation APIを使った現在地の取得
- 現在地から指定した半径内のレストラン検索
- レストラン情報の一覧表示
- レストラン詳細情報の表示

## プロジェクト構成
```
hotpepper-restaurant-search/
├── app/              # Next.jsアプリケーション
├── docker-compose.yml
├── Dockerfile
├── .dockerignore
├── .gitignore
├── .env.example      # 環境変数のサンプルファイル
└── README.md
```

## メモ
1. 新しいパッケージをインストールする場合:
   ```
   docker compose run --rm app npm install パッケージ名
   ```