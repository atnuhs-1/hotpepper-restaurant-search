import { Metadata } from "next";
import HomeSearchForm from "../features/home/components/HomeSearch";

// メタデータの設定（SEO対策）
export const metadata: Metadata = {
  title: "グルメサーチ",
  description: "現在地周辺のレストランを検索できるアプリ",
};

export default function Home() {
  return (
    <div className="min-h-screen  bg-white text-gray-800">
      <main className="container bg-white mx-auto px-4 py-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-orange-600 mb-4">
              グルメサーチ
            </h1>
            <p className="text-gray-600">
              現在地周辺のおすすめレストランを検索できます
            </p>
          </div>

          <HomeSearchForm />

          <div className="text-center text-gray-500 text-sm mt-6">
            <p>ホットペッパーグルメサーチAPIを使用しています</p>
            <p>
              <a
                href="https://webservice.recruit.co.jp/doc/hotpepper/reference.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 hover:underline"
              >
                API リファレンス
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
