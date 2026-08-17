import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import SearchBar from "../components/SearchBar.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Home() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("");

  useEffect(() => {
    // Debounce so we don't fire a request on every keystroke
    const timer = setTimeout(() => {
      const fetchProducts = async () => {
        setLoading(true);
        setError("");
        try {
          const params = new URLSearchParams();
          if (category) params.set("category", category);
          if (gender) params.set("gender", gender);
          if (search.trim()) params.set("search", search.trim());

          const res = await fetch(`${API_URL}/api/products?${params.toString()}`);
          if (!res.ok) throw new Error("Failed to load products");
          const data = await res.json();
          setProducts(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [category, gender, search]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 capitalize">
        {category ? category.replace("-", " ") : "All Products"}
      </h1>

      <SearchBar
        search={search}
        setSearch={setSearch}
        gender={gender}
        setGender={setGender}
        showGenderFilter={!category || category === "slippers"}
      />

      {loading && <p>Loading products...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="text-gray-500">
          {search ? `No results for "${search}"` : "No products yet. Check back soon!"}
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} isAdmin={false} />
        ))}
      </div>
    </div>
  );
}
