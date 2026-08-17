import express from "express";
import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
import verifyAdmin from "../middleware/verifyAdmin.js";

const router = express.Router();

// GET /api/products?category=slippers&gender=women&search=crocs
// All three filters are optional and combine together.
router.get("/", async (req, res) => {
  try {
    const { category, gender, search } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (gender) filter.gender = gender;

    if (search) {
      // Case-insensitive partial match on product name, e.g. "crocs" only
      // returns products whose name contains "crocs".
      filter.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products", error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch product", error: err.message });
  }
});

router.post("/", verifyAdmin, async (req, res) => {
  try {
    const { name, category, gender, price, sizes, imageUrl, imagePublicId } = req.body;

    if (!name || !price || !imageUrl || !imagePublicId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const product = await Product.create({
      name,
      category: category || "slippers",
      gender: gender || "unisex",
      price,
      sizes: sizes || [],
      imageUrl,
      imagePublicId,
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to create product", error: err.message });
  }
});

router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to update product", error: err.message });
  }
});

router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.imagePublicId) {
      await cloudinary.uploader.destroy(product.imagePublicId);
    }

    await product.deleteOne();
    res.json({ message: "Product deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete product", error: err.message });
  }
});

export default router;
