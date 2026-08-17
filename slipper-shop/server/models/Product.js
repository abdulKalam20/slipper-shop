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
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    // Sizes only matter for slippers. Leave as [] for sweeper / tea-powder.
    sizes: {
      type: [String],
      default: [],
    },
    imageUrl: {
      type: String,
      required: true,
    },
    // Needed so we can delete the image from Cloudinary when the product is deleted
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

const Product = mongoose.model("Product", productSchema);
export default Product;
