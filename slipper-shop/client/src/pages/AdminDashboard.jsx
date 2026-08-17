import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminProductForm from "../components/AdminProductForm.jsx";
import ProductCard from "../components/ProductCard.jsx";
import SearchBar from "../components/SearchBar.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("");
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (gender) params.set("gender", gender);
    if (search.trim()) params.set("search", search.trim());
    const res = await fetch(`${API_URL}/api/products?${params.toString()}`);
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [search, gender]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const handleProductAdded = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleProductDeleted = (id) => {
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="text-sm bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Logout
        </button>
      </div>

      <div className="grid md:grid-cols-[350px_1fr] gap-6">
        <AdminProductForm onProductAdded={handleProductAdded} />

        <div>
          <h2 className="text-lg font-semibold mb-3">
            Current Products ({products.length})
          </h2>

          <SearchBar
            search={search}
            setSearch={setSearch}
            gender={gender}
            setGender={setGender}
            showGenderFilter={true}
          />

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  isAdmin={true}
                  onDeleted={handleProductDeleted}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
