import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  products: [{ type: mongoose.Types.ObjectId, ref: "Product" }]
});
export default mongoose.model("Wishlist", WishlistSchema);