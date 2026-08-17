import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function AdminProductForm({ onProductAdded }) {
  const [form, setForm] = useState({
    name: "",
    category: "slippers",
    price: "",
    sizes: "", // comma separated input, e.g. "6,7,8,9"
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // Step 1: upload the raw image file straight to Cloudinary from the browser
  const uploadImageToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: data }
    );

    if (!res.ok) throw new Error("Image upload failed");

    const result = await res.json();
    return { imageUrl: result.secure_url, imagePublicId: result.public_id };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!imageFile) {
      setError("Please select an image");
      return;
    }

    setLoading(true);
    try {
      // Step 1: image -> Cloudinary
      const { imageUrl, imagePublicId } = await uploadImageToCloudinary(imageFile);

      // Step 2: product details + image URL -> our backend -> MongoDB
      const token = localStorage.getItem("adminToken");
      const sizesArray = form.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          price: Number(form.price),
          sizes: form.category === "slippers" ? sizesArray : [],
          imageUrl,
          imagePublicId,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to save product");
      }

      const newProduct = await res.json();
      onProductAdded?.(newProduct);

      // reset form
      setForm({ name: "", category: "slippers", price: "", sizes: "" });
      setImageFile(null);
      setPreview(null);
      e.target.reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4 p-6 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold">Add New Product</h2>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div>
        <label className="block text-sm font-medium mb-1">Product Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="slippers">Slippers</option>
          <option value="sweeper">Sweeper</option>
          <option value="tea-powder">Tea Powder</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Price (₹)</label>
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          min="0"
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {form.category === "slippers" && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Sizes (comma separated, e.g. 6,7,8,9)
          </label>
          <input
            type="text"
            name="sizes"
            value={form.sizes}
            onChange={handleChange}
            placeholder="6,7,8,9"
            className="w-full border rounded px-3 py-2"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Product Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} required />
        {preview && (
          <img src={preview} alt="Preview" className="mt-2 h-32 w-32 object-cover rounded" />
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
}
