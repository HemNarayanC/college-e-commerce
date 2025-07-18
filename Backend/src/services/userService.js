import mongoose from "mongoose";
import User from "../models/User.js";

const getAllUsers = async () => {
  const users = await User.find();
  //if returned array of users then map through the array and remove password from each user object
  const userObj = users.map((user) => {
    const userData = user.toObject();
    delete userData.password; // Remove password from the user object
    return userData;
  });
  return userObj;
};

const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select("-passwordHash");
  if (!user) throw new Error("User not found");
  return user;
};

  const updateUserProfile = async (userId, updates) => {
    const disallowedFields = ["_id", "passwordHash", "createdAt"];
    const data = {};

    // Only include allowed fields
    for (let key in updates) {
      if (!disallowedFields.includes(key)) {
        data[key] = updates[key];
      }
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true,
    }).select("-passwordHash");

    if (!user) throw new Error("User not found");

    return user;
  };

const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const isCorrect = await bcrypt.compare(oldPassword, user.passwordHash);
  if (!isCorrect) throw new Error("Old password is incorrect");

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();
  return true;
};

const deleteUser = async (userId) => {
  const deleted = await User.findByIdAndDelete(userId);
  if (!deleted) throw new Error("User not found");
  return true;
};

const getUserById = async (userId) => {
  const user = await User.findById(userId).select("-passwordHash");
  if (!user) throw new Error("User not found"); 
  return user;
};

// const getCart = async (userId) => {
//   return await CartItem.find({ userId }).populate(
//     "productId",
//     "name price images"
//   );
// };

// // Add to cart or update quantity if already exists
// const addToCart = async (userId, productId, quantity) => {
//   if (!mongoose.Types.ObjectId.isValid(productId)) {
//     throw new Error("Invalid product ID");
//   }

//   const existingItem = await CartItem.findOne({ userId, productId });

//   if (existingItem) {
//     existingItem.quantity += quantity;
//     await existingItem.save();
//     return existingItem;
//   }

//   const newItem = new CartItem({ userId, productId, quantity });
//   return await newItem.save();
// };

// // Update cart item quantity
// const updateCartItem = async (userId, productId, quantity) => {
//   if (!mongoose.Types.ObjectId.isValid(productId)) {
//     throw new Error("Invalid product ID");
//   }

//   const item = await CartItem.findOneAndUpdate(
//     { userId, productId },
//     { quantity },
//     { new: true }
//   );

//   if (!item) {
//     throw new Error("Cart item not found");
//   }

//   return item;
// };

// // Remove item from cart
// const removeFromCart = async (userId, productId) => {
//   if (!mongoose.Types.ObjectId.isValid(productId)) {
//     throw new Error("Invalid product ID");
//   }

//   await CartItem.findOneAndDelete({ userId, productId });
// };

// // Clear entire cart
// const clearCart = async (userId) => {
//   await CartItem.deleteMany({ userId });
// };

const getWishlist = async (userId) => {
  return await Wishlist.findOne({ userId }).populate("products");
};

const addToWishlist = async (userId, productId) => {
  let wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) {
    wishlist = new Wishlist({ userId, products: [productId] });
  } else if (!wishlist.products.includes(productId)) {
    wishlist.products.push(productId);
  }
  await wishlist.save();
  return wishlist;
};

const removeFromWishlist = async (userId, productId) => {
  const wishlist = await Wishlist.findOneAndUpdate(
    { userId },
    { $pull: { products: productId } },
    { new: true }
  );
  return wishlist;
};

const toggleCustomerStatus = async (customerId, isActive) => {
  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    throw new Error("Invalid customer ID");
  }

  const customer = await User.findByIdAndUpdate(
    customerId,
    { isActive },
    { new: true, runValidators: true }
  );

  if (!customer) {
    throw new Error("Customer not found");
  }

  return customer;
};

export default {
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteUser,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getUserById,
  toggleCustomerStatus
}
