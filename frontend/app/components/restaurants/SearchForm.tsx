import { useState } from "react";
import { UseFormRegister } from "react-hook-form";
import { FiChevronDown, FiChevronUp, FiSearch } from "react-icons/fi";

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

type SearchFormProps = {
  register: UseFormRegister<SearchFormInputs>;
  isLoading: boolean;
  isDisabled: boolean;
  onSubmit: (e: React.FormEvent) => void;
};

export default function SearchForm({
  register,
  isLoading,
  isDisabled,
  onSubmit,
}: SearchFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
    >
      <div className="flex flex-col gap-4">
        {/* 常に表示される基本検索条件 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 検索範囲 */}
          <div>
            <label
              htmlFor="radius"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              検索範囲
            </label>
            <select
              id="radius"
              {...register("radius")}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 text-black transition-all"
              disabled={isLoading}
            >
              <option value="1">300m</option>
              <option value="2">500m</option>
              <option value="3">1km</option>
              <option value="4">2km</option>
              <option value="5">3km</option>
            </select>
          </div>

          {/* ジャンル */}
          <div>
            <label
              htmlFor="genre"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ジャンル
            </label>
            <select
              id="genre"
              {...register("genre")}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 text-black transition-all"
              disabled={isLoading}
            >
              <option value="">指定なし</option>
              <option value="G001">居酒屋</option>
              <option value="G002">ダイニングバー</option>
              <option value="G003">創作料理</option>
              <option value="G004">和食</option>
              <option value="G005">洋食</option>
              <option value="G006">イタリアン</option>
              <option value="G007">中華</option>
              <option value="G008">焼肉</option>
              <option value="G009">アジア・エスニック</option>
              <option value="G010">各国料理</option>
              <option value="G011">カラオケ・パーティ</option>
              <option value="G012">バー・カクテル</option>
              <option value="G013">ラーメン</option>
              <option value="G014">カフェ・スイーツ</option>
              <option value="G016">お好み焼き・もんじゃ</option>
              <option value="G017">韓国料理</option>
            </select>
          </div>

          {/* キーワード */}
          <div>
            <label
              htmlFor="keyword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              キーワード
            </label>
            <input
              id="keyword"
              type="text"
              {...register("keyword")}
              placeholder="ラーメン、駅近、個室など"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 text-black transition-all"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* 詳細条件ボタン */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-indigo-600 hover:text-indigo-800 transition-colors flex items-center justify-center gap-1 text-sm"
        >
          {showAdvanced ? (
            <>
              <FiChevronUp className="inline-block" />
              詳細条件を閉じる
            </>
          ) : (
            <>
              <FiChevronDown className="inline-block" />
              詳細条件を開く
            </>
          )}
        </button>

        {/* 詳細検索条件 - 折りたたみ状態で非表示 */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-gray-100">
            {/* 予算 */}
            <div>
              <label
                htmlFor="budget"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                予算
              </label>
              <select
                id="budget"
                {...register("budget")}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 text-black transition-all"
                disabled={isLoading}
              >
                <option value="">指定なし</option>
                <option value="B009">～500円</option>
                <option value="B010">501～1000円</option>
                <option value="B011">1001～1500円</option>
                <option value="B001">1501～2000円</option>
                <option value="B002">2001～3000円</option>
                <option value="B003">3001～4000円</option>
                <option value="B008">4001～5000円</option>
                <option value="B004">5001～7000円</option>
                <option value="B005">7001～10000円</option>
                <option value="B006">10001～15000円</option>
                <option value="B012">15001～20000円</option>
                <option value="B013">20001円～</option>
              </select>
            </div>

            {/* ランチ */}
            <div>
              <label
                htmlFor="lunch"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                ランチ
              </label>
              <select
                id="lunch"
                {...register("lunch")}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 text-black transition-all"
                disabled={isLoading}
              >
                <option value="">指定なし</option>
                <option value="1">あり</option>
              </select>
            </div>

            {/* 個室 */}
            <div>
              <label
                htmlFor="private_room"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                個室
              </label>
              <select
                id="private_room"
                {...register("private_room")}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 text-black transition-all"
                disabled={isLoading}
              >
                <option value="">指定なし</option>
                <option value="1">あり</option>
              </select>
            </div>

            {/* 食べ放題 */}
            <div>
              <label
                htmlFor="free_food"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                食べ放題
              </label>
              <select
                id="free_food"
                {...register("free_food")}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 text-black transition-all"
                disabled={isLoading}
              >
                <option value="">指定なし</option>
                <option value="1">あり</option>
              </select>
            </div>

            {/* 飲み放題 */}
            <div>
              <label
                htmlFor="free_drink"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                飲み放題
              </label>
              <select
                id="free_drink"
                {...register("free_drink")}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 text-black transition-all"
                disabled={isLoading}
              >
                <option value="">指定なし</option>
                <option value="1">あり</option>
              </select>
            </div>

            {/* 駐車場 */}
            <div>
              <label
                htmlFor="parking"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                駐車場
              </label>
              <select
                id="parking"
                {...register("parking")}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 text-black transition-all"
                disabled={isLoading}
              >
                <option value="">指定なし</option>
                <option value="1">あり</option>
              </select>
            </div>

            {/* カード決済 */}
            <div>
              <label
                htmlFor="card"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                カード決済
              </label>
              <select
                id="card"
                {...register("card")}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 text-black transition-all"
                disabled={isLoading}
              >
                <option value="">指定なし</option>
                <option value="1">利用可</option>
              </select>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all shadow-sm disabled:opacity-50 disabled:bg-gray-400 flex items-center justify-center gap-2"
          disabled={isLoading || isDisabled}
        >
          <FiSearch className="inline-block" />
          {isLoading ? "検索中..." : "レストランを検索"}
        </button>
      </div>
    </form>
  );
}
