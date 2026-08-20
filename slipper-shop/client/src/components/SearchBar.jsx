export default function SearchBar({ search, setSearch, gender, setGender, showGenderFilter }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-5">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products, e.g. crocs..."
        className="flex-1 border rounded px-3 py-2 text-sm"
      />

      {showGenderFilter && (
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="border rounded px-3 py-2 text-sm sm:w-40"
        >
          <option value="">All</option>
          <option value="men">Men's</option>
          <option value="women">Women's</option>
          <option value="unisex">Unisex</option>
        </select>
      )}
    </div>
  );
}
