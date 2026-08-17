import express from "express";
import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
import verifyAdmin from "../middleware/verifyAdmin.js";

const router = express.Router();

// GET /api/products?category=slippers  -> public, anyone can browse
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products", error: err.message });
  }
});

// GET /api/products/:id -> public, single product detail
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch product", error: err.message });
  }
});

// POST /api/products -> admin only. Image is already uploaded to Cloudinary
// on the frontend; this just saves the returned URL + publicId + product info.
router.post("/", verifyAdmin, async (req, res) => {
  try {
    const { name, category, price, sizes, imageUrl, imagePublicId } = req.body;

    if (!name || !price || !imageUrl || !imagePublicId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const product = await Product.create({
      name,
      category: category || "slippers",
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

// PUT /api/products/:id -> admin only. Edit details or toggle inStock.
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

// DELETE /api/products/:id -> admin only. Removes DB entry AND the Cloudinary image.
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Clean up the image on Cloudinary so you don't accumulate orphaned files
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
