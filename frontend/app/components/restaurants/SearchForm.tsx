import { FiSearch } from "react-icons/fi";

type SearchFormProps = {
  radius: string;
  genre: string;
  budget: string;
  keyword: string;
  isLoading: boolean;
  isDisabled: boolean;
  onRadiusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onGenreChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBudgetChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onKeywordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function SearchForm({
  radius,
  genre,
  budget,
  keyword,
  isLoading,
  isDisabled,
  onRadiusChange,
  onGenreChange,
  onBudgetChange,
  onKeywordChange,
  onSubmit
}: SearchFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 検索範囲 */}
          <div>
            <label htmlFor="radius" className="block text-sm font-medium text-gray-700 mb-1">
              検索範囲
            </label>
            <select
              id="radius"
              value={radius}
              onChange={onRadiusChange}
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
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
              ジャンル
            </label>
            <select
              id="genre"
              value={genre}
              onChange={onGenreChange}
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
              <option value="G017">韓国料理</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 予算 */}
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
              予算
            </label>
            <select
              id="budget"
              value={budget}
              onChange={onBudgetChange}
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

          {/* キーワード */}
          <div>
            <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
              キーワード
            </label>
            <input
              id="keyword"
              type="text"
              value={keyword}
              onChange={onKeywordChange}
              placeholder="店名、料理名など"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 text-black transition-all"
              disabled={isLoading}
            />
          </div>
        </div>

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