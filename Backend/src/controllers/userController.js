import cartService from "../services/cartService.js";
import orderService from "../services/orderService.js";
import userService from "../services/userService.js";

const getAllUsers = async (req, res) => {
  try {
    const data = await userService.getAllUsers();
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await userService.getUserProfile(userId);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const profileUpdates = req.body;

    const updatedUser = await userService.updateUserProfile(userId, profileUpdates);
    res.status(200).json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { oldPassword, newPassword } = req.body;

    await userService.changePassword(userId, oldPassword, newPassword);
    res.status(200).json({ message: "Password changed" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cart = await cartService.getCart(userId);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, variantId = null, quantity } = req.body;

    const item = await cartService.addToCart(userId, productId, variantId, quantity);
    res.json({ message: "Added to cart", item });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


const updateCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, variantId, quantity } = req.body;

    const item = await cartService.updateCartItem(userId, productId, variantId, quantity);
    res.json({ message: "Cart updated", item });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cartId = req.params.cartId;

    await cartService.removeFromCart(userId, cartId);
    res.json({ message: "Removed from cart" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    await cartService.clearCart(userId);
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const wishlist = await wishlistService.getWishlist(userId);
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const updatedWishlist = await wishlistService.addToWishlist(userId, productId);
    res.json({ message: "Product added to wishlist", wishlist: updatedWishlist });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    const updatedWishlist = await wishlistService.removeFromWishlist(userId, productId);
    res.json({ message: "Product removed from wishlist", wishlist: updatedWishlist });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getUserOrderHistory = async (req, res) => {
  try {
    const userId = req.user.userId; // assuming `userId` is stored in req.user

    const orders = await orderService.getUserOrders(userId);
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


export {
  getAllUsers,
  getProfile,
  updateProfile,
  changePassword,
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  clearCart,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getUserOrderHistory
};
