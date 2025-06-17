import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { createToken } from "../utils/authToken.js";

const registerUser = async (userData) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw {
      statusCode: 409,
      message: "User already exists",
    };
  }

  // Hash the password
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(userData.password, salt);

  // Create user according to schema
  const newUser = await User.create({
    name: userData.name,
    email: userData.email,
    passwordHash: passwordHash,
    phone: userData.phone,
    role: userData.role, // optional, defaults to "customer"
    profileImage: userData.profileImage, // optional
  });

  return newUser;
};


const loginUser = async ({ email, password }) => {
  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw { statusCode: 401, message: "Invalid email or password" };
  }

  // Compare password
  const isMatch = bcrypt.compareSync(password, user.passwordHash);
  if (!isMatch) {
    throw { statusCode: 401, message: "Invalid email or password" };
  }

  // Create JWT token
  const token = createToken({ userId: user._id, role: user.role });

  return { user, token };
};


export default { registerUser, loginUser };