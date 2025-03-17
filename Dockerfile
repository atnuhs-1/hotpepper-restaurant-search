FROM node:18-alpine

WORKDIR /app

# パッケージをコピーしてインストール
COPY ./frontend/package*.json ./
RUN npm install

# 開発用設定
ENV NODE_ENV=development

# ホットリロード用ポート
EXPOSE 3000

# 開発サーバー起動
CMD ["npm", "run", "dev"]