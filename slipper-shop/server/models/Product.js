import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["slippers", "sweeper", "tea-powder"],
      default: "slippers",
    },
    // Only meaningful for slippers. "unisex" is the safe default for
    // sweeper / tea-powder or slippers that fit anyone.
    gender: {
      type: String,
      enum: ["men", "women", "unisex"],
      default: "unisex",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    sizes: {
      type: [String],
      default: [],
    },
    imageUrl: {
      type: String,
      required: true,
    },
    imagePublicId: {
      type: String,
      required: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Text index on name so $text search works for keywords like "crocs"
productSchema.index({ name: "text" });

const Product = mongoose.model("Product", productSchema);
export default Product;
