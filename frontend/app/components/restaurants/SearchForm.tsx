import { FiSearch } from "react-icons/fi";

type SearchFormProps = {
  radius: string;
  isLoading: boolean;
  isDisabled: boolean;
  onRadiusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function SearchForm({
  radius,
  isLoading,
  isDisabled,
  onRadiusChange,
  onSubmit
}: SearchFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-end gap-4">
        <div className="flex-grow">
          <label
            htmlFor="radius"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
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