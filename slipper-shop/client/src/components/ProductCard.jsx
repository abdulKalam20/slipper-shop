const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ProductCard({ product, isAdmin, onDeleted }) {
  const handleDelete = async () => {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;

    const token = localStorage.getItem("adminToken");
    const res = await fetch(`${API_URL}/api/products/${product._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      onDeleted?.(product._id);
    } else {
      alert("Failed to delete product");
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
      <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{product.name}</h3>
          {product.category === "slippers" && product.gender && product.gender !== "unisex" && (
            <span className="text-[10px] uppercase tracking-wide bg-gray-100 rounded px-1.5 py-0.5">
              {product.gender}
            </span>
          )}
        </div>
        <p className="text-gray-600">₹{product.price}</p>

        {product.sizes?.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {product.sizes.map((size) => (
              <span key={size} className="text-xs border rounded px-2 py-0.5">
                {size}
              </span>
            ))}
          </div>
        )}

        {!product.inStock && (
          <span className="text-xs text-red-600 font-medium">Out of stock</span>
        )}

        {isAdmin && (
          <button
            onClick={handleDelete}
            className="mt-3 w-full bg-red-600 text-white py-1.5 rounded text-sm hover:bg-red-700"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
